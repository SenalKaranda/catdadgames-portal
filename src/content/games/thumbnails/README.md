# Game thumbnails

Per §9 of the design doc, thumbnails are the **preferred** (top-tier) visual.
If no thumbnail is supplied, the renderer falls through to an emoji card, then
to a generated text card. Nothing breaks if you skip this folder entirely.

## Rules for a thumbnail

- **Aspect ratio:** 16 × 9.
- **Dimensions:** 1200 × 675 pixels.
- **Format:** WebP.
- **File size:** ≤ 200 KB after Astro's build-time optimization.
- **Filename:** `<slug>.webp` — must match the `slug:` field in the YAML file.

## Adding one

1. Save the image here as `<slug>.webp` (e.g. `think-backwards.webp`).
2. In the matching YAML at `src/content/games/<slug>.yaml`, uncomment
   the `thumbnail: ./thumbnails/<slug>.webp` line.
3. Rebuild — Astro picks it up and emits responsive, lazy-loaded variants.

## Design guidance

Keep the catalog visually consistent: similar margins, a clear focal point,
strong contrast. A simple template (Figma or a static HTML reference) is
worth creating once you have 3–4 games.
