import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

// Accessibility flags can be true, false, or "partial" — see §5/§7 of design doc.
const a11yFlag = z.union([z.boolean(), z.literal('partial')]);

const games = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/games' }),
  schema: ({ image }) =>
    z.object({
      slug: z
        .string()
        .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'slug must be kebab-case'),
      title: z.string().min(1),
      tagline: z.string().min(1),
      description: z.string().min(1),
      url: z.string().url(),
      launch_target: z.enum(['new_tab', 'same_tab']).default('new_tab'),
      thumbnail: image().optional(),
      fallback_emoji: z.string().optional(),
      fallback_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'fallback_color must be a #RRGGBB hex')
        .optional(),
      tags: z.array(z.string()).default([]),
      players: z.string().optional(),
      duration: z.string().optional(),
      ui_language: z.string().default('en'),
      tech: z.string().optional(),
      accessibility: z.object({
        keyboard_navigation: a11yFlag,
        screen_reader: a11yFlag,
        high_contrast_mode: z.boolean(),
        text_resize: z.boolean(),
        reduced_motion: z.boolean(),
        color_only_signals: z.boolean(),
        audio_required: z.boolean(),
        notes: z.string().optional(),
      }),
      status: z.enum(['published', 'draft', 'hidden']).default('published'),
      added: z.coerce.date(),
      updated: z.coerce.date(),
      featured: z.boolean().default(false),
    }),
});

export const collections = { games };
