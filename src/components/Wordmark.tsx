import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';

/**
 * TODO: replace with real asset — when a logo file arrives, swap the <span>
 * below for an <Image src="/logo.svg" .../>. Nothing else needs to change:
 * every part of the site renders the wordmark through this one component.
 */
export default function Wordmark({
  className,
  as = 'link',
}: {
  className?: string;
  /** 'h1' renders the wordmark as the page's main heading (used on About). */
  as?: 'link' | 'text' | 'h1';
}) {
  const classes = cn(
    'font-display font-semibold tracking-[0.16em] uppercase leading-none',
    className ?? 'text-lg',
  );

  if (as === 'h1') return <h1 className={classes}>{siteConfig.wordmark}</h1>;

  const mark = <span className={classes}>{siteConfig.wordmark}</span>;

  if (as === 'text') return mark;

  return (
    <Link href="/" aria-label={`${siteConfig.name} — home`} className="inline-block transition-opacity hover:opacity-70">
      {mark}
    </Link>
  );
}
