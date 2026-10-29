# Udyam Manch

Editorial publication and startup directory about Indian founders. Next.js 14
(App Router) + Sanity Studio v3 at `/admin`. Sole developer: Rohan.

Read these before changing anything:

@AGENTS.md
@docs/FOUNDER_JOURNEYS.md

Reference docs (open when relevant): `PRD.md` (product scope), `Design_System.md`
(tokens, type, components, checklist in section 13), `.planning/STATE.md`
(phase status and decision log), `.planning/REQUIREMENTS.md` (REQ IDs).
Visual source of truth: the prototype `index.html`.

## Commands

- `npm run dev` then http://localhost:3000 (Studio at /admin)
- `npx tsc --noEmit` typecheck
- `npm run build` production build. Also runs the content guard, which fails on
  missing alt text, duplicate block keys, headlines over 90 chars, em dashes.
- If you see errors about `founders/ayush-shaw-shaw-agrivolt-gas`, delete `.next`.

## Architecture rules

- Founder pages: one template, `src/app/founders/[slug]/page.tsx`. Content is
  data in `src/content/founders/*.ts` (or Sanity `founderJourney`). Never add
  `if (slug === ...)`; add a field or a block type instead.
- New block type = 4 places in one change: `lib/journey/types.ts`,
  `components/journey/blocks.tsx`, `sanity/schemas/founderJourney.ts`,
  `styles/journey.css`.
- Pages read content only through `src/lib/journey/repo.ts`.
- Colours only via tokens in `src/styles/tokens.css`. Every token is defined
  for light, system dark, and `[data-theme="dark"]`. No hex in components.
- Class prefixes: `pb` pinboard, `mb` My board, `ig` Instagram, `t` tour,
  `fj` founder journey.
- Metadata, Open Graph and JSON-LD are server rendered (`generateMetadata`).
- Placeholder content sets `sample: true` (label, noindex, not in sitemap).

## Design and copy rules

- Follow the prototype layout and Design_System.md exactly. In dark mode the
  headline highlight is blue (`--mark` uses `--hl`, same as the home page).
- Never use em dashes in copy, comments shown to users, or content.
- Sentence case headings. Natural, conversational voice. No hyphen-heavy or
  templated phrasing. Label placeholders "Sample". Be honest about gaps.
- Check every UI change in light and dark, at 1440px and 390px.

## Working style

- Rohan is learning while building: explain the reasoning behind decisions
  briefly, like a senior engineer would.
- Record architecture decisions as DEC entries in `.planning/STATE.md`.
- Commit only when asked.

## Open items (as of 23 Oct 2026)

- The Next.js app is not committed to git yet. Commit it first.
- Not built: slug 301 redirect engine (REQ-SEO-02), `/directory` and company
  pages (Phase 3, where Founder and Company become separate Sanity documents),
  walkthrough tour and Instagram window from the prototype.
- My board storage key is `um_my_board_v1` in code but `um-board-v1` in the
  design system. Changing it needs a migration so visitors keep their pins.
- `editorial.css` still has ~50 hard-coded hex values in older components.
- Verify founding years (Kishan 2006, Ayush 2023). Ayush hero image is only
  666px wide and still served from `public/assets/`; the 1672px original is in
  `../UdyamManch-cleanup-2026-10-29/`, ready to upload to Cloudinary.
- Sanity project ID not connected yet (Phase 5 blocker).
