'use client';

import React from 'react';
import { useNewsletter } from '@/lib/useNewsletter';

/** Footer newsletter field. Same honest behaviour as the home band: see lib/useNewsletter.ts. */
export default function FooterSubscribe() {
  const { formProps, message } = useNewsletter();

  return (
    <>
      <form className="ft-form" {...formProps}>
        <input type="email" name="email" required placeholder="Email address" aria-label="Email address" autoComplete="email" />
        <button type="submit">Subscribe</button>
      </form>
      {message && (
        <p className="ft-thanks" role="status">
          {message}
        </p>
      )}
    </>
  );
}
