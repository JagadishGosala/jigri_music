import Container from '@/components/Container';
import { ButtonLink } from '@/components/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-section pt-40">
      <Container className="max-w-prose text-center">
        <p className="text-label uppercase text-brand-accent">404</p>
        <h1 className="mt-5 text-display-lg">This page does not exist</h1>
        <p className="mt-5 text-body-lg text-brand-muted">
          The link may be out of date. The music is all still here.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/music" variant="secondary">
            Browse the music
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
