# Rule: Editorial CMS & Content Management Standards

This rule governs the design, behavior, and validation logic of the administrative publishing system and content schemas.

---

## 1. The 15-Minute Non-Technical Benchmark
Per PRD Section 5.3:
> *"The test for success is simple: a new non-technical team member can publish a story with three photos in under 15 minutes after a short walkthrough, without help from a developer."*

### UI Design Principles for the Admin:
- **Zero Raw Code/HTML Input**: Writers must never write HTML or CSS. Use structured rich-text fields with visual buttons.
- **Form-Based Simplicity**: One consolidated, intuitive editorial form.
- **Instant Inline Validation**: Clearly flag missing fields (e.g. "Cover image is required before publishing").
- **Live Previews**: Built-in split/modal preview showing exact mobile (390px) and desktop (1280px) rendering before publishing.

---

## 2. Editorial Workflow & State Transitions

Content records move through a strict state machine:

```text
[Draft] ---> [In Review] ---> [Scheduled] ---> [Published] <---> [Unpublished]
```

### Role Permissions Matrix (PRD Section 3):
| Role | Create & Edit Own | Edit Any | Manage Taxonomies | Schedule & Publish | User Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Writer** | ✅ | ❌ | ❌ | ❌ (Submit only) | ❌ |
| **Editor** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 3. Mandatory Pre-Publish Validation Rules
The system MUST block publishing (or scheduling) if any of the following checks fail:

1. **Headline**: Required, max recommended 90 characters.
2. **Summary (Dek)**: Required, 1 to 2 sentences (used for cards and share previews).
3. **Cover Image**: Required.
4. **Cover Image Alt Text**: Required (accessibility mandate).
5. **Cover Image Credit/Caption**: Strongly recommended.
6. **Category**: Exactly one required category selected from managed list.
7. **Body**: Non-empty rich text body content.
8. **Entity Relations**:
   - Founder Journey: Must be linked to exactly one `Founder` and one `Company`.
   - Story: Linked to at least one Category.

---

## 4. Media Upload Pipeline & Optimization

1. **Drag-and-Drop Handling**:
   - Accept JPEG, PNG, WebP, AVIF up to 10MB.
   - Automatically reject unsupported binaries (executables, SVGs with unescaped scripts, videos outside media rules).
2. **Automated Transformations**:
   - Generate WebP and AVIF formats with 80-85% quality factor.
   - Generate multi-resolution srcset (400w, 800w, 1200w, 1600w).
3. **Share Card Generation**:
   - Generate or crop to `1200 x 630 px` (1.91:1 ratio) for social previews.
   - Center crop focus point selection available in editor.

---

## 5. Slug Lifecycle & Redirect Engine

1. **Slug Generation**:
   - Auto-generated from Headline using kebab-case (`battery-swapping-fleet-contracts`).
   - Unique constraint enforced against database.
2. **Slug Immutability Post-Publish**:
   - Writers and Editors can customize the slug before first publication.
   - Once published, if an Editor modifies the slug, the system MUST:
     1. Update canonical slug on the record.
     2. Write the previous slug into a `redirects` table (`old_slug` -> `new_slug`).
     3. Ensure the web server issues a `301 Moved Permanently` header on requests to `old_slug`.
