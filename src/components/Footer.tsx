import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="w">
        <div>
          <img
            className="lgl"
            src="https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668848/logo-light.webp"
            alt="Udyam Manch"
            style={{ height: '64px', width: 'auto', marginBottom: '6px' }}
          />
          <img
            className="lgd"
            src="https://res.cloudinary.com/nkhny4aq/image/upload/f_auto,q_auto/v1792668847/logo-dark.webp"
            alt="Udyam Manch"
            style={{ height: '64px', width: 'auto', marginBottom: '6px' }}
          />
          <br />
          Stories behind India&apos;s next big businesses.
          <br />
          Stories and profiles on this site are independently researched by our editorial team.
        </div>
        <div>
          <Link href="/stories">Stories</Link>
          <br />
          <Link href="/founders">Founders</Link>
          <br />
          <Link href="/founders">Startup directory</Link>
          <br />
          <a href="#nl">Newsletter</a>
        </div>
        <div>
          <b>Archive</b>
          <br />
          © {new Date().getFullYear()} Udyam Manch.
          <br />
          Independent &amp; reader-supported.
        </div>
      </div>
    </footer>
  );
}
