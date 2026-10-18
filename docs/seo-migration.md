# SEO migration: WordPress → Next.js + Payload

The point of this rebuild is to keep — and then grow — what ecc-group.ae
already ranks for. A replatform loses traffic in exactly three ways: URLs that
change without a redirect, metadata that does not come across, and pages that
quietly disappear. This document is how each is prevented, and the checklist to
run before DNS moves.

## 1. URLs: every old address keeps working

The live site uses several permalink shapes at once. The keyword sheet
(`src/seo/keyword-plan.json`, 156 URLs) shows all of them:

| Live URL shape | Example | On the new site |
| --- | --- | --- |
| Arabic article at the root | `/إدارة-سلسلة-الإمداد/` | Served at the same URL. The proxy sees Arabic script and routes it to the Arabic tree without changing the address. |
| English article at the root | `/online-mba-programs/` | Served at the same URL. |
| Article under a category base | `/blogs/mba-in-healthcare-management`, `/arabic-blogs/…`, `/uncategorized/…` | Served at the same URL — the importer stores it as the article's **Legacy path**. Its bare `/<slug>/` 301s to it. |
| Dated permalink | `/blog/2025/10/02/مهام-الاتش-ار/` | 308 → `/<slug>/` (`src/proxy.ts`). |
| App pages | `/about-us/`, `/contact/`, `/fees-structure/` | Same URLs. |
| Without trailing slash | `/contact` | 308 → `/contact/`. Every link the site emits already ends in `/`. |
| `/en/…` | `/en/about-us/` | 308 → `/about-us/` (English is unprefixed). |
| Arabic slug with prefix | `/ar/إدارة-…/` | 308 → `/إدارة-…/` (one URL per page). |
| Old sitemaps | `/sitemap_index.xml`, `/post-sitemap.xml` | 308 → `/sitemap.xml`. |
| Anything else that moved | `/my-programs/` | Add it under **SEO → Redirects** in the admin. Checked before any 404. |

How an article URL is resolved (`src/app/(frontend)/[locale]/[...slug]/page.tsx`):

1. an exact **Legacy path** match, else the last path segment as a **slug**;
2. if the article's canonical address differs from what was requested, a 308
   to the canonical one (so `/blogs/x`, `/x/` and `/arabic-blogs/x/` never all
   answer 200);
3. otherwise a CMS **Page** with that slug;
4. otherwise a redirect from **SEO → Redirects**;
5. otherwise 404.

Slugs keep Arabic as Arabic (`src/payload/fields/slug.ts`), so an imported slug
matches the live one character for character. Posts and pages share the root,
so a slug is refused on save if another post, page or app route already owns it.

## 2. Metadata: everything Rank Math held comes across

Each document's **SEO** tab has:

- **Meta title** — used as the whole `<title>`, exactly as typed (as in Rank
  Math). Left empty, the page title plus " — ECC Knowledge Group" is used.
- **Meta description**, **share image** (falls back to the featured image).
- **Focus keyword** and **related keywords**, with a live checklist: keyword in
  the meta title (and near its start), description, slug, H1, opening
  paragraphs, a subheading; density; length.
- **Canonical override** — empty means self-canonical, which is right for
  almost every page.
- **Robots** — `noindex`, `nofollow`, etc. Empty means index, follow.

With `RANKMATH=true` the importer reads each URL's live Rank Math `<head>`
(title, description, robots, any canonical pointing elsewhere) through Rank
Math's headless endpoint — switch on *Rank Math → General Settings → Others →
Headless CMS Support* first.

Rendered on every page: `<title>`, description, keywords, canonical,
`hreflang` (en, ar, x-default) where a translation exists, Open Graph and
Twitter cards, and JSON-LD — Organization and WebSite site-wide, BlogPosting +
BreadcrumbList on articles, Course on programmes, FAQPage on the FAQ.

## 3. The keyword plan

`src/seo/keyword-plan.json` is the *Ahmed Hassan Handover* sheet from
*ECC_Keywords.xlsx*: each row a published URL, its main keyword and related
keywords. After importing:

```bash
npm run seo:keywords
```

writes the focus and related keywords onto each URL's article (leaving any an
editor has set; `OVERWRITE=true` to replace) and lists URLs with no article —
each is either an article the import missed or an address that needs a redirect.

The other sheets (handover links to GSC, GA, Ahrefs, Drive) are working
documents for the SEO team and are not imported.

## 4. Launch checklist

Before DNS points at the new site:

1. **Crawl the live site** (Screaming Frog, or Ahrefs Site Audit) and export
   every 200 URL plus the URLs in GSC with impressions in the last 16 months.
2. **Import:** `WORDPRESS_URL=https://ecc-group.ae RANKMATH=true IMPORT_PAGES=true npm run import:wordpress`
   then `npm run seo:keywords`. Fix every failure in the report.
3. **Diff the URL lists:** request every URL from step 1 against the staging
   deployment. Each must return 200, or a single 301/308 to a 200. Add a
   redirect under *SEO → Redirects* for anything that 404s.
4. **Spot-check metadata** on the top 50 pages by traffic: title, description,
   canonical, `hreflang`, robots — compare with the live site.
5. **Set `NEXT_PUBLIC_SITE_URL=https://ecc-group.ae`** on production (a
   `*.vercel.app` origin is deliberately closed to crawlers).
6. Paste the **Search Console verification token** (and tag manager / pixel
   code) into *Settings → Site settings*.
7. Translate the Arabic page Globals — until a Global has Arabic text, its
   `/ar/` page is `noindex` and kept out of the sitemap.
8. After switching DNS: submit `/sitemap.xml` in Search Console, watch
   *Pages → Not found (404)* and *Redirect* reports daily for two weeks, and
   add redirects for anything that surfaces.

## 5. What changes, deliberately

- `/insights/…` from the previous Next build redirects to the WordPress
  addresses (`/blog/`, `/<slug>/`) — those are the ones with history.
- Dated `/blog/YYYY/MM/DD/<slug>/` URLs consolidate onto `/<slug>/`.
- WordPress feeds and author archives redirect to `/blog/`. Tag archives and
  attachment pages are not rebuilt; add redirects if the crawl shows them with
  traffic.
