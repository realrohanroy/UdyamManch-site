# Phase 1: Foundation & Infrastructure Plan

## Objective
Establish the core architectural foundation, data modeling, authentication, and media storage pipelines according to Section 7 & 12 of the PRD.

---

## 1. Requirements Mapped
- `REQ-ADM-01`: Authentication and Role-based access control (Writer, Editor, Admin).
- `REQ-ADM-05`: Drag-and-drop media upload with image compression and optimization.
- `REQ-ADM-11`: Management screens for Founders, Companies, Categories, Tags.
- `REQ-NFR-04`: Security rules (No public write, strict auth sessions, image sanitization).
- `REQ-NFR-05`: Decoupled architecture so public site stays operational if dashboard is offline.

---

## 2. Technical Decisions
- **Framework**: Next.js (App Router, React Server Components) for hybrid static generation and server-side Open Graph generation.
- **Content Backend**: Headless CMS architecture.
  - Option A: Sanity Studio embedded or cloud hosted.
  - Option B: Payload CMS (Node/Next.js native, TypeScript-first, self-hosted, SQLite/PostgreSQL).
- **Data Schemas**:
  - `founderJourney`: fields: `title`, `slug`, `dek`, `coverImage`, `body`, `factsPanel` (company, city, industry, foundedYear, website), `author`, `founder`, `company`, `category`, `tags`, `layoutVariant`, `featured`, `status`, `publishedAt`, `scheduledAt`, `seo`.
  - `story`: fields: `title`, `slug`, `dek`, `coverImage`, `body`, `author`, `founders`, `companies`, `category`, `tags`, `layoutVariant`, `featured`, `status`, `publishedAt`, `scheduledAt`, `seo`.
  - `founder`: fields: `name`, `slug`, `photo`, `bio`, `company`, `socialLinks`.
  - `company`: fields: `name`, `slug`, `logo`, `industry`, `city`, `foundedYear`, `website`, `description`.
  - `category`: fields: `name`, `slug`, `description`.
  - `tag`: fields: `name`, `slug`.

---

## 3. Step-by-Step Execution Plan

### Step 1.1: Stack Initialization & Scaffolding
- Initialize project with Next.js App Router, TypeScript, and modern styling matching the editorial typography.
- Set up environment variables and configuration for local development.

### Step 1.2: Schema Definitions & Relations
- Implement schema definitions with validation rules (e.g., required alt text, max length for headline).
- Verify bidirectional relationship resolution (Story mentions Company; Company shows linked Stories).

### Step 1.3: Role-Based Authentication & Permissions
- Implement role gates:
  - Writer: Can create/edit own drafts, cannot publish.
  - Editor: Can edit all, publish, unpublish, schedule.
  - Admin: Can manage users and site settings.

### Step 1.4: Media Pipeline & Asset Optimization
- Build media upload handler with automatic WebP transformation and dimensions checking.
- Ensure 1200x630 crop preview is available.

### Step 1.5: Deployment & CI/CD
- Set up Netlify/Vercel build pipelines with preview URLs and environment secrets.

---

## 4. Verification & Exit Criteria
- [ ] Non-technical team member can log in and view dashboard.
- [ ] Schemas support all fields required by PRD Section 8.
- [ ] Image uploads are automatically compressed.
- [ ] Staging environment accessible over HTTPS.
