import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/Container';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { getAllPosts, formatPostDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing from Jigiri Music — about the songs, where they come from, and how they are recorded.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes on the songs"
        description="Where the music comes from, how it gets recorded, and what is coming next."
      />

      <section className="py-section">
        <Container>
          {posts.length === 0 ? (
            <p className="text-body-lg text-brand-muted">No posts yet — the first one is being written.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2" data-testid="blog-grid">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 80}>
                  <article className="group h-full rounded-card border border-brand-border bg-brand-surface shadow-card transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-card-hover">
                    <Link href={`/blog/${post.slug}`} className="flex h-full flex-col p-7" data-testid="blog-link">
                      <div className="flex items-center gap-3 text-label uppercase text-brand-muted">
                        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                        <span aria-hidden>·</span>
                        <span>{post.readingTimeMinutes} min read</span>
                      </div>
                      <h2 className="mt-4 text-display-sm leading-snug transition-colors duration-300 group-hover:text-brand-accent">
                        {post.title}
                      </h2>
                      <p className="mt-4 text-body text-brand-muted">{post.excerpt}</p>
                      <span className="mt-auto pt-6 text-body-sm text-brand-accent">Read more →</span>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
