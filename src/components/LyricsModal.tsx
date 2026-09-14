'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Song, Lyrics } from '@/lib/types';
import { cn } from '@/lib/cn';

const TAB_LABELS: Record<keyof Lyrics, string> = {
  original: 'Original',
  transliteration: 'Transliteration',
  translation: 'English',
};

const TAB_ORDER: Array<keyof Lyrics> = ['original', 'transliteration', 'translation'];

export default function LyricsModal({ song, onClose }: { song: Song; onClose: () => void }) {
  const available = TAB_ORDER.filter((k) => song.lyrics?.[k]?.trim());
  const [tab, setTab] = useState<keyof Lyrics>(available[0] ?? 'original');
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  // Rendered into document.body: the trigger card carries a hover transform,
  // and a transformed ancestor would otherwise re-anchor this fixed overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-brand-text/40 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (!panelRef.current?.contains(e.target as Node)) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lyrics-title"
      data-testid="lyrics-modal"
    >
      <div
        ref={panelRef}
        className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-t-2xl bg-brand-surface shadow-card-hover sm:rounded-card"
      >
        <header className="flex items-start justify-between gap-4 border-b border-brand-border px-6 py-5">
          <div>
            <p className="text-label uppercase text-brand-accent">Lyrics</p>
            <h3 id="lyrics-title" className="mt-1 text-display-sm">
              {song.title}
            </h3>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close lyrics"
            className="-mr-2 -mt-1 rounded-card p-2 text-brand-muted transition-colors hover:bg-brand-surface-alt hover:text-brand-text"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {available.length > 1 && (
          <div className="flex gap-1 overflow-x-auto border-b border-brand-border px-4 py-2">
            {available.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'whitespace-nowrap rounded-card px-4 py-2 text-body-sm transition-colors',
                  tab === key
                    ? 'bg-brand-accent-soft font-medium text-brand-accent'
                    : 'text-brand-muted hover:text-brand-text',
                )}
              >
                {TAB_LABELS[key]}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto px-6 py-7">
          <p className="whitespace-pre-line font-display text-body-lg leading-[1.9] text-brand-text/90">
            {song.lyrics?.[tab] ?? 'Lyrics for this song have not been added yet.'}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
