import { store } from './store';
import { Song, Genre, GENRES } from './types';

export async function getSongs(): Promise<Song[]> {
  const songs = await store.read<Song[]>('songs', []);
  return [...songs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  );
}

export async function saveSongs(songs: Song[]): Promise<void> {
  await store.write('songs', songs);
}

export async function getSongById(id: string): Promise<Song | undefined> {
  return (await getSongs()).find((s) => s.id === id);
}

export async function getSongByVideoId(videoId: string): Promise<Song | undefined> {
  return (await getSongs()).find((s) => s.youtubeVideoId === videoId);
}

export function isGenre(value: unknown): value is Genre {
  return typeof value === 'string' && (GENRES as string[]).includes(value);
}

/** Generates the next sequential id, e.g. song-004. */
export function nextSongId(songs: Song[]): string {
  const max = songs.reduce((acc, s) => {
    const m = /^song-(\d+)$/.exec(s.id);
    return m ? Math.max(acc, parseInt(m[1], 10)) : acc;
  }, 0);
  return `song-${String(max + 1).padStart(3, '0')}`;
}

/** Accepts a bare id, a youtu.be link, or a full watch URL. */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = p.exec(trimmed);
    if (m) return m[1];
  }
  return null;
}

export function watchUrl(videoId: string): string {
  return `https://youtu.be/${videoId}`;
}
