import type { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import MusicGrid from '@/components/MusicGrid';
import VideoEmbed from '@/components/VideoEmbed';
import SubscribeButton from '@/components/SubscribeButton';
import Reveal from '@/components/Reveal';
import { getSongs } from '@/lib/songs';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Music & Videos',
  description:
    'Every Jigiri Music release — folk, album and devotional songs, each with its full lyrics in the original, transliteration and English translation.',
};

export default async function MusicPage() {
  const songs = await getSongs();
  const featured = songs[0];

  return (
    <>
      <PageHeader
        eyebrow="Music & videos"
        title="Every release, with the words"
        description="Folk, album and devotional songs. Tap Lyrics on any card to read the full text — in the original, in transliteration, and in English."
      />

      {featured && (
        <section className="py-section" data-testid="featured-video">
          <Container>
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <VideoEmbed videoId={featured.youtubeVideoId} title={featured.title} />
                <div>
                  <p className="text-label uppercase text-brand-accent">Latest release</p>
                  <h2 className="mt-4 text-display-md">{featured.title}</h2>
                  {featured.description && (
                    <p className="mt-5 text-body-lg text-brand-muted">{featured.description}</p>
                  )}
                  <div className="mt-8">
                    <SubscribeButton label="Subscribe for new releases" />
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="pb-section" data-testid="music-library">
        <Container>
          <MusicGrid songs={songs} />
        </Container>
      </section>
    </>
  );
}
