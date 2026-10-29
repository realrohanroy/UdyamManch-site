/**
 * Single source for the public origin. Override per environment (staging, preview).
 * The site is served from udyammanch.com. udyammanch.in only forwards its home page there
 * (GoDaddy), so any deeper .in link is a 404: never use .in here.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://udyammanch.com').replace(/\/$/, '');
export const SITE_NAME = 'Udyam Manch';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
