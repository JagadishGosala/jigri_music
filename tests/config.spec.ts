import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/* ---------------------------------------------------------------------------
 * Source-level quality gates from PART 9 that are not observable in the browser.
 * ------------------------------------------------------------------------- */

const root = path.join(__dirname, '..');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'out'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

test('no secret value is hardcoded in source', () => {
  const sourceFiles = walk(path.join(root, 'src'));
  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, 'utf8');
    expect(text, `${file} hardcodes a secret`).not.toContain('dev-only-secret');
    // ADMIN_SECRET may only ever be read from the environment.
    if (text.includes('ADMIN_SECRET')) {
      expect(text, `${file} must read ADMIN_SECRET from process.env`).toContain('process.env.ADMIN_SECRET');
    }
  }
});

test('.env.local is gitignored and .env.local.example is committed', () => {
  const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  expect(gitignore).toMatch(/^\.env\.local$/m);
  expect(fs.existsSync(path.join(root, '.env.local.example'))).toBe(true);
  const example = fs.readFileSync(path.join(root, '.env.local.example'), 'utf8');
  expect(example).toContain('ADMIN_SECRET=');
  expect(example).not.toContain('dev-only-secret');
});

test('no hardcoded hex colours in component or page files', () => {
  const files = walk(path.join(root, 'src')).filter((f) => /\.(tsx)$/.test(f));
  const hex = /#[0-9a-fA-F]{6}\b/g;
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const matches = text.match(hex) ?? [];
    // layout.tsx legitimately sets the browser theme colour in metadata.
    const allowed = file.endsWith(path.join('app', 'layout.tsx'));
    expect(allowed || matches.length === 0, `${file} contains hardcoded hex ${matches.join(', ')}`).toBe(true);
  }
});

test('every placeholder asset carries a TODO marker', () => {
  const placeholderFiles = [
    'src/components/PlaceholderVisual.tsx',
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/lib/site-config.ts',
  ];
  for (const rel of placeholderFiles) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    expect(text, `${rel} is missing a TODO marker`).toMatch(/TODO: replace|TODO: replace with real asset/);
  }
});

test('the palette lives in tailwind.config.ts as named tokens', () => {
  const config = fs.readFileSync(path.join(root, 'tailwind.config.ts'), 'utf8');
  for (const token of [
    'brand-bg',
    'brand-surface',
    'brand-accent',
    'brand-text',
    'brand-muted',
    'brand-border',
  ]) {
    expect(config, `missing token ${token}`).toContain(token);
  }
});

test('admin API documentation exists with curl examples', () => {
  const doc = fs.readFileSync(path.join(root, 'docs', 'admin-api.md'), 'utf8');
  expect(doc).toContain('curl');
  expect(doc).toContain('Authorization: Bearer');
  expect(doc.toLowerCase()).toContain('hoppscotch');
});

test('the YouTube utility falls back to mock data without an API key', () => {
  const text = fs.readFileSync(path.join(root, 'src', 'lib', 'youtube.ts'), 'utf8');
  expect(text).toContain('YOUTUBE_API_KEY');
  expect(text).toContain('getMockVideos');
  // The absence of a key must short-circuit to the mock path.
  expect(text).toMatch(/if \(!key \|\| !channelId\) return getMockVideos/);
});

test('static export is not enabled (it would break the admin endpoint)', () => {
  const config = fs.readFileSync(path.join(root, 'next.config.mjs'), 'utf8');
  expect(config).not.toMatch(/^\s*output:\s*['"]export['"]/m);
});
