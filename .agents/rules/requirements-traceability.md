# Rule: Requirements Traceability & Verification Protocol

To ensure continuous alignment with `PRD.md`, all development tasks, code commits, and verification audits must reference the requirements catalog in [.planning/REQUIREMENTS.md](file:///c:/Users/lenovo/Downloads/UdyamManch/.planning/REQUIREMENTS.md).

---

## 1. Requirement Tagging Standard

When writing code, commits, plans, or tests, annotate the relevant code or PR with its corresponding requirement ID:

- `[REQ-PUB-**]`: Public website features (Home, Founders listing, Stories listing, Directory, My Board).
- `[REQ-TMP-**]`: Reading page templates, typography, facts panel, share bar.
- `[REQ-SEO-**]`: Permanent slugs, 301 redirects, Open Graph tags, 1200x630 cards, schema.org JSON-LD.
- `[REQ-ADM-**]`: Admin dashboard, RBAC, form validation, image compression, preview simulators.
- `[REQ-NFR-**]`: Non-functional requirements (Performance, a11y, mobile, security, resilience).

---

## 2. Requirement Verification Checklist

Before declaring any feature complete, verify against the following test matrices:

### 2.1 Reading Template Verification (`REQ-TMP`)
- [ ] Typography renders *Bricolage Grotesque* for headlines and *Newsreader* for body.
- [ ] Reading time calculates dynamically based on body word count (~200 words/min).
- [ ] Facts panel renders automatically for Founder Journeys with company data.
- [ ] Pull quotes, callout boxes, and inline images with captions render correctly.
- [ ] Share bar actions function on WhatsApp, LinkedIn, X, Facebook, and mobile share sheet.
- [ ] "Copy Link" triggers confirmation toast.
- [ ] Tracking parameters (`?utm_source=...`) attach correctly to shared links.

### 2.2 Social Preview Verification (`REQ-SEO`)
- [ ] Page source contains `<meta property="og:title" ...>`, `<meta property="og:description" ...>`, and `<meta property="og:image" ...>`.
- [ ] `og:image` URL resolves to a valid 1200x630 px image.
- [ ] `twitter:card` is set to `summary_large_image`.
- [ ] Canonical URL `<link rel="canonical" href="...">` matches the permanent address.
- [ ] Schema.org JSON-LD block is valid according to Google Rich Results test.
- [ ] Draft or unpublished slugs return `404 Not Found` for unauthenticated requests.

### 2.3 Admin Dashboard Verification (`REQ-ADM`)
- [ ] Role enforcement: Writer cannot publish; Editor/Admin can publish.
- [ ] Form autosave triggers on edit without losing state.
- [ ] Pre-publish validator blocks publishing if cover image, summary, or alt text is missing.
- [ ] Drag-and-drop image upload compresses to WebP/AVIF automatically.
- [ ] Social card preview simulator displays realistic WhatsApp and LinkedIn cards before publish.
- [ ] Mobile/Desktop layout preview toggles accurately.

### 2.4 Non-Functional Verification (`REQ-NFR`)
- [ ] Mobile responsiveness: Verified at 360px (small Android) and 390px/430px (modern iPhones).
- [ ] Keyboard accessibility: All buttons, links, and filters focusable with tab order.
- [ ] Lighthouse scores: Target 95+ Performance, 100 Accessibility, 100 SEO.
