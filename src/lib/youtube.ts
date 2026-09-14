import { YouTubeVideo } from './types';
import { getSongs } from './songs';
import { siteConfig } from './site-config';
import { thumbnailFor } from './youtube-urls';

export { thumbnailFor, embedUrl } from './youtube-urls';

/* ---------------------------------------------------------------------------
 * YouTube Data API v3 with automatic mock fallback.
 *
 * If YOUTUBE_API_KEY or the channel ID is missing — or the API call fails for
 * any reason — we fall back to building video objects from /data/songs.json so
 * the site always renders real-looking content and never breaks a build.
 * ------------------------------------------------------------------------- */

const API_BASE = 'https://www.googleapis.com/youtube/v3';


/** Mock source of truth: the seeded songs. Always available, never fails. */
export async function getMockVideos(limit = 6): Promise<YouTubeVideo[]> {
  const songs = await getSongs();
  return songs.slice(0, limit).map((s) => ({
    videoId: s.youtubeVideoId,
    title: s.title,
    description: s.description ?? '',
    publishedAt: s.uploadedAt,
    thumbnailUrl: thumbnailFor(s.youtubeVideoId),
    isMock: true,
  }));
}

interface YtSearchItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
  };
}

/**
 * Fetches the latest uploads for the configured channel.
 * Revalidates hourly so new uploads appear without a redeploy.
 */
export async function getLatestVideos(limit = 6): Promise<YouTubeVideo[]> {
  const key = process.env.YOUTUBE_API_KEY;
  const channelId = siteConfig.youtube.channelId;

  if (!key || !channelId) return getMockVideos(limit);

  try {
    const url =
      `${API_BASE}/search?key=${encodeURIComponent(key)}` +
      `&channelId=${encodeURIComponent(channelId)}` +
      `&part=snippet&order=date&type=video&maxResults=${limit}`;

    // Revalidate hourly (Next.js fetch extension).
    const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
    if (!res.ok) throw new Error(`YouTube API responded ${res.status}`);

    const json = (await res.json()) as { items?: YtSearchItem[] };
    const items = json.items ?? [];
    const videos = items
      .filter((i) => i.id?.videoId)
      .map((i) => ({
        videoId: i.id!.videoId!,
        title: i.snippet?.title ?? 'Untitled',
        description: i.snippet?.description ?? '',
        publishedAt: i.snippet?.publishedAt ?? new Date().toISOString(),
        thumbnailUrl:
          i.snippet?.thumbnails?.high?.url ??
          i.snippet?.thumbnails?.medium?.url ??
          thumbnailFor(i.id!.videoId!),
        isMock: false,
      }));

    return videos.length ? videos : getMockVideos(limit);
  } catch (err) {
    console.warn('[youtube] falling back to mock data:', (err as Error).message);
    return getMockVideos(limit);
  }
}
