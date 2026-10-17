# Udyam Manch: Content Platform PRD

Founder Journeys, Stories, admin dashboard and shareable links. Version 0.1 draft, 16 October 2026.

## 1. Purpose

Udyam Manch is an editorial publication about Indian startups and founders. The prototype proves the look, the pinboard idea and the discovery experience. The next stage turns it into a real publishing platform.

The core need is simple. The Udyam Manch team, who are not developers, must be able to write or upload a founder journey or a story, add photos, press publish, and get a finished, well designed reading page with a public link. Anyone can share that link on WhatsApp, LinkedIn, X or anywhere else, and it shows a proper preview card with the title, summary and cover image, the way news sites such as Moneycontrol do.

The content will keep growing. The system has to handle dozens of entries today and hundred later without any change to the code.

## 2. Goals and non goals

### Goals

1. The team publishes a story or founder journey through a form based dashboard, with no developer involved.
2. Every published item has one permanent public URL and a rich share preview.
3. Founder Journeys and Stories are two separate streams with their own listings, and they link to each other and to the startup directory.
4. The reading page is a fixed, well designed template. Writers fill in fields. They never design pages.
5. The site stays fast, readable on phones and search friendly.

### Non goals for this version

- Accounts for founders or readers. Only the internal team has logins.
- Founders or readers publishing or submitting stories on the site. Company submissions continue through the Google Form, and nothing is published automatically.
- Private draft links or founder approval links. Sharing is only through public links to published stories.
- Comments, paywalls, subscriptions and newsletter automation.
- Languages other than English. The structure should allow more languages later.

## 3. Users and roles

### Readers (public, no login)

Aspiring and existing founders, students and business readers. They browse, read, search, pin items to My board and share links.

### Internal team (login required)

| Role | Can do |
| --- | --- |
| Writer | Create and edit their own drafts, upload images, submit for review |
| Editor | Edit any item, manage categories and tags, publish, unpublish, schedule |
| Admin | Everything above, plus manage team accounts and site settings |

A small team of two to five people is the expected size. If the team is smaller, one person can hold all roles.

## 4. Content types

There are five kinds of record. Writers mainly work with the first two.

| Type | What it is |
| --- | --- |
| Founder Journey | A long form profile of a founder and how they built their company. Has a facts panel (company, industry, city, year founded, website). |
| Story | Any other editorial piece: startup story, interview, case study, business news, feature. |
| Founder | A person record (name, photo, short bio, links). One founder can have several journeys or stories. |
| Company | A directory entry (name, industry, city, founded year, website, description, logo). Links to related journeys and stories. |
| Category and Tag | Categories are a fixed, editor managed list. Tags are free labels for topics and cities. |

Relationships: a Founder Journey belongs to one Founder and one Company. A Story can mention several Founders and Companies. Both types have one category and any number of tags.

## 5. Functional requirements

### 5.1 Public website

**Founders section**

- A listing page of all founder journeys, newest first, with a featured slot at the top.
- Filters by industry, city and year, and search by founder or company name.
- Pagination or a load more button. The page must stay fast with hundreds of entries.
- On mobile, the listing uses the two column pinboard style layout already designed.

**Stories section**

- A separate listing for stories with category tabs, tags and search.
- A featured story slot and a latest stories feed.

**Home page**

- The existing hero, pinboard and My board experience stay.
- Home pulls its featured and latest items from the content system instead of fixed sample data.

**My board**

- Pinned items are stored by a stable identifier (the item slug), not by sample IDs. A pin keeps working when the title changes.
- If a pinned item is unpublished, it disappears from the board quietly.

### 5.2 Reading page template

There is one template for Founder Journeys and one for Stories. They share the same design language.

**Fields filled in by the team**

| Field | Notes |
| --- | --- |
| Headline | Required. Recommended up to 90 characters. |
| Summary (dek) | Required. One or two sentences, used on cards and in share previews. |
| Cover image | Required. Caption, credit and alt text fields. |
| Author and date | Author from the team list. Publish date is automatic and can be edited. |
| Category and tags | Category is required. |
| Body | Rich text: paragraphs, sub headings, bold, italic, links, lists, inline images with captions, pull quotes and a highlighted fact box. |
| Founder and company | Selected from existing records. Creating a new one from the same screen is allowed. |
| Facts panel | Founder Journey only. Pulled automatically from the Company record. |
| Layout variant | A dropdown with two or three approved cover styles, for example full width cover or side by side cover. |
| Featured | A switch that places the item in a featured slot. |
| SEO and share fields | Optional overrides for the share title, share description and share image. Defaults come from the headline, summary and cover. |

**What the template does on its own**

- Calculates read time from the body length.
- Shows the founder or company facts panel, related stories and next story links.
- Adds the share bar and a link to the company profile in the directory.
- Applies the correct typography, spacing, dark mode and mobile layout every time.

### 5.3 Admin dashboard

- Secure login for team members. Admins can add or remove accounts. Two factor sign in is recommended for Admin and Editor.
- A content list with status, type, author, last edited and filters.
- A form based editor with the fields above, an autosave, and clear validation messages before publishing (for example: cover image missing, alt text missing).
- Image upload by drag and drop, with automatic resizing and compression. The editor shows how the image will look as a cover and as a share card.
- A preview button that shows the exact public page layout, on desktop and mobile widths, before publishing.
- States: Draft, In review, Scheduled, Published, Unpublished. Only Editors and Admins can publish.
- Schedule a publish date and time.
- A media library to reuse images, with credit and licence notes per image.
- Simple management screens for categories, tags, founders and companies.
- A change history for each item, so an earlier version can be restored.

The test for success is simple: a new non technical team member can publish a story with three photos in under 15 minutes after a short walkthrough, without help from a developer.

### 5.4 Shareable public links and previews

This is a headline requirement. The prototype uses hash links such as `#/story/1`, which social apps cannot read, so they would show no preview. The real platform needs real page addresses that carry their own preview information.

**Link rules**

- Every published item has one permanent, readable URL, for example `/founders/priya-sharma-textile-export` and `/stories/battery-swapping-fleet-contracts`.
- The slug is created automatically from the headline and can be edited before the first publish.
- If a slug changes after publishing, the old link redirects to the new one automatically.
- Drafts and unpublished items are not reachable by any public link. They return a not found page.
- Links work without login and without any app installed.

**Share bar** (on every story and founder journey, at the top and the end)

- WhatsApp, X, LinkedIn, Facebook and Copy link, plus the phone's native share sheet on mobile.
- Copy link shows a short confirmation message.
- Each share adds simple tracking parameters so the team can see which channel brings readers.

**Preview card requirements**

- Open Graph and Twitter card tags are generated on the server for every item: title, description, image, canonical URL and site name.
- Share image: 1200 by 630 pixels. If a cover image is not the right shape, the system crops it. If there is no usable image, the system generates a branded card with the headline.
- Preview text uses the share fields if set, otherwise the headline and summary.
- Structured article data (schema.org) is included for search engines.
- Acceptance check: a link pasted into WhatsApp, LinkedIn and X shows the correct title, summary and image.

Note on caching: WhatsApp and other apps remember a preview for some time. A story that is edited after the first share may keep its old preview for a while. The dashboard should show a note about this, and the team should check the preview before sharing widely.

### 5.5 Search and SEO

- Clean URLs, a sitemap, a robots file, canonical tags and meaningful alt text prompts.
- Server rendered pages so search engines and social apps see full content.
- Site search covers founders, companies and stories.

## 6. Non functional requirements

- **Performance:** pages are pre built or cached, images served in modern formats and sizes. Target good Core Web Vitals on a mid range phone over a normal mobile connection.
- **Accessibility:** aim for WCAG 2.2 level AA. Alt text is required in the dashboard, colours keep sufficient contrast in light and dark mode, and all controls work by keyboard.
- **Mobile first:** most readers will arrive from WhatsApp on phones. Reading pages and share bars are designed for narrow screens first.
- **Security:** admin only access, strong passwords or sign in through a trusted provider, upload type and size checks, regular backups, and no public write access.
- **Scale:** comfortable with several thousand published items and a few hundred editing sessions a month.
- **Reliability:** if the dashboard is down, the public site keeps working.

## 7. Recommended architecture

The platform needs real page addresses, server rendered previews, an editing dashboard and image handling. Building a custom admin from scratch is slow and risky for a one person team, so I recommend a framework plus a headless CMS.

### Options

| Option | What it is | Fits because | Watch out for |
| --- | --- | --- | --- |
| A. Next.js with a hosted CMS such as Sanity | Public site in Next.js, content and editor in the CMS | Very friendly editor for non technical people, built in image handling, live preview | Monthly cost grows with team size and usage. Verify current pricing before committing. |
| B. Next.js with an open source CMS such as Payload or Strapi | Same site, CMS you host yourself | Full control, no per seat cost, matches a developer comfortable with Next.js | You host, secure and back it up. Editor polish varies by product. |
| C. Astro with a CMS | Lighter site framework | Excellent page speed for reading pages | My Board and other interactive features need more integration work. |
| D. Custom built admin | Own database and dashboard | Total flexibility | Slowest and costliest. Not recommended for version one. |

### Recommendation

Start with Option A or B. My lean is A if budget allows, because the editing experience for non technical staff is the most important success factor. Option B is the sensible alternative if per seat cost or data control matters more. I recommend a short proof of concept with each CMS: one founder journey, entered by a non technical person, before deciding.

A few architecture rules that hold either way:

- Pages are generated ahead of time or cached, and refresh automatically when an editor publishes (through a webhook or on demand revalidation).
- Images are stored in the CMS media service or an image service, never inside the code.
- Deploy on Netlify or a similar host with a custom domain and HTTPS.
- The existing visual design, pinboard and My board are rebuilt as components in the new site.

## 8. Data model

**Story and Founder Journey (shared fields)**

id, type, slug, headline, summary, cover image (file, alt, caption, credit), body, category, tags, author, founder or founders, company or companies, layout variant, featured, status, publish date, scheduled date, share title, share description, share image, created and updated timestamps.

**Founder:** id, slug, name, photo, short bio, links, company.

**Company:** id, slug, name, logo, industry, city, founded year, website, description, headquarters.

**Category:** id, slug, name, description. **Tag:** id, slug, name.

**Team member:** id, name, email, role, active.

Because content is stored in structured fields, new entries appear on listings, filters, My board and the share previews automatically.

## 9. URL structure

| Page | URL |
| --- | --- |
| Home | `/` |
| Founders listing | `/founders` |
| Founder journey | `/founders/[slug]` |
| Stories listing | `/stories` |
| Story | `/stories/[slug]` |
| Category page | `/stories/category/[slug]` |
| Directory | `/directory` |
| Company profile | `/directory/[slug]` |
| Get featured | `/get-featured` |
| About and contact | `/about`, `/contact` |

## 10. Editorial workflow

1. A writer creates a draft using the template and uploads images.
2. The writer submits it for review.
3. An editor checks facts, image rights and the preview, then publishes or schedules it.
4. On publish, the public page and share preview go live and listings update.
5. If a correction is needed, an editor edits and republishes. Unpublishing removes the page.

Before going live, the team should agree a short editorial checklist: how facts and quotes are verified, how consent is recorded when a story features a founder, and who owns image rights. This is a process the team defines. The software only needs a checklist field or notes area to record it.

## 11. Success metrics

- Time for a new editor to publish a story with images, without developer help (target under 15 minutes after training).
- Number of items published per week, and how many were published by non developers.
- Share clicks by channel and visits that come back from shared links.
- Share preview success rate when links are pasted into WhatsApp, LinkedIn and X (target: all correct).
- Core Web Vitals and mobile page speed on reading pages.
- Returning readers and My board usage.

## 12. Delivery phases

These are relative sizes for planning. Real timelines depend on team size and how fast content decisions are made.

| Phase | Scope | Size |
| --- | --- | --- |
| 1. Foundation | Choose CMS through a proof of concept, set up the project, data model, roles, deployment and domain | Small |
| 2. Reading templates | Founder Journey and Story templates, share bar, preview cards, SEO basics | Medium |
| 3. Listings and discovery | Founders and Stories listings, filters, search, directory and company pages from the CMS | Medium |
| 4. Home and My board | Home fed from the CMS, My board moved to slug based pins, mobile layouts | Small to medium |
| 5. Launch readiness | Content entry by the team, editor training, testing of previews, performance and accessibility checks, analytics | Small |

As a one developer project, I would treat phases 1 and 2 as the real critical path. Everything else depends on them.

## 13. Risks and open questions

**Risks**

- **Editor experience:** if the dashboard feels hard, the team will avoid it. The proof of concept with a non technical user is the safeguard.
- **CMS lock in and cost:** a hosted CMS is faster to start but can become costly. Pick one that can export all content.
- **Share preview caching:** old previews can linger in WhatsApp. Plan a pre share check.
- **Image rights and consent:** the team must be sure of rights for every photo, and have a process for founder consent.
- **One person dependency:** a single developer is a risk for maintenance. Good documentation and a standard stack reduce this.

**Open questions for the team**

1. Who will be in the dashboard, and how many people?
2. Do you prefer a hosted CMS with a monthly fee, or one you host yourselves?
3. Which social channels matter most beyond WhatsApp, LinkedIn and X?
4. How many stories and founder journeys do you plan to publish each month for the first year?
5. Do you need a Hindi or other language version in the near future?
6. Is there an existing set of real stories and photos ready for launch, or should launch use a smaller curated set?
7. Who owns the editorial checklist and image rights process?

## 14. Acceptance summary

The first release is ready when all of these are true:

- A non technical editor can create, preview and publish a founder journey and a story, including photos, without a developer.
- Each published item has a permanent public link that shows a correct preview in WhatsApp, LinkedIn and X.
- Founders and Stories each have their own listing, filters and search, and new entries appear without code changes.
- Reading pages, listings and the share bar work well on mobile and in both light and dark mode.
- Drafts and unpublished items cannot be opened by the public.
- My board pins survive title and slug changes and remove unpublished items quietly.
- The site passes agreed checks for speed, accessibility and security.
