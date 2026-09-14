import { FaInstagram, FaFacebookF, FaSnapchatGhost } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';

const ICONS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  x: FaXTwitter,
  snapchat: FaSnapchatGhost,
} as const;

export default function SocialLinks({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  return (
    <ul className={cn('flex items-center gap-2', className)} data-testid="social-links">
      {siteConfig.social.map((item) => {
        const Icon = ICONS[item.icon];
        return (
          <li key={item.name}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.name}
              title={item.name}
              className={cn(
                'flex items-center justify-center rounded-full border border-brand-border text-brand-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-accent hover:text-brand-accent',
                size === 'sm' ? 'h-9 w-9' : 'h-11 w-11',
              )}
            >
              <Icon className={size === 'sm' ? 'h-4 w-4' : 'h-[1.1rem] w-[1.1rem]'} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
