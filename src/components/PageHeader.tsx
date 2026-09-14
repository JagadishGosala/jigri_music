import Container from './Container';

/** Standard top-of-page banner. Adds the offset needed to clear the fixed navbar. */
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-brand-border bg-brand-surface-alt pb-14 pt-32 sm:pt-36">
      <Container>
        {eyebrow && <p className="text-label uppercase text-brand-accent">{eyebrow}</p>}
        <h1 className="mt-4 text-display-lg">{title}</h1>
        {description && (
          <p className="mt-5 max-w-prose text-body-lg text-brand-muted">{description}</p>
        )}
        {children}
      </Container>
    </section>
  );
}
