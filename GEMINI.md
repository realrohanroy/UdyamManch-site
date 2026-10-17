# GEMINI.md — Udyam Manch Workspace Instructions

This file mirrors the core operating standards defined in [AGENTS.md](file:///c:/Users/lenovo/Downloads/UdyamManch/AGENTS.md) and enforces constraint- and requirement-aware development across all IDE interactions.

## Directives
1. **Constraint Awareness**:
   - Strictly honor PRD Section 2 non-goals (no reader logins, no public write access, no hash-based URLs for content pages).
   - Ensure server-side rendered Open Graph tags (1200x630 px) for social crawlers (WhatsApp, LinkedIn, X).
   - Require automatic 301 redirects on slug mutations.
2. **Requirement Traceability**:
   - Reference Requirement IDs (`[REQ-***]`) from [.planning/REQUIREMENTS.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/REQUIREMENTS.md) in all plans and code implementations.
3. **GSD Protocol**:
   - Keep [.planning/STATE.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/STATE.md) current.
   - Respect phase boundaries outlined in [.planning/ROADMAP.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/ROADMAP.md).
4. **Design Integrity**:
   - Preserve editorial magazine typography (*Bricolage Grotesque*, *Newsreader*), clean dark/light themes, and mobile-first layouts.

Refer to [.agents/rules/](file:///c:/Users/lenovo/Downloads/UdyamManch/.agents/rules/) for detailed specifications.
