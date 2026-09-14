# Jigiri Music

The official website for the [Jigiri Music](https://www.youtube.com/@JigiriMusic)
YouTube channel — folk, album and devotional songs by Gendeti Suneel.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v3, all colour in `tailwind.config.ts` |
| Fonts | Cormorant Garamond + DM Sans + Noto Sans Telugu, self-hosted via `@fontsource` |
| Icons | react-icons |
| Blog | Markdown in `content/blog/` (gray-matter + remark) |
| Video | YouTube Data API v3, with an automatic mock fallback |
| Contact | Web3Forms (free tier) |
| Data | JSON files in `data/`, behind a swappable `Store` adapter |
| Tests | Playwright, desktop (1280px) and mobile (375px) |

## Getting started

```powershell
npm install
Copy-Item env.example.txt .env.local.example
Copy-Item env.example.txt .env.local        # then fill in the values
Remove-Item env.example.txt
npm run dev                                  # http://localhost:3000
```

(`env.example.txt` exists because the remote file bridge that delivered this
project cannot write filenames beginning with `.env`. Rename it once and it is
never mentioned again. `.env.local` is already in `.gitignore`.)

Nothing in `.env.local` is required to run the site: without a YouTube API key
it falls back to mock video data, and without a Web3Forms key the contact form
shows a clear "not connected yet" notice instead of failing.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm start       # serve the production build
npm test        # Playwright suite (builds first, then runs 56 tests)
```

Before the first test run: `npx playwright install chromium`.

## Project layout

```
src/app/            Routes (App Router)
  api/admin/        Ghost admin API — see docs/admin-api.md
src/components/     UI components
src/lib/
  site-config.ts    ← ALL external values: social URLs, email, channel, wordmark
  store.ts          ← storage adapter; swap this to change where data persists
  types.ts          Song / Event / BlogPost models
data/               songs.json, events.json (seed + runtime state)
content/blog/       Markdown blog posts
docs/               admin-api.md, next-steps.md
tests/              Playwright specs
```

## Making changes

| To change… | Edit… |
|---|---|
| The colour palette | `tailwind.config.ts` — nothing else |
| Social links, email, channel, tagline | `src/lib/site-config.ts` — nothing else |
| The logo | `src/components/Wordmark.tsx` (one component, used everywhere) |
| Photos / artwork | `src/components/PlaceholderVisual.tsx` |
| Fonts | the `@fontsource` imports in `src/app/layout.tsx` + `--font-*` in `globals.css` |
| Blog posts | add a `.md` file to `content/blog/` |
| Songs, lyrics, events | the admin API (`docs/admin-api.md`) or `data/*.json` directly |

Every placeholder that needs a real asset is marked `// TODO: replace with real asset`.

```bash
grep -rn "TODO: replace" src/
```

## Deployment

See `docs/next-steps.md` for the full launch checklist — env vars, YouTube API
key, domain DNS, Vercel setup, and the one thing that needs changing before the
admin endpoint works in production.
