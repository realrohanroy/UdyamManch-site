# Rule: Architectural Constraints & Non-Goals

This document defines the strict, non-negotiable boundaries for Udyam Manch. Any proposed code change or architecture pattern that violates these rules must be rejected immediately.

---

## 1. Scope Boundaries & Explicit Non-Goals (PRD Section 2)

### 1.1 Reader Accounts
- **Constraint**: **NO user login or registration for general readers.**
- **Rationale**: Readers access content frictionlessly. Board bookmarks ("My Board") are stored locally via `localStorage` and shared via URL tokens.
- **Enforcement**: Never introduce authentication middleware, user tables, or login modals on public routes (`/`, `/founders/*`, `/stories/*`, `/directory/*`).

### 1.2 Public Content Submission
- **Constraint**: **NO public-facing forms or API endpoints that write or publish content.**
- **Rationale**: Company submissions continue through an external Google Form. All site content is manually reviewed, curated, and published by the internal editorial team.
- **Enforcement**: Reject any PR or code adding public `POST /api/stories` or self-serve company onboarding.

### 1.3 Draft Sharing & Privacy
- **Constraint**: **NO public or secret URL access to unpublished drafts.**
- **Rationale**: Founder consent, rights verification, and fact checking occur before publication. Drafts must only be previewable within the authenticated admin dashboard.
- **Enforcement**: Unauthenticated requests to draft or scheduled slugs MUST return a standard `404 Not Found`.

### 1.4 Comments, Paywalls, and Subscriptions
- **Constraint**: **NO paywalls, gated content, reader comments, or newsletter database automation in Version 1.**
- **Rationale**: Keep the platform lightweight, editorial-first, and high performance.

---

## 2. Technical & Routing Constraints

### 2.1 No Hash Routing for Content
- **Constraint**: **Zero usage of hash-based URLs (`#/story/1`, `#/founder/2`) for content pages.**
- **Rationale**: Web crawlers and social scrapers (WhatsApp, LinkedIn, X, Facebook, Googlebot) do not evaluate hash fragments.
- **Enforcement**: All content MUST reside on permanent paths:
  - `/founders/[slug]`
  - `/stories/[slug]`
  - `/directory/[slug]`
  - `/stories/category/[slug]`

### 2.2 Server-Rendered Social Meta Tags
- **Constraint**: **Open Graph and Twitter Card meta tags MUST be generated on the server or pre-rendered into HTML.**
- **Rationale**: WhatsApp and LinkedIn scrapers do NOT run client JavaScript. If meta tags are injected via `useEffect()` or client-side DOM manipulation, preview cards will fail completely.
- **Enforcement**: Always use server component metadata generation (e.g. Next.js `generateMetadata` or static HTML pre-generation).

### 2.3 Slug Immutability & Mandatory 301 Redirects
- **Constraint**: If an article's slug is updated after initial publication, an automatic `301 Permanent Redirect` from the old slug to the new slug MUST be registered.
- **Rationale**: External links shared on WhatsApp, LinkedIn, or indexed by Google must never result in broken 404 links.

### 2.4 "My Board" Resilience & Silent Cleanup
- **Constraint**: Pinned items MUST be identified by their canonical entity slug, NEVER by numerical array index.
- **Constraint**: If an item pinned by a reader is later unpublished or deleted by an editor, the pinboard state MUST silently filter it out on load without throwing errors or displaying empty card shells.

---

## 3. Performance & Accessibility Hard Limits

- **Image Dimensions for Previews**: Social cards MUST be precisely `1200 x 630` pixels with a 1.91:1 aspect ratio.
- **Mobile First**: All layouts must be responsive and tested down to 360px viewport width.
- **Accessibility Standard**: WCAG 2.2 Level AA. Minimum 4.5:1 text contrast ratio in both Light and Dark themes. Mandatory `alt` text on all media.
