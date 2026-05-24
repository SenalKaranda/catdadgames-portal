// Single source of truth for top-level site constants.
// Update REPO_URL and DOMAIN when the GitHub repo and domain are live.

export const SITE_NAME = 'Cat Dad Games';
export const SITE_TAGLINE =
  'A curated, ad-free home for browser games anyone can play.';

export const REPO_URL = 'https://github.com/SenalKaranda/catdadgames-portal';

export const CONTACT_EMAIL = 'catdadstudios@gmail.com';

export const NAV_LINKS = [
  { href: '/about/', label: 'About' },
  { href: '/for-organizations/', label: 'For organizations' },
  { href: '/feedback/', label: 'Feedback' },
] as const;
