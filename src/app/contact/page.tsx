import type { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import SocialLinks from '@/components/SocialLinks';
import SubscribeButton from '@/components/SubscribeButton';
import Reveal from '@/components/Reveal';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Jigiri Music about bookings, press enquiries and collaborations.',
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Bookings, press enquiries, collaborations — or just to tell us you know a different version of one of the songs."
      />

      <section className="py-section">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={120}>
              <aside className="space-y-6">
                <div className="rounded-card border border-brand-border bg-brand-surface p-7 shadow-card">
                  <h2 className="font-display text-display-sm">Email</h2>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="mt-3 block break-all text-body text-brand-accent underline underline-offset-4 decoration-brand-accent/40 transition-colors hover:decoration-brand-accent"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <p className="mt-4 text-body-sm text-brand-muted">
                    We read everything and reply to most things within a few days.
                  </p>
                </div>

                <div className="rounded-card border border-brand-border bg-brand-surface p-7 shadow-card">
                  <h2 className="font-display text-display-sm">Follow</h2>
                  <SocialLinks className="mt-5" size="sm" />
                  <div className="mt-6">
                    <SubscribeButton size="sm" label="Subscribe on YouTube" />
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
