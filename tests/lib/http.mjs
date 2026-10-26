/**
 * Small HTTP helpers for the test suite. No dependencies: Node's fetch only.
 * BASE_URL defaults to a local `next start` on port 3000.
 */
export const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export async function get(path, opts = {}) {
  const t0 = performance.now();
  const res = await fetch(path.startsWith('http') ? path : BASE + path, { redirect: 'manual', ...opts });
  const body = opts.method === 'HEAD' ? '' : await res.text();
  return { status: res.status, headers: res.headers, body, ms: performance.now() - t0, location: res.headers.get('location') };
}

/** Follow redirects and report the chain, so tests can see 301 vs 302 vs 308. */
export async function follow(path, max = 5) {
  const chain = [];
  let url = path.startsWith('http') ? path : BASE + path;
  for (let i = 0; i < max; i++) {
    const r = await get(url);
    chain.push({ url, status: r.status });
    if (r.status >= 300 && r.status < 400 && r.location) url = new URL(r.location, url).toString();
    else return { ...r, url, chain };
  }
  throw new Error(`Too many redirects from ${path}`);
}

export const meta = (html, key) => {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${key.replace(/[:]/g, '\\$&')}"[^>]*content="([^"]*)"`, 'i');
  const re2 = new RegExp(`<meta[^>]+content="([^"]*)"[^>]*(?:property|name)="${key.replace(/[:]/g, '\\$&')}"`, 'i');
  return (html.match(re) || html.match(re2) || [])[1];
};

export const canonical = (html) => (html.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/i) || [])[1];

export const jsonLd = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

/** Internal hrefs from rendered HTML, without hash, de-duplicated. */
export function internalLinks(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const h = m[1].replace(/&amp;/g, '&');
    if (h.startsWith('/') && !h.startsWith('//')) out.add(h.split('#')[0] || '/');
  }
  return [...out];
}

export function images(html) {
  return [...html.matchAll(/<img\b[^>]*>/g)].map((m) => {
    const tag = m[0];
    const src = (tag.match(/\ssrc="([^"]+)"/) || [])[1];
    const alt = tag.match(/\salt="([^"]*)"/);
    return { tag, src: src?.replace(/&amp;/g, '&'), alt: alt ? alt[1] : null };
  });
}

/** Visible text only (scripts, styles and tags removed). */
export const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

/**
 * Real pixel size of a PNG, JPEG or WebP, read from the file header.
 * Share previews depend on the actual file, not the width/height the meta tag claims.
 */
export async function imageInfo(url) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get('content-type') || '';
  let w, h;
  if (buf.subarray(1, 4).toString() === 'PNG') {
    w = buf.readUInt32BE(16);
    h = buf.readUInt32BE(20);
  } else if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xc3) {
        h = buf.readUInt16BE(i + 5);
        w = buf.readUInt16BE(i + 7);
        break;
      }
      i += 2 + len;
    }
  } else if (buf.subarray(8, 12).toString() === 'WEBP') {
    const chunk = buf.subarray(12, 16).toString();
    if (chunk === 'VP8X') {
      w = 1 + buf.readUIntLE(24, 3);
      h = 1 + buf.readUIntLE(27, 3);
    } else if (chunk === 'VP8 ') {
      w = buf.readUInt16LE(26) & 0x3fff;
      h = buf.readUInt16LE(28) & 0x3fff;
    } else if (chunk === 'VP8L') {
      const b = buf.readUInt32LE(21);
      w = (b & 0x3fff) + 1;
      h = ((b >> 14) & 0x3fff) + 1;
    }
  }
  return { status: res.status, type, bytes: buf.length, w, h };
}
