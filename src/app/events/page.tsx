import type { Metadata } from 'next';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import Badge from '@/components/Badge';
import { getEvents, isPast, formatEventDate } from '@/lib/events';
import { cn } from '@/lib/cn';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming Jigiri Music performances, premieres and announcements.',
};

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();
  const upcoming = events.filter((e) => !isPast(e, now));
  const past = events.filter((e) => isPast(e, now)).reverse();

  return (
    <>
      <PageHeader
        eyebrow="Events & announcements"
        title="Where to hear us next"
        description="Live performances, online premieres and channel announcements. Past dates stay listed below for the record."
      />

      <section className="py-section">
        <Container>
          {events.length === 0 && (
            <p className="text-body-lg text-brand-muted">
              Nothing scheduled at the moment. Subscribe on YouTube to hear about the next one first.
            </p>
          )}

          {upcoming.length > 0 && (
            <div data-testid="upcoming-events">
              <h2 className="text-display-sm">Upcoming</h2>
              <ul className="mt-8 space-y-5">
                {upcoming.map((event, i) => (
                  <Reveal as="li" key={event.id} delay={i * 70}>
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </ul>
            </div>
          )}

          {past.length > 0 && (
            <div className={cn(upcoming.length > 0 && 'mt-20')} data-testid="past-events">
              <h2 className="text-display-sm text-brand-muted">Past events</h2>
              <ul className="mt-8 space-y-5">
                {past.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} past />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

function EventCard({
  event,
  past = false,
}: {
  event: Awaited<ReturnType<typeof getEvents>>[number];
  past?: boolean;
}) {
  return (
    <article
      data-testid="event-card"
      data-past={past ? 'true' : 'false'}
      className={cn(
        'rounded-card border bg-brand-surface p-6 shadow-card transition-all duration-500 ease-smooth sm:p-8',
        past
          ? 'border-brand-border opacity-60 grayscale'
          : 'border-brand-border hover:-translate-y-0.5 hover:shadow-card-hover',
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={past ? 'muted' : 'accent'}>{past ? 'Past' : 'Upcoming'}</Badge>
            <p className="text-label uppercase text-brand-muted">{formatEventDate(event.date)}</p>
          </div>
          <h3 className="mt-3 text-display-sm leading-snug">{event.title}</h3>
          <p className="mt-1.5 text-body-sm text-brand-accent">{event.location}</p>
          <p className="mt-4 max-w-prose text-body text-brand-muted">{event.description}</p>
        </div>

        {event.link && !past && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-start rounded-card border border-brand-border px-5 py-2.5 text-body-sm transition-all duration-300 hover:border-brand-accent hover:text-brand-accent"
          >
            Details
          </a>
        )}
      </div>
    </article>
  );
}
