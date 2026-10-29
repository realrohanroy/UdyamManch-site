# Deployment checklist

Use this for the first public launch and for every release after it. Each item says
how to check it and what "pass" looks like. Tick items in a copy of this file or in
the release PR, not here.

Production is Vercel, deploying from `main` (`vercel.json`). For Hostinger, follow
`DEPLOY_HOSTINGER.md` for the hosting steps and use this list for everything else. The public address is
whatever `NEXT_PUBLIC_SITE_URL` says; the code defaults to `https://udyammanch.com`.
In the commands below, replace `https://udyammanch.com` with the real address.

Commands are for PowerShell on Windows. In Git Bash, use `BASE_URL=... npm run test:e2e`.

---

## 0. Launch blockers to decide first

These are open today. Each one needs a decision before the first public launch, not just a tick.

- [ ] **Sanity is not connected.** Without `NEXT_PUBLIC_SANITY_PROJECT_ID` the site serves the
      local files in `src/content/founders/` (that works, and is fine for launch), but `/admin` will not
      load a real project and editors cannot publish. Decide: launch on local content, or connect
      Sanity first (section 5).
- [ ] **Newsletter is not connected.** `NEXT_PUBLIC_NEWSLETTER_ACTION` is empty, so every subscribe
      form says signups are not open yet. That is honest, but the header Subscribe button is the
      main call to action on every page. Connect a list or accept this for launch.
- [ ] **Founder submission form.** `NEXT_PUBLIC_FEATURE_FORM_URL` is empty, so "Get featured" goes
      to `/get-featured`. Set it to the real Google Form, or confirm that page says what to do.
      When submissions open, also set `FLAGS.foundersSubmitCta` to true in `src/lib/flags.ts`; it
      brings back the "Building something in India?" section at the bottom of /founders.
- [ ] **Facts to verify with founders:** founding years (Kishan 2006, Ayush 2023), Rohit's founding
      year (missing), and every number marked Self-reported. Pass when each founder has confirmed
      their page in writing.
- [ ] **Sample content.** The story "Beyond the metro moat" is a labelled sample (`sample: true`,
      noindex, not in the sitemap). Decide whether a sample belongs on the launch site at all.
- [ ] **Ayush's images.** His hero is only 666px wide and, with his share image, is served from
      `public/assets/` instead of Cloudinary. The 1672px original artwork is in
      `../UdyamManch-cleanup-2026-10-29/ayush-shaw-original-artwork-1672px.png`. Upload it to
      Cloudinary and use a JPEG face crop for the share image, as done for Karthik and Rohit (DEC-025).
- [ ] **No privacy page.** Once analytics or a mailing list collect anything, India's DPDP Act
      2023 expects a notice that says what is collected and why. Add `/privacy` and link it from
      the footer before turning either on.
- [ ] **Slug redirects are not built** (REQ-SEO-02). Until they are, a published slug must never
      change. Pass when everyone who publishes knows this.
- [ ] **Uncommitted files.** Commit the app changes. Scratch files belong outside the repo (the
      29 Oct cleanup moved them to `../UdyamManch-cleanup-2026-10-29/`). Pass when `git status`
      shows nothing unexpected.

---

## 1. Before every deploy: code and build (local)

- [ ] `npx tsc --noEmit` prints nothing.
- [ ] `npm run build` ends with `Generating static pages (N/N)` and no errors. The content guard
      runs here: it fails on missing alt text, duplicate block keys, headlines over 90 characters
      and em dashes. Never bypass it.
  - If it fails with `Failed to fetch ... from Google Fonts`, that is the network (next/font
    downloads fonts during the build). Retry; Vercel's builders are not affected.
- [ ] In the build output, these routes are static (`○` or `●`), not dynamic (`ƒ`): `/`,
      `/founders`, `/founders/[slug]`, `/stories`, `/stories/[slug]`. A content page turning `ƒ`
      means something started reading cookies, headers or `searchParams`, and every visit will
      wait for a server render (see DEC-026).
- [ ] First Load JS stays near today's numbers: about 164 kB for `/`, 192 kB for `/founders`,
      158 kB for a founder page. A jump of more than 20 kB needs a reason.
- [ ] `npm start`, then in a second terminal `npm run test:e2e`. Pass: `fail 0`. One `todo`
      (A12, a known Next 14 limitation) is expected.
- [ ] `npm audit --omit=dev` shows no high or critical issues in runtime packages, or each one is
      written down with a reason it does not apply.
- [ ] Check every changed page in light and dark, at 1440px and 390px (CLAUDE.md). No sideways
      scroll at 390px.

---

## 2. Environment variables

Set these in Vercel: Project, Settings, Environment Variables. Set each one for the right
environment; Preview and Production are separate.

| Variable | Production | Preview | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://udyammanch.com` (no trailing slash) | leave unset, or the preview address | Drives canonical tags, the sitemap, robots.txt and share cards. If it is wrong in Production, Google indexes the wrong host. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | the real ID | same | Unset means local content. |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | `production` or a staging dataset | |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-17` | same | Change only on purpose. |
| `SANITY_REVALIDATE_SECRET` | a long random string | a different one | Server only. Must not start with `NEXT_PUBLIC_`. Generate with `[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')`. |
| `NEXT_PUBLIC_NEWSLETTER_ACTION` | the list's form URL, or empty | empty | Empty means the honest "not open yet" message. |
| `NEXT_PUBLIC_FEATURE_FORM_URL` | the Google Form URL | same | Empty means `/get-featured`. |

- [ ] Every `NEXT_PUBLIC_` variable is safe to be public. They are baked into the JavaScript at
      build time, so anyone can read them.
- [ ] After changing any `NEXT_PUBLIC_` variable, **redeploy**. They are read at build time, so a
      running deployment keeps the old value.
- [ ] No secret is in the repository: `git grep -n "SECRET\|TOKEN" -- ':!*.md' ':!.env.example'`
      finds no real values.

---

## 3. Vercel project settings

- [ ] Framework preset Next.js, build command `npm run build`, install `npm install`, output
      `.next` (matches `vercel.json`).
- [ ] Node.js version 20.x (Settings, General). Next 14.2 needs 18.17 or newer. Also add
      `"engines": { "node": "20.x" }` to `package.json` so local and Vercel agree.
- [ ] Function region close to readers and Sanity: Mumbai (`bom1`) for an India audience
      (Settings, Functions, or `"regions": ["bom1"]` in `vercel.json`). Static pages are served from
      the CDN everywhere anyway; the region affects ISR regeneration, the revalidate webhook and
      the share image routes.
- [ ] Production branch is `main`. Pushes to other branches make Preview deployments only.
- [ ] Preview deployments are kept out of search: open any preview URL and check the response
      headers for `x-robots-tag: noindex`
      (`curl.exe -sI https://<preview>.vercel.app/ | Select-String x-robots`). If it is missing,
      turn on Deployment Protection for previews.

---

## 4. Domain, DNS and HTTPS

- [ ] Add both `udyammanch.com` and `www.udyammanch.com` in Vercel (Settings, Domains). Pick one
      as primary (the same host as `NEXT_PUBLIC_SITE_URL`) and set the other to redirect to it
      with a 308.
- [ ] DNS records exactly as Vercel shows them for each domain. Wait until Vercel shows "Valid
      configuration" for both.
- [ ] HTTPS certificate is issued for both hosts (Vercel does this automatically once DNS is right).
- [ ] `next.config.mjs` sends `Strict-Transport-Security: max-age=63072000; includeSubDomains`.
      That forces HTTPS on **every** subdomain for two years. Before launch, confirm no subdomain
      (mail, an old blog, anything) is served over plain HTTP. Do not add `preload` unless you mean it
      permanently.
- [ ] If the domain is also used for email, keep the existing MX, SPF, DKIM and DMARC records
      when changing DNS.

---

## 5. Sanity (when it is connected)

- [ ] Project ID and dataset set in Vercel (section 2) and the site redeployed.
- [ ] CORS origins (sanity.io/manage, API, CORS origins): add `https://udyammanch.com` and
      `http://localhost:3000`, both **with credentials allowed**. Without this, `/admin` loads a
      blank or login-looping Studio.
- [ ] Studio members: only the editorial team, with the least role that lets them publish.
- [ ] Webhook (API, Webhooks): URL `https://udyammanch.com/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`,
      method POST, trigger on create, update and delete, filter
      `_type in ["founderJourney", "founder", "story"]`, projection `{_type, slug}`. The route
      reads exactly `_type` and `slug.current`.
- [ ] Webhook test: publish a small change and check the page within a few seconds.
      Without the webhook, pages still refresh within 60 seconds (ISR), so a slow update means the
      webhook is broken, not the site.
- [ ] Seed content: the local files in `src/content/founders/` match the Sanity schema field for
      field; import them so the two do not drift.
- [ ] 15-minute editor test (AGENTS.md section 3): a non-technical editor drafts a story, uploads
      3 photos with alt text, checks the mobile and share preview, and publishes in under 15
      minutes without help. Pass when timed and done.

---

## 6. Search and sharing

- [ ] `https://udyammanch.com/robots.txt` allows `/`, disallows `/admin/` and `/api/`, and its
      `Sitemap:` line uses the production host.
- [ ] `https://udyammanch.com/sitemap.xml` lists `/`, `/founders`, `/stories` and every real founder
      page, on the production host only, and no sample pages.
- [ ] Every page has one canonical tag on the production host
      (`curl.exe -s https://udyammanch.com/founders | Select-String 'rel="canonical"'`).
- [ ] Google Search Console: add a Domain property (DNS TXT record), submit the sitemap, then use
      URL Inspection on the home page and one founder page. Pass: "URL is on Google" or
      "available to Google" with no errors. Do the same in Bing Webmaster Tools (it can import
      from Search Console).
- [ ] Share previews, tested on the live URL (previews are cached, so test before sharing widely):
  - [ ] LinkedIn Post Inspector (linkedin.com/post-inspector): title, description and the
        1200 x 630 image show for the home page and each founder.
  - [ ] Facebook Sharing Debugger (developers.facebook.com/tools/debug): same check. WhatsApp
        reads the same tags; send a founder link to yourself on WhatsApp and look at the card.
  - [ ] X: post a founder link from a test account, or check the card in the post composer.
- [ ] Every `og:image` returns 200, is 1200 x 630, under about 600 KB (WhatsApp drops bigger
      ones), and is JPEG or PNG, not WebP.
- [ ] JSON-LD is valid: paste a founder page URL into search.google.com/test/rich-results.
      Pass: no errors.

---

## 7. Performance (on the live site, mobile first)

Most readers arrive from WhatsApp on a phone, so test on mobile settings.

- [ ] PageSpeed Insights (pagespeed.web.dev), Mobile, for `/`, `/founders` and one founder page.
      Targets: LCP under 2.5 s, CLS under 0.1, INP under 200 ms, Performance score 85 or more.
      Write the numbers down in the release notes so the next release can be compared.
- [ ] No image over 400 KB on any reading page (test G2 checks this). Founder photos go through
      Cloudinary with `cld()` and a size for their slot; a raw upload URL in an `<img>` is a bug.
- [ ] Page curtain: click between Home, Founders, a founder and Stories. The curtain should never
      sit closed for longer than about half a second, and no new page should flash through it.
- [ ] Founders filters (chips, map, search) update instantly with no network request (DevTools,
      Network tab, filter `_rsc`: nothing new appears when you click a chip).
- [ ] Real phone check: open the site from a WhatsApp message on an Android phone on mobile data.
      Scroll a founder page, open My board, tap a map state, share a story.

---

## 8. Accessibility (WCAG 2.2 AA)

- [ ] Keyboard only: Tab through Home, Founders and a founder page. Every link and button gets a
      visible focus ring, in a sensible order. Skip nothing with the mouse.
- [ ] My board: opens with focus on Close, Tab stays inside, Escape closes it, focus returns to
      the My board button.
- [ ] Mobile menu opens and closes with the keyboard and with Escape.
- [ ] Every image has meaningful alt text, or `alt=""` if it is decoration (the build guard checks
      content images).
- [ ] Contrast: run axe DevTools or Lighthouse Accessibility on the three key pages, light and
      dark. Pass: no contrast or name errors.
- [ ] With "reduce motion" on in the OS, nothing slides, counts or wipes, and nothing is hidden
      waiting for an animation.
- [ ] Zoom the browser to 200%: no text is cut off and nothing needs sideways scrolling.

---

## 9. Security

- [ ] Response headers on the live site
      (`curl.exe -sI https://udyammanch.com/`): `strict-transport-security`, `x-content-type-options: nosniff`,
      `referrer-policy`, `x-frame-options: SAMEORIGIN`, `permissions-policy`, and **no**
      `x-powered-by`.
- [ ] `/api/revalidate` refuses a request without the secret:
      `curl.exe -s -X POST https://udyammanch.com/api/revalidate -d "{}"` returns 401.
      The secret travels in the query string, so it can appear in logs. Rotate it if it is ever
      pasted anywhere public.
- [ ] Draft and scheduled content returns 404 to visitors (AGENTS.md). Check one draft slug once
      Sanity is connected.
- [ ] `/preview/...` pages are `noindex, nofollow` and are not linked from anywhere public.
- [ ] `/admin` asks for a Sanity login and shows no content to a logged-out visitor.
- [ ] Not yet in place, decide whether launch needs it: a Content-Security-Policy header.
      Sanity Studio, Cloudinary, Unsplash and Google Fonts would all need allowing.

---

## 10. Monitoring

Nothing is installed yet. Before launch, decide on at least the first two.

- [ ] Uptime: a free monitor (UptimeRobot, Better Stack) pinging `/` and one founder page every
      5 minutes, alerting your phone.
- [ ] Errors: Vercel's Logs tab is the minimum. Look at it after each deploy. A client error
      tracker (Sentry has a free tier) catches errors on readers' phones that never reach the server.
- [ ] Traffic and speed: Vercel Web Analytics and Speed Insights (`@vercel/analytics`,
      `@vercel/speed-insights`) give real-user Core Web Vitals. Needs the privacy page first
      (section 0).

---

## 11. Deploy steps

1. Finish sections 1 and 2. Make sure `main` is green locally.
2. Push the release to a branch and open a PR. Vercel builds a Preview deployment.
3. On the preview URL: run the smoke test (section 12) with `$env:BASE_URL='https://<preview>.vercel.app'; npm run test:e2e`.
4. Merge to `main`. Vercel builds and promotes Production.
5. Watch the build log until it says "Ready". If the content guard fails, fix the content, do not
   skip the guard.
6. Run section 12 against production immediately.
7. Note in `.planning/STATE.md` what shipped, with the date.

---

## 12. Right after deploy: smoke test (10 minutes)

- [ ] `$env:BASE_URL='https://udyammanch.com'; npm run test:e2e` passes (`fail 0`). This alone covers
      routes, redirects, canonical tags, sitemap, share tags, sample labels and image sizes.
- [ ] By hand, each returns the expected status
      (`curl.exe -s -o NUL -w "%{http_code}" <url>`):

| URL | Expect |
| --- | --- |
| `/`, `/founders`, `/stories`, each `/founders/<slug>` | 200 |
| `/founders?state=mp`, `/founders?view=index` | 200 |
| `/founder/kishan-panchal-farming-solutions-india` | 308 to `/founders/...` |
| `/stories/kishan-for-kisan` | 308 to Kishan's founder page |
| `/founders/Rohit-Gour-Animation-Cult` | 301 to the lowercase address |
| `/definitely-not-a-page` | 404, with the helpful not-found page |
| `/robots.txt`, `/sitemap.xml` | 200, production host inside |
| `/icon.svg`, `/favicon.ico`, `/apple-icon` | 200 |
| `/opengraph-image`, `/founders/<slug>/opengraph-image` | 200, `image/png` |
| `http://udyammanch.com/` and `https://www.udyammanch.com/` | redirect to the primary `https://` host |

- [ ] In a browser, light and dark, on a phone and a laptop: home, Founders (tap a state, pick a
      chip, search), a founder page (share, copy link, pin to My board), Stories.
- [ ] My board survives a reload (pins are saved under `um_my_board_v1` in the browser).
- [ ] Vercel Logs show no new errors in the first 30 minutes.

---

## 13. First week after launch

- [ ] Day 1: Search Console shows the sitemap as "Success" and the pages as discovered.
- [ ] Day 1: share each founder page once on WhatsApp and LinkedIn and check the cards.
- [ ] Day 2 to 3: Search Console, Pages report. Fix anything under "Why pages aren't indexed"
      that should be indexed (sample pages being excluded is correct).
- [ ] Day 7: Core Web Vitals (Search Console, or Speed Insights) on mobile are "Good". If not,
      the slowest page comes first.
- [ ] Day 7: Vercel usage (bandwidth, function invocations, image transformations) is well inside
      the plan limits. Cloudinary usage is well inside its free credits.
- [ ] Publish one change through the full editor flow and confirm it appears within a minute.

---

## 14. Rolling back

- [ ] Before launch, know where it is: Vercel, Deployments, pick the last good Production
      deployment, then "Instant Rollback" (or "Promote to Production"). It takes seconds and needs
      no rebuild.
- [ ] Environment variable changes are not rolled back with a deployment. If a variable change
      caused the problem, set it back and redeploy.
- [ ] A rollback does not undo content published in Sanity. Fix content in Sanity.
- [ ] After a rollback, fix forward on a branch, and run this checklist again before merging.
