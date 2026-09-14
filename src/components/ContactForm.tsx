'use client';

import { useState } from 'react';
import { Button } from './Button';
import { siteConfig } from '@/lib/site-config';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export default function ContactForm() {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';
  const configured = accessKey.length > 0;

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append('access_key', accessKey);
    data.append('subject', `New enquiry from ${siteConfig.name} website`);
    data.append('from_name', siteConfig.name);

    setStatus('sending');
    setMessage('');

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        body: data,
      });
      const json = (await res.json()) as { success?: boolean; message?: string };

      if (res.ok && json.success) {
        setStatus('sent');
        setMessage('Thank you — your message has been sent. We will reply by email.');
        form.reset();
      } else {
        setStatus('error');
        setMessage(json.message ?? 'Something went wrong. Please email us directly instead.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not reach the mail service. Please email us directly instead.');
    }
  }

  const field =
    'w-full rounded-card border border-brand-border bg-brand-surface px-4 py-3 text-body ' +
    'text-brand-text placeholder:text-brand-muted/70 transition-colors duration-300 ' +
    'focus:border-brand-accent focus:outline-none';

  return (
    <form onSubmit={onSubmit} className="space-y-5" data-testid="contact-form" noValidate={false}>
      {!configured && (
        <p
          role="status"
          data-testid="form-unconfigured"
          className="rounded-card border border-brand-border bg-brand-accent-soft px-5 py-4 text-body-sm text-brand-text"
        >
          The contact form is not connected yet. In the meantime please write directly to{' '}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-medium text-brand-accent underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-label uppercase text-brand-muted">
            Your name
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={field} placeholder="Full name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-label uppercase text-brand-muted">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="mb-2 block text-label uppercase text-brand-muted">
          Enquiry type
        </label>
        <select id="topic" name="topic" className={field} defaultValue="General">
          <option>General</option>
          <option>Booking / performance</option>
          <option>Press &amp; media</option>
          <option>Collaboration</option>
          <option>Lyrics correction</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-label uppercase text-brand-muted">
          Message
        </label>
        <textarea id="message" name="message" rows={6} required className={field} placeholder="How can we help?" />
      </div>

      {/* Honeypot — bots fill this, humans never see it. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={!configured || status === 'sending'} data-testid="contact-submit">
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </Button>
        {message && (
          <p
            role="status"
            data-testid="form-status"
            className={status === 'error' ? 'text-body-sm text-brand-accent' : 'text-body-sm text-brand-muted'}
          >
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
