import { FaYoutube } from 'react-icons/fa';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';

/**
 * YouTube subscribe CTA. Deliberately a plain link rather than the official
 * gapi subscribe widget: no third-party script, no cookies until the user
 * actually clicks through, and it can never fail to load.
 */
export default function SubscribeButton({
  className,
  label = 'Subscribe',
  size = 'md',
}: {
  className?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'px-4 py-2 text-body-sm',
    md: 'px-5 py-2.5 text-body-sm',
    lg: 'px-7 py-3.5 text-body',
  };

  return (
    <a
      href={`${siteConfig.youtube.channelUrl}?sub_confirmation=1`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="subscribe-button"
      className={cn(
        'inline-flex items-center gap-2 rounded-card bg-brand-accent font-medium text-brand-surface shadow-card transition-all duration-300 ease-smooth hover:scale-[1.03] hover:bg-brand-accent-hover hover:shadow-card-hover',
        sizes[size],
        className,
      )}
    >
      <FaYoutube className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}
