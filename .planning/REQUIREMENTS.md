# Requirements Traceability Matrix: Udyam Manch

This catalog itemizes all functional, non-functional, editorial, and delivery requirements derived from `PRD.md`. Every development task, component, and PR must verify against these Requirement IDs.

---

## 1. Functional Requirements (Public Website)

### Founders Section
- **[REQ-PUB-01]** Dedicated listing page (`/founders`) displaying all Founder Journeys sorted by newest first.
- **[REQ-PUB-02]** Prominent Hero / Featured Founder slot at the top of the founders listing.
- **[REQ-PUB-03]** Multi-faceted real-time filters: Filter by Industry, City/Hub, and Year Founded.
- **[REQ-PUB-04]** Real-time search across Founder Names and Company Names.
- **[REQ-PUB-05]** Scalable pagination or "Load More" mechanism capable of smoothly rendering hundreds of entries without degrading performance.
- **[REQ-PUB-06]** Mobile pinboard 2-column responsive layout preserved from prototype.

### Stories Section
- **[REQ-PUB-07]** Dedicated listing page (`/stories`) featuring editorial pieces, interviews, and deep-dives.
- **[REQ-PUB-08]** Category tabs and tag filter chips with smooth client/server state sync.
- **[REQ-PUB-09]** Featured story showcase slot + chronological "Latest Stories" feed.
- **[REQ-PUB-10]** Dedicated Category listing route (`/stories/category/[slug]`).

### Directory & Company Pages
- **[REQ-PUB-11]** Directory listing page (`/directory`) with industry and city filters.
- **[REQ-PUB-12]** Company profile page (`/directory/[slug]`) showing company facts, description, logo, and list of linked founder journeys and stories.
- **[REQ-PUB-13]** Static informational pages: `/get-featured`, `/about`, `/contact`.

### Home Page & Discovery
- **[REQ-PUB-14]** Dynamic Home Page (`/`) pulling live featured articles, founder spotlights, and latest stories directly from the CMS (replacing static mock data).
- **[REQ-PUB-15]** Seamless transition from Hero into editorial pinboard layout.

### "My Board" (Personal Pinboard)
- **[REQ-PUB-16]** Pinning mechanism relies on stable entity identifiers (canonical slugs) instead of volatile mock IDs.
- **[REQ-PUB-17]** Pin states persist across renames and headline updates.
- **[REQ-PUB-18]** Graceful unpin: If a pinned story is unpublished, it automatically and silently disappears from "My Board" without throwing errors or breaking state.
- **[REQ-PUB-19]** Header pin counter badge updates dynamically with real-time reactive counts.
- **[REQ-PUB-20]** Shareable board link generation and local browser persistence.

---

## 2. Functional Requirements (Reading Page Template)

### Editorial Display & Layout
- **[REQ-TMP-01]** Unified, magazine-grade reading template for Founder Journeys (`/founders/[slug]`) and Stories (`/stories/[slug]`).
- **[REQ-TMP-02]** Strict layout lock: Authors fill structured fields; no custom ad-hoc page styling allowed.
- **[REQ-TMP-03]** Headline (up to 90 characters recommended), Dek/Summary (1-2 sentences), Author credits, Published Date, and Category/Tag badges.
- **[REQ-TMP-04]** Automated reading time calculation based on body content word count.
- **[REQ-TMP-05]** Rich text renderer supporting paragraphs, subheadings (H2, H3), blockquotes/pull quotes, ordered/unordered lists, bold/italic, hyperlink styling, inline images with captions/credits, and callout fact boxes.
- **[REQ-TMP-06]** Layout variant switcher: Support for full-width cover vs side-by-side cover layouts.
- **[REQ-TMP-07]** Founder Journey Facts Panel: Automatically pulled from linked Company entity (Industry, City, Founded Year, Website).
- **[REQ-TMP-08]** Contextual footer: Related stories, Next Story preview card, and direct link to Company directory profile.

### Social Sharing & Previews
- **[REQ-TMP-09]** Sticky / inline Share Bar at top and bottom of every article.
- **[REQ-TMP-10]** 1-click share actions for WhatsApp, LinkedIn, X (Twitter), Facebook, and Native Mobile Share Sheet (`navigator.share`).
- **[REQ-TMP-11]** "Copy Link" action with clear, animated feedback toast ("Link copied!").
- **[REQ-TMP-12]** Campaign tracking query parameters attached automatically to share URLs (`?utm_source=whatsapp&utm_medium=share_bar`).

---

## 3. SEO & Open Graph Preview Requirements

- **[REQ-SEO-01]** Permanent, human-readable URLs with automatic slug generation from headline.
- **[REQ-SEO-02]** 301 Redirect engine handling slug updates to preserve inbound traffic.
- **[REQ-SEO-03]** Server-rendered Open Graph meta tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`, `og:type` (`article`).
- **[REQ-SEO-04]** Twitter Card meta tags: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.
- **[REQ-SEO-05]** Share Image Specification: 1200 x 630 px. Automated cropping/resizing of uploaded covers or programmatic fallback to branded headline card.
- **[REQ-SEO-06]** Canonical link tags (`rel="canonical"`) on every page to prevent duplicate content indexing.
- **[REQ-SEO-07]** Structured Article Data (`schema.org/NewsArticle` or `schema.org/BlogPosting`) JSON-LD embedded on every reading page.
- **[REQ-SEO-08]** Automated `sitemap.xml` and `robots.txt` generation containing all published routes.
- **[REQ-SEO-09]** 404 Not Found handling for draft, scheduled, or unpublished slugs when accessed by unauthenticated readers.

---

## 4. Admin Dashboard & Content Operations

- **[REQ-ADM-01]** Secure authentication with role-based access control (RBAC):
  - `Writer`: Create, edit own drafts, upload images, submit for review.
  - `Editor`: Edit any entry, manage categories/tags, approve, schedule, publish, unpublish.
  - `Admin`: Full access, user account management, site settings.
- **[REQ-ADM-02]** Content management data tables with status pills (`Draft`, `In Review`, `Scheduled`, `Published`, `Unpublished`), author, date, and search filters.
- **[REQ-ADM-03]** Form-based editor with real-time autosave to prevent data loss.
- **[REQ-ADM-04]** Pre-publish validation checks (e.g. Missing cover image, missing alt text, missing dek, invalid slug).
- **[REQ-ADM-05]** Drag-and-drop media upload with automatic WebP/AVIF compression, thumbnail generation, and alt-text enforcement.
- **[REQ-ADM-06]** Live Share Card Preview simulator: Real-time preview of how the post will render on WhatsApp, LinkedIn, and X before publishing.
- **[REQ-ADM-07]** Responsive Layout Preview: One-click toggle between desktop and mobile viewport previews before publishing.
- **[REQ-ADM-08]** Scheduling engine: Select future date and time for automated publishing.
- **[REQ-ADM-09]** Centralized Media Library with search, reuse, and copyright credit metadata.
- **[REQ-ADM-10]** Version history & revision rollback capability.
- **[REQ-ADM-11]** Entity management screens for Founders, Companies, Categories, and Tags.
- **[REQ-ADM-12]** Non-technical onboarding target: New team member can publish a 3-photo story in under 15 minutes without technical assistance.

---

## 5. Non-Functional Requirements (Architecture, Security & UX)

- **[REQ-NFR-01] Performance**: Pre-rendered (SSG/ISR) or edge-cached HTML. < 2.0s Largest Contentful Paint (LCP) on mobile 4G. Core Web Vitals all green.
- **[REQ-NFR-02] Accessibility (a11y)**: WCAG 2.2 Level AA compliance across all public pages. High-contrast typography in light and dark modes, fully navigable via keyboard, aria attributes on interactive elements.
- **[REQ-NFR-03] Mobile First**: Flawless experience on narrow screens (360px - 430px wide). Sticky share bars, readable serif body text, touch-friendly pin actions.
- **[REQ-NFR-04] Security**: Zero public write endpoints. Admin authentication with session invalidation, secure HTTP-only cookies, strict upload mime-type and size validation (max 10MB per image).
- **[REQ-NFR-05] Resilience & Decoupling**: If the CMS/admin dashboard is down or undergoing maintenance, the public reading site remains 100% operational via cached edge builds.
- **[REQ-NFR-06] Scale**: Architecture comfortably handles 5,000+ published stories, 500,000+ monthly page views, and concurrent editorial sessions.
