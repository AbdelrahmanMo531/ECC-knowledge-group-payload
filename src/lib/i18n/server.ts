import 'server-only';

import { cache } from 'react';

import { getInterfaceStrings } from '@/lib/cms/api';

import { DEFAULT_LOCALE, isLocale, type Locale } from './config';
import { messagesFor, translate, type MessageKey } from './dictionary';

/**
 * The language of the page being rendered, and the words it says.
 *
 * A server component cannot use a hook, and the words that need translating
 * are spread across cards, tables and section headings that sit several levels
 * below the page — none of which have any other reason to know about
 * languages. Threading a `locale` prop through all of them would put the
 * language in the signature of half the component library.
 *
 * `cache()` gives one object per render, so this is scoped to the page being
 * built and cannot leak from one to another: two languages prerendered in the
 * same build get their own. Every page fills it as soon as it has resolved its
 * params, and everything underneath can then simply ask.
 *
 * `generateMetadata` runs in its own scope and is given the language outright,
 * so it never reads this.
 */
const store = cache((): { locale: Locale; overrides: Record<string, string> } => ({
  locale: DEFAULT_LOCALE,
  overrides: {},
}));

/**
 * Called by a page or layout the moment it has resolved its route params.
 *
 * Also fetches whatever an editor has changed about the interface's own words.
 * Awaited here rather than read lazily because `t()` is called from deep in the
 * tree and has to be able to answer without being async — and because a page
 * that renders before its overrides arrive would show the shipped wording and
 * then never correct it.
 */
export async function setRequestLocale(
  requested: string | undefined | null,
): Promise<Locale> {
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE;
  const current = store();

  current.locale = locale;
  current.overrides = await getInterfaceStrings(locale);

  return locale;
}

/** The language of the page being rendered. */
export function requestLocale(): Locale {
  return store().locale;
}

/**
 * One of the site's own words, in the language of the page.
 *
 * What the CMS says, where somebody has said anything; what the front-end
 * ships otherwise. The server's half of `useT`, reading the same two tables in
 * the same order.
 */
export function t(key: MessageKey): string {
  const { locale, overrides } = store();

  return overrides[key] ?? translate(locale, key);
}

/**
 * Every word the interface knows, for handing to the browser once.
 *
 * The layout passes this down so a client component answers from the same
 * table a server component does — a close button and a section heading cannot
 * be translated by different rules.
 */
export function messages(): Record<string, string> {
  const { locale, overrides } = store();

  return { ...messagesFor(locale), ...overrides };
}
