import { NextResponse, type NextRequest } from 'next/server';

/**
 * Public content URLs are lowercase. A link retyped or autocorrected with capital
 * letters (/founders/Ayush-Shaw-...) gets a permanent redirect to the real address,
 * instead of a 404. Runs only on the two content routes, so it costs nothing elsewhere.
 */
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
  return NextResponse.next();
}

export const config = { matcher: ['/founders/:path*', '/stories/:path*'] };
