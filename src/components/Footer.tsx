import React from 'react';
import Link from 'next/link';
import FooterSubscribe from './FooterSubscribe';

/** Footer panel. Class prefix: ft (styles/footer.css). */
export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-panel">
        <div className="ft-intro">
          <p className="ft-tag">Stories behind India&apos;s next big businesses.</p>
          <p className="ft-copy">
            © {new Date().getFullYear()} Udyam Manch. Independent and reader supported. Profiles are researched by our
            editorial team.
          </p>
        </div>

        <div className="ft-col" role="navigation" aria-label="Footer navigation">
          <h2 className="ft-h">Navigation</h2>
          <ul>
            <li><Link href="/stories">Stories</Link></li>
            <li><Link href="/founders">Founders</Link></li>
            <li><Link href="/founders?view=index">Startup directory</Link></li>
          </ul>
        </div>

        <div className="ft-col">
          <h2 className="ft-h">Elsewhere</h2>
          <ul>
            <li><a href="#subscribe">Newsletter</a></li>
            <li>
              <a href="https://www.instagram.com/udyammanch/" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div className="ft-news" id="subscribe">
          <h2 className="ft-h">Get the latest from Udyam Manch</h2>
          <FooterSubscribe />
          <h2 className="ft-h ft-follow">Follow us</h2>
          <div className="ft-social">
            <a href="https://www.instagram.com/udyammanch/" target="_blank" rel="noopener noreferrer" aria-label="Udyam Manch on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://x.com/udyammanch" target="_blank" rel="noopener noreferrer" aria-label="Udyam Manch on X">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="ft-mark" aria-hidden="true">
          <span>Udyam</span> <span>Manch</span>
        </div>
      </div>
    </footer>
  );
}
