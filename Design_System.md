# Udyam Manch: Design System

Rules for building every page and component, in light and dark mode, on mobile and desktop. Version 0.1, 17 October 2026. Written so that agents and developers can follow it without asking.

## 0. How to use this document

1. Read sections 1 to 4 before writing any page. They define the tokens, type, layout and rules every page shares.
2. Use section 5 to pick existing components. Build a new component only if none fits, and follow section 11 for naming.
3. Check your page against section 13 before handing it over.

Must means required. Should means expected unless there is a good reason. Values marked as inferred come from the current prototype and should be confirmed once the site moves to its final framework.

**Source of truth:** the working prototype, `udyam-manch-magazine.html`. Where this document and the prototype disagree, tell the owner, then fix whichever is wrong.

## 1. Brand and design principles

Udyam Manch is a modern business publication about Indian startups and founders. It has two linked ideas: an editorial front page and a personal pinboard (My board).

- **Editorial first.** Strong headlines, clear hierarchy and generous reading space. It must feel like a real publication, not a SaaS dashboard.
- **Pinboard personality.** Notes, pins and slight tilts give the site character. Use them as accents on the home page and My board, not on reading pages.
- **Honest content.** Sample content is always labelled. Never present placeholder facts as real.
- **Calm motion.** Motion explains something or adds delight once. It never blocks reading.
- **Works everywhere.** Every page works in light and dark, on a phone and on a large screen, with a keyboard, and with reduced motion switched on.

Brand colours come from the logo: sky `#75D3F5`, blue `#5299D3`, indigo `#5455A5`.

## 2. Design tokens

Colours must be used through tokens (CSS variables). A component must never hard code a hex value that exists as a token.

### 2.1 Core colour tokens

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--bg` | Page background | `#f1f3fa` | `#0e0d1f` |
| `--ink` | Main text, strong borders, primary buttons | `#13122b` | `#eceaff` |
| `--mute` | Secondary text, captions, metadata | `#5d5c78` | `#a09fc0` |
| `--line` | Hairlines and quiet borders | `#d6d9ea` | `#28274a` |
| `--card` | Surfaces such as inputs and the theme button | `#ffffff` | `#16152e` |
| `--acc` | Accent: category labels, links on hover, selected chips | `#5252a6` | `#9c9bf2` |
| `--acc2` | Highlight accent: focus ring, progress bar, big numbers | `#4fb8ee` | `#5fc3f5` |
| `--soft` | Soft panels such as the newsletter band and notes | `#e3e6f6` | `#1d1c3c` |

Rules:

- Default theme follows the visitor's system setting. A manual toggle overrides it and the choice is remembered.
- Both selectors must always be defined together: `:root[data-theme="dark"]` and the system media query `@media(prefers-color-scheme:dark)` with `:root:not([data-theme="light"])`. Missing one breaks half the visitors.
- Text on `--bg` uses `--ink` or `--mute`. Never use `--acc2` for body text, because it is a highlight colour and is not safe for small text in light mode.
- Accent buttons use `--acc` with white text. The primary button is the inverted pair: `--ink` background with `--bg` text.

### 2.2 Pinboard tokens (home hero and My board only)

These are scoped to the pinboard area so they do not leak into reading pages.

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `--board` | Board surface | `#E9ECF6` | `#0C0D22` |
| `--dot` | Dotted grid and dashed outlines | `#C9CEE3` | `#23264D` |
| `--paper` | Note and card paper | `#FFFFFF` | `#171A3A` |
| `--soft` (scoped) | Secondary text on the board | `#5A5F85` | `#9AA0CC` |
| `--hl` | Headline highlight under the word "pins" | `#FFE36E` | `#3B3F9E` |
| `--mbt` and `--mbx` | Topic note fill and its text | `#FFE36E` and `#2a2400` | `#3B3F9E` and `#FFFFFF` |
| `--indigo`, `--blue`, `--sky` | Brand colours for pins and note edges | `#5455A5`, `#5299D3`, `#75D3F5` | same |

Pin head colours: pink `#E0457B`, indigo, blue and sky. A pin head is a small radial gradient circle with a white highlight and a soft shadow.

### 2.5 Founder journey tones (reading pages)

Steps, impact pillars and company features use a tone instead of a colour. Content picks the tone; tokens decide the colour in each theme. Defined in `src/styles/tokens.css`.

| Tone | `-line` (edge) light | `-soft` (fill) light | `-ink` (icon) light | Dark |
| --- | --- | --- | --- | --- |
| gold | `#f2aa1f` | `#fef3c7` | `#b45309` | soft `#3a2e14`, ink `#f6c25b` |
| green | `#38a169` | `#dcfce7` | `#15803d` | line `#48bb78`, soft `#16301f`, ink `#7ee2a8` |
| teal | `#2f855a` | `#e6fffa` | `#0d9488` | line `#38b2ac`, soft `#11302e`, ink `#5eead4` |
| indigo | `--acc` | `--soft` | `--acc` | follows core tokens |

`--mark` is the headline highlight: `#FFE58F` light. In dark mode it uses `--hl` (`#3B3F9E`), the same blue as the home page headline, so highlights match across the site. These values come from the Kishan prototype (`kishanStoryHtml`).

### 2.3 Typography

| Role | Font | Notes |
| --- | --- | --- |
| Headings, UI, labels, buttons, nav | Bricolage Grotesque, weights 500, 700, 800 | Fallback: Helvetica Neue, Arial, sans-serif |
| Body copy and quotes | Newsreader, 400 and italic 400 | Fallback: Georgia, serif |

Both load from Google Fonts. Every font stack must include a real fallback.

| Style | Size and weight | Line height | Where |
| --- | --- | --- | --- |
| Display h1 (hero, article) | `clamp(38px, 5.2vw to 6vw, 72 to 76px)`, 800 | 1.05 | Lead story, article title |
| Page title h1 | `clamp(40px, 6vw, 80px)`, 800 | 1.05 | Directory and listing pages |
| Section h2 | `clamp(28px, 3.4vw, 42px)`, 800 | 1.05 | Section headings |
| Card h3 | 21 to 26px, 700 | 1.05 | Cards, feed rows |
| Body | 18px (17px at 900px and below), 400 | 1.6 | Default text |
| Article body | 20.5px (19px at 900px and below), 400 | 1.75 | Reading pages, max width 680px |
| Deck or summary | 21px, mute colour | 1.45 | Under headlines |
| Meta | 13.5px, 500, mute | 1.4 | Dates, read time, sample labels |
| Category label | 13.5px, 700, accent | n/a | Above headlines |
| Button | 15px, 700 | n/a | Buttons |
| Nav, chip | 15px / 14px, 600 | n/a | Navigation, filters |

Rules:

- Headings use negative letter spacing around `-.025em`. Do not apply this to body text.
- Headings are sentence case. Never use all capitals, except tiny labels such as the walkthrough step label.
- Article pages open with a drop cap on the first paragraph. Do not add it elsewhere.
- Pull quotes use italic Newsreader, 34px on desktop and 27px on mobile.

### 2.4 Spacing, radius, elevation, layers

**Spacing (inferred):** use multiples of 4 pixels. Common values: 8, 12, 16, 24, 32, 48, 64. Section vertical rhythm is 56 to 70px on desktop and about 40px on mobile.

**Radius:** the signature is asymmetric. One large corner and three small ones.

| Use | Radius |
| --- | --- |
| Lead image | `4px 4px 90px 4px` |
| Side thumbnail | `50% 4px 4px 4px` |
| Pull quote block | `4px 60px 4px 4px` |
| Newsletter band | `4px 4px 4px 90px` |
| Wide figure | `4px 4px 4px 80px` |
| Buttons, chips, theme toggle | `999px` (pill) |
| Inputs | `10px` |
| Pinboard notes | `3px` |
| Floating cards (Instagram, walkthrough) | `18 to 22px` |

Vary the large corner position between neighbouring blocks. Do not put the same shape on every image.

**Elevation:** reading pages are flat. Use hairline borders, not shadows. Shadows are for floating or pinned things only.

- Pinboard note, light: `0 1px 0 #fff inset, 0 10px 24px -12px rgba(20,22,58,.35)`
- Pinboard note, dark: `0 10px 28px -12px #000`
- Floating cards: `0 24px 50px -16px` with a dark transparent colour

**Layers (z-index):** tools bar 5, header 20, progress bar 30, photo preview 60, Instagram widget 80, toast 90, walkthrough 95, page curtain 100. Do not invent new values between these. Ask first.

## 3. Layout and responsive rules

### 3.1 Containers

| Container | Max width | Side padding |
| --- | --- | --- |
| Page (`.w`) | 1240px | 24px |
| Article header | 900px | 24px |
| Article figure and related stories | 1100px | 24px |
| Article body | 680px | 24px |

The header is sticky at 68px height with a blurred background. It hides when scrolling down and returns when scrolling up.

### 3.2 Breakpoints

| Name | Width | What changes |
| --- | --- | --- |
| Desktop | above 900px | Full navigation, two and three column layouts |
| Tablet and mobile | 900px and below | Navigation hides, grids become one column, text sizes step down, pull quotes lose their negative margin |
| Mobile | 700px and below | Pinboard becomes two column masonry, My board stacks, dragging is off |
| Small mobile | 560px and below | Smallest tweaks only, for example single column pinboard notes where a rule asks for it |

Build mobile first. Anything that works only with a mouse (hover previews, tilt, magnetic buttons) must be skipped on touch devices with `@media(hover:none)` or `hover:hover` checks.

### 3.3 Layout patterns by page type

| Page | Desktop | Mobile |
| --- | --- | --- |
| Home | Pinboard hero full width, ticker, trending row of 4, two column latest and quote, directory preview, newsletter | Hero and pinboard in two column masonry, other sections single column |
| Listing (Founders, Stories) | Featured slot, then a list with sticky filter bar | Single column list, filter chips wrap |
| Article or founder journey | Centred 680px body, wide cover, pull quotes break out slightly | Full width body with 24px padding, pull quotes stay inside |
| Directory | Row list: name, description, industry, year. Sticky search and filters | Two column rows, description under the name |
| Company profile | Two columns: story left, facts list right | Single column, facts first |

Avoid repeating identical card grids on every page. Give each page a structure that suits its content.

## 4. Global behaviour rules

### 4.1 Light and dark mode

- Every new component must be checked in both themes before it ships.
- Images that carry text or have transparent backgrounds need a theme aware version. The logo has two files, one dark for light mode and one white for dark mode, and only one shows at a time. Make sure the hiding rule is stronger than any general image display rule.
- Never rely on colour alone to show state. Add an icon, text or shape change.
- Dark mode is not inverted light mode. Use the dark tokens above, keep photos unfiltered and avoid pure white text blocks on pure black.

### 4.2 Accessibility

- Focus ring: `3px solid var(--acc2)` with a 2px offset on every interactive element. Never remove it.
- Touch targets should be at least 40 by 40 pixels. Small visual targets such as pins get a larger invisible hit area.
- Every image needs alt text. Decorative images use an empty alt.
- Every drag interaction needs a keyboard alternative, and every hover only action needs a touch or keyboard equivalent.
- Messages that appear after an action (toasts) use `role="status"`.
- Dialogs and overlays (Instagram window, walkthrough) can be closed with Escape.
- Aim for WCAG 2.2 AA contrast. Contrast has not been audited yet. Check pairs such as `--mute` on `--bg` and white on `--acc` before launch.

### 4.3 Motion

| Pattern | Duration and easing |
| --- | --- |
| Page enter | 0.55s, `cubic-bezier(.2,.7,.2,1)`, fade and 12px rise |
| Headline word reveal | 0.85s per word, stagger 0.055s, `cubic-bezier(.2,.8,.2,1)` |
| Image wipe on lead and wide figures | 1.1s, `cubic-bezier(.7,0,.2,1)`, `clip-path` |
| Scroll reveal (`.rv`) | 0.8s, fade and 22px rise, once only |
| Row hover | padding left 12px, 0.3s |
| Button hover | lift 2px, 0.25s |
| Pinboard notes drop in | 0.7s, `cubic-bezier(.2,1.3,.4,1)`, stagger 70ms, once on load |
| Page curtain on navigation | 380ms in, 480ms out, `cubic-bezier(.7,0,.2,1)` |
| Instagram slide | 0.75s, `cubic-bezier(.6,0,.2,1)` |
| Walkthrough spotlight | 0.45s, `cubic-bezier(.3,.9,.3,1)` |

Rules:

- Animate `transform` and `opacity` where possible.
- One orchestrated moment per page load beats many small ones.
- With `prefers-reduced-motion: reduce`, all animation and transition is removed and all content is fully visible. Never hide content behind an animation that may not run.
- Use Web Animations or CSS only. Do not add heavy animation libraries without approval.

### 4.4 Copy and voice

- Plain, conversational, confident. Write for readers who are founders, students and business people in India.
- **Never use em dashes** in any copy. Use commas, full stops or colons.
- Avoid hyphen heavy and templated phrasing.
- Use sentence case for headings and buttons.
- Label placeholders clearly with the word "Sample". Never invent real facts about real people or companies.
- Dates look like `17 Oct 2026`. Money uses the rupee sign with lakh and crore, for example `₹2.5 crore`.
- State gaps honestly. If something is not done or not verified, say so.

## 5. Components

For each component: purpose, anatomy, light and dark behaviour, mobile behaviour, and rules.

### 5.1 Header and navigation

- Logo on the left, navigation on the right: Stories, Founders, Directory, Get featured, About, My board with a pin icon and count badge, theme toggle, Subscribe button.
- Height 68px, bottom hairline, background is `--bg` at 90% with blur.
- Active link shows a 2px accent underline. Hover does the same.
- **Mobile:** navigation links hide at 900px and below. A round pin button with a count badge sits next to the theme toggle so My board stays reachable.
- The count badge uses `--ink` background and `--bg` text, and bumps once when the number changes.

### 5.2 Buttons

| Variant | Style |
| --- | --- |
| Primary | Pill, `--ink` background, `--bg` text, 15px 700, padding 12px 22px |
| Alternate | Pill, transparent, 1.5px `--ink` border and text |
| Accent (walkthrough Next) | Pill, `--acc` background, white text |

Hover lifts 2px, pressed returns. One primary button per section.

### 5.3 Chips and filters

- Pill, 14px 600, 1.5px `--line` border, `--card` background.
- Selected chip: `--acc` background and border, white text, and `aria-pressed="true"`.
- On the pinboard the filter chips use an `--ink` outline and fill with `--ink` when selected.
- Chips wrap on small screens. Never scroll a chip row sideways without a visible cue.

### 5.4 Inputs

- 16px Bricolage, 10px radius, 1.5px `--line` border, `--card` background. Minimum 16px font size to avoid zoom on iOS.
- Always pair an input with a visible or screen reader label.

### 5.5 Editorial cards and rows

- **Lead block:** large image with the signature corner, category label, display headline, deck, meta.
- **Side story:** text left, square image right with a circular top left corner.
- **Trending strip:** four items, large accent numbers, hairline dividers. Two columns on mobile.
- **Feed row:** small thumbnail, 21px headline, hairline between rows, row shifts right on hover.
- **Directory row:** company name, description, industry, year. Two columns on mobile with the description below.
- Hover colours the headline with `--acc`. Cards are links. The whole card is the tap target.

### 5.6 Quote block and newsletter band

- Quote block: `--ink` background, `--bg` text, italic Newsreader 28px, large top right corner.
- Newsletter band: `--soft` background, large bottom left corner, form with a flexible input and a primary button.
- Success and error messages appear inline under the form.

### 5.7 Article template

- Category label, display headline, deck, byline row with date and read time, share bar.
- Wide cover with the wipe animation, then a 680px body with drop cap, sub headings, pull quotes and a muted note box.
- Related stories in a three column grid on desktop, single column on mobile.
- Founder Journey pages add a facts list (company, industry, city, founded, website) taken from the company record. On mobile the facts come first.
- Reading pages stay flat and calm. Do not add pinboard tilts or decorative pins here.

### 5.8 Facts list and steps

- Facts: a definition list with a 2px `--ink` top rule and hairline rows. Label left in mute, value right in bold.
- Steps: numbered list with 30px accent numerals in a 54px column and hairlines between steps.

### 5.9 Footer

- Hairline top border, mute text 14.5px, logo in the theme correct version, flexible wrap of links and the photo credit line.

## 6. Pinboard hero

The home hero is a full width dotted board that carries the headline, a photo strip, filter chips and pinned notes.

**Structure**

1. Headline with a highlighted word, and a short intro paragraph.
2. A scrolling photo strip, full bleed, paused on hover.
3. Tabs: Editors' board and My board.
4. Filter chips (Everything, Stories, Founders, Startups).
5. A grid of pinned notes.

**Rules**

- The board surface is full width and breaks out of the page container. Inner content aligns to the 1240px container.
- Each note is a paper card with a pin head at the top centre, a slight rotation between minus 2 and plus 2 degrees, and a note shadow. On hover it straightens, lifts and tilts toward the cursor (desktop only).
- Note types: lead story, quote, startup profile, interview, editor's note (yellow), case study with a big number, newsletter box, founder journey.
- On the editors' board, each pin head is a button that pins the card to My board. Pinned pins press in and darken. The button label and tooltip say "Pin to My board" or "Pinned. Click to unpin".
- Editor's notes and newsletter boxes are not pinnable.
- **Mobile (700px and below):** the grid becomes two column masonry with uneven photo heights. The lead story spans both columns. Headings step down to 19px.
- Filters hide non matching notes with no layout jump.

## 7. My board

My board is the visitor's personal pinboard. It needs no account and is saved in the browser.

- Visitors pin topics (categories, industries, cities) or individual stories and companies. Topic notes show a count and a few headlines, each with a small plus to pin that item.
- Desktop: notes are absolutely positioned and can be dragged anywhere. Position is stored as fractions of the board size so it works at any width.
- Keyboard: arrow keys move a focused note, Delete removes it. Pulling the pin removes it.
- Mobile: notes sit in two column masonry, with half the tilt, and dragging is off.
- Share my board: builds a link containing the board and shows it in a text field. It copies the link, or opens the native share sheet on phones. A shared board opens read only with buttons "Add all to my board" and "Back to my own board".
- Empty state: a dashed outline board with the message "Your board is empty. Pin a topic above to start."
- The nav link shows a count badge and takes the visitor to the board.

**Data rules**

- Pin keys must be stable identifiers. In the prototype they look like `s:ID`, `c:ID` and `t:cat:Name`. After the move to a CMS they must use slugs, so that renaming a story does not break pins.
- Items that become unpublished are removed from the board quietly.
- Storage key: `um-board-v1`. Change the version suffix if the stored shape changes.
- Shared links must validate every item against known content. Never insert unchecked text into the page.

## 8. Overlays and floating elements

### 8.1 Toast

- A dark pill at the bottom centre. Short message, optional underlined action such as "View my board". Hides after about 5 seconds.
- Not shown while the walkthrough runs.

### 8.2 Walkthrough (My board tour)

- Starts once for a new visitor on the home page, after about two seconds, unless they have scrolled. Intro card with "Show me" and "Maybe later".
- Three steps: pin a card, open My board from the header, this is your board. The page dims to neutral grey, the target is cut out with a white outline and a pulse, a white arrow bounces toward it, and a card explains the step.
- The highlighted element is really clickable during the tour. Next, Back, Skip, arrow keys and Escape all work.
- Saved as seen in the browser. The storage key carries a version, for example `um-tour-v2`. Raise the version to show it again to everyone.
- Replay: a Quick tour button on the My board tab.
- Mobile: the header target is the round pin button. The card is at least 32px from the screen edges.

### 8.3 Instagram window

- Slides in from the right after the first scroll, in the hero area only. A close button shrinks it into a round Instagram bubble at the bottom corner.
- The whole card links to the Instagram profile and opens in a new tab. Arrows, dots and swiping change the photo. It auto advances every 3.5 seconds and pauses on hover.
- After it is closed, it stays a bubble for the rest of the visit. The session key is `um-ig`.
- It waits while the walkthrough is open.
- Sample posts are labelled "Sample post" until real posts exist.
- On phones the card sits above the bottom bubble position instead of vertically centred.

### 8.4 Page curtain and progress bar

- Internal link clicks play a short coloured curtain sweep, then the new page appears. It is skipped for reduced motion and for new tab or modified clicks.
- The reading progress bar is 3px high in `--acc2` at the very top of article pages.

### 8.5 Photo strip and hover previews

- The strip scrolls slowly, with a fade at both ends, and pauses on hover.
- Directory rows show a small floating photo next to the cursor on devices with a mouse only.

## 9. Imagery

- Photos come from Unsplash for now, with the photographer credited in the footer. Replace with owned or licensed photos when available.
- Every image has a gradient or colour fallback behind it, because images can fail or be blocked. The layout must still look intentional without the photo.
- Aspect ratios: lead 16:11, article cover 21:9, related stories 3:2, side thumbnail 1:1, share image 1200 by 630.
- Photos on hover zoom slowly by about 6 percent. Do not zoom photos inside reading pages.
- Use sharp, honest, documentary style images of work, people and places. Avoid generic stock handshakes.

## 10. Content structure rules for new pages

- Every page has one h1, ordered headings and landmarks (header, main, footer).
- Every story or founder journey has a headline, summary, cover with alt text, category, author, date, body, related items and a share bar.
- Share links must be public, permanent and readable, with a preview card. See the Content Platform PRD for details.
- Listings must handle many items: pagination or load more, filters, and empty states with a clear message.
- Sample data is marked "Sample" in the interface until real content replaces it.

## 11. Naming and code conventions

- Tokens are CSS variables named as in section 2. New tokens need approval.
- Class prefixes keep components from clashing: `pb` for editors' pinboard, `mb` for My board, `ig` for the Instagram window, `t` for walkthrough parts. `fj` for founder journey parts (`src/styles/journey.css`). A new component picks a short unique prefix and documents it here.
- Script state uses clearly versioned storage keys: `um-board-v1`, `um-tour-v2`, `um-ig` (session). Add new keys to this list.
- When the site moves to Next.js or Astro, tokens should become a single theme file, and components should accept props rather than copying markup.
- Never use inline hex colours that already exist as tokens. Never use `!important` except to override inline styles that cannot be removed.
- No new heavy dependencies without approval. Prefer native browser features.

## 12. Do and do not

| Do | Do not |
| --- | --- |
| Use tokens and check both themes | Hard code colours or only test light mode |
| Mix asymmetric corners deliberately | Put the same rounded rectangle on everything |
| Keep reading pages flat and calm | Add pins, tilts and shadows to article text |
| Provide fallbacks for images and fonts | Depend on a photo loading to make the layout work |
| Label sample content | Present invented facts as real |
| Offer keyboard and touch alternatives | Hide an action behind hover or drag only |
| Respect reduced motion | Leave content invisible until an animation runs |
| Write natural, sentence case copy | Use em dashes, all caps headings or templated phrasing |

## 13. Page delivery checklist

Before handing over any new page or component, confirm each item:

1. Uses only tokens for colour, type and spacing, and works in light and dark mode.
2. Looks right at 1440px, 900px, 700px and 390px wide, with no sideways scrolling.
3. All interactive parts work with a keyboard and show a visible focus ring.
4. Touch targets are large enough and nothing depends on hover.
5. Reduced motion shows all content with no animation.
6. Images have alt text, fallbacks and the right aspect ratios.
7. Copy follows section 4.4, with no em dashes and clear Sample labels.
8. Storage keys, class prefixes and z-index values follow sections 7, 11 and 2.4.
9. Headings are ordered, landmarks exist, and the title and description are set for sharing.
10. Contrast of any new colour pair has been checked.

## 14. Known gaps and items to confirm

- Colour contrast has not been formally audited for every pair.
- The spacing scale is inferred from the prototype and not yet formal.
- The prototype is one HTML file. Component rules here should be rebuilt as reusable components when the site moves to a framework.
- The pinboard layer defines some colours locally. When the framework migration happens, merge them into one token file.
- Photos and the Instagram posts are placeholders. Real assets and credits are still needed.
- Pin keys use sample IDs until the CMS provides slugs.
- Large screen behaviour beyond 1440px and tablet specific layouts between 701 and 900 pixels have had little testing.
