'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Flag } from '@/components/ui/Flag';
import {
  LOCALES,
  LOCALE_META,
  localePath,
  splitLocale,
  type Locale,
} from '@/lib/i18n/config';

/**
 * The way from one language to the other.
 *
 * It lands on the same page, not the homepage: someone reading about the DBA
 * in English who wants it in Arabic wants the Arabic DBA page, and being sent
 * back to the front door to find it again is the reason language switchers get
 * a bad name.
 *
 * With two languages there is nothing to choose between — there is only the
 * other one — so this is a single link naming it, written in its own script.
 * `hrefLang` and `lang` are on it because a crawler and a screen reader both
 * need to be told that the words after it change language; without `lang` the
 * word "العربية" is read out by an English voice.
 *
 * `NextLink` directly rather than the app's own wrapper: the address here is
 * already complete, and the wrapper would prefix it a second time.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const alternates = useAlternates(pathname);

  const { locale, path } = splitLocale(pathname ?? '/');

  const others = LOCALES.filter((code) => code !== locale) as Locale[];
  if (!others.length) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`.trim()}>
      {others.map((other) => (
        <NextLink
          key={other}
          href={alternates[other] ?? localePath(other, path)}
          hrefLang={LOCALE_META[other].tag}
          lang={LOCALE_META[other].tag}
          dir={LOCALE_META[other].dir}
          className="inline-flex items-center gap-2 rounded-full border border-brand-sand px-3 py-2 text-sm font-medium text-brand-ink/75 transition-colors hover:border-brand-teal hover:text-brand-teal"
        >
          <Flag code={LOCALE_META[other].flag} size={20} />
          {/*
            The name is hidden on a narrow screen, not removed: a flag alone is
            a country, and somebody who cannot read the page they landed on
            needs the language named. `sr-only` keeps it for a screen reader
            and for anyone who has turned images off.
          */}
          <span className="sr-only sm:not-sr-only">
            {LOCALE_META[other].label}
          </span>
        </NextLink>
      ))}
    </div>
  );
}

/**
 * The addresses this page has already declared for itself.
 *
 * Most routes are the same address in every language, and prefixing is all the
 * switcher needs. An article is not: each language's article is its own
 * document with its own slug, paired with the other under Translations, so the
 * Arabic "Hello world!" is at `/<a different slug>/` and prefixing lands on a
 * page that does not exist.
 *
 * The page already knows — it publishes the pairing as `hreflang` for
 * crawlers — so this reads it back out of the document rather than being told
 * a second time through a prop that every layout between here and the page
 * would have to carry. One source of truth, and a switcher that cannot
 * disagree with what search engines were told.
 *
 * Read after paint rather than during render: the first render has to match
 * the server's, which has no document to read.
 *
 * Watched rather than read once. On a client-side navigation the route changes
 * before the new page's head tags are applied, so a single read at that moment
 * finds the old page's links or none at all — which is how switching from the
 * Arabic article landed on the Arabic slug under `/insights/`. The observer
 * costs nothing while the head is still and is the only thing that reliably
 * knows when it has settled.
 */
function useAlternates(pathname: string | null): Partial<Record<Locale, string>> {
  const [alternates, setAlternates] = useState<Partial<Record<Locale, string>>>({});

  useEffect(() => {
    const read = () => {
      const found: Partial<Record<Locale, string>> = {};

      for (const locale of LOCALES) {
        const link = document.querySelector<HTMLLinkElement>(
          `link[rel="alternate"][hreflang="${LOCALE_META[locale].tag}"]`,
        );

        if (!link?.href) continue;

        // Absolute in the markup, because that is what a crawler wants; the
        // switcher wants the path, so the app routes rather than reloads.
        try {
          const url = new URL(link.href);
          found[locale] = `${url.pathname}${url.search}`;
        } catch {
          // A malformed href is one to ignore, not to crash the header over.
        }
      }

      setAlternates((was) =>
        LOCALES.every((locale) => was[locale] === found[locale]) ? was : found,
      );
    };

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.head, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [pathname]);

  return alternates;
}
