'use client';

import { useState } from 'react';
import { Song, GENRE_LABELS, hasLyrics } from '@/lib/types';
import { thumbnailFor } from '@/lib/youtube-urls';
import Badge from './Badge';
import LyricsModal from './LyricsModal';

export default function VideoCard({ song }: { song: Song }) {
  const [open, setOpen] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const showLyrics = hasLyrics(song);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-card border border-brand-border bg-brand-surface shadow-card transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-card-hover"
      data-testid="video-card"
    >
      <a
        href={song.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-brand-surface-alt"
        aria-label={`Watch ${song.title} on YouTube`}
      >
        {thumbFailed ? (
          <span aria-hidden className="absolute inset-0 bg-gradient-to-br from-brand-accent/80 via-brand-accent/40 to-brand-accent-soft" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailFor(song.youtubeVideoId)}
            alt=""
            loading="lazy"
            onError={() => setThumbFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.05]"
          />
        )}
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-surface/95 opacity-0 shadow-card transition-opacity duration-300 group-hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-brand-accent">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </a>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge>{GENRE_LABELS[song.genre]}</Badge>
        <h3 className="text-display-sm leading-snug">{song.title}</h3>
        {song.description && (
          <p className="text-body-sm text-brand-muted line-clamp-3">{song.description}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
          {showLyrics ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              data-testid="lyrics-button"
              className="inline-flex items-center gap-2 rounded-card border border-brand-border px-4 py-2 text-body-sm text-brand-text transition-all duration-300 hover:border-brand-accent hover:text-brand-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.6" strokeLinecap="round">
                <path d="M4 6h16M4 11h16M4 16h9" />
              </svg>
              Lyrics
            </button>
          ) : (
            <span className="text-body-sm text-brand-muted">Lyrics coming soon</span>
          )}
          <a
            href={song.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm text-brand-accent underline underline-offset-4 decoration-brand-accent/40 transition-colors hover:decoration-brand-accent"
          >
            Watch on YouTube
          </a>
        </div>
      </div>

      {open && <LyricsModal song={song} onClose={() => setOpen(false)} />}
    </article>
  );
}
