import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { BlogPost } from './types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

const WORDS_PER_MINUTE = 200;

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function listSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

function parse(slug: string) {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  return { data: data as Record<string, string>, content };
}

export function getAllPosts(): BlogPost[] {
  return listSlugs()
    .map((slug) => {
      const parsed = parse(slug);
      if (!parsed) return null;
      const { data, content } = parsed;
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? new Date().toISOString(),
        excerpt: data.excerpt ?? content.slice(0, 160).replace(/\s+\S*$/, '') + '…',
        author: data.author ?? 'Jigiri Music',
        readingTimeMinutes: readingTime(content),
      } satisfies BlogPost;
    })
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const parsed = parse(slug);
  if (!parsed) return null;
  const { data, content } = parsed;
  const processed = await remark().use(html).process(content);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? new Date().toISOString(),
    excerpt: data.excerpt ?? '',
    author: data.author ?? 'Jigiri Music',
    readingTimeMinutes: readingTime(content),
    html: processed.toString(),
  };
}

export function getPostSlugs(): string[] {
  return listSlugs();
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
