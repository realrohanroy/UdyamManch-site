# Udyam Manch (उद्यम मंच)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Udyam Manch** is an independent digital publication and startup directory spotlighting Indian entrepreneurs, grassroots innovators and emerging enterprises.

---

## Overview

Udyam Manch tells the stories behind India's growing startups and generational businesses. It has an editorial magazine look: founder journeys, stories and a pinboard of the people and companies worth knowing.

## What is built

- **Home pinboard**: an editors' board of founders, stories and startups, with filter chips and an interactive dot grid that reacts to the cursor.
- **My board**: readers pin stories and founders. Pins are saved in the browser (no accounts, by design).
- **Founder journeys** at `/founders/[slug]`: one template, filled from content. Server rendered metadata, Open Graph and JSON-LD, so WhatsApp and LinkedIn previews work.
- **Founders page** at `/founders`: an India map by state, filters and founder cards.
- **Stories** at `/stories`.
- **Light and dark themes**, following the system setting or the toggle.
- **Sanity Studio** at `/admin` for editors (the project ID is not connected yet).

Not built yet: the `/directory` and company pages, the slug redirect engine, the walkthrough tour and the Instagram window from the prototype. See `.planning/STATE.md`.

## Tech stack

- **Next.js 14** (App Router), React 18, TypeScript
- **Sanity v3** for content, with local files as the fallback and seed data
- **Cloudinary** for images (see below)
- **Vercel** for hosting
- Fonts: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), [Newsreader](https://fonts.google.com/specimen/Newsreader) and Caveat, through `next/font`

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000, Studio at /admin
npx tsc --noEmit     # typecheck
npm run build        # production build, also runs the content guard
npm run test:e2e     # HTTP tests, against npm run build && npm start
```

The content guard fails the build on missing alt text, duplicate block keys, headlines over 90 characters and em dashes.

## Project structure

```text
src/
├── app/                 # routes: home, /founders, /founders/[slug], /stories, /admin
├── components/          # UI; journey/ holds the founder page blocks
├── content/founders/    # one file per founder journey (local content)
├── lib/
│   ├── journey/         # types, repository (repo.ts), content guard
│   └── cloudinary.ts    # image URL helper
├── sanity/              # Studio config and schemas
└── styles/              # tokens.css (all colours) and page styles
public/assets/           # small local files only: SVG illustrations, a few images not yet on Cloudinary
docs/                    # FOUNDER_JOURNEYS.md and other guides
.planning/               # phases, requirements and the decision log
```

## Images

Founder photos and artwork are served from **Cloudinary** (cloud name `nkhny4aq`), not from the repository. Cloudinary resizes each image and converts it to AVIF or WebP for each browser. A 2.4 MB PNG upload reaches a phone as about 30 KB.

**Adding a photo**

1. Upload it in the Cloudinary Media Library. Upload the best quality you have; never shrink it first.
2. Copy its plain delivery URL, the one with no transformations, for example
   `https://res.cloudinary.com/nkhny4aq/image/upload/v1793186538/Editorial_Portrait_with_Geometric_Accents.png`
3. Paste it into the content as `url`, with `alt`, `width` and `height` (the original pixel size).
4. For a founder hero, set `hero.portrait: 'photo'` if it is a normal rectangular photo. Leave it out for a cut-out with a transparent background.

**What the code does with it.** `src/lib/cloudinary.ts` adds `f_auto,q_auto` (best format and quality) and a resize for each slot: the hero gets a `srcSet` from 480 to 1260px, founder cards 720px, related story thumbnails 240px. URLs that are not on Cloudinary pass through unchanged. To use an image in a new place, wrap its URL:

```ts
import { cld, cldSrcSet } from '@/lib/cloudinary';
<img src={cld(url, 'c_limit,w_640')} srcSet={cldSrcSet(url, [320, 640])} />
```

**Share images** (`seo.image`) must be 1200 x 630. Build them from the same upload with a crop in the URL, as JPEG because LinkedIn is unreliable with WebP previews:

```text
https://res.cloudinary.com/nkhny4aq/image/upload/c_fill,g_face,w_1200,h_630/f_jpg,q_auto/v1793186538/<file>
```

`g_face` keeps the face in frame. Use `g_auto` for images without a person.

**Other image sources**

- `public/assets/`: small SVG illustrations only. Do not commit large photos here; they ship with every deploy and are never resized.
- Unsplash (`images.unsplash.com`): placeholder photos on sample content.
- Sanity (`cdn.sanity.io`): images editors upload in the Studio, once Sanity is connected.

Still served locally: Ayush Shaw's hero, share image and company logo (`public/assets/ayush-shaw/`), and Karthik R's two SVG diagrams (`public/assets/karthik-r/`). Everything else is on Cloudinary.

## Deploying

`main` deploys to Vercel (`vercel.json`).

## More documentation

- `docs/FOUNDER_JOURNEYS.md`: how founder pages work and how to add one
- `Design_System.md`: tokens, type, components and the UI checklist
- `PRD.md`: product scope and non-goals
- `.planning/STATE.md`: phase status and the decision log

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
