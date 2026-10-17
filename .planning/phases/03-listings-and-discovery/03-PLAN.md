# Phase 3: Listings & Discovery System Plan

## Objective
Implement scalable, dynamic listings for Founders, Stories, Categories, and the Startup Directory with interactive multi-faceted filtering and search.

---

## 1. Requirements Mapped
- `REQ-PUB-01` to `REQ-PUB-13`: Founders listing, featured hero, filters (industry/city/year), search, stories listing, category tabs, directory, company profiles, static pages.
- `REQ-SEO-08`: Sitemap and robots.txt generation.
- `REQ-NFR-01`, `REQ-NFR-06`: High performance at scale (hundreds to thousands of records).

---

## 2. Technical Approach
- **Founders Feed (`/founders`)**:
  - Hero slot for featured founder journey.
  - Multi-select or dropdown filters: Industry, City/Hub, Year Founded.
  - Client-side fast search bar with debounced input.
  - Efficient virtualization or progressive pagination ("Load More").
  - Mobile 2-column pinboard grid layout.
- **Stories Feed (`/stories`)**:
  - Category pill navigation with URL query state synchronization (`/stories?category=fintech`).
  - Dedicated category routes: `/stories/category/[slug]`.
  - Tag chips and chronological latest feed.
- **Startup Directory (`/directory` & `/directory/[slug]`)**:
  - Directory grid with industry badges, city tags, founded year, and company website link.
  - Company profile page aggregating company metadata, founders, and all published stories mentioning the company.
- **Informational Pages**:
  - `/get-featured`: Startup submission information and editorial requirements guide.
  - `/about`: Editorial vision, masthead, mission statement.
  - `/contact`: Editorial and press inquiries.

---

## 3. Step-by-Step Execution Plan
1. Implement `/founders` listing with filter controls and search index.
2. Implement `/stories` listing with category tabs and tag filters.
3. Build `/stories/category/[slug]` dynamic route.
4. Implement `/directory` and `/directory/[slug]` company profiles with relational queries.
5. Build static pages (`/get-featured`, `/about`, `/contact`).
6. Generate dynamic `sitemap.xml` and `robots.txt`.

---

## 4. Verification & Exit Criteria
- [ ] Filtering by industry and city executes instantly without layout jumps.
- [ ] Search responds in under 100ms for founder and company queries.
- [ ] Company profile accurately links to all associated stories and founders.
- [ ] Mobile responsive layout tested at 360px and 414px widths.
