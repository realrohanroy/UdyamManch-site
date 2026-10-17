# Current Project State: Udyam Manch

**Last Updated**: 2026-10-16
**Framework**: GSD (Get Stuff Done)
**Active Phase**: Phase 1 — Foundation & Infrastructure
**Overall Progress**: Phase 0 (Planning & Constraint System) Complete | Phase 1 Initializing

---

## Phase Status Summary

| Phase | Description | Status | Blockers | Target Completion |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation & Infrastructure | 🔄 Initializing | None | Phase 1 Milestone |
| **Phase 2** | Reading Templates & Social Previews | ⏳ Planned | Blocked by Phase 1 | Phase 2 Milestone |
| **Phase 3** | Listings & Discovery System | ⏳ Planned | Blocked by Phase 2 | Phase 3 Milestone |
| **Phase 4** | Dynamic Home & Robust "My Board" | ⏳ Planned | Blocked by Phase 3 | Phase 4 Milestone |
| **Phase 5** | Launch Readiness & Operational Handover | ⏳ Planned | Blocked by Phase 4 | Phase 5 Milestone |

---

## Active Focus & Immediate Workstream

1. **Stack & CMS Evaluation**:
   - Evaluating Option A (Next.js + Hosted CMS like Sanity) vs Option B (Next.js + Open-Source Self-hosted CMS like Payload CMS / Strapi).
   - Reviewing zero per-seat cost vs maintenance overhead.
2. **Data Model Formalization**:
   - Preparing schemas for FounderJourney, Story, Founder, Company, Category, Tag, and User.
3. **Environment & Agent Guardrails**:
   - Establishing agent constraints in `.agents/rules/` to ensure all subsequent development strictly adheres to PRD requirements.

---

## Key Decisions Log

| Decision ID | Date | Subject | Decision & Rationale |
| :--- | :--- | :--- | :--- |
| **DEC-001** | 2026-10-16 | Planning Framework | Adopted GSD (Get Stuff Done) with `.planning/` directory structure for disciplined requirement tracking and constraint awareness. |
| **DEC-002** | 2026-10-16 | URL & Routing | Strict ban on client-side hash links (`#/story/1`). All public content routes will use permanent semantic slugs (`/founders/[slug]`, `/stories/[slug]`). |
| **DEC-003** | 2026-10-16 | Social Previews | Mandatory server-side rendering for Open Graph tags and 1200x630 cards to guarantee 100% preview reliability on WhatsApp, LinkedIn, and X. |
| **DEC-004** | 2026-10-16 | Scope Boundary | No reader accounts or public submission endpoints in Version 1. Editorial operations restricted to internal authenticated roles. |
| **DEC-005** | 2026-10-16 | "My Board" Architecture | Migrated from fragile numeric array indexing to canonical slug-based indexing with silent unpinning for unpublished stories. |

---

## Open Questions for Team (from PRD Section 13)

1. **Dashboard Seats**: Who will be in the dashboard, and how many people initially (2 to 5 expected)?
2. **Hosted vs Self-Hosted CMS**: Do you prefer a hosted CMS with a monthly subscription (e.g. Sanity) or a self-hosted CMS with zero per-seat cost (e.g. Payload CMS on Node)?
3. **Social Priority**: Beyond WhatsApp, LinkedIn, and X, are Instagram direct share cards or Telegram previews prioritized?
4. **Publishing Cadence**: How many stories and founder journeys are expected to be published per month in year one?
5. **Localization**: Is Hindi translation required in the roadmap for V1.1 or later?
6. **Seed Content**: Is there an initial curated batch of real stories and high-resolution founder photos ready for the proof-of-concept?
7. **Editorial Checklist**: Who holds ownership of fact-verification, founder consent records, and image rights licensing?

---

## Next Steps

1. Select CMS option (Hosted vs Self-Hosted) based on team preference.
2. Scaffold foundational repository structure with Next.js App Router and CMS connectors.
3. Define TypeScript schemas for `FounderJourney`, `Story`, `Founder`, `Company`, `Category`, and `Tag`.
4. Implement initial auth and media upload pipeline.
