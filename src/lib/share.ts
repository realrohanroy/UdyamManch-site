/**
 * Share URLs with campaign tags.  [REQ-TMP-10] [REQ-TMP-12]
 * One function so every share bar on the site tracks channels the same way.
 */
export type ShareChannel = 'whatsapp' | 'linkedin' | 'x' | 'facebook' | 'copy_link' | 'native';

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

/**
 * Copies text and says whether it worked. navigator.clipboard is missing or blocked in
 * some in-app browsers (WhatsApp, Instagram) and on plain http, so fall back to the older
 * select-and-copy. Never throws: callers show the reader the result either way.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the older way.
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
