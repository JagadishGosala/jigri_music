import type { Metadata, Viewport } from 'next';

/* Fonts are SELF-HOSTED via @fontsource (the font files ship in node_modules and
   are bundled at build time). No request ever goes to Google, the build works
   offline, and there is no third-party font CDN in the critical path.
   To change a typeface, swap these imports and update --font-display /
   --font-sans in globals.css. */
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
// Telugu coverage for original-language lyrics.
import '@fontsource/noto-sans-telugu/400.css';
import '@fontsource/noto-sans-telugu/500.css';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Folk, Album & Devotional Songs`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  // TODO: replace with real brand assets when available (see docs/next-steps.md §7).
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-card focus:bg-brand-accent focus:px-4 focus:py-2 focus:text-brand-surface"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
