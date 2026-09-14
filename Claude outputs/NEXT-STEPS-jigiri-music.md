# Next-Steps Report — Jigiri Music

Everything that has to happen between "the code is done" and "the site is live
at jigirimusic.com". Written for Jagadish.

Nothing in this list is blocking the site from running locally — `npm install &&
npm run dev` works today with no configuration at all.

---

## 1. Handing the admin endpoint to Gendeti Suneel

Send him three things:

1. The site address — `https://jigirimusic.com`
2. The admin secret (§2 below) — over a private channel, not a public group
3. A link to `docs/admin-api.md`, or just the file itself

Tell him to use **[Hoppscotch](https://hoppscotch.io)** — free, browser-based, no
account, no install. Part 1 of `docs/admin-api.md` walks him through it
click-by-click and assumes no technical knowledge. Postman works identically if
he prefers it.

The one thing worth saying to him out loud: **updating lyrics replaces all three
versions at once.** If he wants to fix only the translation, he has to send the
original and transliteration again too, or they will be cleared.

**Before you hand it over, do §11 first.** On Vercel's default setup his uploads
will appear to succeed and then vanish. Details below.

---

## 2. Setting `ADMIN_SECRET`

Generate one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set it in two places:

- **Locally** — `.env.local` (already gitignored)
- **Production** — Vercel dashboard → your project → Settings → Environment
  Variables → add `ADMIN_SECRET`, scope it to Production and Preview, redeploy

The repo ships with a throwaway dev value in `.env.local`. It is not committed
and is not a real secret — replace it before anything goes public.

To rotate it later: change the Vercel variable, redeploy, send Suneel the new
one. No code change.

---

## 3. YouTube API key

1. [Google Cloud Console](https://console.cloud.google.com/) → create a project
   (call it `jigiri-music`)
2. APIs & Services → Library → search **YouTube Data API v3** → Enable
3. APIs & Services → Credentials → Create Credentials → API key
4. Click the new key → Restrict key → API restrictions → select **YouTube Data
   API v3** only. (Application restrictions can stay unrestricted — the key is
   used server-side, so an HTTP-referrer restriction would break it.)
5. Add it to Vercel as `YOUTUBE_API_KEY`, and to `.env.local` for local dev

Free quota is 10,000 units/day. The site uses one `search.list` call (100 units)
per hour thanks to `revalidate: 3600` — about 2,400 units/day. Comfortable.

**Without the key nothing breaks.** `src/lib/youtube.ts` falls back to building
video objects from `data/songs.json`. The site builds and renders identically.

---

## 4. YouTube channel ID

The API needs the `UC...` channel ID, not the `@JigiriMusic` handle.

Easiest way: open https://www.youtube.com/@JigiriMusic, view source, and search
for `"channelId"` — or `externalId`. It looks like `UCxxxxxxxxxxxxxxxxxxxxxx`.

Alternatively, with the API key from §3:

```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=@JigiriMusic&key=YOUR_KEY"
```

Set it as `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` in Vercel and `.env.local`.
`src/lib/site-config.ts` reads it from there — no code change needed.

---

## 5. Contact form

1. Go to [web3forms.com](https://web3forms.com), enter
   `gendetisuneel@jigirimusic.com`, and they email you an access key. No account,
   free tier is 250 submissions/month.
2. Set it as `NEXT_PUBLIC_WEB3FORMS_KEY` in Vercel and `.env.local`.

Until that key is set, the form renders with all its fields but the submit button
is disabled and a notice points visitors at the email address directly — so the
page is never quietly broken.

Formspree is the drop-in alternative; if you use it, change `WEB3FORMS_ENDPOINT`
in `src/components/ContactForm.tsx` and keep everything else.

---

## 6. Social media handles

One file: **`src/lib/site-config.ts`**, the `social` array.

```ts
social: [
  { name: 'Instagram', url: 'https://instagram.com/REAL_HANDLE', icon: 'instagram' },
  ...
]
```

They currently point at plausible-looking placeholders. The footer, the About
page and the Contact page all read from this one array, so changing it here
updates every appearance.

To drop a platform, delete its entry. To add one, add an entry and map its icon
in `src/components/SocialLinks.tsx`.

---

## 7. Logo & brand assets

No re-development needed for any of these.

| Asset | What to do |
|---|---|
| **Logo** | `src/components/Wordmark.tsx` — replace the `<span>` with `<Image src="/logo.svg" .../>`. Used by the navbar, footer, hero and About page, so one edit updates all four. |
| **Favicon** | Replace `public/favicon.svg` (currently a "JM" monogram). Keep the filename. |
| **Artist photos** | `src/components/PlaceholderVisual.tsx` — replace the gradient with an `<Image>`. |
| **Home hero image** | `src/app/page.tsx`, the `{/* TODO */}` block at the top of the hero section — drop an `<Image fill>` behind the existing gradient overlay. |
| **Brand colours** | `tailwind.config.ts` → `theme.extend.colors`. Six hex values, and the whole site re-skins. |

Find every one of them:

```bash
grep -rn "TODO: replace" src/
```

The palette currently in place is "Ivory + Terracotta", chosen against the
questionnaire's stated "minimal/clean" answer. If a real brand identity arrives
with different colours, editing those six values in `tailwind.config.ts` is the
entire migration — no component contains a hardcoded colour, and there is a test
that enforces it.

---

## 8. Domain — jigirimusic.com → Vercel

In Vercel: Project → Settings → Domains → add `jigirimusic.com` and
`www.jigirimusic.com`.

At your registrar:

| Record | Name | Value |
|---|---|---|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

(Vercel shows the current values on the Domains screen — use those if they differ
from the above; they do change occasionally.)

Set `jigirimusic.com` as the primary domain so `www` redirects to it. HTTPS is
automatic and free. DNS usually propagates in under an hour.

Then update `siteConfig.url` in `src/lib/site-config.ts` if the final domain
differs — it drives canonical URLs, Open Graph tags and the sitemap.

---

## 9. Deployment — GitHub → Vercel

```bash
cd E:\projects\jigri_music
git init
git add .
git commit -m "Initial commit: Jigiri Music website"
git branch -M main
git remote add origin git@github.com:YOURNAME/jigiri-music.git
git push -u origin main
```

Then [vercel.com](https://vercel.com) → Add New → Project → import the repo.
Vercel detects Next.js; accept the defaults.

**Before the first deploy**, add all four environment variables:

| Variable | Required? | From |
|---|---|---|
| `ADMIN_SECRET` | Yes | §2 |
| `YOUTUBE_API_KEY` | No — mock fallback | §3 |
| `NEXT_PUBLIC_YOUTUBE_CHANNEL_ID` | No | §4 |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | No | §5 |

Every push to `main` redeploys. Pull requests get preview URLs automatically.

Cost: £0. Hobby tier covers this comfortably.

---

## 10. Professional email — Zoho Mail free tier

For `gendetisuneel@jigirimusic.com`:

1. [zoho.com/mail](https://www.zoho.com/mail/) → Forever Free Plan (5 users, 5GB
   each, web access only — no IMAP on free, which is the one real limitation)
2. Add `jigirimusic.com` as your domain
3. Verify ownership with the TXT record Zoho gives you
4. Add their MX records at your registrar:

   | Priority | Value |
   |---|---|
   | 10 | `mx.zoho.com` |
   | 20 | `mx2.zoho.com` |
   | 50 | `mx3.zoho.com` |

5. Add the SPF and DKIM records Zoho provides — without them, mail to Gmail
   lands in spam
6. Create the `gendetisuneel` mailbox

Note: these MX records are independent of the A/CNAME records in §8. Both sets
coexist on the same domain.

---

## 11. Production persistence — do this before handing over the admin endpoint

**This is the one real gap between the current code and a working production
admin endpoint, and it is worth understanding properly.**

The admin API writes to `data/songs.json` and `data/events.json`. That works
locally and on any host with a writable disk. **Vercel's serverless filesystem is
read-only and ephemeral**, so on Vercel a write will either throw or succeed into
a container that is discarded moments later. `GET /api/admin/content` reports
this honestly as `"writable": false`.

Everything is already routed through one interface so the fix is contained.
`src/lib/store.ts`:

```ts
export interface Store {
  read<T>(collection: string, fallback: T): Promise<T>;
  write<T>(collection: string, data: T): Promise<void>;
}

export const store: Store = new FileStore();   // ← change this line
```

Two good options:

### Option A — GitHub as the datastore (recommended)

Implement `Store` against the GitHub contents API: `read` fetches the raw file,
`write` commits it back. A commit triggers a Vercel redeploy, so the site updates
itself within a minute or two of Suneel's upload.

- **Cost:** free
- **Needs:** a fine-grained personal access token with contents:write on the
  repo, as `GITHUB_TOKEN`
- **Nice side effect:** every change Suneel makes becomes a git commit, so
  there is a full history and any mistake is one revert away
- **Trade-off:** a write takes a few seconds, and two uploads within the same
  minute can conflict — fine for the actual usage pattern (a few uploads a month)

### Option B — Supabase free tier

A real Postgres database. Two tables, `songs` and `events`. Implement `Store`
with the `@supabase/supabase-js` client.

- **Cost:** free tier is generous; projects pause after a week of inactivity and
  wake on the next request (a slow first load)
- **Better if** the site ever grows features that need querying, search, or
  more than one person editing at once

### What does *not* change

Either way: no page, component, or API route changes. Only the bottom of
`store.ts`. The route handlers, validation, auth, and the JSON shapes stay
exactly as they are, and the Playwright admin tests keep passing against the new
backend.

### One more thing

Public pages use `revalidate = 3600`, so an upload appears on the live site
within the hour. To make it instant, call `revalidatePath('/music')` and
`revalidatePath('/')` at the end of each write route.

---

## 12. One-page guide for Gendeti Suneel

Plain English, no technical knowledge assumed. This section can be copied and
sent to him as-is.

---

### How to update the Jigiri Music website

You can do three things yourself: **add a song with its lyrics**, **fix the
lyrics of a song already up**, and **add an event**. None of it needs any
software installed — it all happens in a web browser.

You will need the website password from Jagadish. Keep it private.

#### Setting up (once, five minutes)

1. Go to **https://hoppscotch.io**
2. Click the **Authorization** tab in the middle of the screen
3. In the dropdown, choose **Bearer Token**
4. Paste the password into the **Token** box

That is it. Hoppscotch remembers this in your browser, so you only do it once
per computer.

#### Checking it works

Set the dropdown on the left to **GET**, type this in the address bar:

```
https://jigirimusic.com/api/admin/content
```

and press **Send**.

A **green 200** and a list of all the songs means everything is working.
A **red 401** means the password is wrong — check for a space at the start or
end when you pasted it.

#### Adding a new song

1. Change the dropdown to **POST**
2. Address: `https://jigirimusic.com/api/admin/songs`
3. Click **Body**, choose **application/json**, and paste this in:

```json
{
  "title": "Name of the song",
  "genre": "folk",
  "youtubeUrl": "https://youtu.be/PASTE_LINK_HERE",
  "description": "One or two sentences about the song.",
  "lyrics": {
    "original": "First line\nSecond line\n\nNext verse",
    "transliteration": "Modati line\nRendava line",
    "translation": "First line in English\nSecond line in English"
  }
}
```

4. Replace the text between the quote marks with the real values
5. Press **Send**. A **green 201** means it is live.

**Three rules:**

- `genre` must be exactly one of: `folk`, `album`, `devotional`
- Use `\n` for a new line and `\n\n` for a blank line between verses
- You can leave out any of the three lyrics parts you do not have

#### Fixing the lyrics of a song already on the site

1. Do the **GET** check above and find the song. Note its `"id"`, which looks
   like `song-004`.
2. Change the dropdown to **PATCH**
3. Address: `https://jigirimusic.com/api/admin/songs/song-004/lyrics`
4. Body:

```json
{
  "lyrics": {
    "original": "The words in Telugu",
    "transliteration": "The words in English letters",
    "translation": "The meaning in English"
  }
}
```

5. **Send**. Green **200** means done.

**Important:** this replaces all three versions. If you only want to change the
translation, include the original and transliteration again as well — otherwise
they will be wiped.

#### Adding an event

**POST** to `https://jigirimusic.com/api/admin/events`

```json
{
  "title": "Folk evening at the cultural centre",
  "date": "2026-11-05T18:30:00Z",
  "location": "Shilparamam, Madhapur",
  "description": "A forty minute set of folk songs."
}
```

The date has to be written in exactly that shape. 6:30pm on 5 November 2026 is
`2026-11-05T18:30:00Z`.

Once an event's date has passed it greys itself out automatically. You never
need to delete anything.

#### What the numbers mean

| Number | Meaning |
|---|---|
| 200 / 201 | It worked |
| 400 | Something you typed is wrong — the message says which field |
| 401 | Wrong password |
| 404 | That song or event id does not exist |
| 409 | That YouTube video is already on the site |
| 500 | The site could not save — tell Jagadish |

#### Blog posts

Blog posts are not done through this. Write the post and send the text to
Jagadish, and he will put it up.

#### If anything goes wrong

Nothing you can do here can break the website. The worst case is that a song
gets the wrong lyrics, and that is fixed by sending the right ones again.
