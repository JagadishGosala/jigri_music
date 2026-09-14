import type { Metadata } from 'next';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import Wordmark from '@/components/Wordmark';
import SocialLinks from '@/components/SocialLinks';
import SubscribeButton from '@/components/SubscribeButton';
import PlaceholderVisual from '@/components/PlaceholderVisual';
import { ButtonLink } from '@/components/Button';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Jigiri Music — folk, album and devotional songs by Gendeti Suneel.',
};

export default function AboutPage() {
  return (
    <>
      {/* Wordmark-as-hero, standing in until brand assets arrive. */}
      <section className="relative overflow-hidden pb-20 pt-36 sm:pt-44" data-testid="about-hero">
        <div aria-hidden className="absolute inset-0 bg-brand-text" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand-accent/85 via-brand-accent/30 to-brand-text"
        />
        <Container className="relative z-10 text-center">
          {/* TODO: replace with real asset — logo goes here when available. */}
          <Wordmark as="h1" className="text-display-lg text-brand-surface" />
          <p className="mx-auto mt-6 max-w-prose text-body-lg text-brand-surface/85">
            {siteConfig.tagline}
          </p>
        </Container>
      </section>

      <section className="py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-start">
            <Reveal>
              <div>
                <p className="text-label uppercase text-brand-accent">The story</p>
                <h2 className="mt-4 text-display-md">Songs that were never meant to be written down</h2>

                {/* TODO: replace placeholder copy with the client's own brand story. */}
                <div className="mt-7 space-y-6 text-body-lg text-brand-text/90">
                  <p>
                    Jigiri Music is a channel for the music of this region as it is actually
                    sung — folk songs learned by ear, album songs written and arranged with
                    care, and the devotional pieces that belong to particular days of the year.
                  </p>
                  <p>
                    The work is straightforward: record each song properly, publish it to the
                    channel, and put the full lyrics alongside it so that a listener who cannot
                    follow every word still gets the whole song. Around two new videos go up
                    every month.
                  </p>
                  <p>
                    Everything here is written, performed and produced under{' '}
                    {siteConfig.owner}&apos;s direction. Nothing is licensed in from elsewhere,
                    and nothing is published without the words to go with it.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <SubscribeButton label="Subscribe on YouTube" />
                  <ButtonLink href="/music" variant="secondary">
                    Listen to the music
                  </ButtonLink>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-8">
                {/* TODO: replace with real asset — artist photograph. */}
                <PlaceholderVisual label="Jigiri Music" aspect="aspect-[4/5]" />

                <div className="rounded-card border border-brand-border bg-brand-surface p-7 shadow-card">
                  <h3 className="font-display text-display-sm">Find us</h3>
                  <p className="mt-3 text-body-sm text-brand-muted">
                    New releases go to the channel first. Everything else is here.
                  </p>
                  <SocialLinks className="mt-5" size="sm" />
                  <p className="mt-6 text-body-sm text-brand-muted">
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="break-all text-brand-accent underline underline-offset-4 decoration-brand-accent/40 hover:decoration-brand-accent"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </p>
                </div>

                <div className="rounded-card border border-brand-border bg-brand-surface-alt p-7">
                  <h3 className="font-display text-display-sm">Rights</h3>
                  <p className="mt-3 text-body-sm text-brand-muted" data-testid="about-copyright">
                    © {siteConfig.copyrightHolder}. All rights reserved. All music, lyrics and
                    recordings published here are owned by Jigiri Music.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
