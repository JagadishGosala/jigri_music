import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { getPostSlugs } from '@/lib/blog';

/**
 * Public sitemap. NOTE: /api/admin/* is deliberately absent — the admin
 * endpoint has zero surface area on the public site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const pages = ['', '/music', '/events', '/blog', '/about', '/contact', '/terms'].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const posts = getPostSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
