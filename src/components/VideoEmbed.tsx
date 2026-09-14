'use client';

import { useState } from 'react';
import { embedUrl, thumbnailFor } from '@/lib/youtube-urls';
import { cn } from '@/lib/cn';

/**
 * Lazy YouTube embed: renders a lightweight thumbnail + play button and only
 * mounts the real iframe once the user clicks. Keeps the page fast even with
 * a dozen videos on screen. The iframe itself also carries loading="lazy".
 */
export default function VideoEmbed({
  videoId,
  title,
  className,
  eager = false,
}: {
  videoId: string;
  title: string;
  className?: string;
  eager?: boolean;
}) {
  const [active, setActive] = useState(eager);
  const [thumbFailed, setThumbFailed] = useState(false);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-card bg-brand-surface-alt aspect-video',
        className,
      )}
      data-testid="video-embed"
    >
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl(videoId)}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {thumbFailed ? (
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-br from-brand-accent/80 via-brand-accent/40 to-brand-accent-soft"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailFor(videoId)}
              alt=""
              loading="lazy"
              onError={() => setThumbFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
            />
          )}
          <span aria-hidden className="absolute inset-0 bg-brand-text/15 transition-colors duration-300 group-hover:bg-brand-text/25" />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-surface/95 shadow-card transition-transform duration-300 ease-smooth group-hover:scale-110"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-brand-accent">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
