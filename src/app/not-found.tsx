import Link from 'next/link';
import type { Metadata } from 'next';
import { getFeed } from '@/lib/content';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

/** A lost visitor gets a way forward: the home page and the latest real stories. */
export default async function NotFound() {
  const latest = (await getFeed()).filter((s) => !s.sample).slice(0, 3);

  return (
    <div className="w" style={{ padding: '72px 0 24px', maxWidth: 720 }}>
      <p className="meta" style={{ margin: '0 0 10px' }}>Error 404</p>
      <h1 style={{ font: '800 clamp(36px,6vw,64px)/1.05 var(--hd)', letterSpacing: '-.025em', margin: '0 0 14px' }}>
        We could not find that page.
      </h1>
      <p style={{ font: '400 20px/1.55 var(--bd)', color: 'var(--mute)', margin: '0 0 28px' }}>
        The link may be old, mistyped or the story may have been taken down. Here is where to go next.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
        <Link className="btn" href="/">Go to the home page</Link>
        <Link className="btn" href="/founders" style={{ background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--ink)' }}>
          Browse founders
        </Link>
      </div>
      {latest.length > 0 && (
        <>
          <h2 style={{ font: '800 22px var(--hd)', margin: '0 0 8px' }}>Latest stories</h2>
          <div className="feed">
            {latest.map((s) => (
              <Link key={s.href} href={s.href}>
                <span className="meta">{s.date}</span>
                <span>
                  <span className="cat">{s.category}</span>
                  <h3>{s.title}</h3>
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
