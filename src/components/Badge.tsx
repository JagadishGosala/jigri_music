import { cn } from '@/lib/cn';

export default function Badge({
  children,
  tone = 'accent',
  className,
}: {
  children: React.ReactNode;
  tone?: 'accent' | 'muted';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-label font-medium uppercase',
        tone === 'accent' ? 'bg-brand-accent-soft text-brand-accent' : 'bg-brand-surface-alt text-brand-muted',
        className,
      )}
    >
      {children}
    </span>
  );
}
