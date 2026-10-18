'use client';

import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

import { inLanguageOf } from '@/lib/i18n/config';

/**
 * A link that stays in the language the visitor is reading.
 *
 * Internal addresses are written throughout the app the way English serves
 * them, and `inLanguageOf` puts the prefix back on. Doing it here means no
 * component between a page and its links has to carry a locale it does not
 * otherwise need, and no `href` can be forgotten.
 *
 * The language is read from the path rather than passed in, so this is a
 * client component — but `next/link` is one already, so the boundary it draws
 * was there anyway, and the children stay on the server because they arrive as
 * rendered elements.
 */
export function Link({
  href,
  exact = false,
  ...props
}: Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string;
  /**
   * Use `href` exactly as given. For an address that already is final — an
   * article's, which lives at the root whatever language the page linking
   * to it is in.
   */
  exact?: boolean;
}) {
  const pathname = usePathname();

  return <NextLink href={exact ? href : inLanguageOf(pathname, href)} {...props} />;
}
