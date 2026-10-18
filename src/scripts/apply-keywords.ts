/**
 * Writes the SEO keyword plan onto the articles it was made for.
 *
 *     npm run seo:keywords
 *
 * `src/seo/keyword-plan.json` is the keyword sheet the SEO team handed over
 * (ECC_Keywords.xlsx): each row a published URL on ecc-group.ae, the main
 * keyword it targets and its related keywords. Run after the WordPress import,
 * this finds each URL's article and fills in its focus keyword and related
 * keywords — so the keyword check in the editor knows what every article is
 * meant to rank for.
 *
 * A field an editor has already filled is left alone (OVERWRITE=true replaces
 * it). URLs with no article are listed at the end: each is either an article
 * the import missed or an address that needs a redirect.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import config from '@payload-config';
import { getPayload } from 'payload';

type Entry = { path: string; keyword: string; related: string[] };

const OVERWRITE = process.env.OVERWRITE === 'true';
const plan = JSON.parse(readFileSync(path.resolve(process.cwd(), 'src/seo/keyword-plan.json'), 'utf8')) as {
  entries: Entry[];
};

const payload = await getPayload({ config });
const missing: Entry[] = [];
let applied = 0;
let kept = 0;

for (const entry of plan.entries) {
  const clean = `/${entry.path.replace(/^\/+|\/+$/g, '')}`;
  const slug = clean.split('/').filter(Boolean).pop() ?? '';

  const { docs } = await payload.find({
    collection: 'posts',
    where: { or: [{ legacyPath: { equals: clean } }, { slug: { equals: slug } }] },
    limit: 1,
    depth: 0,
    draft: true,
  });
  const post = docs[0] as unknown as { id: number; meta?: { focusKeyword?: string | null; relatedKeywords?: string | null } } | undefined;

  if (!post) {
    missing.push(entry);
    continue;
  }

  const hasOwn = Boolean(post.meta?.focusKeyword?.trim());
  if (hasOwn && !OVERWRITE) {
    kept++;
    continue;
  }

  await payload.update({
    collection: 'posts',
    id: post.id,
    context: { disableRevalidate: true },
    data: {
      meta: {
        ...post.meta,
        focusKeyword: entry.keyword,
        relatedKeywords: entry.related.join('\n') || post.meta?.relatedKeywords || null,
      },
    } as never,
  });
  applied++;
}

payload.logger.info(`Keywords applied to ${applied} articles; ${kept} already had their own; ${missing.length} URLs have no article.`);
for (const entry of missing) payload.logger.warn(`  no article at ${entry.path}  (${entry.keyword})`);

process.exit(0);
