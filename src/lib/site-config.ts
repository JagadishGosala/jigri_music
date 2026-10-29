/* ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for every externally-owned value on the site.
 * To go live, edit ONLY this file (plus .env.local). Nothing else needs to change.
 * ------------------------------------------------------------------------- */

export const siteConfig = {
  name: 'Jigiri Music',
  wordmark: 'JIGIRI MUSIC',
  tagline: 'Folk, album and devotional music from the heart of the tradition.',
  description:
    'Jigiri Music — folk, album and devotional songs by Gendeti Suneel. Watch the latest music videos, read the lyrics, and follow what is coming next.',
  url: 'https://jigirimusic.com',
  owner: 'Gendeti Suneel',
  copyrightHolder: 'Jigiri Music / Gendeti Suneel',
  builtByCredit: 'Built by Jagadish',

  youtube: {
    handle: '@JigiriMusic',
    channelUrl: 'https://www.youtube.com/@JigiriMusic',
    // TODO: replace with the real UC... channel ID — see docs/next-steps.md §4.
    // Read from env so it can be set on Vercel without a code change.
    channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || '',
  },

  contact: {
    email: 'gendetisuneel@jigirimusic.com',
  },

  // Instagram, Facebook and X confirmed 2026-10-29 — real handles below.
  // Snapchat is still a guessed URL.
  // TODO: replace the Snapchat URL with the real handle once confirmed.
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/jigirimusic/', icon: 'instagram' },
    { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61591520053838', icon: 'facebook' },
    { name: 'Twitter / X', url: 'https://x.com/JigiriMusic', icon: 'x' },
    { name: 'Snapchat', url: 'https://snapchat.com/add/jigirimusic', icon: 'snapchat' },
  ] as const,

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Music', href: '/music' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
