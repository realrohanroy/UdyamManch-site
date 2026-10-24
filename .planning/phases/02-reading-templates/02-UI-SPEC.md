---
phase: "02"
slug: "reading-templates"
status: draft
shadcn_initialized: false
preset: none
created: "2026-10-24"
scope: "Founder story reading page, /founders/[slug]"
---

# Phase 02: UI design contract, founder story reading page

> Visual and interaction contract for the redesign of `/founders/[slug]`. Written by gsd-ui-researcher, to be verified by gsd-ui-checker.
> This file is a contract only. No source code was changed to produce it.

Requirements served: REQ-TMP-03, 04, 05, 06, 07, 08, 09, 10, 11, 12, REQ-NFR-01, 02, 03.
Design_System sections that apply: 1, 2.1, 2.3, 2.4, 2.5, 3.1, 3.3, 4.1 to 4.4, 5.7, 5.8, 8.1, 8.4, 9, 12, 13.

## How to read this file

1. Section 1 says why today's page feels vague, as design problems to solve.
2. Section 2 gives three layout variants (A, B, C) and a recommendation. Rohan picks one.
3. Sections 3 to 11 are the contract for the chosen variant. Everything is written for the recommended Variant A. Where B or C differ, section 7.3 lists the deltas.
4. Section 12 lists open risks and decisions to record in `.planning/STATE.md`.

Locked decisions (not re-asked): Next.js 14 App Router, plain CSS with tokens, prefix `fj`, no Tailwind, no component library, no new dependency, colours only through `src/styles/tokens.css`, both dark selectors, dark `--mark` is blue, flat calm reading pages, asymmetric radius signature, content is data rendered by one template, server component by default with a small client layer, no em dashes.

---

## 1. Diagnosis: why the page reads as vague

Evidence comes from the template and components in `src/components/journey/`, the founder-story rules in `src/styles/editorial.css` (lines 1214 to 1868), the live render of `/founders/ayush-shaw-shaw-agrivolt-gas`, and the reference screenshot. Each point ends with the problem to solve.

| # | What is wrong today | Evidence | Problem to solve |
|---|---------------------|----------|------------------|
| D1 | The first screen does not say who, what, where. The facts exist in data (`company.industry`, `company.city`, `company.founded`, `listing.state`) but only the website is rendered. Design_System 5.7 and REQ-TMP-07 ask for a facts list. | `JourneySidebar.tsx` renders only name, summary, website, stats, features. Ayush has no stats, so his company card holds no numbers at all. | Give every story an "At a glance" facts row directly under the hero, built only from fields that exist. |
| D2 | The hero is six equal-weight items in one column: tag, title, dek, pin button, byline, five share circles. Two outlined controls (pin, share) compete with the headline. | `JourneyHero.tsx`. Title wraps to 4 lines at 60px in a 542px column at 1440. | One clear order: headline, dek, byline, then actions. Give the title room (up to 76px, 2 to 3 lines). |
| D3 | Reading text is smaller than the system says, and sidebar text is very small. Body is 19.5px (18px at 768 and below). Design_System says 20.5px and 19px. Sidebar and card text runs at 10, 10.5, 11, 11.5, 12 and 12.5px. | `editorial.css` `.story-content`, `.stat-lbl`, `.fj-feat-d`, `.related-cat`, `.related-meta`, `.stepper-card p`. | One type scale for the page: four size roles (section 4.2). Nothing below 14px. Body at 20.5px / 19px. |
| D4 | The article has no signature moments. No drop cap (Design_System 2.3 and 5.7 require one). The pull quote is a plain 5px left rule. Figures use one uniform 18px radius with a shadow and a hover lift, which breaks "flat, hairline, asymmetric corner" (Design_System 2.4, 12). | `.field-banner-wrap`, `.story-content .pq`. | Use the brand: asymmetric corners that vary down the page, flat surfaces, a drop cap, breakout quotes. |
| D5 | Steps are cramped. Four cards share 680px, so each is about 150px wide with 12px text and a 14px title. Mobile stacks them with rotated arrows. Steps use `h4` directly under `h2` (heading level skip). | `.fj-steps`, `blocks.tsx`. | Let process blocks use a wider tier (840px), 14px text, 20.5px titles, `ol` semantics, `h3` titles. |
| D6 | The sidebar is about 1150px tall at 1440 and `position: sticky`. A sticky box taller than the viewport cannot show its bottom, so Related, Share and Topics are effectively invisible until the article ends. It is also six boxes with four different radii and equal weight. | `.sidebar { position: sticky; top: 88px }`, screenshot. | Stop making one tall rail carry everything. Put the company profile and "keep reading" in a place readers actually reach. |
| D7 | On phones the sidebar comes after the whole article, so company facts, related stories and share arrive last. Design_System 5.7 says facts come first on mobile. There is no sticky share bar, although over 70 percent of traffic is WhatsApp on mobile (REQ-NFR-03, REQ-TMP-09). | `.article-layout` collapses to one column at 1080px. | Facts first on mobile. A thumb-reach share bar with WhatsApp as the primary action. |
| D8 | The page has no motion at all except hover lifts. `.rv` exists in CSS but is never used. There is no progress bar (Design_System 8.4 requires one). The hero image zooms on hover, which Design_System 9 forbids inside reading pages. | grep of `src/` for `.rv` and `progress`. `.hero-stage:hover .hero-double-portrait { transform: scale(1.02) }`. | One orchestrated load moment, a progress bar, calm once-only reveals. Remove the hover zoom. |
| D9 | Copy feedback is a 13px check inside a button plus a `title` tooltip. No toast, no `role="status"`, failure only logs to the console (REQ-TMP-11, Design_System 4.2). `ShareSquareBtn` defaults to `https://farmingsolutions.in` when no url is passed. | `ShareSquareBtn.tsx`. | A real toast with `role="status"`, an honest failure message, no default URL. |
| D10 | Accessibility gaps. Share and copy buttons are 38px (minimum 40px). Topics look like interactive chips but are plain text (`cursor: default`). Text on `--acc` fills uses hard-coded `#fff`, which is 2.50:1 in dark mode (avatar letter, state pill hover). The avatar shows the letter "U" for "Udyam Manch Team". `Pinned to My board` changes the label while `aria-pressed` also changes. Devanagari text ("किसान") has no `lang`. | `editorial.css`, `ShareSquareBtn.tsx`, `JourneyHero.tsx`. | Fix each in the contract, see section 8. |
| D11 | No image fallback or reserved space. Images have no width and height, so the hero and figures can shift layout on load, and a blocked image shows raw alt text (visible in the reference screenshot). Design_System 9 requires a gradient fallback. | `JourneyHero.tsx`, `blocks.tsx`, `ImageRef` type. | Reserve space, add a token-based fallback surface behind every image. |
| D12 | The page ends abruptly. After the last block the reader gets the footer. Related stories sit in the sidebar. There is no "next story" (REQ-TMP-08) and the end share is the sidebar one. | `page.tsx`, `JourneySidebar.tsx`. | A real end of story: company, share, topics, next story. |

What is good and must be kept: breadcrumb, the data-driven block model, the tone system, server-rendered metadata and JSON-LD, the Sample label and note, the `==highlight==` title mark, the stage decorations (script name, role, quote card, signature), the Pin to My board action.

---

## 2. Variants

### 2.1 Requirements shared by all three variants

All three keep every piece of current content. Nothing is dropped, only moved.

| Content | A Cover story | B Dossier | C Chapters |
|---------|---------------|-----------|------------|
| Breadcrumb | top | top | inside hero band |
| Kicker, Sample label | hero | hero | hero band |
| Title with `==highlight==`, dek | hero | hero | hero band |
| Hero image and stage decorations (script name, role, quote card, signature) | stage panel under title | portrait card beside title | portrait inside hero band |
| Meta row (author, date, read minutes, Sample) | stage panel | hero | hero band |
| Pin to My board | stage panel | hero | hero band and dock bar |
| Share, top | stage panel | hero | hero band |
| Share, sticky | ShareDock (pill desktop, bar mobile) | sticky rail | dock bar (desktop), bottom bar (mobile) |
| Share, end | end wrap | end band | end of story |
| Body blocks: section, quote, figure, steps, pillars, regions, note | one 680px column with breakout tiers | 1fr column, max 680 | 12 column chapters |
| Company card: logo or icon, name, summary, Visit website, copy link | end wrap panel | sticky rail, compact | profile chapter |
| Stats grid, feature list | end wrap panel | end band | profile chapter |
| Sidebar quote | end wrap | end band | profile chapter |
| Related stories | "Keep reading" with next story card | "Keep reading" | "Read next" |
| Topics | end wrap | end band | end of story |
| New in all three: At a glance facts, progress bar, toast, drop cap | yes | yes | yes |

A layout is chosen by an optional `layout` field on the journey (`'cover' | 'dossier' | 'chapters'`, default `'cover'`). It also delivers REQ-TMP-06 (layout variant switcher). No `if (slug === ...)` anywhere.

Shared radius family for all variants (Design_System 2.4): one large corner of 60, 80 or 90px and three corners of 4px. The large corner moves between neighbouring blocks. Pills (buttons, chips, share circles) are 999px. Nothing on the page uses a shadow except the toast.

### 2.2 Variant A: Cover story

**Concept.** A magazine cover: the headline gets the full width, the portrait sits on a soft stage panel, a facts row answers who, what and where, and then one calm centred column carries the story to a proper end of story.

**Desktop wireframe, 1440 (container 1240, content 1192)**

```
+------------------------------------------------------------------------------------+
| header 68px sticky                                                                 |
+------------------------------------------------------------------------------------+
| Home > Founders > Ayush Shaw                                                       |
|                                                                                    |
| * FOUNDER STORY  Clean energy  [Sample]                                            |
| From agricultural waste to [clean energy]            display 76px / 800, max 900   |
| for a stronger India.                                                              |
|                                                                                    |
| +-- stage panel, --soft, 1192 wide, corner 4 4 90 4 -------------------------------+|
| | dek 20.5px mute, 34em         |                [portrait, max 640 wide, right]    ||
| |                               |  script name (top left)       [quote card]        ||
| | (UM) Udyam Manch Team         |                                                   ||
| |      18 Oct 2026 . 2 min read |                        signature (bottom right)   ||
| | [ Pin to My board ]           |                                                   ||
| | (wa) (in) (x) (f) (link)      |                                                   ||
| +------------------------------------------------------------------------------------+|
|                                                                                    |
| ====== 2px --ink rule ===============================================================|
| At a glance                                                                        |
| Founder       Company          Industry       Based in      Website                |
| Ayush Shaw    Shaw Agrivolt    Clean energy   West Bengal   shawagrivoltgas.com    |
| ------------------------------------------------------------------------------------|
|                                                                                    |
|                 +----------- text column 680 ------------+                         |
|                 | A vision rooted in real challenges     |   h2 34px              |
|                 | G rowing up in India ... drop cap      |                         |
|          +------+--- pull quote 840, corner 4 60 4 4 -----+------+                  |
|          |  "  Agricultural waste is not a problem ...           |                  |
|          +-------------------------------------------------------+                  |
|     +------------ wide figure 1100, corner 4 4 4 80 -----------------------+        |
|     |                         photo, caption, credit                        |        |
|     +-----------------------------------------------------------------------+        |
|                 | From waste to several sources of value |                         |
|          +--- steps 840, four cards in a row, 14px text ---+                        |
|          | (1) Waste -> (2) Digestion -> (3) CBG -> (4) Fertiliser |                 |
|                 | Building a sustainable and scalable future |                       |
|          +--- pillars band 840, corner 4 4 60 4 ---+                                |
|                                                                                    |
| ======================== end of story wrap, 1192 ===================================|
| +-- About Shaw Agrivolt Gas (--card, corner 4 4 4 90) --------------------------+   |
| | logo, name, summary           | stats grid (3 col, omitted if none)           |   |
| | [Visit website] [copy link]   | features 2 x 2                                |   |
| +--------------------------------------------------------------------------------+   |
| sidebar quote, large, --soft, corner 4 60 4 4                                      |
| Share this story (wa)(in)(x)(f)(link)         Topics: Renewable energy, CBG, ...   |
| Keep reading:  [ Read next: large card ]  [ row ]  [ row ]                          |
+------------------------------------------------------------------------------------+
ShareDock pill (bottom centre, 48px) shows after the stage leaves view, hides at the end share.
```

**Mobile wireframe, 390 (content 358, side padding 16)**

```
+--------------------------+
| header 68                |
| Home > Founders > Ayush  |
| * FOUNDER STORY          |
| Clean energy [Sample]    |
| From agricultural waste  |
| to [clean energy] for a  |
| stronger India.     38px |
| +--- stage panel ------+ |
| |  portrait (358 wide) | |
| |  script name TL      | |
| |           signature BR |
| +----------------------+ |
| quote card (in flow)     |
| dek 19px                 |
| (UM) Udyam Manch Team    |
|      18 Oct 2026 . 2 min |
| [ Pin to My board ]      |
| (wa)(in)(x)(f)(link) 40px|
| At a glance (2 columns)  |
| Founder    | Company     |
| Industry   | Based in    |
| Website (full row)       |
| A vision rooted in ...   |
| body 19px / 1.75 ...     |
| wide figure, edge to edge|
| steps stacked, numbered  |
| ... end wrap, one column |
| [ Share on WhatsApp ][..]|  ShareDock bar, fixed, 64px + safe area
+--------------------------+
```

**What changes versus today**
- Title leaves the narrow column and takes the full width (up to 76px, 2 to 3 lines).
- Portrait lives on a `--soft` stage panel with the signature corner. Stage decorations stay, quote card moves into flow on phones.
- New At a glance row, built from existing fields only.
- Single 680px reading column with three width tiers (680, 840, 1100). Drop cap and breakout pull quotes added.
- The sticky sidebar is retired. Its content becomes the end of story wrap, which is full width so nothing is hidden by sticky behaviour.
- Share becomes a ShareDock (compact pill on desktop, full bar on mobile) plus inline top and end rows.

**Hierarchy and reading flow.** Kicker, headline (largest), dek, byline, portrait, facts, drop cap, story, pull quote moments, process and impact visuals, company panel, share, next story. The eye never has to choose between a main column and a competing rail.

**Radius signature.** Stage panel `4px 4px 90px 4px`. Pull quote `4px 60px 4px 4px`. Wide figure `4px 4px 4px 80px`. Pillars band `4px 4px 60px 4px`. Company panel `4px 4px 4px 90px`. Large corner position moves bottom right, top right, bottom left, bottom right, bottom left down the page.

**Pros.** Closest to Design_System 3.3 and 5.7 (centred 680 body, wide cover, quotes break out, facts first on mobile). Same structure on desktop and phone, so fewer bugs. Handles very short stories (Ayush is a 2 minute read) without empty chrome. Fixes D1 to D12 with the least new machinery. Best fit for WhatsApp arrivals.

**Cons.** The company card is no longer visible beside the story on desktop. The facts row and hero website link carry that job. Wide hero panel exposes low resolution portraits (Ayush hero is only 666px wide), so the portrait is capped at 640 CSS pixels and should be re-exported at 1280px.

**Effort: medium, about 14 files** (listed in section 7.3).

### 2.3 Variant B: Dossier

**Concept.** Keep the familiar two column article, but turn the sidebar into a short sticky "story profile" (company, facts, chapter list, share) that fits on one screen, and move everything secondary into a band after the story.

**Desktop wireframe, 1440**

```
| Home > Founders > Ayush Shaw                                                       |
| +------------ hero, 7 / 5 split, 1192 -----------------------------------------+ |
| | * FOUNDER STORY  Clean energy [Sample]   |  +-- portrait card ------------+   | |
| | From agricultural waste to [clean        |  | corner 4 4 90 4             |   | |
| | energy] for a stronger India.  display   |  | stage: script, quote,       |   | |
| | dek 20.5px                               |  | signature                   |   | |
| | (UM) Udyam Manch Team . 18 Oct . 2 min   |  +-----------------------------+   | |
| | [Pin to My board] (wa)(in)(x)(f)(link)   |                                    | |
| +--------------------------------------------------------------------------------+ |
| +----- article, 1fr, max 680 ------------+   +--- profile rail 340, sticky ------+ |
| | A vision rooted in real challenges     |   | [logo] Shaw Agrivolt Gas          | |
| | G rowing up ... (drop cap)             |   | summary (2 lines)                 | |
| | pull quote (680, corner 4 60 4 4)      |   | [Visit website] [copy]            | |
| | figure (680, corner 4 4 4 80)          |   | Founder / Industry / Based in     | |
| | steps (680, 2 x 2 grid, 14px text)     |   | Founded                            | |
| | pillars (680)                          |   | In this story                      | |
| |                                        |   |  o A vision rooted...  (active)    | |
| |                                        |   |  | From waste to...                | |
| |                                        |   |  | Building a sustainable...       | |
| |                                        |   | Share (wa)(in)(x)(f)(link)         | |
| +----------------------------------------+   +-----------------------------------+ |
| ====================== end band, 1192 ================================================|
| Key figures (stats) | What they do (features 2 x 2) | sidebar quote                    |
| Keep reading: next story + rows            Topics                                    |
```
Rail height target 560px or less, so it is fully visible on a 768px tall laptop (top offset 88px).

**Mobile wireframe, 390**

```
| Home > Founders > Ayush  |
| * FOUNDER STORY [Sample] |
| Title 38px               |
| dek                      |
| (UM) Udyam Manch Team    |
| [Pin] (wa)(in)(x)(f)(link)|
| portrait card, corner 90 |
| Story profile (card)     |
|  [logo] Company, summary |
|  [Visit website] [copy]  |
|  Founder | Industry ...  |
|  > In this story (3)     |   details/summary, no JavaScript
| body ...                 |
| end band, one column     |
| [ Share on WhatsApp ][..]|   ShareDock bar
```

**What changes versus today.** Hero is text dominant (7 of 12 columns instead of 1 : 1.12) so the title gets 3 lines. The sidebar shrinks to a profile rail with chapter navigation and scroll spy, stats, features, quote, related and topics move to a band after the story. Steps drop to a 2 x 2 grid inside 680px.

**Hierarchy and reading flow.** Headline, dek, portrait, then reader chooses: read down the column, or jump through the chapter list. The rail answers "who is this company" without scrolling.

**Radius signature.** Portrait card `4px 4px 90px 4px`. Profile rail card `4px 60px 4px 4px`. Quote `4px 60px 4px 4px` is dropped in favour of a flat rule when it sits beside the rail, so two large corners never touch. Figure `4px 4px 4px 80px`. End band panel `4px 4px 4px 90px`.

**Pros.** Closest to today and to the prototype (DEC-006), so least visual surprise. Rail keeps company context in view on desktop and gives a chapter list. Native sticky share on desktop.

**Cons.** Two columns at 680 + 340 leave steps and figures narrow again. Chapter list is thin for 2 to 3 section stories. Sticky rail adds scroll-spy JavaScript and one more thing that can break. Mobile still stacks hero, then profile, then body, so the story starts later than in A.

**Effort: medium, about 13 files.** Reuses the current article-layout idea.

### 2.4 Variant C: Chapters

**Concept.** A long-form feature: a full-bleed hero band, then numbered chapters with a sticky chapter label in the left margin and wide visual blocks that run the full container, with a docked story bar carrying share and progress.

**Desktop wireframe, 1440**

```
| header 68 sticky                                                                   |
+====================================================================================+
| hero band, full viewport width, --soft, corner 4 4 4 90 (bottom left)              |
|   Home > Founders > Ayush Shaw                                                     |
|   * FOUNDER STORY  Clean energy [Sample]            +---- portrait (4 cols) ----+ |
|   From agricultural waste to [clean energy]          | stage: script, quote,     | |
|   for a stronger India.   76px, 8 columns            | signature                 | |
|   dek | (UM) Udyam Manch Team . 18 Oct . 2 min      +---------------------------+ |
|   [Pin to My board] (wa)(in)(x)(f)(link)                                           |
|   In this story:  01 A vision   02 From waste   03 Building                       |
+====================================================================================+
| story bar, sticky under header, 56px, after the band leaves view                   |
| [UM] Shaw Agrivolt Gas | 02 of 03  From waste to several sources | (wa)(in)(x)(link)(Pin)|
+------------------------------------------------------------------------------------+
| At a glance row                                                                    |
| 01 | A vision rooted in      |  text 640                                           |
|    | real challenges (sticky)|  G rowing up ... (drop cap)                         |
|    |  pull quote, 10 columns, corner 4 60 4 4                                      |
| 02 | From waste to several   |  text                                               |
|    |  steps: full width timeline with a connecting line, 4 nodes                   |
|    |  figure: full 1192, corner 4 4 4 80                                           |
| 03 | Building a sustainable  |  text                                               |
|    |  pillars: full width band, corner 4 4 60 4                                    |
| Profile chapter: company card | stats | features | sidebar quote (4 cells)           |
| Read next + Topics + end share                                                     |
```

**Mobile wireframe, 390**

```
| hero band (edge to edge) |
|  breadcrumb, kicker      |
|  Title 38px, dek         |
|  portrait, meta, actions |
|  In this story (3) list  |
| At a glance 2 columns    |
| 01 / 03                  |
| A vision rooted in ...   |   chapter number as small label above h2
| body ...                 |
| steps: vertical timeline |
| ...                      |
| Profile chapter, stacked |
| Read next, topics        |
| [ Share on WhatsApp ][..]|   bottom bar. Thin progress hairline under header.
```

**What changes versus today.** Whole page structure: full-bleed band, chapter grid, timeline steps, dock bar. Sections are grouped into chapters by a pure function (`section` with a heading starts a chapter; following non-section blocks belong to it).

**Hierarchy and reading flow.** Strong sense of progress and place ("02 of 03"). The reader can skim by chapter label, then dive in.

**Radius signature.** Hero band `4px 4px 4px 90px`. Quote `4px 60px 4px 4px`. Full figure `4px 4px 90px 4px`. Pillars `4px 4px 60px 4px`. Profile chapter cards `4px`.

**Pros.** Most distinctive and most "designed". Best showcase for motion. Great for long stories (6 or more sections).

**Cons.** Largest effort. Heavy for 2 to 3 section stories like Ayush (the chrome outweighs the content). Chapter numbers only exist where sections have headings. Two sticky layers (header 68px plus story bar 56px) take 124px of a 768px laptop viewport. Full-bleed band needs a viewport-width breakout that fights the `.w` container.

**Effort: large, about 15 files**, plus the chapter grouping function.

### 2.5 Comparison

| Criterion | A Cover story | B Dossier | C Chapters |
|-----------|---------------|-----------|------------|
| Answers who, what, where at once | yes, facts row | yes, rail | yes, facts row |
| Fixes tall sticky sidebar (D6) | yes, retired | yes, rail under 560px | yes, retired |
| Mobile structure matches desktop | yes | partly | partly |
| Fit for 2 minute stories | best | good | weak |
| Fit for long stories (6 or more sections) | good | good | best |
| Design_System 3.3 and 5.7 fidelity | highest | medium | medium |
| Desktop sticky share | pill dock | rail | story bar |
| Scroll JavaScript | progress, reveals, dock | plus scroll spy | plus scroll spy, grouping |
| Relative effort | M | M | L |
| Risk of regressions | low | medium | high |

### 2.6 Recommendation: Variant A, Cover story

Why:
1. It follows Design_System 3.3 and 5.7 almost word for word: centred 680px body, wide cover, quotes that break out slightly, facts first on mobile. B and C bend those rules.
2. Over 70 percent of readers arrive from WhatsApp on a phone. A is the only variant whose phone layout is the same structure as desktop, so the thing we test most is the thing we ship.
3. Today's two real stories are short (2 minute read). A does not add chrome that a short story cannot fill. C would.
4. It fixes the largest causes of "vague" directly: the facts row (D1), hero priority (D2), the hidden sidebar (D6) and the missing end of story (D12).
5. Medium effort with the lowest regression risk. The block model, repository, metadata and JSON-LD are untouched.

Keep B as a second layout, `layout: 'dossier'`, for company-rich stories later (Kishan has six stats and a map). Do not build C now. Revisit when stories regularly reach 6 or more sections.

Because wireframes are not enough to choose a look, the recommended next step before any code is `/gsd-sketch` on Variants A, B and C using the real Ayush content, at 1440 and 390, light and dark. Then build only the chosen one.

This supersedes the layout half of DEC-006 (pixel match to `kishanStoryHtml`). Typography, tokens and copy rules from DEC-006, DEC-012, DEC-013 stay. Record it as a new DEC (see section 12).

---

## 3. Design system

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (hand written React components and plain CSS) |
| Icon library | lucide-react 0.453.0 (breadcrumb home icon), internal `components/journey/icons.tsx` set (`ICON_NAMES`), inline SVG for share brands |
| Font | Bricolage Grotesque (headings, UI), Newsreader (body, quotes), Caveat (script accents). All three already loaded in `layout.tsx` |

### Component inventory

Tool is `none`, so no shadcn style inventory applies. For provenance, the existing local components were enumerated:

Enumerated by `ls src/components src/components/journey` - 12 shared component files and 7 journey files - udyam-manch local source (no package version) - 2026-10-24.

Journey files today: `Breadcrumb.tsx`, `JourneyHero.tsx`, `JourneySidebar.tsx`, `ShareIcons.tsx`, `blocks.tsx`, `icons.tsx`, `inline.tsx`. Shared files that this page uses: `PinButton.tsx`, `ShareSquareBtn.tsx`. The founder-story CSS classes in `editorial.css` (`hero-grid`, `story-content`, `article-layout`, `sidebar`, `company-card`, `stepper-card`, `related-card`, `share-btn` and the rest) are used only by the journey components (verified by grep), so they can be migrated into `journey.css` and removed without touching other pages.

This list is a non-exhaustive record of what exists. Building a new `fj` component is the expected path.

---

## 4. Spacing, typography, color

### 4.1 Spacing scale

Multiples of 4 only (Design_System 2.4). Values for the reading page:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, inline padding |
| sm | 8px | Chip gaps, share button gaps |
| md | 16px | Default gaps, paragraph to heading, facts cell padding |
| lg | 24px | Container side padding (16px at 560px and below, per `.w`), card padding |
| xl | 32px | Hero to facts, panel padding |
| 2xl | 48px | Block vertical margin (figure, steps, pillars) on desktop, h2 top margin on mobile |
| 3xl | 64px | Section rhythm on desktop, h2 top margin on desktop |

Exceptions (each deliberate):
- 12px is allowed because Design_System 2.4 lists it in its common values (8, 12, 16, 24, 32, 48, 64). Used for chip padding, stat cell padding and the related row hover shift.
- Paragraph gap is 24px at every width (about 1.2em of body size). Snapped from 28px on desktop.
- Touch targets are 40px (Design_System 4.2). The mobile ShareDock buttons are 48px for thumb reach (8px padding plus 48px buttons gives the 64px bar), snapped from 44px. The `Visit website` button is 48px high, snapped from 44px. The desktop ShareDock pill is 48px high (40px buttons plus 4px padding), snapped from 56px. Pull quote padding is 32px 48px, snapped from 32px 40px.
- 40px appears only as the mobile section rhythm, which Design_System 2.4 gives as "about 40px on mobile". It is not used anywhere else.
- Sticky top offset is `calc(var(--fj-hdr) + 20px)` = 88px. `--fj-hdr` is 68px. See component-scoped custom properties in section 7.4.
- Reading column 680px, mid tier 840px, wide tier 1100px (Design_System 3.1 sets 680 and 1100; 840 is the "breaks out slightly" tier).

### 4.2 Typography

Fonts: Bricolage Grotesque for headings, UI, labels, stats. Newsreader for reading text, dek, quotes. Caveat only inside the stage decorations.

Contract on this page: **four size roles plus one exempt decorative tier, and two weights (400 and 700) plus one named waiver for 800.** These caps are scoped to the reading page only. They do not rewrite Design_System 2.3, which stays the site wide type system.

**Weights.** Regular 400 (Newsreader text) and Bold 700 (Bricolage labels, buttons, h3, values). Weights 500 and 600 are removed from this page.

**Waiver W1 (2-weight cap).** Design_System 2.3 locks Bricolage Grotesque 800 for display headings as a brand decision made by the owner. On the reading page, weight 800 is allowed for exactly these named elements: the `h1` title, the `h2` headings set in the Heading and quote role (each story section heading and the `About {company}` heading), and the big stat numbers. Nothing else uses 800. That excludes the drop cap, every `h3`, buttons, labels and values. Every other element is 400 or 700.

| Role | Size | Weight | Line height | Used for |
|------|------|--------|-------------|----------|
| 1. Display | `clamp(38px, 5.4vw, 76px)` | 800 for the `h1` (W1). 700 for the drop cap | 1.05 (drop cap 0.85) | `h1` title (letter spacing `-.03em`, max width 900px) and the drop cap letter |
| 2. Heading and quote | `clamp(28px, 2.4vw, 34px)` (34px at 1440, 28px at 390) | `h2` and stat numbers 800 (W1). Read next title 700. Pull quote and sidebar quote 400 italic Newsreader | 1.15 for Bricolage, 1.3 for quotes | Story section `h2`, `About {company}` `h2`, pull quote, sidebar quote, Read next card title, big stat numbers. Letter spacing `-.025em` on Bricolage only |
| 3. Body | 20.5px (19px at 900px and below) | 400 Newsreader for text. 700 Bricolage for `h3` and values | 1.75 article paragraphs (measure 680px), 1.45 dek and company summary, 1.25 `h3` and values | Article paragraphs, dek (`--mute`), company summary (`--mute`), step and feature `h3` titles, facts values, related row titles |
| 4. Label and small text | 14px | 700 Bricolage for labels and UI. 400 Newsreader for descriptions | 1.4 | Kicker, meta, caption, credit, chips, pills, tags, note, cite, facts labels, stat labels, step numerals, pillar labels, buttons, step and feature descriptions, stage quote card (italic). Minimum size on this page. Nothing below it |

**Exempt decorative tier (not counted toward the 4 size cap).** These are `aria-hidden` art, not reading text (section 8.1). Sizes are unchanged from the current design.

| Element | Size | Weight | Why exempt |
|---------|------|--------|------------|
| Stage script name | 34px (28px at 700px and below) | Caveat 700 | `aria-hidden`, ornament on the portrait |
| Stage signature | 42px (32px at 700px and below) | Caveat 700 | `aria-hidden`, ornament on the portrait |
| Pull quote glyph | 96px | Newsreader 400 | `aria-hidden`, drawn in `--acc2`, never read |

The stage quote card is content (it stays readable), so it is not exempt. It uses the Label and small text role.

**Merges made to reach four roles.** Dek (was 21px) joins Body at 20.5px, a 0.5px change. Pull quote (was 34px and 27px) and sidebar quote (was 24px) join Heading and quote, so the phone pull quote becomes 28px instead of 27px. Related title (was 28px) and stat numbers (was 22px) join Heading and quote. `h3` (was 18px) and UI text (was 16px) are split between Body at 700 (titles, values) and Label at 14px (buttons, descriptions). Section `h2` was `clamp(28px, 3.4vw, 40px)` and is narrowed to `clamp(28px, 2.4vw, 34px)`, which sits inside the Design_System range of 28 to 42px.

**Design_System 2.3 rows not used on this page:** Page title `h1` (directory and listing pages), Card `h3` (21 to 26px), Body 18px and 17px (default text), Meta 13.5px at 500, Category label 13.5px at 700, Button 15px at 700, Nav and chip 15px and 14px at 600. Rows used: Display `h1` (capped at 76px), Section `h2` (narrowed range), Article body, Deck (merged into Body), Pull quote (28px on phones). Buttons use 14px at 700 here, a 1px step down from the system button size, to hold the 4 role cap and the 14px floor.

Rules:
- Drop cap on the first paragraph of the first `section` block only (Design_System 2.3). It uses the Display role size, Bricolage 700 (not 800, which W1 does not cover), `float: left`, line height 0.85, `--acc`, spanning about 2 lines on desktop. CSS only: `.fj-body > .fj-sec:first-child > p:first-of-type::first-letter`. If the first block is not a section, there is no drop cap.
- Headings in sentence case. The `h2` elements `At a glance`, `Share this story`, `Topics` and `Keep reading` stay `h2` in the outline but are styled in the Label and small text role (14px 700, `--mute`), so they are not covered by W1. `hero-tag` uppercase micro label stays (Design_System allows tiny labels) at 14px, letter spacing `.09em`.
- Devanagari runs get `lang="hi"` (see section 8).

### 4.3 Color

All values are tokens. No hex in components. Values below are for reference only.

| Role | Token (light / dark value) | Usage |
|------|----------------------------|-------|
| Dominant (60%) | `--bg` (`#f1f3fa` / `#0e0d1f`) | Page background, article text surface |
| Secondary (30%) | `--soft` (`#e3e6f6` / `#1d1c3c`) for stage panel, quote, note, tags. `--card` (`#ffffff` / `#16152e`) for company panel, steps, pillars, ShareDock. `--line` for hairlines | Panels and surfaces |
| Text | `--ink` main, `--mute` meta and dek | Text on `--bg`, `--soft`, `--card` |
| Accent (10%) | `--acc` (`#5252a6` / `#9c9bf2`) | Kicker text, drop cap, link hover colour, active chapter marker, selected state outlines |
| Highlight accent | `--acc2` (`#4fb8ee` / `#5fc3f5`) | Focus ring, reading progress bar, decorative quote glyph. Never text |
| Headline highlight | `--mark` (`#FFE58F` / `--hl` blue `#3B3F9E`) | `==highlight==` in the title only |
| Tone families | `--tone-{gold,green,teal,indigo}-{line,soft,ink}` | Steps, pillars, features only. Content picks the tone |
| Destructive | none | No destructive actions on this page |

Accent reserved for (explicit): kicker label, drop cap, meta-row avatar fill (initials in `--bg`), link hover colour, active chapter marker (B and C), `--acc2` on focus ring, progress bar and quote glyph. Not for body text, not for stat numbers (see contrast below), not for every link.

Rules:
- Text placed on an `--acc` fill uses `var(--bg)`, never `#fff`. White on dark `--acc` (`#9c9bf2`) is 2.50:1 and fails. `--bg` on `--acc` is 6.08:1 light and 7.65:1 dark.
- Tone `-ink` is for icons and shapes only, never for text. Teal ink on teal soft in light is 3.57:1 (passes 3:1 for icons, fails 4.5:1 for text).
- Big stat numbers use `--ink`, not `--acc2`. `--acc2` on `--card` in light is 2.23:1, below the 3:1 large text minimum.
- In dark mode the `==highlight==` sits on `--hl` blue. Ink on that blue is 7.44:1.
- Both dark selectors are required for every colour that is defined. No new colour tokens are proposed (section 7.4), so nothing needs adding to `tokens.css`.

Contrast results computed on 2026-10-24 (WCAG relative luminance, `node` script):

| Pair | Light | Dark | Needs |
|------|-------|------|-------|
| `--ink` on `--bg` | 16.48 | 16.22 | 4.5 |
| `--mute` on `--bg` | 5.80 | 7.50 | 4.5 |
| `--mute` on `--card` | 6.43 | 6.96 | 4.5 |
| `--mute` on `--soft` | 5.18 | 6.40 | 4.5 |
| `--ink` on `--mark` | 14.67 | 7.44 | 4.5 |
| `--acc` on `--bg` | 6.08 | 7.65 | 4.5 |
| `--acc` on `--card` | 6.74 | 7.10 | 4.5 |
| `--acc` on `--soft` | 5.43 | 6.53 | 4.5 |
| `--bg` on `--ink` (primary button) | 16.48 | 16.22 | 4.5 |
| `--bg` on `--acc` (fill) | 6.08 | 7.65 | 4.5 |
| gold ink on gold soft (icon) | 4.51 | 8.09 | 3 for icons |
| green ink on green soft (icon) | 4.57 | 9.03 | 3 for icons |
| teal ink on teal soft (icon) | 3.57 | 9.55 | 3 for icons |
| `--acc2` focus ring vs `--bg` | 2.01 | 9.68 | 3 (WCAG 1.4.11) |
| `--acc2` focus ring vs `--card` | 2.23 | 8.99 | 3 |
| `--acc2` focus ring vs `--soft` | 1.80 | 8.27 | 3 |

The light mode focus ring fails 1.4.11. See section 8.2 for the contract fix and the approval it needs.

---

## 5. Copywriting contract

Rules from Design_System 4.4: no em dashes, sentence case, honest labels, "Sample" on placeholders, dates like `18 Oct 2026`, no invented facts. Copy that comes from journey content is not rewritten here. The strings below are interface copy.

| Element | Copy |
|---------|------|
| Primary CTA on page | `Visit website` (company website, opens in a new tab). Mobile dock primary: `Share on WhatsApp` |
| Kicker | `hero.kicker` or `Founder story`, then the industry in `--mute` when `company.industry` exists. Example: `Founder story` then `Clean energy` |
| Sample label | `Sample`. Shown next to the kicker. Existing `note` block keeps its own sentence |
| Facts heading | `At a glance`. For sample stories: `At a glance (sample details)` |
| Facts labels | `Founder`, `Company`, `Industry`, `Based in`, `Founded`, `Website` |
| Facts value for website | host name without `https://` (for example `shawagrivoltgas.com`), link text, full URL in `href` |
| Based in rule | `[company.city, state name from listing.state]` joined by a comma, else state name, else `founder.location`. Missing fields are omitted, never shown as blank or "Not available" |
| Meta row | `Udyam Manch Team`, `18 Oct 2026`, `2 min read` |
| Pin button | Visible text stays `Pin to My board`. Pressed state is shown by a check icon and the filled style plus `aria-pressed`. It does not change to "Pinned to My board" |
| Share buttons (aria-labels) | `Share on WhatsApp`, `Share on LinkedIn`, `Share on X`, `Share on Facebook`, `Copy link to this story`, `More ways to share` |
| Share group label | `Share this story` |
| Copy success toast | `Link copied.` |
| Copy failure toast | `Could not copy the link. Copy it from the address bar instead.` |
| Native share cancelled | No message |
| Company panel heading | `About {company.name}` |
| Company website copy button label | `Copy {company.name} website link` (existing) |
| Topics heading | `Topics` |
| Related heading | `Keep reading` |
| Next story label | `Read next` |
| View all link | `See all founder stories` |
| Empty state heading (no related stories) | `This is the only story here for now` |
| Empty state body | `More founder stories are on the way. Meanwhile, browse everyone we have featured so far.` with the link `See all founder stories` |
| Empty topics, stats, features | Section omitted. No placeholder text |
| Figure credit | `Photo: {credit}` (existing) |
| Image failed to load | The figure keeps its reserved space and `--soft` surface. The alt text shows in `--mute` 14px. No extra message |
| Error state (page level) | Existing `not-found.tsx` and `error.tsx`. Not changed in this phase |
| Destructive confirmation | None. This page has no destructive action. Pinning is reversible |

Chapter strings (Variants B and C only): `In this story`, `Chapter 2 of 3` (visible as `02 of 03`).

---

## 6. UI considerations

Applicable state considerations resolved: 11 covered, 3 backstop, 1 unresolved.

| Category | Element(s) | Status | Resolution / Reason |
|----------|------------|--------|---------------------|
| empty | related stories | ✅ covered | When `related` is empty the Keep reading section shows the empty state copy in section 5, with a link to `/founders` |
| empty | stats, features, topics, sidebar quote | ✅ covered | Each is optional and omitted when absent. The end wrap reflows to one column when stats and features are both absent |
| empty | facts row | ✅ covered | Cells with no data are omitted. If fewer than 2 cells remain the whole row is omitted |
| populated | steps 2 to 5, pillars 2 to 6, regions up to 11 | ✅ covered | Steps use a CSS grid that fits 2 to 5 columns at 840px and stacks at 900px and below. Pillars auto-fit. Regions pills wrap |
| zero-one-many | related stories | ✅ covered | One related story shows as the large Read next card. Two or more add rows below it |
| long-text | title, company name, step text | ✅ covered | No fixed heights on text containers. `overflow-wrap: anywhere` on facts values and website host. Titles wrap, never truncate |
| partial | missing hero stage fields | ✅ covered | Each stage decoration renders only when its field exists (existing behaviour kept) |
| partial | missing logo | ✅ covered | Falls back to `company.icon`, then `leaf` (existing behaviour kept) |
| error | image fails to load | ✅ covered | Reserved space plus token gradient surface, alt text visible in mute. Copy in section 5 |
| error | copy to clipboard fails | ✅ covered | Failure toast copy in section 5. Native share used first when available |
| loading | page | ✅ covered | Page is server rendered. No client loading state. Reveals never hide content before JavaScript runs |
| overflow | 320px viewport | 🧪 backstop | Reflow at 320px with no sideways scroll. `state-pill` no longer `nowrap`. Verified by an e2e check at 320 and 390 |
| overflow | map and wide figures | 🧪 backstop | `max-width: 100%`. Verified visually at 390 and 1440 |
| long-text | Devanagari run in dek or body | 🧪 backstop | Falls back to a system Devanagari font because Newsreader has no Devanagari glyphs. Check on a phone before launch |
| permission | none | ⚠ unresolved | Not applicable: no accounts. Left unresolved on purpose, planner treats as out of scope |

---

## 7. Contract for the chosen variant (written for A)

### 7.1 Page structure and landmarks

```
<header> (site)                               landmark: banner (layout)
<main>                                        landmark: main (layout)
  <div class="w fj-page" data-fj-layout="cover">
    <nav aria-label="Breadcrumb">
    <article class="fj-story">
      <header class="fj-hero">                 not a landmark inside article
        p.fj-kicker, h1.fj-title, p.fj-dek    (h1 has aria-label with plain text, word spans are aria-hidden)
        figure/div.fj-stage                   (img with alt, decorations aria-hidden except quote card)
        div.fj-meta, div.fj-actions
      <section aria-labelledby="fj-facts">    h2 "At a glance", dl.fj-facts
      <div class="fj-body fj-article">        blocks, h2 per section, h3 per step
      <aside class="fj-end" aria-labelledby="fj-about">   h2 "About {company}"
        company panel, quote, share group, topics
      <section aria-labelledby="fj-more">     h2 "Keep reading"
    </article>
    <div class="fj-dock">                      client, role="group" aria-label="Share this story"
    <div role="status" class="mbtoast">        client, always in DOM
    <div class="fj-progress" aria-hidden>      client
<footer> (site)
```

Rules: one `h1`. `h2` for facts, each story section, About, Keep reading. `h3` for step titles and feature titles. No heading levels skipped. The three share groups are `role="group"` with the same label, not extra `nav` landmarks.

### 7.2 Component behaviour

**Stage panel (hero).** Grid with areas `kicker title / stage stage`. Desktop panel is two columns: text left (dek, meta, actions), art right. Art wrapper reserves space with `aspect-ratio` from `ImageRef.width` and `height` when present, else `min-height: clamp(280px, 52vw, 520px)`. Image: `object-fit: contain`, max width 640px, `fetchPriority="high"`, no hover zoom, no drop shadow filter. Panel surface is `--soft`. Behind the img a token gradient `linear-gradient(135deg, var(--soft), var(--line))` is the fallback. Stage decorations as today, with these changes: signature text shadow uses `var(--soft)`, not white; at 700px and below script name 28px, signature 32px, quote card static in flow below the panel.

**Meta row.** Avatar disc is `--acc` fill with `--bg` text showing initials of the first two words of the author (`UM` for `Udyam Manch Team`), `aria-hidden`. Then author (700), then `<time>` and `N min read` separated by a `·` rendered as an `aria-hidden` span, not the current `•` at 40 percent opacity.

**Actions row.** Pin button (min height 40px) then share group. Share circles are 40px. Hover lift 2px (Design_System 5.2) only under `@media (hover: hover)`.

**Facts strip.** `<dl>` with `div` cells. Top rule 2px `--ink`, hairline between cells (`--line`). Desktop: `grid-template-columns: repeat(auto-fit, minmax(176px, 1fr))`. Mobile: 2 columns, website cell spans both. Label 14px 700 `--mute`, value in the Body role (20.5px, 19px at 900px and below) 700 `--ink`. Website is a link with an `↗` and `rel="noopener noreferrer"`, `target="_blank"`, accessible name `Visit {host}, opens in a new tab`.

**Body.** One CSS grid: `grid-template-columns: minmax(0,1fr) min(680px,100%) minmax(0,1fr)`. Default block lives in column 2. Tiers:
- `fj-col` (680px): section, note.
- `fj-mid` (840px, centred via `grid-column: 1 / -1; width: min(840px, 100%); justify-self: center`): quote, steps, pillars, regions.
- `fj-wide` (1100px): figure.
At 900px and below every tier is full column width; figures run edge to edge (negative margin equal to the 16px page padding).

**Pull quote.** `--soft` surface, radius `4px 60px 4px 4px`, padding 32px 48px (24px at 900px and below), no border, no shadow. A decorative open quote glyph (`aria-hidden`, Newsreader 96px, `--acc2`, exempt decorative tier in 4.2) at top left. Text is `--ink` italic Newsreader in the Heading and quote role (34px desktop, 28px at 900px and below). `cite` 14px 700 `--mute` preceded by a 24px `--ink` rule. Never in a left-border style.

**Figure.** `<figure>` radius `4px 4px 4px 80px`, 1px `--line` border, `--soft` fallback surface, no shadow, no hover lift. Caption 14px `--mute` below, outside the clipped box. Credit appended as today.

**Steps.** `<ol class="fj-steps">` with `<li>` cards and a decorative connector drawn by CSS (no arrow DOM nodes). Card: `--card` surface, 1px `--line`, radius 4px, tone top edge 4px using `--t-line`, icon tile 40px using `--t-soft` and `--t-ink`, `h3` in the Body role (20.5px, 19px at 900px and below) at 700, text 14px 400 `--mute`. At 840px: 2 to 5 columns equal width. At 900px and below: one column with a vertical connector. Numerals `1` to `n` in 14px 700 `--mute` above the icon.

**Pillars.** `<ul>` band, `--card`, 1px `--line`, radius `4px 4px 60px 4px`. Icons 32px. Labels 14px 700 `--ink` (not `--t-ink`). Auto-fit `minmax(120px, 1fr)`.

**Regions.** Map (`wide` figure rules, radius `4px 4px 4px 80px`, fallback surface) beside a wrapping list of pills. Pill: 14px 700, `--soft`, 1px `--line`, 999px radius, not `nowrap`. Hover colour change only under `hover: hover`, text stays `--ink` on `--soft` (no `#fff` on `--acc`).

**Note.** 14px 700 `--mute` on `--soft`, radius 4px, padding 16px.

**End wrap (replaces the sidebar).**
- Company panel: `--card`, 1px `--line`, radius `4px 4px 4px 90px`, padding 32px. Left: logo or icon tile, `h2` name (Heading and quote role), summary in the Body role (`--mute`), `Visit website` primary button (pill, `--ink` fill, `--bg` text, 14px 700, min height 48px) plus copy-link icon button 40px. Right: stats `<dl>` 3 columns of number (Heading and quote role, 800 under waiver W1, `--ink`) over label 14px `--mute`; features 2 x 2 using tone icons, title in the Body role at 700, text 14px 400 `--mute`. If both stats and features are absent the panel is single column.
- Sidebar quote: `--soft`, radius `4px 60px 4px 4px`, text in the Heading and quote role (italic Newsreader), cite 14px.
- Share this story: share group (5 buttons) and the Pin button.
- Topics: `ul` of non-interactive tags. Style: 14px 700, `--soft` fill, radius 4px (not pill), no border, no hover, no `cursor: pointer`. This keeps them visually different from interactive pill chips (Design_System 5.3).
- Keep reading: first related story as a Read next card (3:2 thumb with radius `50% 4px 4px 4px` is for side thumbnails, so use `4px 4px 90px 4px` on the large thumb instead), kicker, title in the Heading and quote role at 700, meta at 14px. Remaining related stories as rows with hairlines and titles in the Body role at 700. Row hover shifts padding-left 12px over 0.3s under `hover: hover` (Design_System 4.3). `Sample` label replaces the kicker for sample stories (existing behaviour).

**ShareDock.** Client component, fixed, z-index 5 (Design_System "tools bar" layer, no new value). See section 9.

**Progress bar.** Client element, fixed top 0, full width, height 3px, `--acc2`, z-index 30, `aria-hidden="true"`. Measures `.fj-article` only.

### 7.3 Files to change (Variant A)

Rule from CLAUDE.md: a new block type needs 4 places. This phase adds no new block type, so only existing block renderers and styles change.

| File | Change | New or existing |
|------|--------|-----------------|
| `src/lib/journey/types.ts` | Add `export const LAYOUTS = ['cover','dossier','chapters'] as const`, `Layout` type, optional `layout?: Layout` on `FounderJourney`. Add optional `width?: number; height?: number` on `ImageRef` for layout shift prevention. No other field is needed | existing |
| `src/sanity/schemas/founderJourney.ts` | Add `layout` string field with list built from `LAYOUTS`. Image width and height come from Sanity asset metadata, no editor field | existing |
| `src/lib/share.ts` | Add `'native'` to `ShareChannel` so native share carries `utm_source=native` | existing |
| `src/app/founders/[slug]/page.tsx` | Replace the hard-coded `hero + article-layout` JSX with `const Layout = LAYOUT_COMPONENTS[j.layout ?? 'cover']` and render it. `generateMetadata`, JSON-LD, `revalidate`, `generateStaticParams` do not change | existing |
| `src/components/journey/layouts/CoverLayout.tsx` | Variant A composition (server component) | new |
| `src/components/journey/JourneyHero.tsx` | Rewrite as stage panel and hero text | existing |
| `src/components/journey/SplitTitle.tsx` | Server component: splits the title into word spans with `--i` index, keeps `<mark>` and `<br>`, marks highlight words | new |
| `src/components/journey/FactsStrip.tsx` | At a glance row | new |
| `src/components/journey/blocks.tsx` | New class names, `data-rv` hooks, `ol` steps with `h3`, figure fallback surface, `fj-col/mid/wide` tier classes. No new `_type`, so the `never` check is unchanged | existing |
| `src/components/journey/JourneyEnd.tsx` | End wrap and Keep reading. Replaces `JourneySidebar.tsx` for Variant A | new |
| `src/components/journey/JourneySidebar.tsx` | Keep only if Variant B is built, otherwise delete | existing |
| `src/components/journey/ShareControls.tsx` | Client. Replaces `ShareIcons.tsx` and the copy button. Handles copy, native share, toast | new |
| `src/components/journey/ShareDock.tsx` | Client. Fixed share bar or pill | new |
| `src/components/journey/JourneyFx.tsx` | Client. Progress bar, reveals, dock visibility. Renders the progress element | new |
| `src/components/journey/inline.tsx` | Wrap Devanagari runs in `<span lang="hi">` | existing |
| `src/components/ShareSquareBtn.tsx` | Remove the default `url`. Make `url` required. Or delete if unused after the change | existing |
| `src/styles/journey.css` | Rewrite for all `fj-` classes (section 7.4). Includes the reduced motion block and `@media print` | existing |
| `src/styles/editorial.css` | After the new styles pass review, delete lines 1214 to 1868 (founder-story rules) and the matching mobile rules. Separate commit | existing |
| `tests/` | Add e2e checks: no horizontal scroll at 320 and 390, facts row present, dock appears after the stage leaves view, content visible with reduced motion | new |

Not changed: `repo.ts`, `format.ts` (except nothing), metadata, JSON-LD, `PageCurtain`, `Header`, `Footer`, tokens.

Variant B delta: add `layouts/DossierLayout.tsx`, `ProfileRail.tsx` (client scroll spy for the chapter list, or `details` on mobile), `EndBand.tsx`; keep `JourneySidebar.tsx` logic split into those. Variant C delta: add `layouts/ChaptersLayout.tsx`, `lib/journey/chapters.ts` (pure grouping), `StoryBar.tsx` (client), and a full-bleed band style.

### 7.4 Class and token inventory (prefix `fj`)

Every colour is `var(--token)`. No hex.

| Class | Element | Key rules | Tokens |
|-------|---------|-----------|--------|
| `fj-page` | wrapper | sets component-scoped custom properties, `scroll-padding` via `html:has(.fj-page)` | none |
| `fj-kicker` | tag line | 14px 700 uppercase `.09em`, gold dot | `--acc`, `--mute`, `--tone-gold-line` |
| `fj-sample` | label | pill, existing | `--soft`, `--line`, `--ink` |
| `fj-hero` | header | grid areas | none |
| `fj-title`, `fj-w`, `fj-mk` | h1 and word spans | display type, per-word reveal, highlight per word | `--ink`, `--mark` |
| `fj-dek` | p | Body role, 20.5px Newsreader | `--mute` |
| `fj-stage` | panel | radius `4px 4px 90px 4px`, fallback gradient | `--soft`, `--line` |
| `fj-stage-art`, `fj-stage-img`, `fj-stage-cover` | art wrapper, img, wipe cover | cover is the load wipe layer | `--soft` |
| `fj-script`, `fj-role`, `fj-sig`, `fj-sq` | stage decorations | as today, restyled | `--ink`, `--mute`, `--card`, `--line`, `--acc2` |
| `fj-meta`, `fj-av` | byline | initials avatar | `--acc`, `--bg`, `--ink`, `--mute` |
| `fj-actions`, `fj-pin` | actions row, pin button | min height 40px | `--ink`, `--bg` |
| `fj-share`, `fj-share-btn` | share group, circle | 40px, 1.5px border | `--line`, `--card`, `--ink`, `--bg` |
| `fj-facts`, `fj-fact` | dl, cell | 2px top rule | `--ink`, `--line`, `--mute` |
| `fj-body`, `fj-col`, `fj-mid`, `fj-wide` | body grid and tiers | 680, 840, 1100 | none |
| `fj-sec` | section block | drop cap target | `--acc`, `--ink` |
| `fj-quote`, `fj-quote-glyph` | pull quote | radius `4px 60px 4px 4px` | `--soft`, `--ink`, `--mute`, `--acc2` |
| `fj-fig`, `fj-cap`, `fj-credit` | figure | radius `4px 4px 4px 80px` | `--line`, `--soft`, `--mute` |
| `fj-steps`, `fj-step` | ol, li | grid, connector | `--card`, `--line`, `--t-line`, `--t-soft`, `--t-ink` |
| `fj-pillars` | band | radius `4px 4px 60px 4px` | `--card`, `--line`, `--ink` |
| `fj-regions`, `fj-pill` | map and list | pills wrap | `--soft`, `--line`, `--ink` |
| `fj-note` | note | | `--soft`, `--mute` |
| `fj-end`, `fj-company`, `fj-stats`, `fj-feats` | end wrap | radius `4px 4px 4px 90px` | `--card`, `--line`, `--ink`, `--mute`, tones |
| `fj-sidequote` | sidebar quote | radius `4px 60px 4px 4px` | `--soft`, `--ink`, `--mute` |
| `fj-topics`, `fj-tag` | topics | radius 4px, not interactive | `--soft`, `--ink` |
| `fj-more`, `fj-next`, `fj-rel` | keep reading | | `--ink`, `--mute`, `--acc`, `--line`, `--soft` |
| `fj-dock` | share dock | fixed, z 5 | `--card`, `--line`, `--ink`, `--bg` |
| `fj-progress` | progress bar | fixed, z 30 | `--acc2` |
| `fj-rv`, `fj-rv-pre`, `fj-in` | reveal hooks | state classes | none |
| `fj-toast-up` | toast offset modifier on `.mbtoast` | raises toast above dock | none |
| `fj-t-gold`, `-green`, `-teal`, `-indigo` | tones | existing | tone tokens |

Component-scoped custom properties, declared on `.fj-page`, not global tokens, no colour values, no approval needed: `--fj-hdr: 68px`, `--fj-sticky: calc(var(--fj-hdr) + 20px)`, `--fj-col: 680px`, `--fj-mid: 840px`, `--fj-wide: 1100px`, `--fj-dock-h: 64px` (mobile) and `48px` (desktop pill), and the inline stagger index `--i` set by React on word and card elements. They exist so the sticky offset can change in one place if the header ever starts hiding on scroll (Design_System 3.1 describes this, but `Header.tsx` does not do it today).

New colour tokens needed: none. The stage panel uses `--soft`, the pull quote uses `--soft`, the dock uses `--card`. If implementation finds a gap, stop and ask (Design_System 11).

Hard-coded colour to remove while migrating the founder-story rules: `#fff` on `.hero-byline .av` and `.state-pill:hover`, `rgba(...)` shadows on `.field-banner-wrap`, `.stepper-card`, `.company-card`, `.stage-quote-card`, `.hero-double-portrait`, the white `text-shadow` on the signature, and `rgba(0,0,0,.45)` is not in scope (menu backdrop, other component).

---

## 8. Accessibility contract (WCAG 2.2 AA)

### 8.1 Structure and content
- Landmarks and heading order as in 7.1. Steps and features use `h3`, never `h4` under `h2`.
- `h1` carries `aria-label` with the plain title. Word spans inside are `aria-hidden`. This prevents word by word announcements.
- Steps are an ordered list (`ol`), pillars an unordered list, regions an unordered list, facts a definition list.
- Alt text rules: hero image alt is required and describes the person and setting (existing guard). Figure and map alt required (existing guard). Text inside an image must be repeated in the alt (Kishan field image already does this). Company logo `alt=""` because the company name is adjacent. Related thumbnails `alt=""` because the link text names the story. Stage script name, role and signature are `aria-hidden`. The stage quote card is content and stays readable.
- Language of parts (3.1.2): Devanagari runs are wrapped with `lang="hi"` by `Inline`.
- Links that open a new tab say so in their accessible name (`Visit {host}, opens in a new tab`).
- Pin button: constant label, state in `aria-pressed`.

### 8.2 Focus
- Ring from Design_System 4.2: `3px solid var(--acc2)`, offset 2px, on every interactive element, never removed.
- **Gap and proposed amendment.** `--acc2` on `--bg` is 2.01:1 in light mode and fails WCAG 1.4.11 (3:1 for focus indicators). Contract for this page: keep the 3px `--acc2` ring and add a 1px `--ink` hairline `box-shadow: 0 0 0 1px var(--ink)` directly on the element, so the pair reads at over 3:1 in both themes. This amends Design_System 4.2 and needs Rohan's approval. If declined, the gap stays and must be listed in the launch audit.
- Sticky and fixed UI must not hide the focused element (2.4.11). `html:has(.fj-page)` gets `scroll-padding-top: 88px` and `scroll-padding-bottom: 80px` (mobile bar 64px plus 16px). The end of the article has bottom padding of the dock height plus safe area.
- When the dock is hidden it uses `visibility: hidden` so its buttons leave the tab order.
- Tab order equals DOM order. On phones the stage image moves above the dek with CSS grid areas. Only non-focusable content changes visual order, because all focusable controls (pin, share) are last in both orders.

### 8.3 Targets
- All interactive elements are at least 40 by 40px (Design_System 4.2): share circles 40, copy 40, pin min height 40, `Visit website` min height 48, mobile dock buttons 48, desktop pill buttons 40, related rows full row tap targets. WCAG 2.5.8 minimum (24px) is exceeded.
- Topic tags are not interactive, so they have no target size and no hover.

### 8.4 Motion and time
- `prefers-reduced-motion: reduce`: no animation or transition, everything visible, progress bar still follows the scroll position (it is position feedback, not animation) but without a transition. See section 9.
- No auto-playing or looping animation exists on this page, so 2.2.2 does not apply.
- Toast is `role="status"` and stays in the DOM, text changes when a message is needed. Visible for 3 seconds.

### 8.5 Contrast and non-text
- All text pairs in 4.3 pass 4.5:1.
- Tone ink is used for icons only. Teal icon on soft is 3.57:1 in light (passes 3:1).
- Interactive boundaries: share circles and the copy button rely on their icon, which is `--ink` at over 16:1, so the 1.27:1 hairline border is decorative.
- Never colour alone: the pinned state adds a check icon, the copied state adds a check icon and a toast.
- Reflow (1.4.10): no horizontal scroll at 320px. Steps stack, facts go to one column below 360px, pills wrap.
- Text spacing (1.4.12): no fixed heights on text boxes, only `min-height` on image containers.
- Forced colors: the focus ring is an `outline`, so it survives forced colors mode.
- Print: reveals, dock and progress are hidden, everything visible.

---

## 9. Motion contract

Library: none. CSS keyframes and transitions plus one small client component (`JourneyFx`) using `IntersectionObserver` and a single passive `scroll` listener throttled with `requestAnimationFrame`. Properties animated: `transform` and `opacity`, and `clip-path` for wipes. Durations and easings come from Design_System 4.3.

Easings used (all from Design_System 4.3):
- `--ease-enter`: `cubic-bezier(.2,.7,.2,1)` (page enter, reveals)
- `--ease-word`: `cubic-bezier(.2,.8,.2,1)` (headline words)
- `--ease-wipe`: `cubic-bezier(.7,0,.2,1)` (image wipes, curtain)

These are written as custom properties on `.fj-page`, no approval needed (not colours).

### 9.1 Orchestrated page load (one moment)

Starts at first paint plus a base delay of 120ms (so on client navigation the first words appear as the page curtain, DEC-017, finishes lifting). Pure CSS, no JavaScript needed. The base state is the visible state; keyframes start from hidden, so if animation is off, nothing is hidden.

| Order | Element | Effect | Duration | Delay | Easing |
|-------|---------|--------|----------|-------|--------|
| 1 | breadcrumb and kicker row | fade and 12px rise | 0.55s | 0 | enter |
| 2 | title words (`fj-w`) | fade and `translateY(.45em)` to 0 | 0.85s each | `80ms + i * 55ms`, `i` capped at 14 | word |
| 3 | highlighted words (`fj-mk`) | highlight bar `scaleX(0)` to 1 from the left, drawn per word so it survives line wraps | 0.5s | `720ms + k * 90ms` (k counts words inside the mark) | word |
| 4 | stage cover (`fj-stage-cover`) | cover layer `scaleX(1)` to 0 with origin right, uncovering the panel left to right | 1.1s | 150ms | wipe |
| 5 | dek, meta, actions | fade and 12px rise | 0.55s | 350ms, 420ms, 490ms (70ms stagger) | enter |
| 6 | script name and role | fade and 8px rise (the 6 degree rotation stays in the keyframes) | 0.55s | 900ms | enter |
| 7 | stage quote card | fade and 12px rise | 0.55s | 1000ms | enter |
| 8 | signature | `clip-path: inset(0 100% 0 0)` to `inset(0)` | 0.9s | 1100ms | wipe |
| 9 | facts cells | fade and 12px rise, 70ms stagger | 0.55s | 1000ms plus index | enter |

Total about 1.9s, but text is readable from 0.6s and the page is never blocked or scroll-locked.

Why a cover layer for the stage and not `clip-path` on the image: the hero image is the Largest Contentful Paint candidate (REQ-NFR-01, under 2.0s on 4G). Clipping the image itself risks LCP being measured late. A cover layer slides away over a fully painted image. If Lighthouse on throttled 4G shows LCP under 2.0s with `clip-path` on the image, either approach is allowed. Figures later in the article (not LCP) use `clip-path` as Design_System 4.3 says.

### 9.2 Reading progress bar (Design_System 8.4)

- Fixed, top 0, left 0, width 100 percent, height 3px, `background: var(--acc2)`, z-index 30, `aria-hidden="true"`.
- `transform: scaleX(p)`, `transform-origin: left`. `p = clamp((scrollY - top) / (height - viewportHeight), 0, 1)` measured on `.fj-article` (body blocks only, so it reaches 100 percent at the end of the story, before the end wrap).
- Hidden (`opacity: 0`) until the first scroll, then fades in over 0.15s. Updated in a `requestAnimationFrame` callback. No `transition` on the transform, so it tracks the finger.
- Reduced motion: still shown and updated (it is scroll position feedback), with no opacity transition.

### 9.3 Scroll reveals (Design_System `.rv`)

- Only blocks, not paragraphs: each `section` block, `quote`, `steps`, `pillars`, `regions`, the end wrap panels, and each related row.
- Effect: fade and 22px rise, 0.8s, enter easing, once only, then `unobserve`.
- Threshold 0.2, `rootMargin: 0px 0px -8% 0px`.
- Safety rule: on mount, `JourneyFx` adds `fj-rv-pre` (hidden state) only to elements whose top is below the viewport bottom. Anything already in view stays untouched, so there is no flash. If JavaScript fails or never loads, nothing was hidden.
- The hidden-state CSS lives inside `@media (prefers-reduced-motion: no-preference)`, so reduced motion needs no override.

### 9.4 Block specific motion

| Block | Motion | Timing |
|-------|--------|--------|
| Steps | Cards enter in sequence left to right (top to bottom on phones): fade and 16px rise. The tone top edge draws with `scaleX` 0 to 1 on a pseudo element. The connector fades in between cards | Card 0.55s enter, stagger 140ms (90ms on phones). Edge 0.5s, 120ms after its card. Connector 0.3s, 70ms after the previous card |
| Pillars | Items fade and rise 12px with a 70ms stagger (Design_System pinboard stagger value), icons do not bounce (reading pages are calm) | 0.55s enter easing |
| Figure | `clip-path: inset(0 100% 0 0)` to `inset(0)` wipe left to right, then caption fades | Wipe 1.1s wipe easing. Caption 0.55s, delay 0.6s. No image zoom |
| Regions | Map wipes like a figure. Pills fade in with a 40ms stagger, capped at 12 | Pills 0.4s enter easing |
| Pull quote | Block reveals (fade and 22px rise). The quote glyph drops from -12px to 0 and fades in. Cite fades 300ms later. No looping | Block 0.8s. Glyph 0.8s word easing. Cite 0.55s |
| Stats | No count up. Values are free text such as `5,00,000+`, so counting would risk wrong numbers or Indian digit grouping | none |
| End wrap and related | Panels reveal as blocks. Related rows stagger 70ms | 0.8s |

### 9.5 Sticky share behaviour

| Where | Behaviour |
|-------|-----------|
| Desktop (above 900px), ShareDock pill | Hidden while the stage actions row is in view. When that row leaves the viewport upwards the pill slides up from `translateY(16px)` with opacity 0 to 1. Hides again when the end share group enters the viewport. Bottom centre, 24px above the bottom edge, z-index 5 |
| Mobile (900px and below), ShareDock bar | Same trigger. Full width bar at the bottom, 64px plus safe area inset. Slides up from `translateY(100%)` |
| Transition | 0.35s, enter easing, transform and opacity. `visibility` flips at the end of hide so hidden buttons leave the tab order |
| Reduced motion | State changes instantly, no slide |
| Interaction with toast | Toast moves above the dock using `fj-toast-up` (`bottom: calc(var(--fj-dock-h) + 16px + env(safe-area-inset-bottom))`) |
| Header | The site header stays sticky and visible. Sticky offsets use `--fj-sticky`, so a future hide-on-scroll header only needs one value changed |

### 9.6 Hover and press

Only under `@media (hover: hover)`. Button hover lift 2px over 0.25s (Design_System 4.3). Related row padding-left 12px over 0.3s. Image hover zoom is removed. Photos do not zoom inside reading pages (Design_System 9).

### 9.7 Reduced motion contract

```
@media (prefers-reduced-motion: reduce) {
  .fj-page *, .fj-page *::before, .fj-page *::after { animation: none; transition: none; }
  .fj-stage-cover { display: none; }
  .fj-mk::before { transform: none; }     /* highlight fully drawn */
  .fj-dock { transition: none; }
}
```
All `fj-rv-pre` rules sit inside `no-preference`, so content is visible by default. `JourneyFx` also reads `matchMedia('(prefers-reduced-motion: reduce)')` and skips adding hidden states and observers.

---

## 10. Mobile first contract (360 to 430px)

- Design at 390. Check at 320, 360, 390, 430, 700, 900 and 1440 in light and dark (Design_System 13).
- Side padding 16px (existing `.w` rule at 560px and below). Body 19px / 1.75, measure about 40 characters.
- Order on phones: kicker, title, stage image, quote card, dek, meta, actions, At a glance, story. Reason: people arriving from a WhatsApp preview already saw the image and title, so we confirm it, then give the dek and who wrote it.
- Facts first (Design_System 5.7): facts sit before the first story paragraph, 2 columns, website row full width.
- Hero stage on a phone: panel full width, portrait at 100 percent of 358px. Script name 28px at top left, signature 32px at bottom right, quote card moves out of the image into flow below the panel.
- Wide blocks (figure, map) run edge to edge using negative margins equal to the page padding. Steps and pillars stack to one column. Pills wrap, 2 per row at 320.
- Tap targets 40 or more. No hover dependent action.
- **ShareDock bar on mobile.** Fixed bottom, full width, `--card` background, 1px top `--line`, padding 8px 16px plus `env(safe-area-inset-bottom)`, z-index 5, height 64px.
  - Left: primary pill `Share on WhatsApp` (WhatsApp mark plus label, 48px high, `--ink` fill, `--bg` text, flexible width).
  - Right: `More ways to share` icon button (48px, calls `navigator.share({ title, text, url })` where available, which covers LinkedIn, X, Facebook, Instagram and the rest; if unsupported it opens the inline share group by scrolling to the end share group), and `Copy link` icon button (48px).
  - Appears after the stage actions leave the view, hides at the end share group, never overlaps the footer (hidden by the end share trigger before it).
  - The end of the article has bottom padding of 64px plus safe area so the last paragraph is never covered.
- Share URLs keep campaign tags (REQ-TMP-12). Mediums: `share_top` (stage actions), `share_dock` (dock), `share_end` (end wrap). The old `share_sidebar` is retired.
- Performance for phones: the page is a server component. The client layer is three small components (`JourneyFx`, `ShareControls`, `ShareDock`). No animation library. Hero image `fetchPriority="high"`, other images `loading="lazy"` with reserved space.

---

## 11. Verification checklist (maps to Design_System 13)

Planner and auditor use this list as acceptance criteria.

1. Only tokens for colour. No hex, no `rgba` colours left from the migrated founder-story rules. Works in light, system dark and `[data-theme="dark"]`.
2. 1440, 900, 700, 390 and 320 wide: no sideways scrolling.
3. Keyboard: every control reachable and visibly focused. Focused element is never hidden by the header or the dock.
4. Touch targets 40px or more. Nothing depends on hover.
5. Reduced motion: all content visible, no animation, dock toggles without sliding.
6. Every image has alt text (decorative ones empty), a fallback surface, and reserved space.
7. Copy follows section 5. No em dashes. Sample labels present on sample stories.
8. Z-index only 5, 20, 30, 90, 100 (existing values). Prefix `fj`. No new storage keys.
9. One `h1`, ordered headings, landmarks. Title, description, Open Graph unchanged.
10. Contrast pairs in 4.3 re-checked after implementation. Focus ring amendment decided.
11. `npm run build` passes the content guard. `npx tsc --noEmit` passes. `npm run test:e2e` passes with the new checks.
12. Lighthouse mobile on a throttled connection: LCP under 2.0s, CLS under 0.1, Accessibility 100.
13. Layout field works: setting `layout` on a journey changes the composition with no slug check in the template.
14. Type: computed font sizes on the page resolve to only the four roles in 4.2 plus the exempt `aria-hidden` script and glyph. Computed weights are 400 and 700, with 800 only on the `h1`, story and company `h2`, and stat numbers (waiver W1).

---

## 12. Decisions to record and open risks

### Proposed DEC entries for `.planning/STATE.md`

| ID | Subject | Decision and reason |
|----|---------|---------------------|
| DEC-021 | Founder story layout | Recommended Variant A (Cover story) replaces the sidebar layout from DEC-006. Reason: fixes the facts gap, hidden sticky sidebar and missing end of story, matches Design_System 3.3 and 5.7, same structure on phones. Typography, tokens and copy rules from DEC-006, 012 and 013 are kept |
| DEC-022 | `layout` field | Optional `layout` on `FounderJourney` (`cover`, `dossier`, `chapters`, default `cover`) delivers REQ-TMP-06 and avoids any `if (slug === ...)` |
| DEC-023 | Reading page motion | One load moment, progress bar, once-only block reveals, `transform`, `opacity` and `clip-path` only, reduced motion shows everything. Hero wipe uses a cover layer to protect LCP |
| DEC-024 | Type floor and roles | No text under 14px on the reading page. Four size roles only: Display, Heading and quote, Body (20.5px and 19px per Design_System 2.3), Label and small text (14px). Script and quote glyph are an exempt decorative tier (`aria-hidden`). Scoped to this page, Design_System 2.3 is not rewritten |
| DEC-026 | Weight waiver W1 | Reading page weights are 400 and 700. Weight 800 is a named waiver for the `h1`, the `h2` headings in the Heading and quote role, and big stat numbers only, because Design_System 2.3 locks 800 for display headings as the owner's brand decision |
| DEC-025 | Focus ring amendment | Add a 1px `--ink` hairline to the 3px `--acc2` ring on reading pages, because `--acc2` is 2.01:1 on `--bg` in light mode. Needs approval |

### Open risks

| # | Risk | Mitigation or owner |
|---|------|---------------------|
| R1 | Light mode focus ring fails WCAG 1.4.11 (2.01:1) | Approve the DEC-025 amendment, or log it in the launch accessibility audit |
| R2 | Ayush hero portrait is 666px wide. A wide stage panel makes the softness obvious on retina screens | Cap portrait at 640 CSS px. Rohan to supply a 1280px wide export |
| R3 | `company.founded` is unverified for both real journeys (Kishan 2006, Ayush 2023, noted in `CLAUDE.md`). The facts row would publish them | Verify before launch, or remove `founded` from those two files until verified. Facts row only shows what exists |
| R4 | Ayush has no city. "Based in" falls back to `West Bengal` from `listing.state` | Rohan confirmed the state on 24 Oct 2026 (comment in `ayush-shaw.ts`). Add `company.city` when known |
| R5 | LCP could slip because of the 1.1s stage wipe | Cover layer technique. Measure with Lighthouse on throttled 4G before sign-off |
| R6 | Newsreader has no Devanagari glyphs, so `किसान` falls back to a system font | Check on an Android phone. Consider a Devanagari serif later (needs approval for a new font) |
| R7 | Header hide on scroll is described in Design_System 3.1 but not implemented. Sticky offsets assume a visible header | Offsets are one custom property (`--fj-sticky`) |
| R8 | Retiring the sticky sidebar changes the look that DEC-006 matched pixel for pixel | Needs Rohan's explicit approval of Variant A (DEC-021) |
| R9 | Building all three variants before choosing triples the work | Run `/gsd-sketch` on A, B and C with real content first, then build one |
| R10 | `ShareSquareBtn` default URL points at Kishan's company site | Remove the default in this phase |
| R11 | Dead rules in `editorial.css` (about 650 lines) | Remove in a separate commit after review. Keeps hard-coded colours out of the code base (`CLAUDE.md` open item) |
| R12 | The page curtain (DEC-017) and the load sequence overlap on client navigation | 120ms base delay. Check the pair on a real phone |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none (Tool: none) | none | not applicable. No third party code, no new dependency |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS
- [ ] Dimension 7 Inventory Provenance: PASS

**Approval:** pending
