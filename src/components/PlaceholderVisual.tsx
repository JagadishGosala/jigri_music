import { cn } from '@/lib/cn';

/**
 * TODO: replace with real asset — a tasteful gradient stands in wherever an
 * artist photo or cover image will eventually go. Never a grey box, never a
 * broken-image icon. Swap this component's body for an <Image> when photos
 * arrive; every placeholder on the site updates at once.
 */
export default function PlaceholderVisual({
  label,
  className,
  aspect = 'aspect-[4/3]',
}: {
  label?: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label ? `Placeholder artwork: ${label}` : 'Placeholder artwork'}
      className={cn(
        'relative overflow-hidden rounded-card bg-brand-accent-soft',
        aspect,
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-brand-accent/85 via-brand-accent/45 to-brand-accent-soft"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 14px)',
        }}
      />
      {label && (
        <span className="absolute inset-0 flex items-center justify-center p-6 text-center font-display text-lg tracking-[0.14em] uppercase text-brand-surface/90">
          {label}
        </span>
      )}
    </div>
  );
}
