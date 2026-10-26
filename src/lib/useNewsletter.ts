'use client';

import { useState, type FormEvent } from 'react';

/**
 * Shared behaviour for the home band and the footer field.
 *
 * Until a mailing list is connected, the form must NOT say "Thanks, check your
 * inbox": nothing would arrive. Set NEXT_PUBLIC_NEWSLETTER_ACTION to your list's
 * form address (for example Buttondown or Mailchimp embed form) and the form
 * posts the `email` field there, in a new tab, with no server code of ours.
 */
const ACTION = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION;

export function useNewsletter() {
  const [state, setState] = useState<'idle' | 'sent' | 'closed'>('idle');

  const formProps = {
    ...(ACTION ? { action: ACTION, method: 'post', target: '_blank' } : {}),
    onSubmit: (e: FormEvent) => {
      if (!ACTION) {
        e.preventDefault();
        setState('closed');
      } else {
        setState('sent'); // the browser still submits the form natively
      }
    },
  };

  const message =
    state === 'sent'
      ? 'Thanks. Check your inbox to confirm.'
      : state === 'closed'
        ? 'Newsletter signups are not open yet. Follow us on Instagram for the launch.'
        : null;

  return { formProps, message };
}
