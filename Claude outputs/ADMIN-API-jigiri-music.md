# Jigiri Music — Admin API

A private, hidden API for adding songs, lyrics and events to the website
without touching any code.

There is **no link to this anywhere on the website**. It does not appear in the
navigation, the footer, the sitemap or the page source. The only way to reach it
is to know the address and hold the password.

---

## Part 1 — For Gendeti Suneel (no technical knowledge needed)

### What this lets you do

- Add a new song, with its YouTube video and its lyrics
- Add or correct the lyrics of a song already on the site
- Point a song at a different YouTube video
- Add and update events
- See a list of everything currently on the site, to check your work

### What you need

Two things, both from Jagadish:

1. **The website address**, e.g. `https://jigirimusic.com`
2. **The password** (called the *admin secret*) — a long line of random letters
   and numbers

Keep the password private. Anyone who has it can change the website. If it is
ever shared by accident, tell Jagadish and he will change it in a few minutes.

### The tool to use: Hoppscotch

[Hoppscotch](https://hoppscotch.io) is free, works in your browser, and needs no
installation or account. (Postman works too if you prefer it — same steps.)

### First-time setup

1. Go to **https://hoppscotch.io**
2. You will see a box with a dropdown reading `GET` and a long address bar.
3. Set the dropdown to **GET** and type into the address bar:
   `https://jigirimusic.com/api/admin/content`
4. Click the **Authorization** tab underneath.
5. In the "Authorization Type" dropdown choose **Bearer Token**.
6. Paste the password into the **Token** box.
7. Click the blue **Send** button on the right.

If everything is right, the bottom panel fills with all the songs and events on
the site, and you will see a green **200** near the top. That is your check that
the address and the password both work.

If you see a red **401**, the password is wrong or was pasted with a space at
the start or end. Try pasting it again.

### Adding a new song

1. Change the dropdown from `GET` to **POST**.
2. Change the address to `https://jigirimusic.com/api/admin/songs`
3. Leave the Authorization tab as it was (Bearer Token + password).
4. Click the **Body** tab, and set the content type to **application/json**.
5. Paste this in and edit the values between the quote marks:

```json
{
  "title": "Name of the song",
  "genre": "folk",
  "youtubeUrl": "https://youtu.be/PASTE_THE_YOUTUBE_LINK",
  "description": "One or two sentences about the song.",
  "lyrics": {
    "original": "First line\nSecond line\n\nNext verse",
    "transliteration": "Modati line\nRendava line",
    "translation": "First line in English\nSecond line in English"
  }
}
```

6. Click **Send**. A green **201** means the song is now on the website.

**Rules for the values:**

| Field | Rule |
|---|---|
| `title` | Required. Any text. |
| `genre` | Required. Must be exactly one of: `folk`, `album`, `devotional` |
| `youtubeUrl` | Required. Paste the YouTube link exactly as you copied it. A `youtu.be/...` link, a `youtube.com/watch?v=...` link, or just the 11-character video code all work. |
| `description` | Optional. |
| `lyrics` | Optional. You can fill in one, two or all three parts. Leave out the ones you do not have. |

**Writing lyrics:** use `\n` where you want a new line, and `\n\n` where you want
a blank line between verses. So `"Line one\nLine two\n\nNew verse"` becomes:

```
Line one
Line two

New verse
```

You can also just send lyrics as one piece of plain text instead of the
three-part object — `"lyrics": "All the words here"` — and the site will treat it
as the original-language version.

### Adding lyrics to a song that is already on the site

1. First do the **GET** `/api/admin/content` step above and find the song. Each
   one has an `"id"` that looks like `"song-004"`. Note it down.
2. Change the dropdown to **PATCH**.
3. Set the address to `https://jigirimusic.com/api/admin/songs/song-004/lyrics`
   (replacing `song-004` with the real id).
4. In the Body tab, paste:

```json
{
  "lyrics": {
    "original": "The words in Telugu",
    "transliteration": "The words in English letters",
    "translation": "The meaning in English"
  }
}
```

5. Click **Send**. A green **200** means the lyrics are updated.

Note: this **replaces** all the lyrics for that song. If you only want to fix the
translation, include the original and transliteration again as well, otherwise
they will be cleared.

### Changing which video a song points to

Same as above, but the address ends in `/video` instead of `/lyrics`:

`https://jigirimusic.com/api/admin/songs/song-004/video`

```json
{ "youtubeUrl": "https://youtu.be/NEW_VIDEO_LINK" }
```

### Adding an event

**POST** to `https://jigirimusic.com/api/admin/events`

```json
{
  "title": "Folk evening at the cultural centre",
  "date": "2026-11-05T18:30:00Z",
  "location": "Shilparamam, Madhapur",
  "description": "A forty minute set of folk songs.",
  "link": "https://www.youtube.com/@JigiriMusic"
}
```

The `date` must be written in that exact shape: four-digit year, dash, two-digit
month, dash, two-digit day, then `T`, then the time in 24-hour form, then `Z`.
So 6:30pm on 5 November 2026 is `2026-11-05T18:30:00Z`.

Events whose date has passed grey themselves out on the website automatically.
You never need to delete them.

To change an existing event, use **PATCH** to
`https://jigirimusic.com/api/admin/events/event-004` and send only the fields you
want to change, e.g. `{ "location": "New venue" }`.

### What the coloured numbers mean

| Number | Meaning |
|---|---|
| **200** / **201** | Success — it worked |
| **400** | Something in what you sent is wrong. The message tells you which field. |
| **401** | Wrong password, or the password was not sent |
| **404** | That song or event id does not exist — check it with a GET first |
| **409** | A song with that same YouTube video is already on the site |
| **500** | The website could not save. Tell Jagadish. |

### Blog posts

Blog posts are **not** managed through this API. They are Markdown files that
Jagadish edits. Send him the text and he will publish it.

---

## Part 2 — For Jagadish (technical reference)

### Base URL

```
https://jigirimusic.com/api/admin
```

Locally: `http://localhost:3000/api/admin`

### Authentication

Every route requires:

```
Authorization: Bearer <ADMIN_SECRET>
```

`ADMIN_SECRET` is read from the environment only — it is never written into
source, never logged, and never returned in a response. Comparison is
constant-time (`crypto.timingSafeEqual`). Any missing, malformed or incorrect
token returns a bare `401 {"error":"Unauthorized"}` with no further detail.

All admin responses carry `Cache-Control: no-store` and
`X-Robots-Tag: noindex, nofollow`.

### Routes

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/admin/content` | Everything at once — songs, events, counts, and whether the runtime filesystem is writable. Use as a health check. |
| `GET` | `/api/admin/songs` | List all songs |
| `POST` | `/api/admin/songs` | Create a song |
| `PATCH` | `/api/admin/songs/:id/lyrics` | Replace a song's lyrics |
| `PATCH` | `/api/admin/songs/:id/video` | Repoint a song at another video |
| `GET` | `/api/admin/events` | List all events |
| `POST` | `/api/admin/events` | Create an event |
| `PATCH` | `/api/admin/events/:id` | Partially update an event |

### curl examples

Health check:

```bash
curl -i https://jigirimusic.com/api/admin/content \
  -H "Authorization: Bearer $ADMIN_SECRET"
```

Expect `401` without the header:

```bash
curl -i https://jigirimusic.com/api/admin/content
# HTTP/1.1 401 Unauthorized
# {"error":"Unauthorized"}
```

Create a song:

```bash
curl -i -X POST https://jigirimusic.com/api/admin/songs \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Palle Baata",
    "genre": "folk",
    "youtubeUrl": "https://youtu.be/dQw4w9WgXcQ",
    "description": "A walking song for the road home.",
    "lyrics": {
      "original": "పల్లె బాట పిలుస్తోంది",
      "transliteration": "Palle baata pilustondi",
      "translation": "The village road is calling me"
    }
  }'
```

Update lyrics:

```bash
curl -i -X PATCH https://jigirimusic.com/api/admin/songs/song-001/lyrics \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"lyrics":{"original":"...","transliteration":"...","translation":"..."}}'
```

Repoint a video:

```bash
curl -i -X PATCH https://jigirimusic.com/api/admin/songs/song-001/video \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl":"https://youtu.be/NEW_VIDEO_ID"}'
```

Create an event:

```bash
curl -i -X POST https://jigirimusic.com/api/admin/events \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Folk Evening",
    "date": "2026-11-05T18:30:00Z",
    "location": "Shilparamam, Madhapur",
    "description": "A forty minute set."
  }'
```

Update an event:

```bash
curl -i -X PATCH https://jigirimusic.com/api/admin/events/event-002 \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"location":"New venue"}'
```

### Schemas

**Song**

```json
{
  "id": "song-001",
  "title": "string",
  "genre": "folk | album | devotional",
  "youtubeVideoId": "11-char id",
  "youtubeUrl": "https://youtu.be/<id>",
  "description": "string (optional)",
  "lyrics": {
    "original": "string (optional)",
    "transliteration": "string (optional)",
    "translation": "string (optional)"
  },
  "uploadedAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

On input, `lyrics` also accepts a plain string, which is normalised to
`{ "original": "<that string>" }`. `youtubeVideoId` accepts a bare id, a
`youtu.be` link, a `watch?v=` URL, an `/embed/` URL or a `/shorts/` URL.
Ids are assigned by the server; any `id` in a request body is ignored.

**Event**

```json
{
  "id": "event-001",
  "title": "string",
  "date": "ISO 8601",
  "location": "string",
  "description": "string",
  "link": "url (optional)",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

### Persistence and the production caveat

Writes go through the `Store` interface in `src/lib/store.ts`. The default
`FileStore` writes `data/songs.json` and `data/events.json` atomically: it
serialises concurrent writes through an in-process lock, writes to a uniquely
named `.tmp` file in the same directory, then `fs.rename`s it over the target.
A rename on the same filesystem is atomic, so a reader never observes a
half-written file, and a crash mid-write leaves the previous version intact.

**This works in local development and on any host with a writable disk. It does
not persist on Vercel**, whose serverless filesystem is read-only and
ephemeral. `GET /api/admin/content` reports this as `"writable": false`.

To make admin writes persist in production, implement `Store` against a durable
backend and change the single `export const store` line at the bottom of
`src/lib/store.ts`. Nothing else in the codebase changes. See
`docs/next-steps.md` §11 for the two recommended options.

### Note on cache revalidation

The public pages use `revalidate = 3600`, so a change made through this API
appears on the live site within an hour. To make it appear immediately, call
`revalidatePath('/music')` from the write routes, or lower the interval.
