---
layout: ../layouts/StaticPageLayout.astro
title: Accessibility
description: How Cat Dad Games is built to be usable by everyone — and how to report a problem.
---

# Accessibility

Cat Dad Games is built to meet **WCAG 2.2 Level AA** across the site, with
**Level AAA** contrast on body text. The site is designed and tested with
older adults, people with low vision, and keyboard and screen-reader users
in mind.

## What that means in practice

- Body text is at least 20 pixels, with a high-legibility font.
- A text-size control in the header scales the whole site to 125% or 150%.
- The site offers a light theme, a dark theme, and an automatic option that
  follows your operating system.
- Every interactive control is at least 48 by 48 pixels, large enough for a
  finger or a shaky hand on a mouse.
- Every focusable element shows a clear focus ring; nothing relies on hover.
- A "Skip to main content" link appears when you press Tab on any page.
- Color is never used alone to convey information — icons and labels come
  with it.
- Pages do not autoplay sound or video, and no animation runs without your
  permission. Reduced-motion preferences are respected.

## About the games

Each game has its own accessibility characteristics. The detail page for
every game lists what is supported (keyboard navigation, screen reader,
high-contrast mode, text resize, reduced motion, color independence, and
audio requirements) so you can decide before opening it.

When a flag says "Partial", it means the feature works in some places but
not all. When a flag says "No", the game does not currently support that
feature.

## How this is tested

Each release is checked against:

- Automated accessibility scanning with axe-core. The build fails on any
  violation.
- A Lighthouse accessibility score of 100 on every page.
- A manual keyboard-only walkthrough.
- A screen reader smoke test (NVDA on Windows, VoiceOver on macOS).

## Reporting a problem

If something on the site is hard to read, hard to use, or you cannot reach a
control, please tell me. The [Feedback](/feedback/) page has a direct email
link. Real reports take priority over anything else on this list.
