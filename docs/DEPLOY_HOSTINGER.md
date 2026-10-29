# Deploying on Hostinger

Two ways, depending on whether a Node.js web app slot is free on the plan. Use either together
with `DEPLOY_CHECKLIST.md`. Items there that are Vercel-only (preview deployments, Instant
Rollback, function regions) do not apply on Hostinger; the rest does.

hPanel labels change from time to time. If a name below does not match exactly, look for the
closest one.

## Domains (checked 29 Oct 2026)

- `udyammanch.com` is the site: its DNS points at Hostinger. Builds must use
  `NEXT_PUBLIC_SITE_URL=https://udyammanch.com` (the code default), or every share link,
  canonical tag and sitemap entry points somewhere else.
- `udyammanch.in` is at GoDaddy (nameservers `ns69/ns70.domaincontrol.com`) with domain
  forwarding to `udyammanch.com`. GoDaddy forwards **only the home page**: any deeper `.in`
  address is a plain "Not Found". To make every `.in` link work:
  - [ ] hPanel: add `udyammanch.in` to this website as a parked or alias domain (it then serves
        the same `public_html`).
  - [ ] GoDaddy: turn off forwarding for `udyammanch.in`, then point it at Hostinger, either by
        changing its nameservers to the two hPanel shows (`ns1/ns2.dns-parking.com`) or by setting
        the A records hPanel gives.
  - [ ] Wait for DNS to update (minutes to a few hours), then check that
        `https://udyammanch.in/founders/rohit-gour-animation-cult` redirects (301) to the same
        page on `.com`. The `.htaccess` already has that rule, and the same one for `www.`.
- WhatsApp caches a preview per link. A link that failed once may keep showing no preview for a
  while; test with a fresh link (for example add `?v=2` to the end).

---

# A. Static files in public_html (now: all Node.js app slots are in use)

`npm run build:static` turns the site into plain HTML, CSS and JavaScript files that any PHP/HTML
hosting can serve, plus an `.htaccess` that does the server's job: clean addresses, the old-site
redirects, HTTPS and security headers. How it works is explained at the top of
`scripts/build-static.mjs`.

**What the static site does not have**, compared with a Node.js app or Vercel:

- Content changes need a rebuild and re-upload. There is no once-a-minute refresh and no Sanity
  webhook. Today content lives in `src/content/founders/`, so every change needs a deploy anyway.
- No Sanity Studio at `/admin` (it is not connected yet, so nothing is lost today).
- Capitalised addresses are not lowercased (`/founders/Rohit-...` is a 404, not a redirect).
- Every founder needs its own share image (`seo.image`); the build stops if one is missing.

When Sanity is connected, move to a Node.js app (part B): that is when these start to matter.

## A1. Build

- [ ] Set the public address first, in PowerShell: `$env:NEXT_PUBLIC_SITE_URL='https://udyammanch.com'`
      (also `NEXT_PUBLIC_FEATURE_FORM_URL` and `NEXT_PUBLIC_NEWSLETTER_ACTION` if you have them).
      They are baked into the files.
- [ ] `npm run build:static`. It builds the normal site once (to render the share images), then
      the static one, and writes `..\udyammanch-static-YYYY-MM-DD.zip` next to the project folder.
      If a normal build is already running on port 3000, `$env:OG_SOURCE='http://localhost:3000'`
      skips that first build.

## A2. Upload

- [ ] Back up the old site (hPanel, the website, Files, Backups; and File Manager, `public_html`,
      Compress, download). Keep it until the new site has run for a week.
- [ ] File Manager, `public_html`: move the old files into a folder named `old-site` (or delete them
      after the backup). Nothing from the old site should stay next to the new files.
- [ ] Upload the zip into `public_html` and Extract it there. `index.html`, `.htaccess`, `_next/` and
      `founders/` must sit directly in `public_html`, not in a subfolder.
- [ ] `.htaccess` starts with a dot, so File Manager may hide it. Turn on "show hidden files" and
      check it is there.
- [ ] SSL: hPanel, Security, SSL. A certificate must be active for the domain and `www`.

## A3. Check on the live site

- [ ] `/`, `/founders`, `/founders/rohit-gour-animation-cult`, `/stories` open, with styles.
- [ ] Clean addresses work without `.html`, and an unknown address shows the not-found page.
- [ ] `/index.html` and `/founders/kishan-panchal-farming-solutions-india/index.html` redirect to the
      new pages (these are links people shared from the old site).
- [ ] `http://` redirects to `https://`.
- [ ] Response headers include `strict-transport-security` and `x-frame-options`
      (`curl.exe -sI https://udyammanch.com/`). If they are missing, LiteSpeed is ignoring the
      `mod_headers` block; tell me and we adjust the `.htaccess`.
- [ ] Click between pages: the curtain plays and pages change without a full reload. Founders
      filters, the map and search work. My board pins survive a reload.
- [ ] `$env:BASE_URL='https://udyammanch.com'; npm run test:e2e`. Expect a few failures that are
      about features the static site does not have (lowercase redirects, `/api/revalidate`,
      `/admin`); everything else should pass.

To update: rebuild, delete the old files in `public_html` (keep `old-site`), upload and extract the
new zip. Keep each zip: re-uploading the previous one is the rollback.

---

# B. Node.js web app (when a slot is free, and once Sanity is connected)

## B1. Check the plan supports Node.js

- [ ] hPanel, your hosting plan. Node.js web apps are on **Business** web hosting and **Cloud**
      plans. Single and Premium only run PHP and HTML: upgrade, or use a VPS instead.

## B2. Back up the old site

- [ ] hPanel, the old website, Files, Backups: download a full backup. Also File Manager, select
      `public_html`, Compress, download the zip. Keep both until the new site has run for a week.

## B3. Build the upload zip

From the project folder, in PowerShell:

```powershell
npm run build   # must pass first: it also runs the content guard
tar.exe -a -c -f ..\udyammanch-hostinger.zip package.json package-lock.json next.config.mjs next-env.d.ts tsconfig.json sanity.config.ts .env.example src public
```

Use `tar.exe`, not `Compress-Archive`: Windows PowerShell 5.1 writes backslashes into zip paths,
which unpack as broken file names on Hostinger's Linux servers. Never put `.env`, `node_modules`
or `.next` in the zip; Hostinger installs and builds itself.

## B4. Create the Node.js app

- [ ] hPanel, Websites, Add website, **Node.js app**. Upload the zip (or connect the GitHub repo,
      which makes later updates a push instead of a new zip).
- [ ] Settings: framework **Next.js**, Node.js **20** (18.17 or newer works), install command
      `npm install`, build command `npm run build`, start command `npm start`, output `.next`.
- [ ] Environment variables **before the first build** (`NEXT_PUBLIC_` values are baked in at build
      time; changing one later needs a rebuild):
  - `NEXT_PUBLIC_SITE_URL` = the live address, for example `https://udyammanch.com`, no trailing slash
  - `NEXT_PUBLIC_FEATURE_FORM_URL`, `NEXT_PUBLIC_NEWSLETTER_ACTION` if you have them
  - Sanity variables only once Sanity is connected (see `.env.example`)
- [ ] If Hostinger offers a temporary address for the new app, deploy there first and test it
      (section 6) while the old site keeps serving your domain.
- [ ] If the build stops with `JavaScript heap out of memory`, the plan's build memory is too small
      (the Sanity Studio at `/admin` is the heavy part). Ask Hostinger support, or move up a plan.

## B5. Move the domain from the old site to the new app

A domain can only belong to one website in hPanel.

- [ ] With the backup done, remove the domain from the old PHP website (delete that website, or
      change its domain), then connect the domain to the Node.js app.
- [ ] If the domain's DNS is managed at Hostinger it updates by itself. If it is managed somewhere
      else, set the records hPanel shows for the new app.
- [ ] SSL: hPanel, Security, SSL. Make sure a certificate is active for the domain and `www`, and
      that HTTPS is forced. Pages are down for a few minutes during the switch; do it at a quiet hour.

## B6. Test right after the switch

- [ ] `$env:BASE_URL='https://udyammanch.com'; npm run test:e2e` passes (`fail 0`, one known `todo`).
- [ ] Old links from the static site still work: `/index.html` and
      `/founders/kishan-panchal-farming-solutions-india/index.html` redirect (308) to the new pages.
- [ ] The rest of section 12 of `DEPLOY_CHECKLIST.md` (status codes, headers, real phone check).

## B7. Updating the Node.js app later

- With GitHub connected: push to the connected branch and Hostinger rebuilds.
- With zip uploads: build a new zip (section 3), upload it, redeploy. **Keep the previous zip**:
  re-uploading it is the rollback.
- Content refresh works the same as on Vercel: pages regenerate at most once a minute, and the
  Sanity webhook (`/api/revalidate`) refreshes them at once, because `npm start` runs a normal
  Next.js server.
