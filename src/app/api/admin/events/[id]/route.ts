import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, ADMIN_HEADERS } from '@/lib/auth';
import { getEvents, saveEvents } from '@/lib/events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** PATCH /api/admin/events/:id — update any field of an existing event. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400, headers: ADMIN_HEADERS });
  }

  const events = await getEvents();
  const index = events.findIndex((e) => e.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: `No event with id "${params.id}".` }, { status: 404, headers: ADMIN_HEADERS });
  }

  const current = events[index];
  const next = { ...current };

  if (typeof body.title === 'string' && body.title.trim()) next.title = body.title.trim();
  if (typeof body.location === 'string' && body.location.trim()) next.location = body.location.trim();
  if (typeof body.description === 'string') next.description = body.description.trim();
  if (typeof body.link === 'string') next.link = body.link.trim() || undefined;
  if (typeof body.date === 'string') {
    const d = new Date(body.date);
    if (Number.isNaN(d.getTime())) {
      return NextResponse.json(
        { error: 'If provided, "date" must be a valid date, e.g. "2026-11-05T18:30:00Z".' },
        { status: 400, headers: ADMIN_HEADERS },
      );
    }
    next.date = d.toISOString();
  }

  next.updatedAt = new Date().toISOString();
  events[index] = next;

  try {
    await saveEvents(events);
  } catch (err) {
    return NextResponse.json({ error: 'Could not save. ' + (err as Error).message }, { status: 500, headers: ADMIN_HEADERS });
  }

  return NextResponse.json({ ok: true, event: next }, { headers: ADMIN_HEADERS });
}
