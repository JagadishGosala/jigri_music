import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';

/**
 * Real brand asset, live at `public/logo.png`. The icon + wordmark are baked
 * into the one image, so it renders decoratively (empty alt) with the site
 * name kept in the DOM as a visually-hidden label — every usage keeps an
 * accessible name, and heading text content is unchanged for 'h1'.
 * Every part of the site renders the logo through this one component.
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

  const mark = (
    <span className="inline-flex items-center">
      <Image
        src="/logo.png"
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        className={cn('w-auto object-contain', as === 'h1' ? 'h-24 sm:h-32' : 'h-8 sm:h-9')}
      />
      <span className="sr-only">{siteConfig.wordmark}</span>
    </span>
  );

  if (as === 'h1') return <h1 className={classes}>{mark}</h1>;

  if (as === 'text') return mark;

  return (
    <Link href="/" aria-label={`${siteConfig.name} — home`} className="inline-block transition-opacity hover:opacity-70">
      {mark}
    </Link>
  );
}
