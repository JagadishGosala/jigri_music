import Link from 'next/link';
import Container from './Container';
import Wordmark from './Wordmark';
import SocialLinks from './SocialLinks';
import { siteConfig } from '@/lib/site-config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-surface-alt" data-testid="footer">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-xl" />
            <p className="mt-4 max-w-sm text-body-sm text-brand-muted">{siteConfig.tagline}</p>
            <SocialLinks className="mt-6" size="sm" />
          </div>

          <nav aria-label="Footer">
            <h2 className="text-label uppercase text-brand-muted">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body-sm text-brand-text transition-colors hover:text-brand-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-label uppercase text-brand-muted">Get in touch</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="break-all text-body-sm text-brand-text transition-colors hover:text-brand-accent"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.youtube.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-body-sm text-brand-text transition-colors hover:text-brand-accent"
                >
                  YouTube {siteConfig.youtube.handle}
                </a>
              </li>
              <li>
                <Link href="/terms" className="text-body-sm text-brand-text transition-colors hover:text-brand-accent">
                  Terms &amp; Copyright
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-brand-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-brand-muted" data-testid="copyright">
            © {year} {siteConfig.copyrightHolder}. All rights reserved.
          </p>
          <p className="text-body-sm text-brand-muted">{siteConfig.builtByCredit}</p>
        </div>
      </Container>
    </footer>
  );
}
