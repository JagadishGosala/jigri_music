/**
 * Pure URL helpers — safe to import from Client Components.
 * Kept separate from youtube.ts so client bundles never pull in the
 * filesystem-backed data layer.
 */

export function thumbnailFor(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function embedUrl(videoId: string): string {
  const params = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
