# ECC Knowledge Group — ecc-group.ae

The rebuild of [ecc-group.ae](https://ecc-group.ae/) (currently WordPress) as a
Next.js site with **Payload CMS**. Payload runs inside the same Next app: one
codebase, one deployment, the admin at `/admin`, content read through Payload's
Local API with no HTTP hop.

**Crafting Excellence in Every Shade**

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| CMS | Payload 3.91 — admin at `/admin`, REST at `/api`, GraphQL at `/api/graphql` |
| Database | Postgres (`@payloadcms/db-postgres`), migrations in `src/migrations` |
| Media | Local disk in development, Vercel Blob in production |
| Languages | English at `/`, Arabic at `/ar` — Payload's built-in localization |
| SEO | `@payloadcms/plugin-seo` + focus keyword, canonical, robots; `@payloadcms/plugin-redirects` |
| Styling | Tailwind CSS v4, brand tokens from the 2026 guideline (`docs/brand.md`) |

## Getting started

```bash
npm install
cp .env.example .env          # set DATABASE_URI and PAYLOAD_SECRET
npm run dev                   # schema is pushed to the database on first start
npm run seed                  # optional: load the built-in copy into the CMS
```

Open <http://localhost:3000> for the site and <http://localhost:3000/admin> for
the CMS (the first visit asks you to create an admin user, or set
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before `npm run seed`).

**The site runs without a database.** Leave `DATABASE_URI` unset and every page
renders from the seeded copy in `src/lib/content/site.ts`. With a database, each
section switches to CMS content as it is filled in — an empty field falls back to
the shipped copy, so a half-edited page never renders blank.

## Scripts

```bash
npm run dev               # development server (no caching: edits show on refresh)
npm run build             # production build
npm run start             # serve the build
npm run lint              # eslint
npm run typecheck         # tsc --noEmit
npm test                  # node:test unit tests
npm run generate:types    # regenerate src/payload-types.ts after a schema change
npm run generate:importmap  # after adding a custom admin component
npm run migrate:create    # write a migration for a schema change
npm run migrate           # apply migrations (run on deploy)
npm run seed              # load the built-in copy into an empty CMS
npm run import:wordpress  # import articles from the live WordPress site
npm run seo:keywords      # apply the SEO keyword plan to imported articles
```

## SEO — the reason for the rebuild

Everything ecc-group.ae ranks for today keeps its URL. The full plan, the
launch checklist and how each old URL shape is handled are in
**[`docs/seo-migration.md`](docs/seo-migration.md)**. In short:

- **Articles stay where WordPress put them.** `/<slug>/` for both languages —
  Arabic slugs stay Arabic and stay at the root (`/إدارة-سلسلة-الإمداد/`), as on
  the live site. An article published elsewhere (`/blogs/<slug>`,
  `/arabic-blogs/<slug>`, `/uncategorized/<slug>`) keeps that exact address in
  its *Legacy path* field; every other form of its URL 301s to it.
- **Trailing slashes everywhere**, as WordPress did. The slash-less form 308s.
- **The keyword plan is in the CMS.** The SEO team's sheet
  (`src/seo/keyword-plan.json`, from *ECC_Keywords.xlsx*) maps 156 live URLs to
  their focus and related keywords; `npm run seo:keywords` writes them onto the
  articles, and the editor shows a Rank Math-style keyword check on every
  document's SEO tab.
- **Redirects are editable** under *SEO → Redirects* and applied before any 404.
- **Metadata per page**: title, description, canonical, robots, Open Graph,
  `hreflang` pairs, keywords; JSON-LD for Organization, WebSite, Course,
  FAQPage, BlogPosting and BreadcrumbList.
- **`/sitemap.xml`** lists every canonical URL with its language alternates;
  WordPress's `sitemap_index.xml` and `*-sitemap.xml` addresses redirect to it.
- Untranslated Arabic pages are `noindex, follow` and left out of the sitemap.
- Preview deployments on `*.vercel.app` serve `robots.txt: Disallow: /`.

## What editors control

| In the admin | On the site |
| --- | --- |
| **Pages → Home, About us, Contact, Fees structure…** (13 Globals) | The app-built pages, section by section. Empty fields fall back to the shipped copy |
| **Articles** | The blog: `/blog/`, `/category/<slug>/` and each article at its own URL |
| **Pages** (collection) | Any other page — a policy, a programme landing page. Publish and it is live at `/<slug>/` |
| **Programmes, Partners, Accreditations** | Listings, detail pages, and the institution each programme belongs to |
| **Academic members, Team members, Specializations** | Our People, the staff directory, academic profiles |
| **Testimonials, Videos, Podcasts, FAQs** | Carousels, `/testimonials/`, `/video-gallery/`, `/podcast/`, `/faq/` |
| **Forms → Forms / Submissions** | Every form's fields, conditions, notifications and webhook; every submission, stored |
| **SEO → Redirects** | Old URLs and where they go |
| **Settings → Site settings** | Contact details, social links, default share image, Search Console tokens, tracking code |
| **Settings → Navigation** | Header and footer menus, per language |
| **Settings → Interface strings** | Rewording any button or message, per language |

Every document has an **SEO** tab: meta title and description (with
generators and a search-result preview), share image, focus keyword and its
live checks, related keywords, canonical override and robots directives.

Edits are live on the next request: collection and global hooks purge the
affected cache tags (`src/payload/hooks/revalidate.ts`).

## Two languages

English keeps every URL it has (`/fees-structure/`); Arabic is under `/ar/`
(`/ar/fees-structure/`) — except addresses written in Arabic script, which live
at the root exactly as the WordPress site published them. `src/proxy.ts` routes
each request to its language; `localePath()` in `src/lib/i18n/config.ts` is the
single rule every link, canonical, `hreflang` and sitemap entry is built from.

Programmes, partners, globals and pages are **localized documents**: switch the
locale in the admin and translate field by field; an empty Arabic field shows the
English one. Articles are **single-language documents** (the Arabic and English
blogs target different keywords); link an article to its translation, if it has
one, and the two name each other in `hreflang`.

The interface's own words ship in `src/lib/i18n/dictionary.ts` and can be
overridden per language under *Settings → Interface strings*.

## Project layout

```
src/
├── payload.config.ts              # collections, globals, plugins, database
├── proxy.ts                       # language routing, trailing slashes, legacy redirects
├── payload/
│   ├── collections/               # Pages, Posts, Programs, Partners, People, Forms…
│   ├── globals/                   # one Global per app-built page; settings; navigation
│   ├── fields/                    # field builders, slug (Unicode-safe), SEO fields, permalinks
│   ├── components/KeywordCheck.tsx  # focus-keyword checks on the SEO tab
│   ├── hooks/revalidate.ts        # purge cache tags on save
│   └── seo.ts                     # meta title/description/URL generators
├── app/
│   ├── (frontend)/[locale]/       # every public page
│   │   ├── [...slug]/             # articles at their old URLs, CMS pages, redirects
│   │   ├── blog/  category/       # article listings, WordPress-style paging
│   │   └── programs/ partners/ about-us/ …
│   ├── (frontend)/sitemap.ts, robots.ts
│   ├── (payload)/admin, api       # Payload's admin and API (generated)
│   └── actions/forms.ts           # form submissions → Payload, email, webhook
├── lib/
│   ├── cms/api.ts                 # every read from Payload, with seeded fallback
│   ├── cms/normalise.ts           # Payload documents → the components' types
│   ├── i18n/                      # languages, URL rules, dictionary
│   ├── content/site.ts            # seeded fallback content
│   └── seo.ts                     # metadata builder
├── scripts/                       # seed, WordPress import, keyword plan
├── seo/keyword-plan.json          # the SEO team's keyword → URL sheet
└── migrations/                    # Postgres migrations
```

## Deploying

See [`docs/deploy.md`](docs/deploy.md) — Vercel with Neon Postgres and Vercel
Blob is the reference setup.

## Known follow-ups

- **Content import needs the live site.** `npm run import:wordpress` was tested
  against a mock of the WordPress REST API; run it against ecc-group.ae (or a
  staging copy) and review the report before launch.
- **Somar Sans webfont files are not in the repo** (licensed). `globals.css`
  declares them and `npm test` fails until they are added under
  `public/fonts/` — see `docs/brand.md`.
- The Arabic interface copy in `src/lib/i18n/dictionary.ts` wants a native
  reader before launch.
- Draft preview is not wired yet: drafts of articles and pages save and can be
  scheduled, but there is no preview route showing an unpublished draft on the
  site.
