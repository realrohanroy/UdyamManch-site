# Rule: Social Share Previews, Open Graph & SEO Standards

This rule governs the social sharing engine, preview card generation, and search engine optimization. As stated in PRD Section 5.4, **Shareable Public Links and Previews are a headline requirement** of this platform.

---

## 1. Social Scraper Mechanics & Architectural Requirements

### The Scraper Reality:
WhatsApp, LinkedIn, X, Facebook, and Slack crawlers use lightweight HTTP user-agents (e.g. `WhatsApp/2.2x`, `LinkedInBot/1.0`, `Twitterbot/1.0`). **They do NOT run client-side JavaScript.** 

### Mandatory Rule:
All Open Graph (`<meta property="og:...">`) and Twitter Card (`<meta name="twitter:...">`) tags **MUST be rendered server-side in the initial raw HTML response**. Never attempt to inject or update them in `useEffect()`, client-side routers, or single-page application hash links.

---

## 2. Meta Tag Specification

Every published Founder Journey and Story page MUST emit the following markup in the `<head>`:

```html
<!-- Primary Meta -->
<title>[Headline] | Udyam Manch</title>
<meta name="description" content="[Dek / Summary]">
<link rel="canonical" href="https://udyammanch.in/[founders|stories]/[slug]">

<!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="Udyam Manch">
<meta property="og:title" content="[Share Title or Headline]">
<meta property="og:description" content="[Share Description or Dek]">
<meta property="og:url" content="https://udyammanch.in/[founders|stories]/[slug]">
<meta property="og:image" content="[Absolute URL to 1200x630 Image]">
<meta property="og:image:secure_url" content="[Absolute HTTPS URL to 1200x630 Image]">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="[Cover Image Alt Text]">
<meta property="article:published_time" content="[ISO-8601 Timestamp]">
<meta property="article:author" content="[Author Name]">
<meta property="article:section" content="[Category Name]">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@udyammanch">
<meta name="twitter:title" content="[Share Title or Headline]">
<meta name="twitter:description" content="[Share Description or Dek]">
<meta name="twitter:image" content="[Absolute URL to 1200x630 Image]">
```

---

## 3. Social Share Card Image (1200 x 630 px)

- **Dimensions**: Strictly `1200px` width by `630px` height (1.91:1 aspect ratio).
- **Format**: Optimized JPEG or WebP, file size under 1MB for fast scraper fetching.
- **Dynamic Fallback**: If an article does not feature an uploaded cover photo suitable for 1.91:1 crop, an automated branded preview card MUST be generated dynamically using edge rendering (e.g. Satori / `@vercel/og`), displaying the Udyam Manch masthead, the headline in *Bricolage Grotesque*, author credits, and category badge.

---

## 4. WhatsApp & Social Cache Mitigation

Per PRD Section 5.4:
> *"Note on caching: WhatsApp and other apps remember a preview for some time. A story that is edited after the first share may keep its old preview for a while. The dashboard should show a note about this, and the team should check the preview before sharing widely."*

### Implementation Guidelines:
1. **Admin Warning Banner**: In the admin editor, include a persistent advisory:
   > *"WhatsApp and LinkedIn cache link previews for up to 7 days upon first share. Ensure your headline, summary, and cover image are finalized before broadcasting links."*
2. **Versioned Share Media URLs**: When a cover image is replaced, the image URL served in `og:image` should include a cache-busting fingerprint or timestamp query: `og:image?v=updated_timestamp`.

---

## 5. Share Bar Actions & Campaign Tracking

The reading template must include a Share Bar (both at top below the Dek, and sticky/inline at the bottom) with the following actions:

1. **WhatsApp**:
   - `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url + '?utm_source=whatsapp&utm_medium=share_bar')}`
2. **LinkedIn**:
   - `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url + '?utm_source=linkedin&utm_medium=share_bar')}`
3. **X (Twitter)**:
   - `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url + '?utm_source=x&utm_medium=share_bar')}&via=udyammanch`
4. **Native Share Sheet**:
   - Call `navigator.share({ title, text: dek, url })` on supported mobile browsers.
5. **Copy Link**:
   - Write canonical URL + `?utm_source=copy_link` to clipboard.
   - Display accessible confirmation banner/toast ("Link copied to clipboard").

---

## 6. Structured Data (Schema.org)

Every reading page MUST embed a `<script type="application/ld+json">` block structured as `NewsArticle`:

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "[Headline]",
  "description": "[Dek]",
  "image": ["[1200x630 Image URL]"],
  "datePublished": "[ISO Date]",
  "dateModified": "[ISO Date]",
  "author": [{
    "@type": "Person",
    "name": "[Author Name]"
  }],
  "publisher": {
    "@type": "Organization",
    "name": "Udyam Manch",
    "logo": {
      "@type": "ImageObject",
      "url": "https://udyammanch.in/assets/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://udyammanch.in/[type]/[slug]"
  }
}
```
