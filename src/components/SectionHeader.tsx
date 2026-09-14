import { cn } from '@/lib/cn';

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn('max-w-prose', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className="text-label uppercase text-brand-accent mb-4 font-medium">{eyebrow}</p>
      )}
      <h2 className="text-display-md">{title}</h2>
      {description && <p className="mt-4 text-body-lg text-brand-muted">{description}</p>}
    </div>
  );
}
