/**
 * Branded share card, 1200 x 630 PNG.  [REQ-SEO-05]
 *
 * WHY GENERATED: WhatsApp skips share images over about 600KB and LinkedIn is
 * unreliable with WebP. Cover photos are often huge or the wrong shape, so every
 * page gets a small branded card built from its headline. It always passes.
 *
 * The share image is rendered outside the page and cannot read CSS variables, so
 * the brand colours are repeated here, in the same indigo, yellow and white family as tokens.css.
 */
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = 'image/png';

const BRAND = { bg: '#3a3b82', ink: '#ffffff', soft: '#d9dbff', accent: '#ffe36e' };

export function shareCard(opts: { title: string; kicker: string; byline?: string }) {
  const { title, kicker, byline } = opts;
  // Long headlines step down so they never overflow the card.
  const size = title.length > 80 ? 54 : title.length > 55 ? 64 : title.length > 35 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BRAND.bg,
          color: BRAND.ink,
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>Udyam Manch</div>
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 700,
              color: BRAND.bg,
              background: BRAND.accent,
              padding: '8px 22px',
              borderRadius: 999,
            }}
          >
            {kicker}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1040 }}>{title}</div>

        <div style={{ display: 'flex', fontSize: 28, color: BRAND.soft }}>{byline ?? 'Stories behind India’s next big businesses'}</div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
