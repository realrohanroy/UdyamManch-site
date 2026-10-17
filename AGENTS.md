# AGENTS.md — Udyam Manch Agent Directives & Constraints

Welcome to **Udyam Manch** (उद्यम मंच). As an AI pair programmer operating within this repository, you must strictly adhere to the project constraints, architectural decisions, and requirement-driven development workflows established in the PRD and GSD planning system.

---

## 1. Operating Principle: Constraint & Requirement Aware Development

You must operate under a **Zero-Assumption, Constraint-First** policy:
1. **Never violate PRD Non-Goals**: Do not implement features explicitly ruled out in PRD Section 2.
2. **Every implementation must map to a Requirement ID**: Trace all features and refactors to `[REQ-***]` in [.planning/REQUIREMENTS.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/REQUIREMENTS.md).
3. **Follow the GSD Execution Protocol**: Check and update [.planning/STATE.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/STATE.md) before and after completing milestones.
4. **Preserve Visual Excellence**: Maintain the bespoke editorial magazine look (*Bricolage Grotesque*, *Newsreader*, fluid spacing, rich dark/light mode). Avoid generic, cookie-cutter templates.

---

## 2. Absolute Constraints & Non-Goals (DO NOT VIOLATE)

| Area | Strict Constraint / Boundary | Rationale |
| :--- | :--- | :--- |
| **Reader Authentication** | ❌ **NO reader accounts or login flows**. Readers are 100% public. | PRD Section 2. Board state lives in local storage + share tokens. |
| **Public Submissions** | ❌ **NO direct public publishing or story submission forms on-site**. | Submissions are handled via external forms; only internal staff publish. |
| **Article URLs** | ❌ **NO client-side hash routing (`#/story/1`) for articles**. | Social crawlers (WhatsApp, LinkedIn, X) cannot scrape hash routes. Must use permanent `/founders/[slug]` and `/stories/[slug]`. |
| **Social Previews** | ❌ **NO client-side-only Open Graph tags**. | OG tags (`og:image`, `og:title`, etc.) **MUST** be rendered server-side or pre-built. Previews must be 1200x630 px. |
| **Slug Changes** | ❌ **NEVER change a published slug without an automatic 301 redirect**. | Prevents broken links when articles are shared on social platforms. |
| **Draft Visibility** | ❌ **Drafts and scheduled items must return 404 to unauthenticated visitors**. | No private draft URLs or unauthorized leakages. |
| **Pinboard Resilience** | ❌ **Pins must NOT use array index IDs**. | Pins must use canonical slug identifiers. Unpublished items must be quietly removed. |

---

## 3. Editorial Team Benchmark (The 15-Minute Rule)
The primary administrative success metric:
> **A non-technical editor must be able to draft a story, upload 3 photos, check mobile/share previews, and publish in under 15 minutes without any developer assistance.**

When building admin features:
- Form fields must have instant, clear validation messages (e.g. "Cover image required", "Alt text missing").
- Media uploads must support drag-and-drop with automated compression (WebP/AVIF).
- Provide a real-time Social Share Card simulator (WhatsApp/LinkedIn/X preview) in the editor.

---

## 4. Technical Stack & Architecture Guardrails
- **Hybrid SSR / SSG / ISR**: Ensure reading pages (`/founders/[slug]`, `/stories/[slug]`) and listing pages are edge-cached or pre-rendered.
- **Image Optimization**: Images must be optimized and served via modern formats from a CDN, never bundled raw in code.
- **Accessibility**: Aim for **WCAG 2.2 Level AA**. Alt text is strictly mandatory on all media uploads. High contrast in both light and dark themes.
- **Mobile First**: Over 70% of traffic arrives from WhatsApp on mobile phones. Prioritize narrow viewports (360px - 430px) for reading layouts, sticky share bars, and navigation.

---

## 5. Working with GSD (Get Stuff Done)
When tasked with implementing features:
1. **Consult `STATE.md`**: Verify the currently active phase and blockers.
2. **Consult `ROADMAP.md` & `phases/`**: Read the detailed phase plan.
3. **Trace Requirements**: Ensure your code satisfies the specific `REQ-***` codes.
4. **Update `STATE.md`**: Record key decisions, completed tasks, and any emergent risks.

For detailed guidelines, refer to the rule files in [.agents/rules/](file:///c:/Users/lenovo/Downloads/UdyamManch/.agents/rules/).
