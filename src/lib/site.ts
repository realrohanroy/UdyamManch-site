/** Single source for the public origin. Override per environment (staging, preview). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://udyammanch.in').replace(/\/$/, '');
export const SITE_NAME = 'Udyam Manch';

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
