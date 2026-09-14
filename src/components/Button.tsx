import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-card px-6 py-3 text-body-sm font-medium ' +
  'transition-all duration-300 ease-smooth hover:scale-[1.03] active:scale-[0.99] ' +
  'disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-accent text-brand-surface hover:bg-brand-accent-hover shadow-card hover:shadow-card-hover',
  secondary: 'border border-brand-border bg-brand-surface text-brand-text hover:border-brand-accent hover:text-brand-accent',
  ghost: 'text-brand-text hover:text-brand-accent hover:bg-brand-accent-soft',
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  external,
  children,
  ...rest
}: CommonProps & { href: string; external?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const classes = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
