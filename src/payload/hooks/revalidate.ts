import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload';

/**
 * Purges the cache tags a change affects, so an edit is live on the next
 * request instead of after the hourly revalidation.
 *
 * Payload runs inside the Next app, so this calls `revalidateTag` directly —
 * no webhook, no shared secret. Outside a Next request (the seed script, a
 * migration) there is no cache to purge and the call throws; that is ignored.
 */
async function purge(tags: string[]) {
  try {
    const { revalidateTag } = await import('next/cache');
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
  } catch {
    // Not running inside Next — nothing is cached.
  }
}

export const revalidateCollection =
  (...tags: string[]): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    if (!req.context?.disableRevalidate) await purge(tags);
    return doc;
  };

export const revalidateCollectionDelete =
  (...tags: string[]): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    if (!req.context?.disableRevalidate) await purge(tags);
    return doc;
  };

export const revalidateGlobal =
  (...tags: string[]): GlobalAfterChangeHook =>
  async ({ doc, req }) => {
    if (!req.context?.disableRevalidate) await purge(tags);
    return doc;
  };

/** Both hooks for a collection, in the shape `hooks` takes. */
export const revalidates = (...tags: string[]) => ({
  afterChange: [revalidateCollection(...tags)],
  afterDelete: [revalidateCollectionDelete(...tags)],
});
