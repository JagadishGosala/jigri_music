import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, ADMIN_HEADERS } from '@/lib/auth';
import { getEvents, saveEvents, nextEventId } from '@/lib/events';
import { JigiriEvent } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/admin/events — list every event. */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const events = await getEvents();
  return NextResponse.json({ count: events.length, events }, { headers: ADMIN_HEADERS });
}

/** POST /api/admin/events — add a new event. */
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400, headers: ADMIN_HEADERS });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  const dateRaw = typeof body.date === 'string' ? body.date : '';
  const date = new Date(dateRaw);

  if (!title) {
    return NextResponse.json({ error: 'A "title" is required.' }, { status: 400, headers: ADMIN_HEADERS });
  }
  if (!dateRaw || Number.isNaN(date.getTime())) {
    return NextResponse.json(
      { error: 'A valid "date" is required, e.g. "2026-11-05T18:30:00Z".' },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }
  if (!location) {
    return NextResponse.json({ error: 'A "location" is required.' }, { status: 400, headers: ADMIN_HEADERS });
  }

  const events = await getEvents();
  const now = new Date().toISOString();
  const event: JigiriEvent = {
    id: nextEventId(events),
    title,
    date: date.toISOString(),
    location,
    description: typeof body.description === 'string' ? body.description.trim() : '',
    link: typeof body.link === 'string' && body.link.trim() ? body.link.trim() : undefined,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await saveEvents([...events, event]);
  } catch (err) {
    return NextResponse.json({ error: 'Could not save. ' + (err as Error).message }, { status: 500, headers: ADMIN_HEADERS });
  }

  return NextResponse.json({ ok: true, event }, { status: 201, headers: ADMIN_HEADERS });
}
