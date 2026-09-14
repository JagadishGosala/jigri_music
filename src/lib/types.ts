/** Shared data models for the Jigiri Music site. */

export type Genre = 'folk' | 'album' | 'devotional';

export const GENRES: Genre[] = ['folk', 'album', 'devotional'];

export const GENRE_LABELS: Record<Genre, string> = {
  folk: 'Folk',
  album: 'Album',
  devotional: 'Devotional',
};

/**
 * Lyrics are a multi-field object so a song can carry its original-language
 * text, a Latin transliteration, and an English translation independently.
 * A plain string is also accepted on input and normalised to { original }.
 */
export interface Lyrics {
  original?: string;
  transliteration?: string;
  translation?: string;
}

export interface Song {
  id: string;
  title: string;
  genre: Genre;
  youtubeVideoId: string;
  youtubeUrl: string;
  description?: string;
  lyrics?: Lyrics;
  uploadedAt: string; // ISO 8601
  updatedAt: string;  // ISO 8601
}

export interface JigiriEvent {
  id: string;
  title: string;
  date: string;        // ISO 8601 — used to auto-grey past events
  location: string;
  description: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  readingTimeMinutes: number;
  html?: string;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  /** True when this object came from the mock fallback rather than the live API. */
  isMock: boolean;
}

/** Normalise a lyrics value that may arrive as a plain string from the API. */
export function normaliseLyrics(input: unknown): Lyrics | undefined {
  if (!input) return undefined;
  if (typeof input === 'string') {
    return input.trim() ? { original: input } : undefined;
  }
  if (typeof input === 'object') {
    const o = input as Record<string, unknown>;
    const out: Lyrics = {};
    if (typeof o.original === 'string' && o.original.trim()) out.original = o.original;
    if (typeof o.transliteration === 'string' && o.transliteration.trim()) out.transliteration = o.transliteration;
    if (typeof o.translation === 'string' && o.translation.trim()) out.translation = o.translation;
    return Object.keys(out).length ? out : undefined;
  }
  return undefined;
}

export function hasLyrics(song: Song): boolean {
  return !!song.lyrics && Object.values(song.lyrics).some((v) => !!v && v.trim().length > 0);
}
