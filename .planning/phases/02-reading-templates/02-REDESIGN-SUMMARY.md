# Phase 02 redesign summary: founder story reading page

Date: 2026-10-24. Built directly from `02-UI-SPEC.md` (verified by the checker, with flags), outside the normal plan and execute flow. This file is the record of what was built, for the UI audit.

## What was built

Three switchable layouts for `/founders/[slug]`, chosen by an optional `layout` field on the journey (`cover` default, `dossier`, `chapters`). Same content in all three. No slug checks in the template.

- **A, Cover story (default):** full-width title, stage panel with dek, byline, actions and portrait, "At a glance" facts row, one centred 680px column with 840 and 1100 breakout tiers, drop cap, pull quotes, and an end-of-story wrap (company panel, stats, features, quote, share, topics, Keep reading).
- **B, Dossier:** text-led hero, two columns, a sticky profile rail (company, facts, chapter list with scroll marker, share), details band after the story.
- **C, Chapters:** full-bleed hero band, numbered chapters with sticky margin labels, a docked story bar on desktop.
- **Shared:** progress bar, once-only scroll reveals, per-word title motion, stage wipe, share dock (pill on desktop, bottom bar on phones), toast with `role="status"`, native share, campaign tags (`share_top`, `share_dock`, `share_end`, `share_rail`, `share_bar`).

Preview route for comparing layouts: `/preview/{cover|dossier|chapters}/{slug}` (noindex, not in sitemap, to delete after a layout is chosen).

## Files

New: `components/journey/{SplitTitle,FactsStrip,JourneyEnd,JourneyFx,ShareControls,ShareDock,ChapterNav,StoryBar,share-glyphs}.tsx`, `components/journey/layouts/index.tsx`, `lib/journey/{facts,chapters,toast}.ts`, `app/preview/[variant]/[slug]/page.tsx`.
Rewritten: `JourneyHero.tsx`, `blocks.tsx`, `inline.tsx` (Devanagari `lang="hi"`), `PinButton.tsx` (constant label, check icon), `styles/journey.css`.
Changed: `lib/journey/types.ts` (`LAYOUTS`, `layout`, image width and height), `lib/journey/repo.ts`, `lib/share.ts` (`native`), `sanity/schemas/founderJourney.ts` (layout field), `app/founders/[slug]/page.tsx`.
Removed: `JourneySidebar.tsx`, `ShareSquareBtn.tsx`, old `ShareIcons.tsx`.
Not removed yet: about 650 lines of dead founder-story rules in `styles/editorial.css`.

## Deviations from the UI-SPEC

1. Built all three variants, which the spec's risk R9 advised against, so the owner can choose by looking.
2. The 1px `--ink` focus hairline (DEC-025) is applied on the reading page but is not approved by the owner yet.
3. Stat numbers use weight 800 under waiver W1. The checker flagged that Design_System 2.3 does not name stats, so owner approval is still needed.
4. Variant C steps use the standard card row, not the timeline with a connecting line described in the spec.
5. Variant B chapter list has no collapsible `details` on phones.
6. Hero is a `div`, and the chapter list a `div role="navigation"`, because global `header` and `nav` rules in `editorial.css` leaked into them (a real bug, found and fixed).

## Verification done

- `npx tsc --noEmit` passes. `npm run build` passes.
- `npm run test:e2e`: 84 tests, 83 pass, 0 fail, 1 known to-do. New tests Q1 to Q3 cover pinned hero, 390px overflow and the phone chapter list.
- Screenshots checked: desktop for all three layouts (light), Cover in dark, Dossier and Chapters at 390px, Kishan on Cover.

## Not verified

- Lighthouse and LCP, real phone, other browsers.
- Dark mode for Dossier and Chapters, and Kishan on Dossier and Chapters.
- Motion in a recorded real browser session (reveals, stage wipe, dock slide).
- Contrast pairs recomputed after implementation (checklist item 10).
- Screen reader pass.
