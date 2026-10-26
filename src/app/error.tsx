'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Shown when a page crashes in the browser. Without this, the visitor sees a bare
 * "Application error" and no way out. The header and footer stay, so they can navigate.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // One place to hook error reporting later (Sentry, or a beacon to your own endpoint).
    console.error('[page error]', error.digest ?? '', error.message);
  }, [error]);

  return (
    <div className="w" style={{ padding: '80px 0', maxWidth: 640 }}>
      <h1 style={{ font: '800 clamp(32px,5vw,48px)/1.05 var(--hd)', letterSpacing: '-.025em', margin: '0 0 14px' }}>
        Something went wrong on our side.
      </h1>
      <p style={{ font: '400 19px/1.55 var(--bd)', color: 'var(--mute)', margin: '0 0 28px' }}>
        The page did not load properly. Trying again usually fixes it. If it keeps happening, your saved board may be the
        cause, and you can start fresh from the home page.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" className="btn" onClick={() => reset()}>
          Try again
        </button>
        <Link className="btn" href="/" style={{ background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--ink)' }}>
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
