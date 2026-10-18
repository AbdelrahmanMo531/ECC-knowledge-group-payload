import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  DEFAULT_LOCALE,
  LOCALES,
  direction,
  inLanguageOf,
  isLocale,
  localePath,
  splitLocale,
  translatedPaths,
} from './config.ts';
import { DICTIONARY, messagesFor, translate } from './dictionary.ts';

/* ------------------------------------------------------------------ paths */

test('the default language keeps the paths the site already has', () => {
  assert.equal(localePath('en', '/fees-structure'), '/fees-structure/');
  assert.equal(localePath('en', '/'), '/');
});

test('page addresses end in a slash, as every WordPress permalink did', () => {
  assert.equal(localePath('en', '/blogs/mba-in-healthcare-management'), '/blogs/mba-in-healthcare-management/');
  assert.equal(localePath('en', '/sitemap.xml'), '/sitemap.xml');
});

test('every other language is prefixed', () => {
  assert.equal(localePath('ar', '/fees-structure'), '/ar/fees-structure/');
  assert.equal(localePath('ar', '/'), '/ar/');
});

test('a trailing slash never doubles up', () => {
  assert.equal(localePath('ar', '/podcast/'), '/ar/podcast/');
  assert.equal(localePath('en', '/podcast/'), '/podcast/');
});

test('a nested path keeps its shape', () => {
  assert.equal(
    localePath('ar', '/programs/master-of-business-administration'),
    '/ar/programs/master-of-business-administration/',
  );
});

test('an Arabic-script address keeps the root it was published at', () => {
  assert.equal(localePath('ar', '/إدارة-سلسلة-الإمداد'), '/إدارة-سلسلة-الإمداد/');
  assert.equal(localePath('ar', '/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9'), '/%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9/');
  assert.deepEqual(splitLocale('/إدارة-سلسلة-الإمداد/'), { locale: 'ar', path: '/إدارة-سلسلة-الإمداد' });
  assert.equal(inLanguageOf('/ar/blog/', '/التسويق-الرقمي'), '/التسويق-الرقمي/');
});

test('a Latin address in Arabic is still prefixed', () => {
  assert.equal(localePath('ar', '/شهادة-mba'), '/شهادة-mba/');
  assert.equal(localePath('ar', '/privacy-policy'), '/ar/privacy-policy/');
});

/* ------------------------------------------------------------- splitting */

test('an unprefixed path is the default language', () => {
  assert.deepEqual(splitLocale('/fees-structure'), {
    locale: 'en',
    path: '/fees-structure',
  });
  assert.deepEqual(splitLocale('/'), { locale: 'en', path: '/' });
});

test('a prefixed path reports its language and the path underneath', () => {
  assert.deepEqual(splitLocale('/ar/fees-structure'), {
    locale: 'ar',
    path: '/fees-structure',
  });
  assert.deepEqual(splitLocale('/ar'), { locale: 'ar', path: '/' });
  assert.deepEqual(splitLocale('/ar/'), { locale: 'ar', path: '/' });
});

test('a path that merely starts with two letters is not a language', () => {
  assert.deepEqual(splitLocale('/about-us'), {
    locale: 'en',
    path: '/about-us',
  });
  assert.deepEqual(splitLocale('/artists'), { locale: 'en', path: '/artists' });
});

test('the internal English prefix is read as English, not as a page', () => {
  // No visitor sees `/en/…` — the middleware redirects it away — but it is
  // what a route under `app/[locale]` is called while it is being prerendered,
  // and reading it as a page called "en" is what put `/ar/en/fees-structure`
  // in a language switcher.
  assert.deepEqual(splitLocale('/en/fees-structure'), {
    locale: 'en',
    path: '/fees-structure',
  });
  assert.deepEqual(splitLocale('/en'), { locale: 'en', path: '/' });
});

test('a switcher built while prerendering points at the public address', () => {
  assert.equal(localePath('ar', splitLocale('/en/fees-structure').path), '/ar/fees-structure/');
  assert.equal(localePath('en', splitLocale('/ar/fees-structure').path), '/fees-structure/');
});

test('splitting and rebuilding a path is a round trip', () => {
  for (const path of ['/', '/podcast', '/programs/mba', '/video-gallery']) {
    for (const locale of LOCALES) {
      const built = localePath(locale, path);
      const back = splitLocale(built);

      assert.equal(back.locale, locale, `${locale} ${path}`);
      assert.equal(back.path, path === '/' ? '/' : path, `${locale} ${path}`);
    }
  }
});

/* ----------------------------------------------------------- following */

test('a link followed from English is the address as written', () => {
  assert.equal(inLanguageOf('/', '/programs'), '/programs/');
  assert.equal(inLanguageOf('/fees-structure', '/contact'), '/contact/');
});

test('a link followed from Arabic stays in Arabic', () => {
  assert.equal(inLanguageOf('/ar', '/programs'), '/ar/programs/');
  assert.equal(inLanguageOf('/ar/fees-structure', '/'), '/ar/');
  assert.equal(
    inLanguageOf('/ar/programs', '/partners/ibas'),
    '/ar/partners/ibas/',
  );
});

test('an address that already names a language is left alone', () => {
  // An editor may type the prefix into a menu; prefixing twice 404s.
  assert.equal(inLanguageOf('/ar/programs', '/ar/contact'), '/ar/contact/');
  assert.equal(inLanguageOf('/', '/ar/contact/'), '/ar/contact/');
});

test('a query string and a fragment travel with the path', () => {
  assert.equal(
    inLanguageOf('/ar', '/video-gallery?category=ceremonies'),
    '/ar/video-gallery/?category=ceremonies',
  );
  assert.equal(inLanguageOf('/ar', '/programs/mba#apply'), '/ar/programs/mba/#apply');
});

test('anything that is not a path this app serves is untouched', () => {
  for (const href of [
    'https://example.com/x',
    'mailto:info@ecc-group.ae',
    'tel:+97141234567',
    '#main',
    '//cdn.example.com/x',
  ]) {
    assert.equal(inLanguageOf('/ar/programs', href), href, href);
  }
});

test('a null pathname is the default language, not a crash', () => {
  assert.equal(inLanguageOf(null, '/programs'), '/programs/');
});

/* -------------------------------------------------------- translations */

test('a translation is found at its own slug, not the original one', () => {
  assert.deepEqual(
    translatedPaths('en', '/insights/hello-world', [
      { locale: 'ar', slug: 'العربى-هالو-وورلد' },
    ]),
    { en: '/insights/hello-world', ar: '/insights/العربى-هالو-وورلد' },
  );
});

test('and the pairing reads the same from either side', () => {
  assert.deepEqual(
    translatedPaths('ar', '/insights/العربى-هالو-وورلد', [
      { locale: 'en', slug: 'hello-world' },
    ]),
    { ar: '/insights/العربى-هالو-وورلد', en: '/insights/hello-world' },
  );
});

test('a nested section keeps its shape', () => {
  assert.deepEqual(
    translatedPaths('en', '/programs/mba', [{ locale: 'ar', slug: 'ماجستير' }]),
    { en: '/programs/mba', ar: '/programs/ماجستير' },
  );
});

test('nothing translated means nothing claimed', () => {
  // Not `{ en: … }`: a lone entry would tell a crawler this page exists in one
  // language only, which is a claim, where saying nothing is not.
  assert.equal(translatedPaths('en', '/insights/x', []), null);
  assert.equal(translatedPaths('en', '/insights/x', undefined), null);
});

test('a language this site does not run in is not offered', () => {
  // A translation can name a language the front-end has no routes for (one
  // carried over from the old site, say); linking to it would be linking to a
  // 404.
  assert.equal(
    translatedPaths('en', '/insights/x', [{ locale: 'fr', slug: 'bonjour' }]),
    null,
  );
});

/* ------------------------------------------------------------- languages */

test('only the languages the site runs in are languages', () => {
  assert.equal(isLocale('en'), true);
  assert.equal(isLocale('ar'), true);
  assert.equal(isLocale('fr'), false);
  assert.equal(isLocale(undefined), false);
});

test('Arabic runs right to left and English does not', () => {
  assert.equal(direction('ar'), 'rtl');
  assert.equal(direction('en'), 'ltr');
});

test('English is the default', () => {
  assert.equal(DEFAULT_LOCALE, 'en');
});

/* ------------------------------------------------------------ the words */

test('every English key has an Arabic counterpart', () => {
  const missing = Object.keys(DICTIONARY.en).filter(
    (key) => !(key in DICTIONARY.ar),
  );

  assert.deepEqual(missing, [], `untranslated: ${missing.join(', ')}`);
});

test('and Arabic invents no key English does not have', () => {
  const extra = Object.keys(DICTIONARY.ar).filter(
    (key) => !(key in DICTIONARY.en),
  );

  assert.deepEqual(extra, []);
});

test('no Arabic string was left as its English self', () => {
  // Compared as plain strings: the tables are `as const`, so TypeScript can
  // see the literals never match and would reject the comparison outright.
  // The check still earns its place at runtime, against the day somebody
  // pastes an English string into the Arabic column.
  const en: Record<string, string> = DICTIONARY.en;
  const ar: Record<string, string> = DICTIONARY.ar;

  const untranslated = Object.keys(en).filter((key) => en[key] === ar[key]);

  assert.deepEqual(untranslated, []);
});

test('a translation is used where there is one', () => {
  assert.equal(translate('ar', 'cta.apply'), 'قدّم الآن');
  assert.equal(translate('en', 'cta.apply'), 'Apply now');
});

test('the whole table falls back to English for anything missing', () => {
  const table = messagesFor('ar');

  assert.equal(Object.keys(table).length, Object.keys(DICTIONARY.en).length);
  assert.equal(table['cta.apply'], 'قدّم الآن');
});
