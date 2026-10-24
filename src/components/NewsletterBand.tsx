'use client';

import React, { useState } from 'react';

export default function NewsletterBand() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="news" id="nl">
      <div>
        <h2>The stories behind India&apos;s next big businesses, in your inbox.</h2>
        <p>
          One email a week with the best founder story, three companies worth knowing and the business news that mattered. No spam, unsubscribe any time.
        </p>
      </div>
      {submitted ? (
        <b style={{ font: '700 18px var(--hd)', color: 'var(--ink)' }}>Thanks. Check your inbox to confirm.</b>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="email" required placeholder="you@company.com" aria-label="Email address" />
          <button type="submit" className="btn">
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
