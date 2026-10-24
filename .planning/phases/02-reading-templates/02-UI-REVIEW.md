# Phase 02 — UI Review

**Audited:** 2026-10-24
**Baseline:** 02-UI-SPEC.md (variant A contract, B and C deltas), Design_System.md, CLAUDE.md
**Screenshots:** captured. Headless Chrome via CDP helper, 24 captures (Ayush and Kishan x cover/dossier/chapters x 1440 and 390 x light and dark) plus 1440x768 sticky checks. Stored in `.planning/ui-reviews/02-audit/` (git-ignored).
**Interaction captures:** off (workflow.ui_interaction_capture is false). Keyboard focus and reduced motion were checked through computed styles and CDP key events, not the chrome-devtools driver.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Contract strings match, no em dashes; Kishan title forces an ugly "soil" orphan on phones; "Founded" fact is unverified content |
| 2. Visuals | 2/4 | Chapters sticky label hidden under story bar; Kishan stage quote card clipped at 390; Dossier portrait is a large empty slab |
| 3. Color | 3/4 | Tokens only, no hex in components, dark mode correct on all three; 1px ink focus hairline still unapproved |
| 4. Typography | 3/4 | Roles and weights match the contract; 13px text exists on page; dossier company summary clamped mid sentence |
| 5. Spacing | 3/4 | No overflow at 390 or 1440, 4px multiples held; several links under the 40px target |
| 6. Experience Design | 2/4 | Reduced motion and focus ring work; duplicate share (rail plus dock) in Dossier; sticky collision in Chapters; no collapsible chapter list on phones |

**Overall: 16/24**

---

## Top 3 Priority Fixes

1. **Chapters sticky label is covered by the story bar (BLOCKER for layout C)** — At 1440x768 the `.fj-chlabel` sticks at top 88px (`--fj-sticky`, journey.css:493) but `.fj-bar` occupies 68 to 124px (journey.css:468-486, z-index 6). Measured: bar 68-124, label 88-142, so the "01" is hidden and only "/ 03" shows (see `sticky-chapters-ayush-1440x768.png`). Fix: when `.fj-bar.is-on`, offset the label to `calc(var(--fj-hdr) + 56px + 20px)` (use a `--fj-sticky-c` variable for the chapters layout), and add the same to `scroll-padding-top`.
2. **Kishan stage art clips at 390 in Chapters (and the hero image text collides)** — In `kisha-chapters-390-dark.png` the stage quote card is cut off at the right edge ("Farr / don't / need prod") and the script caption "Farming Solutions India" runs through the portrait. Cause: in Chapters on phones `.fj-stage-art` gets `overflow: hidden` and a fixed art box while `.fj-sq` is `position: static` with `margin` inside an art flex row (journey.css:508, 538). Fix: put the quote card below the art in flow for all layouts at 900px and below, and hide `.fj-script` overlap by capping its width. Re-check Cover and Dossier at 390 the same way.
3. **Dossier doubles up share and leaves a dead portrait slab** — The Dossier rail already has a share row (layouts/index.tsx:79) and the ShareDock pill also appears (measured dock at 694-744 at 1440x768), so two share groups are on screen together, which the spec forbids for B ("sticky rail" is the share). Separately, `.fj-stage-art` uses `align-self: stretch` (journey.css:418), so the Ayush portrait is a 635px tall empty indigo rectangle with the image pinned bottom right (`ayush-dossier-1440-dark.png`). Fix: pass `dock={false}` to Chrome for Dossier, and set the art to `align-self: start` with the real aspect ratio instead of stretch.

Further fixes, not in the top 3: raise sub-40px targets (see Pillar 5), stop clamping the company summary mid sentence in the rail, add the phone collapsible chapter list, make the title `\n` in Kishan not orphan "soil" at 390, tame the 13px text, remove the dead 650 lines in `editorial.css`.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)
- Interface copy matches the contract: toast `Link copied.` and failure text (ShareControls.tsx:11, 14, 83-87), aria-labels `Share on WhatsApp`, `Share on LinkedIn`, `Copy link to this story`, `At a glance (sample details)` for samples (FactsStrip.tsx:12), constant `Pin to My board` label.
- Grep for em dashes in `src/components/journey`, `journey.css`, `facts.ts`, `chapters.ts`: none. Sentence case headings throughout.
- WARNING: Kishan hero title contains a forced `\n`. At 390 it renders "From Rajasthan's / soil / to farms across India." with a one word line (`kisha-chapters-390-dark.png`, `kisha-cover-390-*`). The break is content, but on phones it reads as a bug. Soften by dropping `\n` below 560px (render as a space) or editing the title.
- WARNING: Dossier rail company summary is `-webkit-line-clamp: 2` (journey.css:439), so Kishan reads "protected farming, irrigation, solar and..." and cuts the sentence, with no way to see the rest on desktop. Let it wrap to 3 lines or show a full sentence.
- NOTE: CLAUDE.md flags founding years (Kishan 2006, Ayush 2023) as unverified, yet "Founded 2006" now appears in the Dossier rail and facts row at high prominence. Content risk, not a code defect.
- Not checked: the Empty-state copy (`This is the only story here for now`) was not rendered, because both slugs have related stories.

### Pillar 2: Visuals (2/4)
- BLOCKER (layout C only): story bar hides the sticky chapter number, see Fix 1. The bar and header together take 124px of a 768px viewport, as the spec predicted in its C cons.
- BLOCKER (phones, C and probably A/B with Kishan): quote card and script caption clipped or colliding on the stage art, see Fix 2.
- WARNING: Dossier portrait slab (journey.css:418) leaves about 400px of empty `--soft`/line gradient above the Ayush portrait at 1440. It looks like a missing image. Chapters has the opposite problem for Ayush: the portrait is a small cut-out floating far right in the hero band with a large empty right half (`ayush-chapters-1440-dark.png`), and the 8/4 column split pushes the 76px title to wrap to 4 lines.
- WARNING: Variant C deviation 4 stands: steps are the standard card row, not the timeline with a connecting line the spec describes for C. The 16px stub connector (journey.css:271) is nearly invisible against `--line`.
- OK: Cover hierarchy is clear (kicker, 76px title, stage panel, facts strip). Asymmetric radii vary down the page as specified, no shadows, no hover zoom. Highlight mark is yellow in light and blue in dark, as required (`kisha-chapters-390-dark.png`).
- OK: Icon only buttons all carry aria-labels (ShareControls.tsx:51-58, 79).

### Pillar 3: Color (3/4)
- Grep for `#hex` and `rgb(` in `src/components/journey/` and `journey.css`: zero hits. Every colour is a token.
- Dark mode verified for all three layouts, both stories: backgrounds resolve to `rgb(14,13,31)`, mute text `rgb(160,159,192)`, accent `rgb(156,155,242)`. This closes the "dark Dossier and Chapters unverified" gap. No surfaces looked broken.
- Computed colours match the spec contrast table (mute on bg 5.80 light, 7.50 dark; acc on soft 5.43/6.53). I did not independently recompute every pair, so the full item 10 checklist is only partly verified.
- WARNING: The focus ring (3px `--acc2`) gets a 1px `--ink` hairline (journey.css:39-46). Measured computed value on Tab: `outline 3px rgb(79,184,238)` plus `box-shadow 0 0 0 1px rgb(19,18,43)`. This does fix the 2.01:1 light-mode ring, but DEC-025 is still unapproved by the owner.
- WARNING: `--acc2` (`#4fb8ee`) is also the progress bar fill on a light page at 3px high, 2.01:1 against `--bg`. It is decorative, so acceptable, but weak.
- Accent use is within the declared list (kicker, drop cap, avatar, chapter markers, next-story kicker). The `--acc` 10% rule holds.

### Pillar 4: Typography (3/4)
- Weight distribution in `journey.css`: 36 uses of 700, 13 of 400, 4 of 800 (title, h2, company name, stats), consistent with waiver W1. No 500 or 600 weights.
- Size roles all resolve through `--fj-display`, `--fj-h`, `--fj-body`, `--fj-label`. Only literal `px` sizes are the exempt decorative script tiers (509-510, 580-581).
- WARNING: Measured text under 14px on the page at every viewport: two leaf elements at 13px (no class, so likely the breadcrumb separators or an inherited editorial.css rule). The spec says nothing below 14px. Could not trace which element without a DOM dump; verify in devtools.
- WARNING: Dossier rail company name is forced down to the Body role at 700 (journey.css:438) while the stage `h2` "About {company}" in Cover/Chapters is 800. Acceptable under W1 only if the rail name is not an `h2`; check the markup.
- WARNING: The `.fj-sec h2` drop cap uses `font: 700 var(--fj-display)`, fine, but in Chapters the first chapter only gets a drop cap through an override pair at journey.css:499-500; fragile.
- OK: Body 20.5px / 19px at 900px and below, line height 1.75, measure 680px.

### Pillar 5: Spacing (3/4)
- No horizontal scroll in any of the 24 captures (`scrollWidth` equals `clientWidth` at 390; at 1440 both are 1425 because of the scrollbar).
- Values are 4px multiples throughout the CSS; exceptions (12px chip padding, 40px mobile rhythm) are the documented ones.
- WARNING: Interactive targets under 40px high were measured on every page: Chapter nav links 35px high (journey.css:446, `padding: 8px 0` plus 14px text, 290x35 in the Dossier rail, 358x35 on phones), the breadcrumb links 14x32 and 59x30, the inline link `.fj-link` 153x17, and the Kishan website fact link 215x25. WCAG 2.2 AA minimum is 24px so this passes the standard, but the Design_System 40px rule is missed. Give `.fj-chapters a` and `.fj-link` `min-height: 40px`.
- WARNING: Sticky overlap at 1440x768: the Dossier rail measured top 88, bottom 679 (Ayush) and 88 to 695 (Kishan), 591 and 607px tall, so both fit, but they sit within 25 to 10px of the viewport bottom and the dock pill (694 to 744) is directly below. On a 1366x768 laptop with browser chrome the rail would scroll internally (`max-height: calc(100vh - 108px)`). Kishan's rail is over the 560px target.
- WARNING: On phones the Dossier layout puts the rail first (`order: -1`, journey.css:541), pushing the story start down. Total page height at 390: 8105px vs 6229px at 1440, so phones scroll about 30 percent more than desktop for the same content. Kishan Chapters at 390 is 7987px.

### Pillar 6: Experience Design (2/4)
- OK: Reduced motion verified with CDP emulation. `.fj-w` animation `none`, `.fj-stage-cover` display `none`, `.fj-rv-pre` count 0, dek opacity 1. Nothing hidden or moving.
- OK: Keyboard focus is visible on the first eight Tab stops in all variants (3px blue outline plus hairline), and hidden dock and bar use `visibility: hidden`, so they stay out of the tab order.
- OK: Chapter links use `aria-current`, decorative numerals are `aria-hidden` (ChapterNav.tsx:39-40). Toast is `role="status"` per the contract (not re-tested with a screen reader).
- BLOCKER (layout C): sticky label collision, see Fix 1.
- WARNING: Dossier shows two share groups at once (rail and dock), see Fix 3. This is both a clutter and a duplicated tab stop set.
- WARNING: Deviation 5 stands. No collapsible `details` for the chapter list in Dossier on phones, so a 4 chapter Kishan list adds about 180px of scroll before the story.
- WARNING: Dossier sticky rail relies on JS scroll spy for `aria-current`; with JS off the list degrades to plain anchors, which is fine, but was not tested.
- Not verified: dock slide and stage wipe in a recorded session, native share on a real phone, Lighthouse and LCP, screen reader pass, other browsers, and the Devanagari fallback font on a phone.

---

## Spec deviation check

| Item | Status |
|------|--------|
| Dark mode Dossier and Chapters | Verified, no token failures |
| Kishan on all three layouts | Verified. Cover is good. Chapters at 390 breaks (Fix 2). Dossier rail is tall at 607px |
| Reduced motion | Verified, passes |
| Keyboard focus | Verified, passes, hairline unapproved |
| Sticky overlap at 1440x768 | Fails in Chapters, tight in Dossier |
| Contrast pairs | Computed colours match the spec table, not re-derived |
| W1 800 waiver | In use only on declared elements, still needs owner sign-off |

## Files Audited
- `src/styles/journey.css`, `src/styles/tokens.css` (token values)
- `src/components/journey/layouts/index.tsx`, `ShareControls.tsx`, `ChapterNav.tsx`, `FactsStrip.tsx`, `JourneyHero.tsx` (via grep), `JourneyEnd.tsx` (via grep)
- Rendered pages under `/preview/{cover|dossier|chapters}/{ayush,kishan}`
- Screenshots in `.planning/ui-reviews/02-audit/`
