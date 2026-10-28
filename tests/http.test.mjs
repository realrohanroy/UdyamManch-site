/**
 * Production behaviour tests over HTTP: what crawlers, share previews and people
 * pasting odd links will hit. Run against `npm run build && npm start`:
 *
 *   npm run test:e2e            (or: BASE_URL=https://staging.example node --test tests/)
 *
 * Each test name starts with its case ID so the report in docs/TEST_REPORT.md
 * can point at it. A failing test is a finding, not a flaky test.
 */
import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { BASE, get, follow, meta, canonical, jsonLd, internalLinks, images, textOf, imageInfo } from './lib/http.mjs';

const JOURNEYS = [
  { slug: 'rohit-gour-animation-cult', name: 'Rohit Gour', sample: false },
  { slug: 'karthik-r-aurumcrypto', name: 'Karthik R', sample: false },
  { slug: 'ayush-shaw-shaw-agrivolt-gas', name: 'Ayush Shaw', sample: false },
  { slug: 'kishan-panchal-farming-solutions-india', name: 'Kishan Panchal', sample: false },
  { slug: 'sunita-meena-desert-loom-crafts', name: 'Sunita Meena', sample: true },
  { slug: 'arjun-somani-aarav-hydraulics', name: 'Arjun Somani', sample: true },
];
const STORY = '/stories/beyond-the-metro-moat-tier-2-manufacturing';
const PAGES = ['/', '/founders', '/stories', STORY, ...JOURNEYS.map((j) => `/founders/${j.slug}`)];

const html = {};
before(async () => {
  for (const p of PAGES) html[p] = (await get(p)).body;
});

describe('A. Routes, links and redirects', () => {
  test('A1 core pages return 200', async () => {
    for (const p of [...PAGES, '/robots.txt', '/sitemap.xml']) {
      assert.equal((await get(p)).status, 200, p);
    }
  });

  test('A2 unknown founder and story slugs return 404, not 500', async () => {
    assert.equal((await get('/founders/no-such-founder')).status, 404);
    assert.equal((await get('/stories/no-such-story')).status, 404);
  });

  test('A3 junk slugs (unicode, traversal, 2000 chars) return 404, never 500', async () => {
    for (const p of ['/founders/%E0%A4%89%E0%A4%A6%E0%A5%8D', '/founders/..%2F..%2Fetc%2Fpasswd', `/founders/${'a'.repeat(2000)}`, '/stories/%00']) {
      const r = await get(p);
      assert.ok(r.status === 404 || r.status === 400, `${p.slice(0, 40)} gave ${r.status}`);
    }
  });

  test('A4 uppercase slug from a mistyped or autocorrected link reaches the story', async () => {
    // Asked twice: on a case-insensitive disk (Windows) the first hit can match the
    // prerendered file by accident, then ISR caches a 404. Linux hosts 404 every time.
    for (const attempt of [1, 2]) {
      const r = await follow('/founders/Ayush-Shaw-Shaw-Agrivolt-Gas');
      assert.equal(r.status, 200, `attempt ${attempt}, chain: ${JSON.stringify(r.chain)}`);
    }
  });

  test('A4b uppercase slug is a permanent redirect, so shared links keep their ranking', async () => {
    const r = await get('/founders/Ayush-Shaw-Shaw-Agrivolt-Gas');
    assert.equal(r.status, 301);
    assert.match(r.location || '', /\/founders\/ayush-shaw-shaw-agrivolt-gas$/);
  });

  test('A5 trailing slash links still reach the page', async () => {
    assert.equal((await follow(`/founders/${JOURNEYS[0].slug}/`)).status, 200);
  });

  test('A6 legacy links redirect permanently to the founder story', async () => {
    for (const p of ['/stories/8', '/stories/the-field-is-the-real-business-school', '/stories/kishan-for-kisan', '/founder/kishan-panchal-farming-solutions-india']) {
      const r = await get(p);
      assert.ok([301, 308].includes(r.status), `${p} gave ${r.status}`);
      assert.match(r.location || '', /\/founders\/kishan-panchal-farming-solutions-india$/, p);
    }
  });

  test('A7 no internal link on any page leads to a 404', async () => {
    const broken = [];
    const seen = new Set();
    for (const p of PAGES) {
      for (const l of internalLinks(html[p])) {
        if (seen.has(l) || l.startsWith('/admin')) continue;
        seen.add(l);
        const r = await follow(l);
        if (r.status >= 400) broken.push(`${l} (${r.status}) on ${p}`);
      }
    }
    assert.deepEqual(broken, []);
  });

  test('A8 every image on every page loads and has an alt attribute', async () => {
    const problems = [];
    const seen = new Set();
    for (const p of PAGES) {
      for (const img of images(html[p])) {
        if (img.alt === null) problems.push(`missing alt: ${img.src} on ${p}`);
        if (!img.src || img.src.startsWith('data:') || seen.has(img.src)) continue;
        seen.add(img.src);
        try {
          const r = await fetch(new URL(img.src, BASE), { method: 'HEAD', signal: AbortSignal.timeout(15000) });
          if (!r.ok) problems.push(`${r.status}: ${img.src} on ${p}`);
        } catch (err) {
          // An outside host (Unsplash) being slow or unreachable is not our bug. Our own images must always load.
          if (new URL(img.src, BASE).origin === new URL(BASE).origin) problems.push(`unreachable: ${img.src} on ${p}`);
        }
      }
    }
    assert.deepEqual(problems, []);
  });
});

describe('A2. Pages that must exist', () => {
  test('A9 /get-featured exists and says the truth about the form', async () => {
    const r = await get('/get-featured');
    assert.equal(r.status, 200);
    assert.match(textOf(r.body), /submission form/i);
  });

  test('A10 the 404 page helps a lost visitor and stays out of search', async () => {
    const r = await get('/definitely-not-a-page');
    assert.equal(r.status, 404);
    assert.match(textOf(r.body), /could not find that page/i);
    assert.ok(r.body.includes('href="/"'));
    assert.match(meta(r.body, 'robots') || '', /noindex/);
  });

  test('A11 an unknown founder or story address is a noindex 404', async () => {
    for (const p of ['/founders/definitely-not-a-page', '/stories/definitely-not-a-page']) {
      const r = await get(p);
      assert.equal(r.status, 404, p);
      assert.match(meta(r.body, 'robots') || '', /noindex/, p);
    }
  });

  // Known gap, see docs/TEST_REPORT.md: Next 14 draws this 404 in the browser, so with JavaScript off the body is empty.
  test('A12 the 404 for an unknown founder address is readable without JavaScript', { todo: 'Next 14 ISR limitation' }, async () => {
    const r = await get('/founders/definitely-not-a-page');
    assert.match(textOf(r.body), /could not find that page/i);
  });
});

describe('B. Founders page under hostile or odd query strings', () => {
  const odd = [
    '?state=zz', '?state=rj&state=gj', '?state[]=rj', '?page=-5', '?page=abc', '?page=999999',
    '?sector=%00', '?view=index', '?view=<b>', `?q=${'x'.repeat(5000)}`, '?q=%F0%9F%92%A5', '?q=%',
  ];
  for (const q of odd) {
    test(`B1 /founders${q.slice(0, 30)} returns 200`, async () => {
      assert.equal((await get('/founders' + q)).status, 200);
    });
  }

  test('B2 search text is escaped, never injected as HTML', async () => {
    const r = await get('/founders?q=' + encodeURIComponent('"><script>alert(1)</script>'));
    assert.equal(r.status, 200);
    assert.ok(!r.body.includes('<script>alert(1)</script>'));
  });

  test('B3 a state filter with no founders shows an empty state, not a blank page', async () => {
    const r = await get('/founders?state=kl');
    assert.match(textOf(r.body), /no founders|nothing here|no results|0 founders|Showing 0/i);
  });

  test('B4 a 5000 character search answers in under 2 seconds', async () => {
    const r = await get(`/founders?q=${'founder '.repeat(625)}`);
    assert.ok(r.ms < 2000, `${Math.round(r.ms)}ms`);
  });
});

describe('C. Share previews and SEO', () => {
  for (const j of JOURNEYS) {
    test(`C1 ${j.slug}: OG, Twitter, canonical and JSON-LD are server rendered`, () => {
      const h = html[`/founders/${j.slug}`];
      assert.ok(meta(h, 'og:title'), 'og:title');
      assert.ok(meta(h, 'og:description'), 'og:description');
      assert.match(meta(h, 'og:image') || '', /^https:\/\//, 'og:image absolute https');
      assert.equal(meta(h, 'og:type'), 'article');
      assert.equal(meta(h, 'twitter:card'), 'summary_large_image');
      assert.match(canonical(h) || '', new RegExp(`/founders/${j.slug}$`));
      for (const ld of jsonLd(h)) JSON.parse(ld);
    });
  }

  test('C2 share images are real 1200 x 630 files that WhatsApp and LinkedIn can read', async () => {
    const problems = [];
    for (const p of PAGES) {
      const url = meta(html[p], 'og:image');
      if (!url) {
        problems.push(`${p}: no og:image`);
        continue;
      }
      // Production URLs point at the live domain; test the same path on this server.
      const local = new URL(new URL(url).pathname + new URL(url).search, url.includes('udyammanch.in') ? BASE : url).toString();
      const i = await imageInfo(local);
      if (i.status !== 200) problems.push(`${p}: og:image ${i.status} (${url})`);
      else {
        if (i.w !== 1200 || i.h !== 630) problems.push(`${p}: og:image is ${i.w}x${i.h}, not 1200x630`);
        if (/webp/.test(i.type)) problems.push(`${p}: og:image is WebP (LinkedIn is unreliable with WebP)`);
        if (i.bytes > 600_000) problems.push(`${p}: og:image is ${Math.round(i.bytes / 1024)}KB (WhatsApp skips images over about 600KB)`);
      }
    }
    assert.deepEqual(problems, []);
  });

  test('C2b the generated share card renders for every journey and story', async () => {
    const urls = [...JOURNEYS.map((j) => `/founders/${j.slug}/opengraph-image`), `${STORY}/opengraph-image`, '/opengraph-image'];
    const bad = [];
    for (const u of urls) {
      const i = await imageInfo(BASE + u);
      if (i.status !== 200 || i.w !== 1200 || i.h !== 630 || !/png/.test(i.type) || i.bytes > 300_000) bad.push(`${u}: ${i.status} ${i.w}x${i.h} ${i.type} ${i.bytes}B`);
    }
    assert.deepEqual(bad, []);
  });

  test('C3 sample journeys are noindex, real ones are indexable', () => {
    for (const j of JOURNEYS) {
      const robots = meta(html[`/founders/${j.slug}`], 'robots') || '';
      assert.equal(/noindex/.test(robots), j.sample, `${j.slug}: robots="${robots}"`);
    }
  });

  test('C4 listing pages have a canonical URL and their own share image', () => {
    const missing = [];
    for (const p of ['/', '/founders', '/stories']) {
      if (!canonical(html[p])) missing.push(`${p}: no canonical`);
      if (!meta(html[p], 'og:image')) missing.push(`${p}: no og:image`);
    }
    assert.deepEqual(missing, []);
  });

  test('C5 sitemap lists only live, non-redirecting, non-sample pages, on one host', async () => {
    const xml = (await get('/sitemap.xml')).body;
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    const problems = [];
    for (const u of urls) {
      const path = new URL(u).pathname;
      const r = await get(path);
      if (r.status !== 200) problems.push(`${path} -> ${r.status}`);
      if (JOURNEYS.some((j) => j.sample && path.endsWith(j.slug))) problems.push(`sample in sitemap: ${path}`);
    }
    for (const j of JOURNEYS.filter((x) => !x.sample)) {
      if (!urls.some((u) => u.endsWith(`/founders/${j.slug}`))) problems.push(`missing from sitemap: ${j.slug}`);
    }
    assert.deepEqual(problems, []);
  });

  test('C6 robots.txt points crawlers at the sitemap and keeps /admin out', async () => {
    const t = (await get('/robots.txt')).body;
    assert.match(t, /Sitemap:\s*\S+sitemap\.xml/i);
    assert.match(t, /Disallow:\s*\/admin/i);
  });
});

describe('D. Content consistency across the site', () => {
  for (const j of JOURNEYS) {
    test(`D1 ${j.name} appears on Stories, Founders and Home`, () => {
      for (const p of ['/stories', '/founders', '/']) {
        assert.ok(html[p].includes(`/founders/${j.slug}`), `${j.name} not linked from ${p}`);
      }
    });
  }

  test('D2 no hard-coded or fake dates ("2h ago", "15 Oct 2026" on every item)', () => {
    for (const p of ['/', '/stories']) {
      const t = textOf(html[p]);
      assert.ok(!/\b\d+[hd] ago\b/.test(t), `${p} shows relative fake times`);
    }
    const storyDates = textOf(html['/stories']).match(/\d{1,2} [A-Z][a-z]{2} \d{4}/g) || [];
    assert.ok(new Set(storyDates).size > 1, `all items show the same date: ${storyDates[0]}`);
  });

  test('D3 sample content is labelled "Sample" wherever it is listed', () => {
    for (const p of ['/', '/stories', '/founders']) {
      const t = textOf(html[p]);
      for (const j of JOURNEYS.filter((x) => x.sample)) {
        const at = t.indexOf(j.name.split(' ')[0]);
        if (at < 0) continue;
        assert.match(t, /Sample/, `${p} lists sample ${j.name} without a Sample label`);
      }
    }
  });

  test('D4 copy rule: no em dashes in rendered text', () => {
    const offenders = PAGES.filter((p) => textOf(html[p]).includes('—'));
    assert.deepEqual(offenders, []);
  });
});

describe('E. Revalidate API abuse', () => {
  test('E1 POST without secret is refused', async () => {
    const r = await get('/api/revalidate', { method: 'POST', body: '{}', headers: { 'content-type': 'application/json' } });
    assert.equal(r.status, 401);
  });

  test('E2 broken JSON without secret is refused with 401, not a 500 that leaks the error', async () => {
    const r = await get('/api/revalidate', { method: 'POST', body: '{not json', headers: { 'content-type': 'application/json' } });
    assert.equal(r.status, 401);
  });

  test('E3 GET is not allowed', async () => {
    assert.equal((await get('/api/revalidate')).status, 405);
  });
});

describe('F. Security headers', () => {
  test('F1 basic hardening headers are present', async () => {
    const h = (await get('/')).headers;
    const missing = ['x-content-type-options', 'referrer-policy'].filter((k) => !h.get(k));
    if (!h.get('x-frame-options') && !/frame-ancestors/.test(h.get('content-security-policy') || '')) missing.push('x-frame-options or CSP frame-ancestors');
    assert.deepEqual(missing, []);
  });

  test('F2 the server does not advertise its framework (x-powered-by)', async () => {
    assert.equal((await get('/')).headers.get('x-powered-by'), null);
  });
});

describe('G. Weight and speed (local server, so a floor, not real 4G numbers)', () => {
  test('G1 every page answers in under 800ms and its HTML is under 250KB', async () => {
    const slow = [];
    for (const p of PAGES) {
      const r = await get(p);
      if (r.ms > 800) slow.push(`${p} ${Math.round(r.ms)}ms`);
      if (r.body.length > 250_000) slow.push(`${p} HTML ${Math.round(r.body.length / 1024)}KB`);
    }
    assert.deepEqual(slow, []);
  });

  test('G2 no single image over 400KB on a reading page (mobile data)', async () => {
    const heavy = [];
    const seen = new Set();
    for (const p of PAGES) {
      for (const img of images(html[p])) {
        if (!img.src || seen.has(img.src) || img.src.startsWith('data:')) continue;
        seen.add(img.src);
        const r = await fetch(new URL(img.src, BASE));
        const bytes = (await r.arrayBuffer()).byteLength;
        if (bytes > 400_000) heavy.push(`${Math.round(bytes / 1024)}KB ${img.src}`);
      }
    }
    assert.deepEqual(heavy, []);
  });
});
