'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Wordmark from './Wordmark';
import SubscribeButton from './SubscribeButton';
import Container from './Container';
import { siteConfig } from '@/lib/site-config';
import { cn } from '@/lib/cn';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Transparent over the home hero; solid everywhere else and once scrolled.
  const solid = scrolled || !isHome || menuOpen;

  return (
    <header
      data-testid="navbar"
      data-solid={solid ? 'true' : 'false'}
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-smooth',
        solid
          ? 'bg-brand-bg/95 shadow-nav backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <Container>
        <div
          className={cn(
            'flex items-center justify-between transition-all duration-500 ease-smooth',
            solid ? 'h-16' : 'h-20',
          )}
        >
          <Wordmark className={cn('text-base sm:text-lg', !solid && 'text-brand-surface')} />

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {siteConfig.nav.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-card px-3.5 py-2 text-body-sm transition-colors duration-300',
                    solid
                      ? active
                        ? 'text-brand-accent'
                        : 'text-brand-text hover:text-brand-accent'
                      : active
                        ? 'text-brand-surface'
                        : 'text-brand-surface/80 hover:text-brand-surface',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <SubscribeButton size="sm" className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={cn(
                'rounded-card p-2 transition-colors md:hidden',
                solid ? 'text-brand-text' : 'text-brand-surface',
              )}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current" fill="none" strokeWidth="1.6" strokeLinecap="round">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div id="mobile-nav" className="border-t border-brand-border bg-brand-bg md:hidden">
          <Container>
            <nav aria-label="Mobile" className="flex flex-col py-3">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-card px-2 py-3 text-body text-brand-text transition-colors hover:text-brand-accent"
                >
                  {item.label}
                </Link>
              ))}
              <SubscribeButton className="mt-3 justify-center sm:hidden" />
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
