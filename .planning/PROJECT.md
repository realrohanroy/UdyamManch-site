# Project Brief: Udyam Manch (उद्यम मंच)

## 1. Executive Summary & Purpose
**Udyam Manch** is an independent editorial publication spotlighting Indian founders, startups, and grassroots innovators. The existing prototype demonstrated the editorial aesthetic, pinboard concept ("My Board"), and discovery flow. 

The primary objective of this phase is transforming the prototype into an **enterprise-grade, production-ready publishing platform**. 

### The Core Problem Solved:
Non-technical editorial staff (writers, editors, admins) must be able to draft, format, upload media, preview, schedule, and publish Founder Journeys and Stories via an intuitive dashboard—**with zero developer intervention**. Every published piece must automatically generate a **permanent, human-readable URL** with **server-rendered Open Graph / Twitter preview cards** (1200x630) that render reliably on WhatsApp, LinkedIn, X, and Facebook.

---

## 2. Target Audience & Personas

### A. Public Readers (No login required)
- Aspiring entrepreneurs, existing startup operators, investors, students, and business enthusiasts.
- **Key Behaviors**: Arriving predominantly from social channels (WhatsApp/LinkedIn) via mobile; browsing Founder Journeys and Stories; filtering the Startup Directory; bookmarking/pinning to "My Board"; sharing articles.

### B. Internal Editorial Team (Login & Role-based Access)
- **Writer**: Drafts content, adds media, assigns categories/tags, submits for review.
- **Editor**: Edits drafts, verifies fact-checking and rights, schedules, publishes, unpublishes.
- **Admin**: All editor capabilities plus user management, taxonomy control, system configurations.
- **Key Metric**: A non-technical team member can draft and publish a 3-photo story in **under 15 minutes** after onboarding.

---

## 3. Core Content Types & Data Schema

| Content Type | Purpose & Attributes |
| :--- | :--- |
| **Founder Journey** | In-depth profile of a founder and company building journey. Includes Company Facts Panel (Industry, City, Founded Year, Website), milestones, pull quotes. |
| **Story** | Editorial features, case studies, industry analyses, news, candid interviews. Mentions one or more Founders/Companies. |
| **Founder** | Entity record: Full Name, Slug, Portrait Photo, Short Bio, Social Links, Company association. |
| **Company** | Directory entry: Company Name, Slug, Logo, Industry, City/Hub, Year Founded, Website, Description, Headquarters. |
| **Taxonomy** | Fixed Editor-managed **Categories** (Fintech, Agritech, D2C, CleanTech, etc.) and free-form **Tags** (topics, cities, themes). |
| **Team Member** | User ID, Name, Email, Role (`Writer` \| `Editor` \| `Admin`), Status (`Active` \| `Inactive`). |

---

## 4. Key Constraints & Non-Goals

### Non-Goals (Scope Boundaries)
- ❌ **No Reader Accounts**: Readers do not sign up or log in. "My Board" pins persist locally and via shareable tokens.
- ❌ **No Public Submissions**: External startups submit via external forms (e.g. Google Forms); zero direct public publishing access.
- ❌ **No Private Draft Sharing**: Only published stories have public URLs. Drafts are internal-only behind authentication.
- ❌ **No Comments / Paywalls / Subscriptions**: Focus remains strictly on editorial content delivery and discovery.
- ❌ **Single Language for V1**: English-first, with clean schema separation to allow localization in future iterations.

### Non-Negotiable Technical Constraints
- 🔒 **Zero Hash Links for Content**: Replace `#/story/1` with clean semantic paths: `/founders/[slug]` and `/stories/[slug]`.
- 🖼️ **Server-Side Rendered Previews**: Social scrapers (WhatsApp, LinkedIn, TwitterBot) cannot execute client-side JavaScript. All metadata tags (`og:title`, `og:description`, `og:image`, `twitter:card`) must be rendered server-side.
- 🔄 **Slug Immutability & Redirects**: Changing a slug automatically establishes 301 redirects to avoid breaking external shares.
- 📱 **Mobile-First & Performance**: Over 70% of readers arrive via mobile WhatsApp links. Target < 2s LCP on mid-range 4G mobile devices.
- ♿ **WCAG 2.2 AA Compliance**: Semantic HTML, full keyboard navigation, high-contrast dark/light mode, and mandatory alt text for all uploaded imagery.

---

## 5. Architectural Strategy & Stack

- **Frontend / Rendering**: Modern SSR/SSG/ISR framework (e.g. Next.js App Router or Astro with SSR endpoints) to provide instant pre-rendered public pages, dynamic OG previews, and client-side hydration for "My Board" and interactive directory filtering.
- **Content Management / Backend**: Headless CMS (Payload CMS or Sanity or structured backend) providing role-based authentication, structured field forms, live desktop/mobile preview, and automated media optimization (WebP/AVIF resizing + 1200x630 OG generation).
- **Styling & Aesthetics**: Preserving the bespoke editorial magazine look:
  - Fonts: *Bricolage Grotesque* (display/headlines) & *Newsreader* (serif body editorial).
  - Fluid responsive typography, subtle editorial borders, dark/light theme persistence.
  - Zero generic UI templates.
- **Hosting & Infrastructure**: Netlify / Vercel with CDN edge caching and SSL.
