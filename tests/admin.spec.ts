import { test, expect, request as pwRequest } from '@playwright/test';

/* ---------------------------------------------------------------------------
 * Quality gates G10–G11 — the ghost admin endpoint.
 * These run once (not per viewport project) since they never touch the DOM.
 * ------------------------------------------------------------------------- */

const SECRET = process.env.ADMIN_SECRET ?? 'dev-only-secret-2f8a41c9b7e34d0a';
const AUTH = { Authorization: `Bearer ${SECRET}` };

const ADMIN_ROUTES = [
  '/api/admin/songs',
  '/api/admin/events',
  '/api/admin/content',
];

test.describe('Ghost admin endpoint', () => {
  // G10 — 401 without a valid auth header
  test('G10: every admin route returns 401 without auth', async ({ request }) => {
    for (const route of ADMIN_ROUTES) {
      const res = await request.get(route);
      expect(res.status(), `${route} should be 401 with no header`).toBe(401);
      const body = await res.json();
      // The body must give nothing away.
      expect(Object.keys(body)).toEqual(['error']);
      expect(body.error).toBe('Unauthorized');
    }
  });

  test('G10b: a wrong or malformed token is also rejected', async ({ request }) => {
    const badHeaders = [
      { Authorization: 'Bearer wrong-secret' },
      { Authorization: `Bearer ${SECRET}x` },
      { Authorization: SECRET },
      { Authorization: 'Basic ' + Buffer.from(`admin:${SECRET}`).toString('base64') },
    ];
    for (const headers of badHeaders) {
      const res = await request.get('/api/admin/content', { headers });
      expect(res.status()).toBe(401);
    }
  });

  test('G10c: write routes are equally protected', async ({ request }) => {
    const post = await request.post('/api/admin/songs', { data: { title: 'Injected' } });
    expect(post.status()).toBe(401);

    const patch = await request.patch('/api/admin/songs/song-001/lyrics', {
      data: { lyrics: 'Injected' },
    });
    expect(patch.status()).toBe(401);
  });

  // G11 — 200 with the correct auth header
  test('G11: valid auth returns 200 and the content', async ({ request }) => {
    const res = await request.get('/api/admin/content', { headers: AUTH });
    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    // Production ships with an empty catalogue until real songs are uploaded,
    // so this only checks the shape of the response, not a minimum count.
    expect(Array.isArray(body.songs)).toBe(true);
    expect(Array.isArray(body.events)).toBe(true);
    expect(res.headers()['cache-control']).toContain('no-store');
  });

  test('G11b: a created song appears in the list with normalised lyrics', async ({ request }) => {
    const videoId = 'TESTvid' + Math.random().toString(36).slice(2, 6);
    const created = await request.post('/api/admin/songs', {
      headers: AUTH,
      data: {
        title: 'Admin Listing Check',
        genre: 'folk',
        youtubeVideoId: videoId,
        lyrics: { original: 'Original text', translation: 'Translated text' },
      },
    });
    expect(created.status()).toBe(201);
    const { song } = await created.json();

    const res = await request.get('/api/admin/songs', { headers: AUTH });
    expect(res.status()).toBe(200);
    const { songs } = await res.json();

    const found = songs.find((s: { id: string }) => s.id === song.id);
    expect(found).toBeTruthy();
    expect(found.lyrics.original).toBe('Original text');
    expect(found.lyrics.translation).toBe('Translated text');
    expect(['folk', 'album', 'devotional']).toContain(found.genre);
  });

  test('G11c: input validation rejects bad payloads with 400', async ({ request }) => {
    const noTitle = await request.post('/api/admin/songs', { headers: AUTH, data: { genre: 'folk' } });
    expect(noTitle.status()).toBe(400);

    const badGenre = await request.post('/api/admin/songs', {
      headers: AUTH,
      data: { title: 'X', genre: 'jazz', youtubeVideoId: 'abcdefghijk' },
    });
    expect(badGenre.status()).toBe(400);

    const badVideo = await request.post('/api/admin/songs', {
      headers: AUTH,
      data: { title: 'X', genre: 'folk', youtubeVideoId: 'nope' },
    });
    expect(badVideo.status()).toBe(400);

    const missing = await request.patch('/api/admin/songs/song-999/lyrics', {
      headers: AUTH,
      data: { lyrics: 'Some words' },
    });
    expect(missing.status()).toBe(404);
  });

  test('G11d: a full create → update → verify → clean-up round trip works', async ({ request }) => {
    const videoId = 'TESTvid' + Math.random().toString(36).slice(2, 6);

    // Create
    const created = await request.post('/api/admin/songs', {
      headers: AUTH,
      data: {
        title: 'Round Trip Test Song',
        genre: 'album',
        youtubeUrl: `https://youtu.be/${videoId}`,
        lyrics: 'First draft of the lyrics',
      },
    });
    expect(created.status()).toBe(201);
    const { song } = await created.json();
    expect(song.youtubeVideoId).toBe(videoId);
    // A bare string must be normalised into the lyrics object.
    expect(song.lyrics.original).toBe('First draft of the lyrics');

    // Update lyrics with the full multi-field object
    const patched = await request.patch(`/api/admin/songs/${song.id}/lyrics`, {
      headers: AUTH,
      data: {
        lyrics: {
          original: 'Original text',
          transliteration: 'Transliterated text',
          translation: 'Translated text',
        },
      },
    });
    expect(patched.status()).toBe(200);
    const patchedBody = await patched.json();
    expect(patchedBody.song.lyrics.translation).toBe('Translated text');
    expect(new Date(patchedBody.song.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(song.uploadedAt).getTime(),
    );

    // Update the video link
    const newVideo = 'NEWvid' + Math.random().toString(36).slice(2, 7);
    const revideo = await request.patch(`/api/admin/songs/${song.id}/video`, {
      headers: AUTH,
      data: { youtubeUrl: `https://www.youtube.com/watch?v=${newVideo}` },
    });
    expect(revideo.status()).toBe(200);
    expect((await revideo.json()).song.youtubeVideoId).toBe(newVideo);

    // Verify by reading back
    const list = await request.get('/api/admin/songs', { headers: AUTH });
    const found = (await list.json()).songs.find((s: { id: string }) => s.id === song.id);
    expect(found.youtubeVideoId).toBe(newVideo);
    expect(found.lyrics.transliteration).toBe('Transliterated text');
  });

  test('G11e: events can be created and updated', async ({ request }) => {
    const created = await request.post('/api/admin/events', {
      headers: AUTH,
      data: {
        title: 'Round Trip Test Event',
        date: '2027-03-15T18:00:00Z',
        location: 'Test venue',
        description: 'Created by the automated test suite.',
      },
    });
    expect(created.status()).toBe(201);
    const { event } = await created.json();

    const patched = await request.patch(`/api/admin/events/${event.id}`, {
      headers: AUTH,
      data: { location: 'Updated venue' },
    });
    expect(patched.status()).toBe(200);
    expect((await patched.json()).event.location).toBe('Updated venue');

    const badDate = await request.patch(`/api/admin/events/${event.id}`, {
      headers: AUTH,
      data: { date: 'not-a-date' },
    });
    expect(badDate.status()).toBe(400);
  });

  // Ghost requirement: zero surface area anywhere public.
  test('G-ghost: the admin endpoint is not referenced anywhere public', async ({ request }) => {
    const publicPaths = ['/', '/music', '/events', '/blog', '/about', '/contact', '/terms', '/sitemap.xml', '/robots.txt'];
    for (const path of publicPaths) {
      const res = await request.get(path);
      expect(res.status(), `${path} should be reachable`).toBe(200);
      const text = await res.text();
      expect(text, `${path} must not mention the admin endpoint`).not.toContain('/api/admin');
      expect(text.toLowerCase(), `${path} must not leak the admin secret`).not.toContain(SECRET.toLowerCase());
    }
  });
});
