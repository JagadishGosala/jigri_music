import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3100);
const baseURL = `http://127.0.0.1:${PORT}`;

/* Optional escape hatch for environments that already have a Chromium on disk
   (CI images, sandboxes) instead of Playwright's downloaded browsers.
   Leave unset locally — `npx playwright install chromium` is the normal path. */
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
const launchOptions = executablePath ? { executablePath } : {};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    launchOptions,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: undefined, launchOptions, viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], channel: undefined, launchOptions, viewport: { width: 375, height: 812 } },
    },
  ],

  webServer: {
    // Tests run against a real production build — the same artefact that ships.
    command: `npx next build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: { ADMIN_SECRET: process.env.ADMIN_SECRET ?? 'dev-only-secret-2f8a41c9b7e34d0a' },
  },
});
