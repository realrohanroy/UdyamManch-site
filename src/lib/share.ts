/**
 * Share URLs with campaign tags.  [REQ-TMP-10] [REQ-TMP-12]
 * One function so every share bar on the site tracks channels the same way.
 */
export type ShareChannel = 'whatsapp' | 'linkedin' | 'x' | 'facebook' | 'copy_link';

export function tagged(url: string, channel: ShareChannel, medium = 'share_bar'): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', channel);
  u.searchParams.set('utm_medium', medium);
  return u.toString();
}

export function shareLinks(url: string, title: string, medium = 'share_bar') {
  const enc = encodeURIComponent;
  return {
    whatsapp: `https://api.whatsapp.com/send?text=${enc(`${title} ${tagged(url, 'whatsapp', medium)}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(tagged(url, 'linkedin', medium))}`,
    x: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(tagged(url, 'x', medium))}&via=udyammanch`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(tagged(url, 'facebook', medium))}`,
    copy: tagged(url, 'copy_link', medium),
  };
}
