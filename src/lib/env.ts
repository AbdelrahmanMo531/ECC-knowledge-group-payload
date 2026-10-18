/**
 * Reading configuration, where "set to nothing" means "not set".
 *
 * A hosting dashboard has no way to say "unset". Adding a variable and leaving
 * the box empty gives the process an empty string, not `undefined` — so `??`
 * does not fall back, `Number('')` is `0` rather than `NaN`, and every default
 * written with either of those quietly stops applying.
 *
 * That is not hypothetical. `NEXT_PUBLIC_SITE_URL` added and left blank on
 * Vercel took `siteUrl()` past its `??`, handed `new URL('')` an empty string,
 * and failed the production build with `Invalid URL` and no clue which
 * variable was to blame. A blank `WORDPRESS_REVALIDATE_SECONDS` was worse
 * because it did not fail: `Number('') >= 0` is true, so caching would have
 * been switched off and every request sent to WordPress.
 *
 * Takes the value rather than the name deliberately. Next inlines
 * `process.env.NEXT_PUBLIC_*` at build time only where it is read as a literal
 * member expression; `process.env[name]` is not, and the variable would arrive
 * undefined in the browser.
 *
 *     configured(process.env.NEXT_PUBLIC_SITE_URL)   // inlined, correct
 *     env('NEXT_PUBLIC_SITE_URL')                    // would not be
 */
export function configured(value: string | undefined): string | undefined {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

/**
 * A configured value that has to be a whole number of at least zero.
 *
 * `undefined` for anything else — blank, missing, words, or a negative — so a
 * caller's own default applies rather than a zero nobody meant.
 */
export function configuredCount(value: string | undefined): number | undefined {
  const raw = configured(value);
  if (raw === undefined) return undefined;

  const count = Number(raw);

  return Number.isFinite(count) && count >= 0 ? count : undefined;
}

/** Where the site lives when nothing says otherwise. */
export const DEFAULT_SITE_URL = 'https://ecc-group.ae';

/**
 * The site's own origin — canonical URLs, the sitemap, every Open Graph tag.
 *
 * Here rather than in `seo.ts` because it is a configuration reader before it
 * is anything to do with SEO, and because this module imports nothing, which
 * is what lets the rule be tested directly.
 *
 * A blank `NEXT_PUBLIC_SITE_URL` counts as unset. A value that is present but
 * not a URL throws instead of falling back: it is a typo either way, but the
 * two are not equally recoverable. Shipping with the wrong origin puts a
 * canonical tag pointing at another domain on every page, and a search engine
 * believes it long after the mistake is fixed. A failed build is the cheaper
 * of the two — so long as it says which variable and what it was given, which
 * a bare `Invalid URL` did not.
 */
export function siteUrl(): string {
  const value = configured(process.env.NEXT_PUBLIC_SITE_URL);
  if (!value) return DEFAULT_SITE_URL;

  const url = value.replace(/\/$/, '');

  try {
    new URL(url);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a URL: ${JSON.stringify(value)}. ` +
        `Expected something like ${DEFAULT_SITE_URL}, or leave it unset.`,
    );
  }

  return url;
}

/**
 * Whether this deployment is the site's real address.
 *
 * A preview deployment serves the whole site, publicly, on a URL that is not
 * the one the business owns — and `robots.txt` invites a crawler in exactly as
 * readily as production does. Getting a duplicate of every page indexed under
 * `*.vercel.app` is not undone by taking the deployment down: the pages stay
 * in the index, they compete with the real domain for the same queries, and
 * removing them is a manual job per URL.
 *
 * So a Vercel-hosted origin is treated as staging, and staging is closed to
 * crawlers. Attaching a real domain and setting `NEXT_PUBLIC_SITE_URL` to it
 * opens the site up on its own, with nothing further to remember.
 *
 * `NEXT_PUBLIC_ALLOW_INDEXING=true` overrides it, for a site whose public
 * address really is the deployment URL.
 */
export function isPublicOrigin(): boolean {
  if (configured(process.env.NEXT_PUBLIC_ALLOW_INDEXING) === 'true') return true;

  const origin = siteUrl();

  try {
    return !new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}
