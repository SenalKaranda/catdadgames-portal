// Axe-core accessibility audit against the built site.
// Spawns http-server to serve dist/, then runs axe against each route.
// Fails the process on any axe violation.
//
// Usage:  pnpm a11y
// Requires:  `pnpm build` has run.

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const PORT = 4329;
const BASE = `http://127.0.0.1:${PORT}`;
const ROUTES = [
  '/',
  '/about/',
  '/accessibility/',
  '/for-organizations/',
  '/feedback/',
  '/games/think-backwards/',
];

const log = (msg: string) =>
  console.log(`[${new Date().toISOString().slice(11, 23)}] ${msg}`);

const DIST = resolve(process.cwd(), 'dist');
if (!existsSync(DIST)) {
  console.error('Error: dist/ not found. Run `pnpm build` first.');
  process.exit(1);
}

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
      // retry
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
    const context = await browser.newContext();
    let totalViolations = 0;

    for (const route of ROUTES) {
      const page = await context.newPage();
      const url = BASE + route;
      log(`navigating to ${route}`);
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });
      log(`running axe on ${route}`);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      if (results.violations.length === 0) {
        log(`✓ ${route}  no violations`);
      } else {
        log(`✗ ${route}  ${results.violations.length} violation(s):`);
        for (const v of results.violations) {
          console.log(`    [${v.impact}] ${v.id}: ${v.description}`);
          console.log(`      help: ${v.helpUrl}`);
          for (const node of v.nodes.slice(0, 3)) {
            console.log(`      target: ${node.target.join(' ')}`);
            console.log(`      html: ${node.html}`);
            if (node.failureSummary)
              console.log(`      failure: ${node.failureSummary.replace(/\n/g, ' | ')}`);
          }
        }
        totalViolations += results.violations.length;
      }
      await page.close();
    }

    await browser.close();
    log(
      totalViolations === 0
        ? '\nAll routes passed axe-core.'
        : `\n${totalViolations} total violation(s).`,
    );
    process.exitCode = totalViolations > 0 ? 1 : 0;
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  server.kill();
  process.exit(1);
});
