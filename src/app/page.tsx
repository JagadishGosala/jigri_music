import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/Container';
import Reveal from '@/components/Reveal';
import VideoCard from '@/components/VideoCard';
import SubscribeButton from '@/components/SubscribeButton';
import SectionHeader from '@/components/SectionHeader';
import { ButtonLink } from '@/components/Button';
import EventsTicker from '@/components/EventsTicker';
import { getSongs } from '@/lib/songs';
import { getUpcomingEvents } from '@/lib/events';
import { getLatestVideos } from '@/lib/youtube';
import { siteConfig } from '@/lib/site-config';

export const revalidate = 3600;

export default async function HomePage() {
  const [songs, upcoming, latest] = await Promise.all([
    getSongs(),
    getUpcomingEvents(),
    getLatestVideos(6),
  ]);

  // Prefer song entries (they carry lyrics); fall back to raw API results.
  const featured = songs.slice(0, 6);
  const usingLiveApi = latest.some((v) => !v.isMock);

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden" data-testid="hero">
        {/* TODO: replace with real asset — a hero photograph or artwork drops in
            here behind the gradient. Until then this is the brand visual. */}
        <div aria-hidden className="absolute inset-0 bg-brand-text" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-brand-accent/90 via-brand-accent/35 to-brand-text"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.13] mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.55) 0 1px, transparent 1px 16px)',
          }}
        />

        <Container className="relative z-10 py-32">
          <div className="max-w-3xl animate-fade-up">
            <p className="text-label uppercase text-brand-surface/70">
              {siteConfig.youtube.handle}
            </p>
            <h1 className="mt-6">
              <Image
                src="/logo.png"
                alt=""
                aria-hidden="true"
                width={512}
                height={512}
                priority
                className="h-28 w-auto object-contain sm:h-36"
              />
              <span className="sr-only">{siteConfig.wordmark}</span>
            </h1>
            <p className="mt-7 max-w-xl text-body-lg text-brand-surface/85">
              {siteConfig.tagline}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href="#latest" className="bg-brand-surface text-brand-text hover:bg-brand-surface">
                Watch Latest
              </ButtonLink>
              <SubscribeButton size="lg" label="Subscribe on YouTube" />
            </div>
          </div>
        </Container>

        <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-bg to-transparent" />
      </section>

      {/* ------------------------------------------------------ LATEST VIDEOS */}
      <section id="latest" className="scroll-mt-24 py-section" data-testid="latest-videos">
        <Container>
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeader
                eyebrow="Latest releases"
                title="New from the channel"
                description={`Around two new videos every month. ${
                  usingLiveApi ? 'Pulled live from YouTube.' : 'Watch them here or on the channel.'
                }`}
              />
              <ButtonLink href="/music" variant="secondary">
                All music
              </ButtonLink>
            </div>
          </Reveal>

          {featured.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((song, i) => (
                <Reveal key={song.id} delay={i * 70}>
                  <VideoCard song={song} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-body-lg text-brand-muted">
              The first videos are on their way. In the meantime, follow the channel.
            </p>
          )}
        </Container>
      </section>

      {/* --------------------------------------------------- EVENTS / NOTICES */}
      {upcoming.length > 0 && <EventsTicker events={upcoming} />}

      {/* ------------------------------------------------------------ SUBSCRIBE */}
      <section className="py-section">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-card border border-brand-border bg-brand-surface px-8 py-16 text-center shadow-card sm:px-14">
              <p className="text-label uppercase text-brand-accent">Never miss a release</p>
              <h2 className="mx-auto mt-5 max-w-2xl text-display-md">
                Two new songs a month, straight to your feed
              </h2>
              <p className="mx-auto mt-5 max-w-prose text-body-lg text-brand-muted">
                Folk, album and devotional music — recorded properly, published with the full
                lyrics, and free to listen to.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <SubscribeButton size="lg" label="Subscribe on YouTube" />
                <ButtonLink href="/contact" variant="secondary">
                  Get in touch
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
