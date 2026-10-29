import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin, ADMIN_HEADERS } from '@/lib/auth';
import { getSongs, saveSongs, extractVideoId, watchUrl } from '@/lib/songs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** PATCH /api/admin/songs/:id/video — point an existing song at a new video. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400, headers: ADMIN_HEADERS });
  }

  const raw =
    typeof body.youtubeVideoId === 'string'
      ? body.youtubeVideoId
      : typeof body.youtubeUrl === 'string'
        ? body.youtubeUrl
        : '';
  const videoId = extractVideoId(raw);
  if (!videoId) {
    return NextResponse.json(
      { error: 'A valid "youtubeVideoId" or "youtubeUrl" is required.' },
      { status: 400, headers: ADMIN_HEADERS },
    );
  }

  const songs = await getSongs();
  const index = songs.findIndex((s) => s.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: `No song with id "${params.id}".` }, { status: 404, headers: ADMIN_HEADERS });
  }

  songs[index] = {
    ...songs[index],
    youtubeVideoId: videoId,
    youtubeUrl: watchUrl(videoId),
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveSongs(songs);
  } catch (err) {
    return NextResponse.json({ error: 'Could not save. ' + (err as Error).message }, { status: 500, headers: ADMIN_HEADERS });
  }

  revalidatePath('/');
  revalidatePath('/music');

  return NextResponse.json({ ok: true, song: songs[index] }, { headers: ADMIN_HEADERS });
}
