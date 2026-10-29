---
gsd_state_version: "1.0"
status: unknown
stopped_at: Phase 02 UI-SPEC approved (variants A, B, C)
last_updated: "2026-10-24T11:58:26.755Z"
state_head: 9a53a4f1ab1b3b797113df4fa9a11bc8cd590b14
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 5
  completed_plans: 0
  percent: 0
---

# Current Project State: Udyam Manch

**Last Updated**: 2026-10-23
**Framework**: GSD (Get Stuff Done)
**Active Phase**: Phase 2 — Reading Templates & Social Previews
**Overall Progress**: Phase 0 & Phase 1 Complete (Next.js 14 + Sanity Studio v3 + Hybrid Content Layer + CI/CD Operational)

---

## Phase Status Summary

| Phase | Description | Status | Blockers | Target Completion |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation & Infrastructure (Next.js 14, Sanity Studio at `/admin`, App Router, Exact Design System) | ✅ Complete | None | Passed verification |
| **Phase 2** | Reading Templates & Social Previews (Server-side OG 1200x630, WCAG 2.2 AA, Mobile ShareBar, Exact HTML Layout) | ✅ Complete | None | Passed verification |
| **Phase 3** | Listings & Discovery System (`/founders`, `/stories`, Category & Tag indexes) | ✅ Complete | None | Passed verification |
| **Phase 4** | Dynamic Home & Robust "My Board" (Slug-indexed, zero-login localStorage, Full-Bleed Pinboard Hero) | ✅ Complete | None | Passed verification |
| **Phase 5** | Launch Readiness & Operational Handover (CI/CD GitHub Actions, Vercel staging/prod) | 🔄 Ready to deploy | Connect Sanity Project ID | Launch Milestone |

---

## Active Focus & Immediate Workstream

1. **Stack & CMS Evaluation**:
   - Evaluating Option A (Next.js + Hosted CMS like Sanity) vs Option B (Next.js + Open-Source Self-hosted CMS like Payload CMS / Strapi).
   - Reviewing zero per-seat cost vs maintenance overhead.
2. **Data Model Formalization**:
   - Preparing schemas for FounderJourney, Story, Founder, Company, Category, Tag, and User.
3. **Environment & Agent Guardrails**:
   - Establishing agent constraints in `.agents/rules/` to ensure all subsequent development strictly adheres to PRD requirements.

---

## Key Decisions Log

| Decision ID | Date | Subject | Decision & Rationale |
| :--- | :--- | :--- | :--- |
| **DEC-001** | 2026-10-16 | Planning Framework | Adopted GSD (Get Stuff Done) with `.planning/` directory structure for disciplined requirement tracking and constraint awareness. |
| **DEC-002** | 2026-10-16 | URL & Routing | Strict ban on client-side hash links (`#/story/1`). All public content routes will use permanent semantic slugs (`/founders/[slug]`, `/stories/[slug]`). |
| **DEC-003** | 2026-10-16 | Social Previews | Mandatory server-side rendering for Open Graph tags and 1200x630 cards to guarantee 100% preview reliability on WhatsApp, LinkedIn, and X. |
| **DEC-004** | 2026-10-16 | Scope Boundary | No reader accounts or public submission endpoints in Version 1. Editorial operations restricted to internal authenticated roles. |
| **DEC-005** | 2026-10-16 | "My Board" Architecture | Migrated from fragile numeric array indexing to canonical slug-based indexing with silent unpinning for unpublished stories. |
| **DEC-006** | 2026-10-17 | Founder Story Layout Fidelity | Aligned `/founders/kishan-panchal-farming-solutions-india` pixel-for-pixel with `kishanStoryHtml()` prototype: Caveat script font via direct Google Fonts, exact copy, light mode default with data-theme restoration, and full sidebar components. |
| **DEC-007** | 2026-10-17 | Stories to Founder Story Direct Connection | Connected `/stories` first card directly to `/founders/kishan-panchal-farming-solutions-india`, and instituted automatic permanent 301/308 redirects from `/stories/the-field-is-the-real-business-school` and `/stories/8` directly to the verified founder story. |
| **DEC-008** | 2026-10-17 | Exact Brand Logo Restoration | Extracted and integrated the exact light and dark WebP brand logos from the initial HTML prototype into the navbar (`Header.tsx`, height: 44px) and footer (`Footer.tsx`, height: 64px), configured with CSS theme-aware visibility (`.lgl` / `.lgd`). |
| **DEC-009** | 2026-10-17 | Mobile Hamburger Navigation | Added a circular hamburger menu button (`.nav-toggle`) in the navbar for mobile and smaller screens (`<=900px`). Toggles an accessible frosted-glass dropdown menu containing Stories, Founders, Directory, My board (with badge count and drawer trigger), and Subscribe to Newsletter. Auto-closes on route change and Escape. |
| **DEC-010** | 2026-10-23 | Founder Journey Template | Replaced per-founder page files with one data-driven template at `/founders/[slug]`. Journeys are a hero, an ordered list of typed body blocks (section, quote, figure, steps, pillars, regions, note) and a sidebar. Fixes a live bug: the old template hard-coded Kishan's story, so Ayush and Sunita pages showed Kishan's content. [REQ-TMP-01, REQ-TMP-02, REQ-TMP-05] |
| **DEC-011** | 2026-10-23 | Content Repository Boundary | `lib/journey/repo.ts` is the only reader of journey content (Sanity when configured, local `src/content/founders/` otherwise). Home, `/founders`, sitemap and the template all derive from it; `SEED_FOUNDERS` removed. [REQ-PUB-14, REQ-NFR-05] |
| **DEC-012** | 2026-10-23 | Single Theme File and Story Tones | `tokens.css` is now the only place colour values live, imported before `editorial.css`. Prototype step colours promoted to `--tone-{gold,green,teal,indigo}-{line,soft,ink}` with dark values in both dark selectors. Fixes hero highlight not darkening for system-dark visitors. |
| **DEC-013** | 2026-10-23 | Copy Rules over Prototype Copy | Where the Kishan prototype used Title Case headings and em dashes, Design_System 4.4 wins: sentence case and no em dashes. Layout still follows the prototype. Enforced by a build-time content guard (`lib/journey/validate.ts`) and matching Sanity validation. |
| **DEC-014** | 2026-10-23 | Sanity `founderJourney` Type | Old `founder` schema replaced (no CMS data existed yet). Fields mirror `lib/journey/types.ts`; icon and tone dropdowns read the same constants as the code. Founder and Company stay embedded until Phase 3 makes them separate documents. |
| **DEC-015** | 2026-10-23 | Sample Content Handling | `sample: true` shows a Sample label, sets `noindex` and excludes the page from the sitemap. Sunita Meena and Arjun Somani were samples; both were removed on 28 Oct 2026. |
| **DEC-016** | 2026-10-24 | Footer Panel | Footer is a brand panel with one big rounded end (left on desktop, top arch at 900px and below), a big Udyam Manch wordmark and an inline newsletter field. Adds tokens `--foot-bg` and `--foot-ink` (defined in all three theme selectors) and `styles/footer.css` with prefix `ft`. Only links to pages that exist. The footer newsletter, like the home band, does not send the address anywhere yet. |
| **DEC-017** | 2026-10-24 | Page Curtain | Implements Design_System 8.4. `components/PageCurtain.tsx` holds internal link clicks with one capture-phase document listener, sweeps a curved two layer SVG band (round leading edge, hollowed trailing edge, curve scaled to screen height) in from the left (380ms), calls `router.push`, and sweeps it out to the right (480ms) when `usePathname` changes. Light theme is yellow over sky blue, dark theme is the reverse: blue (`--hl`) with a yellow (`#ffbc1f`) edge, via `--curtain-lead` and `--curtain-main` in `tokens.css`. Skipped for reduced motion, new tab and modified clicks, downloads, hash links, the same page, `/admin` and `/api`. A 4s failsafe lifts the curtain if a route stalls. Prefix `pc`, z-index 100. |
| **DEC-018** | 2026-10-24 | Founders Page | New `/founders` page (hero with India map, sector marquee, spotlight, wall/index/map views, insights, get featured band). Reads only through `getJourneys()` via `lib/journey/listing.ts`. Journeys opt in with an optional `listing { state, metric, placement, placementUntil }` field, also added to the Sanity schema. Filters live in the URL, so every state link works without JavaScript. Sponsored slots are always labelled, appear only in the Spotlight, rotate daily, need an end date, and never reorder the normal list. Adds token `--spot` and prefix `fd`. Replaces `FoundersDirectory` on this route (component kept, now unused). |
| **DEC-019** | 2026-10-24 | One Reading Feed | `getFeed()` in `lib/content.ts` merges founder journeys and editorial stories, newest first. `/stories`, home "Latest" and home "From the directory" read it, so a published journey appears everywhere without being copied by hand (Ayush was missing from Stories). Deleted the hand-copied Kishan story, which had invented details; its old URLs still 301 via `next.config.mjs`, so the slug check in `stories/[slug]` is removed. Real dates replace hard-coded ones. Production tests added in `tests/` (`npm run test:e2e`), findings in `docs/TEST_REPORT.md`. |
| **DEC-020** | 2026-10-24 | Production Hardening | Fixes from `docs/TEST_REPORT.md`. Board storage is validated on read and reconciled against live content (`lib/board.tsx`), with `error.tsx`, `global-error.tsx` and a helpful `not-found.tsx`. Share cards are generated 1200 x 630 PNGs (`lib/og.tsx`, `opengraph-image.tsx` routes) on the edge runtime, because Next 14's Node image generator fails on Windows builds. Newsletter forms no longer claim to subscribe unless `NEXT_PUBLIC_NEWSLETTER_ACTION` is set. Stories gain a `sample` flag. Added `/get-featured`, a lowercase redirect in `src/middleware.ts`, security headers and `SITE_URL` everywhere. Next patched to 14.2.35. Known gap: unknown founder or story addresses draw their 404 in the browser (Next 14 ISR), so JavaScript-off visitors see a blank page. |
| **DEC-021** | 2026-10-24 | Founder Story Reading Page | Redesigned from `.planning/phases/02-reading-templates/02-UI-SPEC.md`. Three compositions chosen by an optional `layout` field (`cover` default, `dossier`, `chapters`), all rendering the same content through shared parts (hero, facts row, blocks, end of story, share dock). Replaces the sticky sidebar from DEC-006. Reading page type: four size roles, weights 400 and 700, with a named 800 waiver for the h1, h2 headings and stat numbers (DEC-024, DEC-026 in the spec). Motion is CSS plus one small client component, reduced motion shows everything. Pending owner decisions: keep the 1px `--ink` focus hairline (DEC-025), approve 800 on stat numbers, verify founding years, and pick the layout to keep (then delete `/preview` and the unused layouts, and remove about 650 dead lines from `editorial.css`). Global `header` and `nav` element rules in `editorial.css` leak into new components, so new reading-page parts use `div` with a role instead. Audit: `02-UI-REVIEW.md` scored 16/24, its top fixes are applied. |
| **DEC-022** | 2026-10-26 | Live layout stays classic | The live `/founders/[slug]` page renders the original layout (`components/journey/legacy`, styles `legacy-journey.css`, class prefix `fl`). The redesigned layouts (`cover`, `dossier`, `chapters`, prefix `fj`) are reachable only at `/preview/{layout}/{slug}`, which returns 404 whenever the `VERCEL` variable is set. The `layout` field was removed from the Sanity schema so editors cannot pick a layout that does nothing. When a layout is chosen: make it the page, delete the legacy folder and the unused layouts, remove `/preview`, and drop the dead founder-story rules from `editorial.css`. Supersedes the default-layout part of DEC-021. |
| **DEC-023** | 2026-10-26 | Founders hero map | The India map is part of the hero, not a card: it sits on the page over the pinboard dot grid (`--dot`, faded at the edges), bleeds to the right edge on wide screens, and the stats are one flat row. State fills and outlines are mixed from `--ink`, `--acc` and `--bg`, so the country is visible in light and dark (empty states were the same colour as the dark page before). Pins (`--pin-pink`) replace the pulsing rings and are placed on land with `isPointInFill`. Hover and keyboard focus show the same name card. The headline is three fixed lines. Intro copy no longer says hover, which does not exist on touch. |
| **DEC-024** | 2026-10-28 | Magnetic dot grid | One reusable component, `components/MagneticDots.tsx`, draws the dot grid on a canvas wherever it is placed: the home hero (`.phero`) and the Founders hero map (`.fd-dots`, `size={1.6}`). It attaches to its parent element, takes `gap` and `size` props to match that element's CSS grid, and its styles live in `styles/magnetic-dots.css`. The parent must be positioned and form a stacking context. Within 200px of the cursor, dots spring towards it (at most 14px), grow slightly and fade to `--dot-active` (`--indigo` in light, `--acc2` in dark), then settle back. The CSS dot grid stays as the fallback and is switched off (inline `background-image: none`) only once the canvas runs, so touch screens, reduced motion and no-JS visitors get the same static grid as before. The animation loop stops when everything is at rest, so an idle page does no work. Colours are read from tokens and re-read on theme change. Performance: the grid is painted once, then each frame repaints only the clipped rectangle around moving dots and simulates only dots near the cursor (typed arrays), so cost depends on the field size, not the page size (about 1 ms per frame at 2x DPR). The canvas backing store is capped at 8 million pixels. The cursor is kept in viewport coordinates and mapped through a host rect measured every running frame, so the field follows a still cursor while the page scrolls. On frames where the page moved, dots jump straight to their target instead of springing, because springs trail behind on fast trackpad scrolls; springs still drive hand movement. The cursor position is also taken from wheel and pointerover events, so a cursor that has not moved since page load is still found by scrolling alone. Motion is frame rate independent, and the field eases after the cursor and fades out in place when it leaves. That easing runs in viewport coordinates, so it smooths hand movement but never lags behind scrolling. Serves REQ-PUB-15 (hero to pinboard transition). |
| **DEC-025** | 2026-10-28 | Cloudinary is the image CDN | Founder photos and artwork live on Cloudinary (cloud `nkhny4aq`). Content stores the plain upload URL; `lib/cloudinary.ts` adds `f_auto,q_auto` and a resize per slot (hero `srcSet` 480 to 1260px, founder cards 720px, related thumbnails 240px), and passes other URLs through unchanged. Share images are a 1200 x 630 `c_fill,g_face` crop delivered as JPEG for LinkedIn. New optional field `hero.portrait` (`cutout` default, or `photo`) frames rectangular photos and moves the handwritten name onto the page above them, so it reads in both themes; added to the type, Sanity schema, GROQ projection and `editorial.css`. Karthik R is the first `photo` hero. Still local: Ayush Shaw images and unused PNGs in `public/assets/`. Documented in README, "Images". |
| **DEC-026** | 2026-10-29 | /founders is static, filters run in the browser | Reading `searchParams` on the server made /founders dynamic: every visit and every filter click waited for a server render, and the page could not be prefetched. The page now renders the full list statically (ISR 60s); `components/founders/FounderBrowser.tsx` reads the query string with `useSearchParams` and filters on the client, changing the URL with `history.pushState` (no server trip). Pure filter code lives in `lib/journey/founder-filters.ts` so the browser bundle never pulls in repo.ts. Trade-off: without JavaScript a filtered URL shows the full list; canonical is /founders either way. Do not read searchParams in app/founders/page.tsx. |
| **DEC-027** | 2026-10-29 | Page curtain navigates in parallel | The curtain used to call router.push() only after it had fully closed, so download and render time was added on top of the 380ms wipe (up to 1.1s closed). Now: prefetch on hover, touch and focus; router.push() at the click; the curtain opens as soon as it is closed AND the route has changed. If the page commits first it is hidden for those frames (`html[data-curtain-wait]`); CSS animations are paused while covered (`html[data-curtain]`) so entrances play in view. Exit uses an ease-out curve. Measured on a production build: 184 to 451ms closed, down from 384 to 1129ms. |
| **DEC-028** | 2026-10-29 | Static build for Hostinger public_html | All five Node.js app slots on the Hostinger Business plan are in use, so the site ships as static files for now. `scripts/build-static.mjs` (`npm run build:static`) copies the project to a temp folder, removes the server-only parts there (`/api/revalidate`, middleware, `/admin`, `/preview`), sets `output: export`, swaps the generated share images for PNG files rendered by a normal build (Next 14 Node image generator is broken on Windows), and writes an `.htaccess` for clean addresses, the old-site redirects, HTTPS and headers. The real source is never edited, so Vercel or a Node.js app still work unchanged. Costs: no ISR or webhook (rebuild to publish), no Studio, no lowercase redirects. Move to a Node.js app once Sanity is connected. |

---

## Open Questions for Team (from PRD Section 13)

1. **Dashboard Seats**: Who will be in the dashboard, and how many people initially (2 to 5 expected)?
2. **Hosted vs Self-Hosted CMS**: Do you prefer a hosted CMS with a monthly subscription (e.g. Sanity) or a self-hosted CMS with zero per-seat cost (e.g. Payload CMS on Node)?
3. **Social Priority**: Beyond WhatsApp, LinkedIn, and X, are Instagram direct share cards or Telegram previews prioritized?
4. **Publishing Cadence**: How many stories and founder journeys are expected to be published per month in year one?
5. **Localization**: Is Hindi translation required in the roadmap for V1.1 or later?
6. **Seed Content**: Is there an initial curated batch of real stories and high-resolution founder photos ready for the proof-of-concept?
7. **Editorial Checklist**: Who holds ownership of fact-verification, founder consent records, and image rights licensing?

---

## Next Steps

1. Select CMS option (Hosted vs Self-Hosted) based on team preference.
2. Scaffold foundational repository structure with Next.js App Router and CMS connectors.
3. Define TypeScript schemas for `FounderJourney`, `Story`, `Founder`, `Company`, `Category`, and `Tag`.
4. Implement initial auth and media upload pipeline.

---

## Status Corrections (2026-10-23)

- Phases 2 to 4 were marked complete, but several exit criteria are not met yet: the 301 redirect engine for changed slugs (REQ-SEO-02), `/directory` and company pages (REQ-PUB-11, 12), the walkthrough tour and Instagram window from the prototype, and the My board storage key (`um_my_board_v1` in code, `um-board-v1` in Design_System 7).
- Founder journeys now meet REQ-TMP-01 to 05, 07, 09 to 12 and REQ-SEO-03, 04, 06, 07, 09. See `docs/FOUNDER_JOURNEYS.md`.

## Session

**Last session:** 2026-10-24T11:58:26.690Z
**Stopped at:** Phase 02 UI-SPEC approved (variants A, B, C)
**Resume file:** .planning/phases/02-reading-templates/02-UI-SPEC.md
