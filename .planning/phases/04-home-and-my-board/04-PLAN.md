# Phase 4: Dynamic Home & Robust "My Board" Plan

## Objective
Connect the Homepage to CMS feeds and re-architect the interactive pinboard ("My Board") to use stable slug-based pins with silent unpinning and shareable states.

---

## 1. Requirements Mapped
- `REQ-PUB-14` to `REQ-PUB-20`: Dynamic homepage feeds, slug-based pinning, silent unpinning of unpublished content, reactive pin counter, shareable board link.
- `REQ-NFR-02`, `REQ-NFR-03`: Accessibility, mobile pin interactions.

---

## 2. Technical Approach
- **Homepage Integration (`/`)**:
  - Pull latest published featured stories, founder spotlights, and directory updates directly from the content layer.
  - Retain the bespoke editorial hero and magazine grid aesthetics.
- **"My Board" Architecture**:
  - Store pinned items using canonical slugs: `{ type: 'story' | 'founder', slug: string, pinnedAt: number }[]`.
  - Persist in `localStorage` under a versioned schema key (`udyam_board_v2`).
  - Validation Pass on mount: Check pinned slugs against the published inventory. If a pinned item has been unpublished or deleted, remove it quietly from the state without throwing errors or displaying broken cards.
  - Header badge: Reactive state hook updating count immediately on pin/unpin events.
  - Shareable board link: Encode list of slugs into a compressed URL token (`/board?items=slug1,slug2,slug3`) allowing visitors to share their curated pinboard.
- **Walkthrough / Spotlight Tour**:
  - Integrate guided spotlight tour to educate readers on how to pin stories, navigate the directory, and share articles.

---

## 3. Step-by-Step Execution Plan
1. Connect Homepage sections to dynamic data queries.
2. Refactor pinboard state manager to use slug-based keys.
3. Implement unpublish-sanitization filter for pinned items.
4. Update header pin counter with reactive badge animations.
5. Build board export/share URL generator and import handler.
6. Test spotlight tour across mobile touch and desktop keyboard interactions.

---

## 4. Verification & Exit Criteria
- [ ] Pinned items survive title edits and slug updates without breaking.
- [ ] Unpublished stories vanish silently from "My Board".
- [ ] Header counter increments/decrements synchronously on pin toggles.
- [ ] Board links correctly populate another browser session with pinned items.
