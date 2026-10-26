/**
 * Real browser tests (headless Chrome over DevTools Protocol): what phones,
 * old settings in storage, blocked storage, no-JS and impatient users do.
 * Skipped automatically when Chrome is not installed.
 */
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { launch, chromePath, sleep } from './lib/cdp.mjs';
import { BASE } from './lib/http.mjs';

const JOURNEY = '/founders/ayush-shaw-shaw-agrivolt-gas';
const PAGES = ['/', '/founders', '/stories', JOURNEY, '/founders/kishan-panchal-farming-solutions-india', '/stories/beyond-the-metro-moat-tier-2-manufacturing'];
const BOARD_KEY = 'um_my_board_v1';

let browser;
before(async () => {
  if (chromePath) browser = await launch();
});
after(() => browser?.close());

const opts = { skip: !chromePath && 'Chrome not found (set CHROME_PATH)' };

describe('H. Phones and layout', opts, () => {
  for (const width of [360, 390]) {
    test(`H1 no sideways scrolling at ${width}px on any page`, async () => {
      const p = await browser.page({ width, height: 800 });
      const wide = [];
      for (const path of PAGES) {
        await p.goto(BASE + path, 2500);
        const r = await p.eval(`(() => {
          const vw = document.documentElement.clientWidth;
          const sw = document.documentElement.scrollWidth;
          const culprits = [...document.querySelectorAll('body *')]
            .filter(e => { const b = e.getBoundingClientRect(); return b.right > vw + 1 && getComputedStyle(e).position !== 'fixed'; })
            .slice(0, 3).map(e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''));
          return { vw, sw, culprits };
        })()`);
        if (r.sw > r.vw + 1) wide.push(`${path}: page is ${r.sw}px wide on a ${r.vw}px screen (${r.culprits.join(', ')})`);
      }
      await p.close();
      assert.deepEqual(wide, []);
    });
  }

  test('H2 tap targets in the header are at least 40 x 40px on mobile', async () => {
    const p = await browser.page({ width: 390 });
    await p.goto(BASE + '/');
    const small = await p.eval(`[...document.querySelectorAll('header a, header button')]
      .filter(e => e.offsetParent)
      .map(e => { const b = e.getBoundingClientRect(); return { n: (e.getAttribute('aria-label') || e.textContent || e.tagName).trim().slice(0, 24), w: Math.round(b.width), h: Math.round(b.height) }; })
      .filter(x => x.w < 40 || x.h < 40)`);
    await p.close();
    assert.deepEqual(small, []);
  });
});

describe('I. Errors a visitor would never see but we must', opts, () => {
  test('I1 no uncaught errors or console errors on any page (desktop and mobile)', async () => {
    const found = [];
    for (const width of [1280, 390]) {
      const p = await browser.page({ width });
      for (const path of PAGES) {
        p.errors.length = 0;
        p.consoleErrors.length = 0;
        await p.goto(BASE + path, 2500);
        for (const e of [...p.errors, ...p.consoleErrors]) found.push(`${width}px ${path}: ${String(e).split('\n')[0].slice(0, 160)}`);
      }
      await p.close();
    }
    assert.deepEqual(found, []);
  });

  test('I2 every image actually renders (no broken image icons)', async () => {
    const p = await browser.page({ width: 1280 });
    const broken = [];
    for (const path of PAGES) {
      await p.goto(BASE + path, 2000);
      await p.eval('window.scrollTo(0, document.body.scrollHeight)');
      await sleep(1500);
      const b = await p.eval(`[...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src').slice(0, 80))`);
      for (const s of b) broken.push(`${path}: ${s}`);
    }
    await p.close();
    assert.deepEqual(broken, []);
  });
});

describe('J. Theme', opts, () => {
  test('J1 a visitor whose phone is in light mode gets the light theme on first visit', async () => {
    const p = await browser.page({ theme: 'light' });
    await p.goto(BASE + '/');
    const bg = await p.eval(`getComputedStyle(document.body).backgroundColor + ' / data-theme=' + document.documentElement.dataset.theme`);
    await p.close();
    assert.match(bg, /rgb\(241, 243, 250\)/, `light-mode visitor got: ${bg}`);
  });

  test('J2 a chosen theme survives reload without flashing the other theme first', async () => {
    const p = await browser.page({ theme: 'dark' });
    await p.goto(BASE + '/');
    await p.eval(`document.querySelector('header button[aria-label="Switch theme"]').click()`);
    await sleep(300);
    const chosen = await p.eval('document.documentElement.dataset.theme');
    // Read the theme the very first script sets, before React runs.
    await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `document.addEventListener('DOMContentLoaded', () => { window.__firstTheme = document.documentElement.dataset.theme || 'system'; });` });
    await p.goto(BASE + '/');
    const first = await p.eval('window.__firstTheme');
    await p.close();
    assert.equal(first, chosen, `chose ${chosen}, but first paint used ${first}`);
  });
});

describe('K. Storage: old, corrupted, full or blocked', opts, () => {
  const corrupt = {
    'not JSON': `'not json {'`,
    'an object instead of a list': `'{"slug":"x"}'`,
    'nulls and numbers': `'[null, 5, "x"]'`,
    'items missing fields': `'[{"slug":7}, {"title":"no slug"}]'`,
  };
  for (const [name, value] of Object.entries(corrupt)) {
    test(`K1 board storage holding ${name} does not break the page`, async () => {
      const p = await browser.page({ init: `try { localStorage.setItem('${BOARD_KEY}', ${value}); } catch (e) {}` });
      await p.goto(BASE + '/', 2500);
      const ok = await p.eval(`!!document.querySelector('footer') && document.body.innerText.length > 500`);
      const errs = [...p.errors];
      await p.close();
      assert.ok(ok, 'page did not render');
      assert.deepEqual(errs, []);
    });
  }

  test('K2 a pin for a story that was unpublished disappears quietly (REQ-PUB-18)', async () => {
    const pins = JSON.stringify([{ slug: 'story-that-was-unpublished', type: 'story', title: 'Old story', subtitle: 'x' }]);
    const p = await browser.page({ init: `localStorage.setItem('${BOARD_KEY}', ${JSON.stringify(pins)})` });
    await p.goto(BASE + '/', 2500);
    const left = await p.eval(`localStorage.getItem('${BOARD_KEY}')`);
    const shown = await p.eval(`document.body.innerText.includes('Old story')`);
    await p.close();
    assert.ok(!shown && !String(left).includes('story-that-was-unpublished'), `still pinned: ${left}`);
  });

  test('K2b a pin made before founder stories moved to /founders is kept and re-pointed', async () => {
    const pins = JSON.stringify([{ slug: 'the-field-is-the-real-business-school', type: 'story', title: 'Kishan old pin', subtitle: 'Founder Story' }]);
    const p = await browser.page({ init: `localStorage.setItem('${BOARD_KEY}', ${JSON.stringify(pins)})` });
    await p.goto(BASE + '/', 2500);
    const left = JSON.parse(await p.eval(`localStorage.getItem('${BOARD_KEY}')`));
    await p.close();
    assert.equal(left.length, 1);
    assert.equal(left[0].slug, 'kishan-panchal-farming-solutions-india');
    assert.equal(left[0].type, 'founder');
  });

  test('K2c a renamed story refreshes its title on the board (REQ-PUB-17)', async () => {
    const pins = JSON.stringify([{ slug: 'ayush-shaw-shaw-agrivolt-gas', type: 'founder', title: 'An old headline', subtitle: '' }]);
    const p = await browser.page({ init: `localStorage.setItem('${BOARD_KEY}', ${JSON.stringify(pins)})` });
    await p.goto(BASE + '/', 2500);
    const left = JSON.parse(await p.eval(`localStorage.getItem('${BOARD_KEY}')`));
    await p.close();
    assert.notEqual(left[0].title, 'An old headline');
  });

  test('K3 storage blocked (Safari private mode, strict privacy settings) does not crash the site', async () => {
    const block = `Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });`;
    const p = await browser.page({ init: block });
    await p.goto(BASE + '/', 2500);
    const rendered = await p.eval(`document.body.innerText.length > 500`);
    const errs = [...p.errors];
    await p.close();
    assert.ok(rendered, 'page did not render');
    assert.deepEqual(errs.map((e) => e.split('\n')[0]), []);
  });
});

describe('P. Newsletter honesty', opts, () => {
  test('P1 with no mailing list connected, the form never claims to have subscribed anyone', async () => {
    const p = await browser.page();
    await p.goto(BASE + '/');
    await p.eval(`(() => { const f = document.querySelector('.news form'); f.querySelector('input').value = 'a@b.co'; f.requestSubmit(); })()`);
    await sleep(400);
    const text = await p.eval(`document.querySelector('.news').innerText`);
    await p.close();
    assert.ok(!/check your inbox/i.test(text), text);
    assert.match(text, /not open yet/i);
  });
});

describe('L. Without JavaScript (slow phones, failed bundle, crawlers)', opts, () => {
  for (const path of ['/founders', JOURNEY, '/stories']) {
    test(`L1 ${path} shows its main text with JavaScript off`, async () => {
      const p = await browser.page({ js: false, width: 390 });
      await p.goto(BASE + path, 1500);
      const hidden = await p.eval(`[...document.querySelectorAll('main h1, main h2, main h3, main p')]
        .filter(e => e.textContent.trim().length > 3)
        .filter(e => { let n = e; while (n && n !== document.body) { const s = getComputedStyle(n); if (s.opacity === '0' || s.visibility === 'hidden' || s.display === 'none') return true; n = n.parentElement; } return false; })
        .slice(0, 5).map(e => e.tagName + ': ' + e.textContent.trim().slice(0, 50))`);
      await p.close();
      assert.deepEqual(hidden, []);
    });
  }
});

describe('M. Motion and the page curtain', opts, () => {
  test('M1 with reduced motion, links navigate with no curtain', async () => {
    const p = await browser.page({ reducedMotion: true });
    await p.goto(BASE + '/founders');
    await p.eval(`document.querySelector('header a[href="/stories"]').click()`);
    await sleep(150);
    const vis = await p.eval(`[...document.querySelectorAll('.pc-lead, .pc-main')].map(e => getComputedStyle(e).display + '/' + getComputedStyle(e).visibility).join()`);
    await sleep(2500);
    const path = await p.eval('location.pathname');
    await p.close();
    assert.equal(path, '/stories');
    assert.ok(!/visible/.test(vis) || /none/.test(vis), `curtain showed: ${vis}`);
  });

  test('M2 impatient double and triple clicks end on the right page with the curtain gone', async () => {
    const p = await browser.page();
    await p.goto(BASE + '/founders');
    await p.eval(`(() => { const a = document.querySelector('header a[href="/stories"]'); a.click(); a.click(); a.click(); })()`);
    await sleep(3000);
    const r = await p.eval(`location.pathname + ' ' + [...document.querySelectorAll('.pc-lead,.pc-main')].map(e => getComputedStyle(e).visibility).join()`);
    await p.close();
    assert.equal(r, '/stories hidden,hidden');
  });

  test('M3 pressing Back while the curtain is closing does not leave the screen covered', async () => {
    const p = await browser.page();
    await p.goto(BASE + '/');
    // Real clicks, so the history has two pages of ours: / then /founders.
    await p.eval(`document.querySelector('header a[href="/founders"]').click()`);
    await sleep(3000);
    await p.eval(`document.querySelector('header a[href="/stories"]').click()`);
    await sleep(200); // curtain is mid-way
    await p.eval('history.back()');
    await sleep(5000); // longer than the 4s failsafe
    const r = await p.eval(`[...document.querySelectorAll('.pc-lead,.pc-main')].map(e => getComputedStyle(e).visibility).join()`);
    await p.close();
    assert.equal(r, 'hidden,hidden');
  });

  test('M4 Ctrl+click and middle click are not hijacked (open in new tab still works)', async () => {
    const p = await browser.page();
    await p.goto(BASE + '/founders');
    const prevented = await p.eval(`(() => {
      const a = document.querySelector('header a[href="/stories"]');
      const out = [];
      for (const init of [{ ctrlKey: true }, { metaKey: true }, { button: 1 }]) {
        const e = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
        a.dispatchEvent(e); out.push(e.defaultPrevented);
      }
      return out;
    })()`);
    await p.close();
    assert.deepEqual(prevented, [false, false, false]);
  });
});

describe('Q. Reading page layouts', opts, () => {
  for (const variant of ['cover', 'dossier', 'chapters']) {
    test(`Q1 ${variant}: the top of the page scrolls away, nothing big stays pinned except the profile rail`, async () => {
      const p = await browser.page({ width: 1440, height: 900 });
      await p.goto(`${BASE}/preview/${variant}/ayush-shaw-shaw-agrivolt-gas`, 2500);
      await p.eval('window.scrollTo(0, 1500)');
      await sleep(600);
      const r = await p.eval(`({
        heroTop: Math.round(document.querySelector('.fj-hero').getBoundingClientRect().top),
        pinned: [...document.querySelectorAll('body *')]
          .filter(e => ['fixed', 'sticky'].includes(getComputedStyle(e).position) && e.getBoundingClientRect().height > 100 && e.getBoundingClientRect().width > 100)
          .map(e => e.tagName.toLowerCase() + '.' + String(e.className.baseVal ?? e.className).split(' ')[0])
          .filter(n => !/^(svg\.pc-|aside\.fj-rail)/.test(n)),
      })`);
      await p.close();
      assert.ok(r.heroTop < 0, `hero is still on screen at top ${r.heroTop}`);
      assert.deepEqual(r.pinned, [], 'unexpected pinned elements');
    });

    test(`Q2 ${variant}: no sideways scrolling and no script errors at 390px`, async () => {
      const p = await browser.page({ width: 390, height: 844 });
      await p.goto(`${BASE}/preview/${variant}/kishan-panchal-farming-solutions-india`, 2500);
      const sw = await p.eval('document.documentElement.scrollWidth');
      const errs = [...p.errors];
      await p.close();
      assert.ok(sw <= 390, `page is ${sw}px wide on a 390px screen`);
      assert.deepEqual(errs, []);
    });
  }

  test('Q3 the chapter list stays visible on phones (a global nav rule used to hide it)', async () => {
    const p = await browser.page({ width: 390, height: 844 });
    await p.goto(`${BASE}/preview/dossier/ayush-shaw-shaw-agrivolt-gas`, 2500);
    const shown = await p.eval(`(() => { const e = document.querySelector('.fj-chapters'); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0; })()`);
    await p.close();
    assert.ok(shown);
  });
});

describe('N. Keyboard', opts, () => {
  test('N1 every element reached with Tab shows a visible focus ring', async () => {
    const p = await browser.page();
    await p.goto(BASE + '/founders');
    const bad = [];
    for (let i = 0; i < 25; i++) {
      await p.key('Tab', 'Tab', 9);
      const r = await p.eval(`(() => { const e = document.activeElement; if (!e || e === document.body) return null;
        const s = getComputedStyle(e);
        const ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
        return { ring, n: (e.getAttribute('aria-label') || e.textContent || e.tagName).trim().slice(0, 30) }; })()`);
      if (r && !r.ring) bad.push(r.n);
    }
    await p.close();
    assert.deepEqual([...new Set(bad)], []);
  });

  test('N2 the mobile menu opens, and Escape closes it', async () => {
    const p = await browser.page({ width: 390 });
    await p.goto(BASE + '/');
    await p.eval(`document.querySelector('.nav-toggle').click()`);
    await sleep(300);
    const open = await p.eval(`document.querySelector('.nav-toggle').getAttribute('aria-expanded')`);
    await p.key('Escape', 'Escape', 27);
    await sleep(300);
    const closed = await p.eval(`document.querySelector('.nav-toggle').getAttribute('aria-expanded')`);
    await p.close();
    assert.equal(`${open}/${closed}`, 'true/false');
  });
});
