import crypto from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Bearer-token guard for every /api/admin/* route.
 * Returns null when the request is authorised, or a bare 401 response otherwise.
 * The response body carries no detail — no hint about whether the secret is
 * unset, malformed, or simply wrong. The secret is never logged.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET;
  const header = req.headers.get('authorization') ?? '';

  const unauthorized = () =>
    NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } },
    );

  if (!secret || secret.length < 8) return unauthorized();
  if (!header.startsWith('Bearer ')) return unauthorized();

  const provided = header.slice(7).trim();
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  // Length-independent constant-time comparison.
  if (a.length !== b.length) {
    crypto.timingSafeEqual(b, b);
    return unauthorized();
  }
  if (!crypto.timingSafeEqual(a, b)) return unauthorized();

  return null;
}

/** Standard headers for every admin response — never cached, never indexed. */
export const ADMIN_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
} as const;
