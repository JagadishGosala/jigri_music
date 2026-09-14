import { test, expect } from '@playwright/test';
import { siteConfig } from '../src/lib/site-config';

/* ---------------------------------------------------------------------------
 * Quality gates G1–G9 from the Master Task List.
 * Every test runs in both the `desktop` (1280px) and `mobile` (375px) projects.
 * ------------------------------------------------------------------------- */

test.describe('Public site', () => {
  // G1 — Home page hero visible
  test('G1: home hero renders the wordmark and CTA', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('hero');
    await expect(hero).toBeVisible();
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(siteConfig.wordmark);
    await expect(hero.getByRole('link', { name: 'Watch Latest' })).toBeVisible();
    await expect(page.getByTestId('latest-videos')).toBeVisible();
  });

  // G2 — All nav links resolve without 404
  test('G2: every navigation link resolves with a 200', async ({ page }) => {
    const targets = [...siteConfig.nav.map((n) => n.href), '/terms'];
    for (const href of targets) {
      const res = await page.goto(href);
      expect(res, `no response for ${href}`).not.toBeNull();
      expect(res!.status(), `unexpected status for ${href}`).toBe(200);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  // G3 — Video iframes present on Music page
  test('G3: music page exposes video players and lyrics', async ({ page }) => {
    await page.goto('/music');

    // The featured release renders a lazy embed that mounts a real iframe on click.
    const embed = page.getByTestId('video-embed');
    await expect(embed).toBeVisible();
    await embed.getByRole('button', { name: /^Play video:/ }).click();
    await expect(embed.locator('iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);

    // The library grid renders one card per seeded song.
    const cards = page.getByTestId('video-card');
    expect(await cards.count()).toBeGreaterThan(0);

    // Lyrics open in a modal and show the song title.
    await page.getByTestId('lyrics-button').first().click();
    const modal = page.getByTestId('lyrics-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { level: 3 })).not.toBeEmpty();
    await modal.getByRole('button', { name: 'Close lyrics' }).click();
    await expect(modal).toBeHidden();
  });

  test('G3b: genre filter narrows the grid', async ({ page }) => {
    await page.goto('/music');
    const total = await page.getByTestId('video-card').count();
    await page.getByTestId('genre-filter').getByRole('tab', { name: /^Devotional/ }).click();
    const filtered = await page.getByTestId('video-card').count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThanOrEqual(total);
  });

  // G4 — Contact form fields and submit button present
  test('G4: contact form exposes all fields and a submit button', async ({ page }) => {
    await page.goto('/contact');
    const form = page.getByTestId('contact-form');
    await expect(form).toBeVisible();
    await expect(form.getByLabel('Your name')).toBeVisible();
    await expect(form.getByLabel('Email')).toBeVisible();
    await expect(form.getByLabel('Enquiry type')).toBeVisible();
    await expect(form.getByLabel('Message')).toBeVisible();
    await expect(page.getByTestId('contact-submit')).toBeVisible();
    // Without a Web3Forms key the form must say so rather than fail silently.
    await expect(page.getByTestId('form-unconfigured')).toBeVisible();
  });

  // G5 — Blog list → post detail navigation
  test('G5: a blog card navigates to its post', async ({ page }) => {
    await page.goto('/blog');
    const grid = page.getByTestId('blog-grid');
    await expect(grid).toBeVisible();

    const firstLink = page.getByTestId('blog-link').first();
    const title = (await firstLink.getByRole('heading', { level: 2 }).textContent())?.trim();
    await firstLink.click();

    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
    await expect(page.getByTestId('blog-post')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title!);
    await expect(page.getByTestId('reading-time')).toContainText(/\d+ min read/);
  });

  // G6 — Events page cards visible
  test('G6: events page shows upcoming cards and greys out past ones', async ({ page }) => {
    await page.goto('/events');
    const cards = page.getByTestId('event-card');
    expect(await cards.count()).toBeGreaterThan(0);

    await expect(page.getByTestId('upcoming-events')).toBeVisible();

    // The seed data contains one deliberately past event.
    const past = page.locator('[data-testid="event-card"][data-past="true"]');
    expect(await past.count()).toBeGreaterThan(0);
    await expect(past.first()).toHaveClass(/opacity-60/);
  });

  // G7 — Footer copyright present
  test('G7: footer carries the copyright line on every page', async ({ page }) => {
    for (const href of ['/', '/music', '/blog']) {
      await page.goto(href);
      const copyright = page.getByTestId('copyright');
      await expect(copyright).toContainText('All rights reserved');
      await expect(copyright).toContainText(siteConfig.copyrightHolder);
    }
  });

  // G8 / G9 — layout intact at 375px and 1280px (both projects run this)
  test('G8/G9: no horizontal overflow at this viewport', async ({ page }, testInfo) => {
    for (const href of ['/', '/music', '/events', '/blog', '/about', '/contact']) {
      await page.goto(href);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() => {
        const d = document.documentElement;
        return d.scrollWidth - d.clientWidth;
      });
      expect(overflow, `${href} overflows horizontally in ${testInfo.project.name}`).toBeLessThanOrEqual(1);
    }
  });

  test('G8/G9: navigation is reachable at this viewport', async ({ page }, testInfo) => {
    await page.goto('/');
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toBeVisible();

    if (testInfo.project.name === 'mobile') {
      // Desktop nav collapses; the menu button must take over.
      const toggle = navbar.getByRole('button', { name: 'Open menu' });
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(page.locator('#mobile-nav').getByRole('link', { name: 'Music' })).toBeVisible();
    } else {
      await expect(navbar.getByRole('navigation', { name: 'Main' })).toBeVisible();
      await expect(navbar.getByRole('link', { name: 'Music', exact: true })).toBeVisible();
    }
  });

  test('navbar transitions from transparent to solid on scroll', async ({ page }) => {
    await page.goto('/');
    const navbar = page.getByTestId('navbar');
    await expect(navbar).toHaveAttribute('data-solid', 'false');
    await page.mouse.wheel(0, 600);
    await expect(navbar).toHaveAttribute('data-solid', 'true');
  });
});
