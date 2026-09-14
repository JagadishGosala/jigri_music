import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, ADMIN_HEADERS } from '@/lib/auth';
import { getSongs } from '@/lib/songs';
import { getEvents } from '@/lib/events';
import { isWritableRuntime } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/content — everything in one call. Useful as a health check:
 * if this returns 200 with your songs and events, the endpoint and the secret
 * are both working.
 */
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const [songs, events] = await Promise.all([getSongs(), getEvents()]);

  return NextResponse.json(
    {
      ok: true,
      writable: isWritableRuntime(),
      counts: { songs: songs.length, events: events.length },
      songs,
      events,
    },
    { headers: ADMIN_HEADERS },
  );
}
