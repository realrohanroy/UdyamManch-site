# Founder journeys: how they work and how to add one

Every founder page on Udyam Manch is the same template filled with different
content. There is no page file per founder. This guide explains the pieces and
the reasoning, so you can extend it without breaking it.

## The mental model

```
content (data)  ->  repository  ->  template  ->  blocks  ->  tokens
src/content/        lib/journey/    app/founders/  components/  styles/
founders/*.ts       repo.ts         [slug]/page    journey/*    tokens.css
  or Sanity
```

1. **Content** says *what* a page contains. It is plain data: no JSX, no CSS,
   no colours. A journey is a hero, an ordered list of body blocks, and a sidebar.
2. **The repository** (`lib/journey/repo.ts`) is the only code that knows where
   content lives. Today it reads Sanity if a project ID is set, and falls back
   to local files. Pages never import content files directly.
3. **The template** (`app/founders/[slug]/page.tsx`) lays out hero, article and
   sidebar, and renders metadata, Open Graph tags and JSON-LD on the server.
4. **Blocks** (`components/journey/blocks.tsx`) turn each body block into markup.
5. **Tokens** (`styles/tokens.css`) are the only place colour values exist.

The rule that keeps this scalable: **if a founder needs something different,
add a field or a block type. Never add `if (slug === ...)` to the template.**
That `if` is exactly how the old template ended up showing Kishan's story on
every founder's page.

## Adding a founder (local content)

1. Copy `src/content/founders/ayush-shaw.ts` to `src/content/founders/<name>.ts`.
2. Change `slug`. It becomes `/founders/<slug>` forever, so pick it carefully:
   lowercase words joined by hyphens, usually `founder-name-company-name`.
3. Fill `founder`, `company`, `hero`, `body`, `sidebar`, `topics`, `related`, `seo`.
4. Upload photos to Cloudinary and paste the plain delivery URL (see
   "Images" in the README). Small SVG illustrations can live in
   `public/assets/<slug>/`. Every image needs `alt` text, and `width` and
   `height` when you know them. Set `hero.portrait: 'photo'` for a normal
   rectangular photo; leave it out for a cut-out with a transparent
   background. The share image (`seo.image`) must be 1200 x 630.
5. Add the import to `src/content/founders/index.ts`.
6. Run `npm run build`. The content guard (`lib/journey/validate.ts`) fails the
   build with a clear message if you missed alt text, reused a block `_key`,
   wrote a headline over 90 characters, or used an em dash.

Unverified or placeholder content must set `sample: true`. That shows a Sample
label, adds `noindex`, and keeps the page out of the sitemap.

Once Sanity is connected, editors do the same thing in `/admin` with the
"Founder journey" document. The fields are the same, field for field.

## Block types

| `_type` | Use it for | Fields |
| --- | --- | --- |
| `section` | Sub heading and paragraphs | `heading?`, `paragraphs[]` |
| `quote` | Pull quote in the article | `text`, `cite?` |
| `figure` | Wide image with caption | `image { url, alt, caption?, credit? }` |
| `steps` | Process or timeline, 2 to 5 steps | `label`, `steps[] { title, text, icon, tone }` |
| `pillars` | Row of impact icons, 2 to 6 | `label`, `items[] { label, icon, tone }` |
| `regions` | Map and list of states or cities | `label`, `map?`, `regions[]` |
| `note` | Muted note box, e.g. sample notice | `text` |

Text fields accept `**bold**`, `*italic*` and `==highlight==`. The hero title
also accepts `\n` for a deliberate line break. This is parsed into React
elements, never injected as HTML, so content cannot break the page.

`icon` is one of the names in `ICON_NAMES` and `tone` is one of `TONES`
(`gold`, `green`, `teal`, `indigo`), both in `lib/journey/types.ts`. The Sanity
dropdowns are built from the same arrays.

## Adding a new block type

Do all four steps in one change:

1. Add it to the `JourneyBlock` union in `lib/journey/types.ts`.
2. Render it in `components/journey/blocks.tsx`. If you forget, TypeScript
   fails on the `never` check at the bottom of the switch. That is deliberate.
3. Add the matching `defineArrayMember` in `sanity/schemas/founderJourney.ts`.
4. Style it in `styles/journey.css` with the `fj-` prefix, using tokens only.
   Check it in light and dark mode, at 1440px and 390px.

## Why it is built this way

- **Data, not pages.** A page file per founder means every design fix has to
  be repeated per founder, and they drift. One template means a fix lands
  everywhere at once.
- **Same shape locally and in Sanity.** `_type` and `_key` follow Sanity's
  conventions, so moving to the CMS is a configuration change, not a rewrite.
  The local files double as seed data to import.
- **Repository boundary.** If we ever swap Sanity for Payload, only `repo.ts`
  changes. It also gives a working site when the CMS is down (REQ-NFR-05).
- **Server-rendered metadata.** WhatsApp and LinkedIn do not run JavaScript.
  `generateMetadata` puts the preview tags in the first HTML response.
- **Static with ISR.** Pages are pre-built and refreshed at most once a
  minute (`revalidate = 60`). New slugs render on first request, then cache.
- **Guard at build time.** Rules that live only in a document get forgotten.
  Rules that fail the build do not.
- **Tones instead of colours.** Content picks a meaning ("gold step"), the
  tokens decide the colour in each theme. That is how dark mode stays correct
  without anyone thinking about it.

## Known gaps

- Founder and Company are embedded in the journey for now. When the directory
  (Phase 3) lands, they should become their own Sanity documents, referenced
  from the journey, so one company can appear on several stories.
- The 301 redirect engine for changed slugs (REQ-SEO-02) is not built yet.
  Until it is, treat published slugs as permanent.
- `og:image` for Ayush is WebP. LinkedIn is unreliable with WebP previews, so
  a JPEG version is safer before wide sharing.
