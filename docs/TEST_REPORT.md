# Production test report

Tested 24 Oct 2026 against a production build (`npm run build && npm start`), not the
dev server, because caching, redirects and 404s behave differently in production.

**Current result: 77 tests, 76 pass, 0 fail, 1 known gap (marked as a to-do).**

The first run found 10 failures. All were fixed in this change and re-tested. The tests
stay in the repo and now run in CI, so these problems cannot quietly come back.

## How to run the tests

```bash
npm run build
npm start                 # in one terminal
npm run test:e2e          # in another
BASE_URL=https://staging.udyammanch.in npm run test:e2e   # against any deployed site
```

- `tests/http.test.mjs`: what crawlers, WhatsApp previews and people pasting odd links
  hit. Routes, redirects, broken links, hostile URLs, share tags and cards, sitemap,
  the revalidate API, headers, page weight.
- `tests/browser.test.mjs`: what real phones and browsers hit. Layout at 360px and
  390px, console errors, theme, corrupted or blocked storage, JavaScript off, reduced
  motion, impatient clicking, keyboard, the newsletter.

No new packages. They use Node's built-in test runner and the Chrome that is already
installed (set `CHROME_PATH` if it lives elsewhere). Each test name starts with a case
ID (A1, K2 and so on).

## Founders missing from Stories (fixed)

**What you saw:** Ayush Shaw appeared on Founders but not on Stories.

**Why:** Stories, the home "Latest" list and "From the directory" each read their own
hand-written list instead of the founder journeys. Kishan only appeared on Stories
because someone had copied his story in by hand, with invented details about a real
person that are not in his real journey.

**Fix:** one feed, `getFeed()` in `src/lib/content.ts`, built from founder journeys
plus editorial stories, newest first. Publishing a journey is now enough to appear
everywhere. The hand copy is deleted, and its old links still 301 to the real page.
Real dates replace "15 Oct 2026", "2h ago" and "3d ago". Tests D1 and D2 guard it.

## What was fixed, and how it is tested

| # | Problem found | Fix | Test |
| --- | --- | --- | --- |
| 1 | One `null` in the saved board blanked the whole site for that visitor | Every stored entry is validated on read (`cleanPins`). New `error.tsx` and `global-error.tsx` show a recovery page, never a bare crash. | K1, K3 |
| 2 | Newsletter forms said "Check your inbox" but sent nothing | Forms now say signups are not open yet. Set `NEXT_PUBLIC_NEWSLETTER_ACTION` and they post to your mailing list. | P1 |
| 3 | Share previews failed on 6 of 8 pages (9 MB originals, WebP, wrong size, none on listings) | Every page gets a generated branded 1200 x 630 PNG of about 40KB (`lib/og.tsx`). A hand made `seo.image` still wins. Ayush's image converted from WebP to JPEG. | C2, C2b, C4 |
| 4 | Invented content shown as real | The home quote now comes from a real journey's sidebar, the Trending strip from real items. The unverified story is marked Sample (label, noindex, out of the sitemap). Founders cards show a Sample tag. | D3, C3, C5 |
| 5 | Pins for unpublished stories stayed forever (REQ-PUB-18) | Pins are reconciled against what is live on every load, and renamed titles refresh (REQ-PUB-17). An empty live list keeps all pins, so a CMS outage never wipes a board. Old Kishan story pins migrate to his founder page. | K2, K2b, K2c |
| 6 | "Get featured" was a 404 | New `/get-featured` page (REQ-PUB-13). It shows the form button once `NEXT_PUBLIC_FEATURE_FORM_URL` is set, and says plainly that it is not open yet until then. | A7, A9 |
| 7 | Missing canonicals, hard-coded production host | Every page has a canonical. Layout, sitemap, robots and JSON-LD use `SITE_URL`. | C4, C5, C6 |
| 8 | No security headers, framework advertised | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS, and `X-Powered-By` removed. | F1, F2 |
| S1 | Capital letters in a link gave a 404 | Permanent redirect to the lowercase address (`src/middleware.ts`). Percent escapes keep their case. | A4, A4b |
| S2 | Header buttons 34px on mobile | 40 x 40px, logo link 40px tall. | H2 |
| S4 | "Directory" and "Founders" went to the same page | Directory opens the Founders index view. | manual |
| S5 | Plain default 404 | New 404 page with links and the latest real stories, `noindex`. | A10 |
| S8 | Board key differed between code and Design_System | Documented as `um_my_board_v1`, the key the site really uses, so nobody loses pins. | docs |
| S9 | Dead code | `ThemeToggle.tsx` and `FoundersDirectory.tsx` deleted. | tsc |
| S10 | Tests did not run in CI | New "Production tests" step in `.github/workflows/deploy.yml`. | CI |

Two regressions of my own turned up while testing and were fixed in the same change:
the "Sample" label on the Trending strip picked up a 30px number style and pushed the
home page 13px wider than a 360px phone (test H1), and the lowercase redirect also
fired for percent escapes in non-English addresses (test A3).

Also done: Next.js patched from 14.2.15 to 14.2.35.

## Still open

| Item | Why it is not fixed | What to do |
| --- | --- | --- |
| **Unknown founder and story addresses draw their 404 in the browser** (test A12, to-do) | A Next 14 behaviour for on-demand pages. The status is a correct 404 and the page is `noindex`, so search engines are fine. A visitor with JavaScript off sees a blank page. | Fixing it needs `dynamicParams = false`, which means a rebuild to publish a new founder. Decide that with the Sanity webhook plan (REQ-SEO-09), or move to Next 15. |
| `/founders` is rendered on every request (filters live in the URL) | Fine at today's traffic. At WhatsApp-viral traffic every hit renders on the server. | Render the unfiltered page statically and filter in the browser, or cache common filters. REQ-NFR-01, 06. |
| Slug redirect engine (REQ-SEO-02) | Not built. Renaming a published slug still breaks shared links. | Treat slugs as permanent until it exists. |
| Stories still use the old `content: string[]` model | Two templates will drift apart. | Move stories onto the journey block model. |
| Content Security Policy | The site uses inline scripts for theme and structured data, so a strict policy needs nonces. | Add after the Sanity connection, with a report-only trial first. |
| Client error reporting | `error.tsx` logs to the console only. Nobody sees a visitor's crash. | Hook Sentry (free tier) or a small beacon into `error.tsx`. |
| Newsletter list and Google Form not connected | They need your accounts. | Set the two environment variables in `.env.example`. |
| Edge runtime for share cards | Chosen because Next 14's Node image generator fails on Windows builds. | Safe on Vercel. Revisit after any Next upgrade. |
| Map outline (Founders page) | May not match the official Survey of India depiction. | Replace the paths in `india-states.ts` before launch. |

## What passed from the start

- **Links and URLs:**
  - Unknown slugs return a 404. Unicode, path traversal and 2000-character slugs
    return a 404, never a 500.
  - Legacy Kishan links 301 to his page.
  - Trailing slashes work.
- **Hostile query strings on `/founders`:** fake states, repeated parameters, negative
  or huge page numbers, null bytes, a 5000-character search and emoji all return 200.
  Search text is escaped, so `<script>` cannot be injected.
- **Search and share tags:** every founder journey has server-rendered Open Graph,
  Twitter, canonical and valid JSON-LD. Sample pages are `noindex`. The sitemap lists
  only live, non-sample pages. `robots.txt` blocks `/admin`.
- **Revalidate API:** refuses requests without the secret (including broken JSON) and
  refuses GET.
- **Layout and errors:** no sideways scrolling at 360px or 390px, no console errors,
  every image loads with alt text, every page answers in under 800ms locally, no image
  over 400KB.
- **Theme:** a light-mode phone gets the light theme, and a chosen theme survives
  reload with no flash.
- **Storage:** blocked storage (Safari private mode) and corrupt board storage do not
  crash the site.
- **JavaScript off:** Founders, Stories and journey pages are still readable.
- **Page curtain:** skipped with reduced motion, survives triple clicks and Back
  mid-wipe, never hijacks Ctrl+click or middle click.
- **Keyboard:** every Tab stop shows a focus ring, and Escape closes the mobile menu.

## Not tested, and why

- **Real WhatsApp, LinkedIn and X scrapers.** The tests check the files and tags those
  apps read. Paste one real link into each app before launch, and use each platform's
  preview debugger to refresh any cached preview.
- **Sanity Studio and CMS content.** No project ID is connected yet (Phase 5 blocker).
  When it is, add tests that a draft returns 404 and a published edit appears within
  60 seconds.
- **Other browsers.** Safari on iPhone and Firefox were not tested, only Chrome.
- **Real phones on 4G.** Timings come from a local server, so they are a floor. Run
  Lighthouse or PageSpeed Insights on the deployed site against REQ-NFR-01 (LCP under
  2 seconds).
- **Screen readers, colour contrast audit and load testing.** Not covered.
