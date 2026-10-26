'use client';

import React from 'react';
import { useNewsletter } from '@/lib/useNewsletter';

export default function NewsletterBand() {
  const { formProps, message } = useNewsletter();

  return (
    <section className="news" id="nl">
      <div>
        <h2>The stories behind India&apos;s next big businesses, in your inbox.</h2>
        <p>
          One email a week with the best founder story, three companies worth knowing and the business news that mattered. No spam, unsubscribe any time.
        </p>
      </div>
      <div>
        <form {...formProps}>
          <input type="email" name="email" required placeholder="you@company.com" aria-label="Email address" autoComplete="email" />
          <button type="submit" className="btn">
            Subscribe
          </button>
        </form>
        {message && (
          <p role="status" style={{ font: '700 16px/1.4 var(--hd)', color: 'var(--ink)', margin: '12px 0 0' }}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
