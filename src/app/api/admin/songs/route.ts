import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, ADMIN_HEADERS } from '@/lib/auth';
import { getSongs, saveSongs, nextSongId, extractVideoId, isGenre, watchUrl } from '@/lib/songs';
import { normaliseLyrics, Song } from '@/lib/types';
import { isWritableRuntime } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/songs — list every song so the uploader can verify their work. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const songs = await getSongs();
  return NextResponse.json({ count: songs.length, songs }, { headers: ADMIN_HEADERS });
}

/** POST /api/admin/songs — add a new song entry. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400, headers: ADMIN_HEADERS });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) {
    return NextResponse.json({ error: 'A "title" is required.' }, { status: 400, headers: ADMIN_HEADERS });
  }

  if (!isGenre(body.genre)) {
    return NextResponse.json(
      { error: 'A "genre" of "folk", "album" or "devotional" is required.' },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }

  const rawVideo =
    typeof body.youtubeVideoId === 'string'
      ? body.youtubeVideoId
      : typeof body.youtubeUrl === 'string'
        ? body.youtubeUrl
        : '';
  const videoId = extractVideoId(rawVideo);
  if (!videoId) {
    return NextResponse.json(
      { error: 'A valid "youtubeVideoId" (11 characters) or "youtubeUrl" is required.' },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }

  const songs = await getSongs();
  if (songs.some((s) => s.youtubeVideoId === videoId)) {
    return NextResponse.json(
      { error: 'A song with that YouTube video already exists.' },
      { status: 409, headers: ADMIN_HEADERS },
    );
  }

  const now = new Date().toISOString();
  const song: Song = {
    id: nextSongId(songs),
    title,
    genre: body.genre,
    youtubeVideoId: videoId,
    youtubeUrl: watchUrl(videoId),
    description: typeof body.description === 'string' ? body.description.trim() : undefined,
    lyrics: normaliseLyrics(body.lyrics),
    uploadedAt: now,
    updatedAt: now,
  };

  try {
    await saveSongs([...songs, song]);
  } catch (err) {
    return NextResponse.json(
      { error: 'Could not save. ' + (isWritableRuntime() ? (err as Error).message : 'This deployment has a read-only filesystem.') },
      { status: 500, headers: ADMIN_HEADERS },
    );
  }

  return NextResponse.json({ ok: true, song }, { status: 201, headers: ADMIN_HEADERS });
}
