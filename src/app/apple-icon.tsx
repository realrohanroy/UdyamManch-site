import { ImageResponse } from 'next/og';

/**
 * Home screen icon for iPhone and iPad (Add to Home Screen), 180 x 180 PNG.
 * iOS ignores SVG icons, so this draws the same mark as app/icon.svg on white.
 * Generated outside the page, so it cannot read tokens.css: the brand colours are repeated here.
 */
// Edge runtime: Next 14's Node image generator builds a broken file path on Windows, so local builds fail.
export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path fill="#75D3F5" d="M17 23.5 24 20v23h-7z" />
          <path fill="#5299D3" d="M26.5 18.5 34 14v29h-7.5z" />
          <path fill="#5455A5" d="M36.5 12.5 47 7c1.2 6 1.5 18 0 36H36.5z" />
          <path fill="none" stroke="#1b1b3a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" d="M10 29v5a22 15 0 0 0 44 0v-5M32 49.5v7M22 57.5h20" />
        </svg>
      </div>
    ),
    size,
  );
}
