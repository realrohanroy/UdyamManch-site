import { NextResponse, type NextRequest } from 'next/server';
import { FLAGS } from '@/lib/flags';
import { LOCAL_JOURNEYS } from '@/content/founders';

/**
 * Public content URLs are lowercase. A link retyped or autocorrected with capital
 * letters (/founders/Ayush-Shaw-...) gets a permanent redirect to the real address,
 * instead of a 404.
 *
 * TEMPORARY: with FLAGS.foundersOnly, every address except the founder story pages is a 404
 * (the site's own not-found page, with a real 404 status). See lib/flags.ts.
 */
const OPEN = new Set(LOCAL_JOURNEYS.map((j) => `/founders/${j.slug}`));

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Lowercase letters only. Percent escapes (%E0%A4...) keep their case, or every
  // non-English address would redirect for no reason.
  const lower = pathname.replace(/(%[0-9a-fA-F]{2})|([A-Z])/g, (_m, pct, up) => pct ?? up.toLowerCase());
  if (pathname !== lower) {
    const url = req.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 301);
  }
  if (FLAGS.foundersOnly) {
    const page = pathname.replace(/\/(opengraph-image)?$/, '');
    // Rewriting to an address that does not exist renders app/not-found.tsx with status 404.
    if (!OPEN.has(page)) return NextResponse.rewrite(new URL('/__closed', req.url));
  }
  return NextResponse.next();
}

// Everything except build files and the files founder pages load (images, icons, share cards).
export const config = {
  matcher: ['/((?!_next/|assets/|icon\\.svg|apple-icon|favicon\\.ico|opengraph-image|robots\\.txt).*)'],
};
