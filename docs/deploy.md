# Deploying

Reference setup: **Vercel** (the Next app, with Payload inside it) + **Neon**
(Postgres) + **Vercel Blob** (uploads). Any Node host with Postgres works the
same way; only media storage needs a persistent disk or an object store.

## 1. Database

Create a Postgres database (Neon: one project, a `main` branch for production,
a branch per preview if wanted). Use the **pooled** connection string as
`DATABASE_URI`.

Migrations are committed in `src/migrations`. Production never pushes schema
changes on its own; apply migrations on deploy:

- Vercel build command: `npm run migrate && npm run build`
  (or run `npm run migrate` from CI before promoting a deployment).

After changing a collection or global:

```bash
npm run migrate:create <name>   # writes src/migrations/<timestamp>_<name>.ts
npm run generate:types
```

and commit both.

## 2. Environment variables (Vercel → Settings → Environment Variables)

| Variable | Production | Preview |
| --- | --- | --- |
| `DATABASE_URI` | Neon `main` pooled URL | a Neon branch URL |
| `PAYLOAD_SECRET` | `openssl rand -hex 32` | a different one |
| `NEXT_PUBLIC_SITE_URL` | `https://ecc-group.ae` | leave unset or the preview URL |
| `BLOB_READ_WRITE_TOKEN` | from Storage → Blob | same store or another |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | for form notifications | optional |

A `*.vercel.app` `NEXT_PUBLIC_SITE_URL` serves `robots.txt` as `Disallow: /`,
so previews never get indexed.

## 3. First deploy

1. Deploy; the build runs migrations.
2. Open `/admin`, create the first admin user (or run `npm run seed` locally
   against the production `DATABASE_URI` with `SEED_ADMIN_EMAIL` /
   `SEED_ADMIN_PASSWORD` set — it also loads the built-in page copy).
3. Run the WordPress import and keyword plan (see `seo-migration.md`).
4. Under *Users*, add editors. Every signed-in user can edit content; only
   the **Admin** role can manage users (the **Editor** and **SEO** roles are
   labels for now, ready for finer permissions).

## 4. Caching

Pages are statically rendered and revalidate hourly; saving anything in the
admin purges the affected cache tags immediately, so edits are live on the next
request. Cache keys include the deployment id, so a new deploy never serves
data cached by the previous one.
