import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Container from '@/components/Container';
import { getPost, getPostSlugs, formatPostDate } from '@/lib/blog';
import { siteConfig } from '@/lib/site-config';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post not found' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="pb-section pt-32 sm:pt-36" data-testid="blog-post">
      <Container className="max-w-prose">
        <Link
          href="/blog"
          className="text-body-sm text-brand-accent underline underline-offset-4 decoration-brand-accent/40 transition-colors hover:decoration-brand-accent"
        >
          ← All posts
        </Link>

        <header className="mt-8 border-b border-brand-border pb-10">
          <h1 className="text-display-lg">{post.title}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-label uppercase text-brand-muted">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.author}</span>
            <span aria-hidden>·</span>
            <span data-testid="reading-time">{post.readingTimeMinutes} min read</span>
          </div>
        </header>

        <div
          className="prose-jigiri mt-10"
          dangerouslySetInnerHTML={{ __html: post.html ?? '' }}
        />

        <footer className="mt-16 border-t border-brand-border pt-8">
          <p className="text-body-sm text-brand-muted">
            © {new Date().getFullYear()} {siteConfig.copyrightHolder}.
          </p>
        </footer>
      </Container>
    </article>
  );
}
