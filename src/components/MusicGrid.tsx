'use client';

import { useMemo, useState } from 'react';
import VideoCard from './VideoCard';
import { Song, Genre, GENRES, GENRE_LABELS } from '@/lib/types';
import { cn } from '@/lib/cn';

type Filter = 'all' | Genre;

export default function MusicGrid({ songs }: { songs: Song[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: songs.length };
    for (const g of GENRES) c[g] = songs.filter((s) => s.genre === g).length;
    return c;
  }, [songs]);

  const visible = filter === 'all' ? songs : songs.filter((s) => s.genre === filter);

  const tabs: Array<{ key: Filter; label: string }> = [
    { key: 'all', label: 'All' },
    ...GENRES.map((g) => ({ key: g as Filter, label: GENRE_LABELS[g] })),
  ];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter by genre"
        className="flex flex-wrap gap-2"
        data-testid="genre-filter"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={filter === tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'rounded-card border px-5 py-2.5 text-body-sm transition-all duration-300 ease-smooth',
              filter === tab.key
                ? 'border-brand-accent bg-brand-accent text-brand-surface'
                : 'border-brand-border bg-brand-surface text-brand-text hover:border-brand-accent hover:text-brand-accent',
            )}
          >
            {tab.label}
            <span className="ml-2 opacity-60">{counts[tab.key] ?? 0}</span>
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="music-grid">
          {visible.map((song) => (
            <VideoCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-body-lg text-brand-muted">
          Nothing in this category yet — new songs are published about twice a month.
        </p>
      )}
    </div>
  );
}
