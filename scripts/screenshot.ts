// Visual sanity-check: screenshot every route in light mode.
// Saves PNGs to dist-screenshots/<name>.png.
//
// Usage:  pnpm tsx scripts/screenshot.ts
// Requires:  `pnpm build` has run.

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PORT = 4330;
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = resolve(process.cwd(), 'dist-screenshots');
const ROUTES = [
  { route: '/', name: 'home' },
  { route: '/games/think-backwards/', name: 'detail-think-backwards' },
  { route: '/about/', name: 'about' },
  { route: '/accessibility/', name: 'accessibility' },
  { route: '/for-organizations/', name: 'for-organizations' },
  { route: '/feedback/', name: 'feedback' },
];

const log = (m: string) => console.log(`[${new Date().toISOString().slice(11, 23)}] ${m}`);

if (!existsSync('dist')) {
  console.error('Run `pnpm build` first.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

log(`starting http-server on port ${PORT}`);
const server = spawn(
  'pnpm',
  ['exec', 'http-server', 'dist', '-p', String(PORT), '-s', '--cors', '-c-1'],
  { stdio: 'pipe', shell: true },
);

async function waitForServer(): Promise<void> {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE + '/');
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error('http-server did not become ready');
}

async function main() {
  try {
    await waitForServer();
    log('http-server ready, launching chromium');
    const browser = await chromium.launch();
    log('chromium launched');
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });

    for (const { route, name } of ROUTES) {
      const page = await context.newPage();
      log(`capturing ${route}`);
      await page.goto(BASE + route, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
      await page.waitForTimeout(200);
      const path = resolve(OUT, `${name}.png`);
      await page.screenshot({ path, fullPage: true });
      log(`saved ${path}`);
      await page.close();
    }

    await browser.close();
    log('done');
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  server.kill();
  process.exit(1);
});
