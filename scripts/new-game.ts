// Scaffold a new game YAML entry from a template.
//
// Usage:  pnpm new-game <slug>
// Example: pnpm new-game word-ladder
//
// Creates src/content/games/<slug>.yaml with every schema field present and
// sensible defaults. Refuses to overwrite an existing file.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const CONTENT_DIR = resolve(process.cwd(), 'src', 'content', 'games');

function die(msg: string): never {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

const slug = process.argv[2];
if (!slug) die('missing slug.\n\nUsage:  pnpm new-game <slug>');
if (!SLUG_RE.test(slug))
  die(`"${slug}" is not a valid slug. Use kebab-case (lowercase letters, digits, hyphens).`);

const targetPath = resolve(CONTENT_DIR, `${slug}.yaml`);
if (existsSync(targetPath)) die(`a game with slug "${slug}" already exists at ${targetPath}`);

mkdirSync(CONTENT_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const titleFromSlug = slug
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join(' ');

const template = `slug: ${slug}
title: ${titleFromSlug}
tagline: A short one-line description.
description: |
  A longer description for the detail page. Markdown is supported.

  Use this space to explain what the game is, who it's for, and any tips
  that help a first-time player.
url: https://example.com/${slug}
launch_target: new_tab

# Thumbnail: drop a 1200x675 WebP at ./thumbnails/${slug}.webp and uncomment.
# thumbnail: ./thumbnails/${slug}.webp
fallback_emoji: "🎮"
fallback_color: "#14352A"

tags: []
players: ""
duration: ""
ui_language: en
tech: ""

accessibility:
  keyboard_navigation: false
  screen_reader: false
  high_contrast_mode: false
  text_resize: false
  reduced_motion: false
  color_only_signals: false
  audio_required: false
  notes: |
    To be filled in after testing.

status: draft
added: ${today}
updated: ${today}
featured: false
`;

writeFileSync(targetPath, template);

console.log(`\nCreated ${targetPath}\n`);
console.log('Next steps:');
console.log(`  1. Edit ${slug}.yaml — fill in title, tagline, description, url, tags, accessibility.`);
console.log(`  2. (Optional) Drop a 1200x675 WebP at src/content/games/thumbnails/${slug}.webp and uncomment the thumbnail line.`);
console.log('  3. Change `status: draft` to `status: published` when ready.');
console.log('  4. Run `pnpm build` — the schema validates the file at build time.');
console.log('');
