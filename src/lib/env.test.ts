import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import {
  configured,
  configuredCount,
  isPublicOrigin,
  siteUrl,
} from './env.ts';

/**
 * The empty string is the case that matters.
 *
 * `undefined` is what everybody writes their default against and it has always
 * worked. `''` is what a hosting dashboard actually hands over when a variable
 * is added and left blank, and it is the one that slips past `??`, past
 * `Number()`, and into a production build.
 */

test('a blank value is the same as no value', () => {
  for (const blank of ['', ' ', '\t', '\n  ']) {
    assert.equal(configured(blank), undefined, JSON.stringify(blank));
  }
});

test('so is a missing one', () => {
  assert.equal(configured(undefined), undefined);
});

test('a real value comes back trimmed', () => {
  assert.equal(configured('  https://ecc-group.ae  '), 'https://ecc-group.ae');
});

test('a value that is only punctuation is still a value', () => {
  // Not every setting is a URL. `/` is a legitimate base path.
  assert.equal(configured('/'), '/');
});

/* ------------------------------------------------------------- counts ---- */

test('a blank count does not read as zero', () => {
  // `Number('')` is 0, which passed every "is this a sensible number" test
  // ever written against it and switched off caching for the whole site.
  assert.equal(configuredCount(''), undefined);
  assert.equal(configuredCount('   '), undefined);
  assert.equal(configuredCount(undefined), undefined);
});

test('zero itself is kept, because zero means something', () => {
  // "Never serve this from cache" is a real answer, and distinct from unset.
  assert.equal(configuredCount('0'), 0);
});

test('a number is a number', () => {
  assert.equal(configuredCount('300'), 300);
  assert.equal(configuredCount(' 3600 '), 3600);
});

test('nonsense falls through to the caller default', () => {
  for (const bad of ['soon', '-1', 'NaN', 'Infinity', '5 minutes']) {
    assert.equal(configuredCount(bad), undefined, bad);
  }
});

/* --------------------------------------------------------- the origin ---- */

/**
 * `siteUrl()` broke a production deploy, so it is worth pinning down.
 *
 * `NEXT_PUBLIC_SITE_URL` was added to Vercel and left blank. The old `??` only
 * falls back on `undefined`, so `''` went through to `new URL('')` in the root
 * layout's `metadataBase` and the build died with `Invalid URL` — naming no
 * variable, and blaming whichever page happened to be collected first.
 */

const ORIGINAL = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL;
});

test('unset falls back', () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;

  assert.equal(siteUrl(), 'https://ecc-group.ae');
});

test('blank falls back too — this is the one that broke the build', () => {
  for (const blank of ['', '   ']) {
    process.env.NEXT_PUBLIC_SITE_URL = blank;

    assert.equal(siteUrl(), 'https://ecc-group.ae', JSON.stringify(blank));
    // The thing that actually threw, in the shape the layout uses it.
    assert.doesNotThrow(() => new URL(siteUrl()));
  }
});

test('a configured origin is used as given', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ecc.example';

  assert.equal(siteUrl(), 'https://ecc.example');
});

test('a trailing slash is dropped, so paths do not double up', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ecc.example/';

  assert.equal(siteUrl(), 'https://ecc.example');
  assert.equal(`${siteUrl()}/programs`, 'https://ecc.example/programs');
});

test('a preview deployment origin works', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ecc-knowledge-group.vercel.app';

  assert.equal(siteUrl(), 'https://ecc-knowledge-group.vercel.app');
});

test('a value that is not a URL says so, and says which variable', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'ecc-group.ae';

  assert.throws(() => siteUrl(), (error: Error) => {
    // The old failure named neither the variable nor the value. This one has
    // to do both, or it is no better than `Invalid URL`.
    assert.match(error.message, /NEXT_PUBLIC_SITE_URL/);
    assert.match(error.message, /ecc-group\.ae/);
    return true;
  });
});

/* ------------------------------------------------- staging vs the real site */

const ORIGINAL_ALLOW = process.env.NEXT_PUBLIC_ALLOW_INDEXING;

afterEach(() => {
  if (ORIGINAL_ALLOW === undefined) delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;
  else process.env.NEXT_PUBLIC_ALLOW_INDEXING = ORIGINAL_ALLOW;
});

test('a Vercel deployment URL is staging, not the public site', () => {
  delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ecc-knowledge-group.vercel.app';

  assert.equal(isPublicOrigin(), false);
});

test('so is a per-branch preview URL', () => {
  delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;
  process.env.NEXT_PUBLIC_SITE_URL =
    'https://ecc-knowledge-group-git-claude-abc123-ecc.vercel.app';

  assert.equal(isPublicOrigin(), false);
});

test('a real domain is the public site', () => {
  delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;

  for (const origin of ['https://ecc-group.ae', 'https://www.ecc-group.ae']) {
    process.env.NEXT_PUBLIC_SITE_URL = origin;

    assert.equal(isPublicOrigin(), true, origin);
  }
});

test('and so is the default, which is a real domain', () => {
  delete process.env.NEXT_PUBLIC_ALLOW_INDEXING;
  delete process.env.NEXT_PUBLIC_SITE_URL;

  assert.equal(isPublicOrigin(), true);
});

test('a deployment whose public address really is the Vercel URL can say so', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ecc-knowledge-group.vercel.app';
  process.env.NEXT_PUBLIC_ALLOW_INDEXING = 'true';

  assert.equal(isPublicOrigin(), true);
});

test('anything other than "true" is not an override', () => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://ecc-knowledge-group.vercel.app';

  for (const value of ['1', 'yes', 'TRUE', '']) {
    process.env.NEXT_PUBLIC_ALLOW_INDEXING = value;

    assert.equal(isPublicOrigin(), false, JSON.stringify(value));
  }
});
