import { store } from './store';
import { JigiriEvent } from './types';

export async function getEvents(): Promise<JigiriEvent[]> {
  const events = await store.read<JigiriEvent[]>('events', []);
  return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function saveEvents(events: JigiriEvent[]): Promise<void> {
  await store.write('events', events);
}

/** An event is "past" once its calendar day has fully elapsed. */
export function isPast(event: JigiriEvent, now: Date = new Date()): boolean {
  const end = new Date(event.date);
  end.setHours(23, 59, 59, 999);
  return end.getTime() < now.getTime();
}

export async function getUpcomingEvents(): Promise<JigiriEvent[]> {
  const now = new Date();
  return (await getEvents()).filter((e) => !isPast(e, now));
}

export function nextEventId(events: JigiriEvent[]): string {
  const max = events.reduce((acc, e) => {
    const m = /^event-(\d+)$/.exec(e.id);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
  return `event-${String(max + 1).padStart(3, '0')}`;
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
}
