import type { Metadata } from 'next';
import Link from 'next/link';

/** [REQ-PUB-13] Submissions go through an external form. Nothing is published automatically. */
export const metadata: Metadata = {
  title: 'Get featured',
  description: 'Tell us your founder story. Our editorial team reads every submission and decides what to publish.',
};

const FORM = process.env.NEXT_PUBLIC_FEATURE_FORM_URL;

export default function GetFeaturedPage() {
  return (
    <div className="w" style={{ padding: '56px 0 24px', maxWidth: 760 }}>
      <p className="meta" style={{ margin: '0 0 10px' }}>For founders</p>
      <h1 style={{ font: '800 clamp(38px,6vw,72px)/1.05 var(--hd)', letterSpacing: '-.025em', margin: '0 0 18px' }}>
        Building something in India? Tell us.
      </h1>
      <p style={{ font: '400 21px/1.5 var(--bd)', color: 'var(--mute)', margin: '0 0 28px' }}>
        Our team reads every entry and decides what to publish. A submission never guarantees coverage, and nothing goes
        live without our checks and your consent.
      </p>

      <h2 style={{ font: '800 24px var(--hd)', margin: '0 0 10px' }}>What helps us say yes</h2>
      <ul style={{ font: '400 19px/1.6 var(--bd)', paddingLeft: 22, margin: '0 0 32px' }}>
        <li>A real business with customers, not an idea.</li>
        <li>Numbers you can back up with a document or a call.</li>
        <li>Photos you own, or have the right to share.</li>
      </ul>

      {FORM ? (
        <a className="btn" href={FORM} target="_blank" rel="noopener noreferrer">
          Open the submission form
        </a>
      ) : (
        <p role="status" style={{ font: '600 17px/1.5 var(--hd)', background: 'var(--soft)', padding: '14px 18px', borderRadius: 10 }}>
          The submission form is not open yet. Check back soon, or follow us on{' '}
          <a href="https://www.instagram.com/udyammanch/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--acc)' }}>
            Instagram
          </a>{' '}
          for the opening.
        </p>
      )}

      <p className="meta" style={{ marginTop: 28 }}>
        <Link href="/founders" style={{ color: 'var(--acc)' }}>
          See who we have featured
        </Link>
      </p>
    </div>
  );
}
