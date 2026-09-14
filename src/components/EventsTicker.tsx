import Link from 'next/link';
import Container from './Container';
import Reveal from './Reveal';
import { JigiriEvent } from '@/lib/types';
import { formatEventDate } from '@/lib/events';

/**
 * Announcements strip on the home page. Shows the next few upcoming events as a
 * calm horizontal band rather than a literal scrolling marquee — easier to read
 * and it does not fight the rest of the page for attention.
 */
export default function EventsTicker({ events }: { events: JigiriEvent[] }) {
  const shown = events.slice(0, 3);

  return (
    <section className="border-y border-brand-border bg-brand-surface-alt py-12" data-testid="events-ticker">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="shrink-0">
              <p className="text-label uppercase text-brand-accent">Coming up</p>
              <h2 className="mt-2 font-display text-display-sm">Events &amp; announcements</h2>
            </div>

            <ul className="flex flex-1 flex-col gap-4 sm:flex-row sm:flex-wrap lg:justify-end">
              {shown.map((event) => (
                <li
                  key={event.id}
                  className="min-w-0 rounded-card border border-brand-border bg-brand-surface px-5 py-4 sm:max-w-xs"
                >
                  <p className="text-label uppercase text-brand-muted">{formatEventDate(event.date)}</p>
                  <p className="mt-1.5 font-display text-lg leading-snug">{event.title}</p>
                  <p className="mt-1 truncate text-body-sm text-brand-muted">{event.location}</p>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href="/events"
            className="mt-6 inline-block text-body-sm text-brand-accent underline underline-offset-4 decoration-brand-accent/40 transition-colors hover:decoration-brand-accent"
          >
            See all events
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
