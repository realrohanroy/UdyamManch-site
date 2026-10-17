# Phase 2: Reading Templates & Social Previews Plan

## Objective
Build the reading templates for Founder Journeys and Stories with server-rendered preview cards, social share bar, and SEO metadata.

---

## 1. Requirements Mapped
- `REQ-TMP-01` to `REQ-TMP-12`: Reading page templates, typography, layout variants, reading time calculation, facts panel, share bar.
- `REQ-SEO-01` to `REQ-SEO-07`: Permanent URLs, 301 redirects, server-rendered OG/Twitter tags, 1200x630 cards, schema.org JSON-LD.
- `REQ-NFR-01` to `REQ-NFR-03`: Mobile-first responsive design, fast LCP, WCAG 2.2 AA accessibility.

---

## 2. Technical Approach
- **Dynamic Routes**:
  - `/founders/[slug]`: Server component rendering Founder Journey with Facts Panel.
  - `/stories/[slug]`: Server component rendering Story template.
- **Server-Rendered Previews**:
  - Implement Next.js `generateMetadata()` for dynamic Open Graph and Twitter Card tags.
  - Edge OG Image Generation (`@vercel/og` or Satori) creating 1200x630 branded cards when cover image is absent or custom-rendered.
- **Typography & Styling**:
  - Display: *Bricolage Grotesque*
  - Body: *Newsreader* with optimal line height (1.6-1.7), balanced whitespace, drop caps / pull quotes.
- **Social Share Component**:
  - Native share API integration (`navigator.share`) for mobile.
  - Direct fallback web intents: WhatsApp (`https://wa.me/?text=...`), LinkedIn (`https://www.linkedin.com/sharing/share-offsite/?url=...`), X (`https://twitter.com/intent/tweet?url=...`), Facebook.
  - Clipboard API with accessible toast confirmation.
  - Append tracking params: `?utm_source={channel}&utm_medium=share_bar`.

---

## 3. Step-by-Step Execution Plan
1. Scaffold `/founders/[slug]` and `/stories/[slug]` with mock and CMS data fetching.
2. Implement rich text block renderer with typography styles and pull quote / fact box components.
3. Build Company Facts Panel component for Founder Journeys.
4. Implement layout switcher for full-width vs side-by-side hero cover.
5. Implement server metadata generation with dynamic Open Graph tags.
6. Build and test social share bar on mobile and desktop widths.
7. Implement slug redirect middleware (301 status) for slug renames.

---

## 4. Verification & Exit Criteria
- [ ] Pasting a test URL into WhatsApp, LinkedIn, and X displays the correct 1200x630 card, title, and summary.
- [ ] Draft/unpublished slugs return 404 to non-authenticated visitors.
- [ ] Reading time calculates accurately based on body words.
- [ ] Dark and light modes render cleanly with sufficient contrast.
