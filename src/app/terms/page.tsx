import type { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms & Copyright',
  description: 'Terms of use and copyright notice for the Jigiri Music website.',
};

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms & Copyright" />
      <section className="py-section">
        <Container className="max-w-prose">
          <div className="prose-jigiri">
            <h2>Copyright</h2>
            <p>
              All music, lyrics, recordings, video content, text and design published on this
              website are © {new Date().getFullYear()} {siteConfig.copyrightHolder}. All rights
              reserved.
            </p>

            <h2>Use of this site</h2>
            <p>
              You are welcome to read, share links to, and quote short passages from this site
              with attribution. You may not reproduce, redistribute, re-upload or commercially
              exploit any recording, lyric or video published here without prior written
              permission.
            </p>

            <h2>Video content</h2>
            <p>
              Videos on this site are embedded from the official{' '}
              <a href={siteConfig.youtube.channelUrl} target="_blank" rel="noopener noreferrer">
                Jigiri Music YouTube channel
              </a>
              . Playback is subject to YouTube&apos;s own terms of service and privacy policy.
            </p>

            <h2>Lyrics</h2>
            <p>
              Lyrics are published here for listening and study. Where a song is a traditional
              folk piece, the arrangement and this particular transcription, transliteration and
              translation remain the property of Jigiri Music.
            </p>

            <h2>Contact</h2>
            <p>
              For permissions, corrections or any other enquiry, write to{' '}
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
