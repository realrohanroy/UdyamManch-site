/**
 * Cloudinary is the image CDN for founder photos and artwork (see README,
 * "Images"). Content stores the plain delivery URL; this module adds the
 * resize step for each slot on the page, so one upload serves a 64px
 * thumbnail and a full width hero without anyone making two files.
 *
 * Every URL also gets f_auto,q_auto: Cloudinary picks AVIF or WebP and a
 * quality level per browser. A 2.4 MB PNG upload arrives as about 45 KB.
 *
 * URLs that are not on Cloudinary (local /assets files, Unsplash) are
 * returned unchanged, so callers never need to check first.
 */

const UPLOAD = '/image/upload/';

export function isCloudinary(url: string | undefined): url is string {
  return !!url && url.startsWith('https://res.cloudinary.com/') && url.includes(UPLOAD);
}

/**
 * Adds a transformation to a Cloudinary URL, e.g. cld(url, 'c_limit,w_640').
 * Transformations already in the URL (a crop, rounded corners) are kept and
 * run first; the new one is chained after them.
 */
export function cld(url: string, transform: string): string;
export function cld(url: string | undefined, transform: string): string | undefined;
export function cld(url: string | undefined, transform: string): string | undefined {
  if (!isCloudinary(url)) return url;
  const at = url.indexOf(UPLOAD) + UPLOAD.length;
  const head = url.slice(0, at);
  const parts = url.slice(at).split('/');
  // Segments before the version (v1234) or the file name are transformations.
  let i = 0;
  while (i < parts.length - 1 && !/^v\d+$/.test(parts[i])) i++;
  const existing = parts.slice(0, i);
  const rest = parts.slice(i).join('/');
  const auto = existing.some((t) => t.includes('f_auto')) ? [] : ['f_auto,q_auto'];
  return head + [...existing, ...auto, transform].join('/') + '/' + rest;
}

/** Width descriptors for srcSet, never upscaling past the original. */
export function cldSrcSet(url: string | undefined, widths: number[]): string | undefined {
  if (!isCloudinary(url)) return undefined;
  return widths.map((w) => `${cld(url, `c_limit,w_${w}`)} ${w}w`).join(', ');
}
