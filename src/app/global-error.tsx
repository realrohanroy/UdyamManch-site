'use client';

/**
 * Last resort: replaces the whole page if the root layout itself crashes.
 * It cannot use our CSS or tokens, so it carries a few plain styles of its own.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Helvetica Neue, Arial, sans-serif', background: '#f1f3fa', color: '#13122b' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '96px 24px' }}>
          <h1 style={{ fontSize: 36, lineHeight: 1.1, margin: '0 0 14px' }}>Udyam Manch is having a moment.</h1>
          <p style={{ fontSize: 18, lineHeight: 1.55, margin: '0 0 24px' }}>Something broke while loading the page. Please try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ font: '700 15px Helvetica Neue, Arial, sans-serif', padding: '12px 22px', borderRadius: 999, border: 0, background: '#13122b', color: '#f1f3fa', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
