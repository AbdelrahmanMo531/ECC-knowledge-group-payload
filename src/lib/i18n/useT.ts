'use client';

import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

import { splitLocale } from './config';
import { translate, type MessageKey } from './dictionary';
import { useMessages } from './Messages';

/**
 * The site's own words, in the language of the page they are on.
 *
 * For anything that runs in the browser. The language is read from the path
 * rather than handed down, so a control buried six levels inside a dialog
 * needs nothing passed to it — which matters here, because the words that need
 * translating are mostly on exactly those controls: a close button, a mute
 * toggle, the placeholder in a select.
 *
 * What an editor has changed comes from the layout through `MessagesProvider`;
 * what the front-end ships is the fallback, so a key is never rendered bare and
 * a missing provider costs nothing.
 *
 * A server component cannot call this. Those use `t` from `./server`, which
 * reads the same two tables in the same order.
 */
export function useT(): (key: MessageKey) => string {
  const pathname = usePathname();
  const messages = useMessages();

  const { locale } = splitLocale(pathname ?? '/');

  return useCallback(
    (key: MessageKey) => messages[key] ?? translate(locale, key),
    [messages, locale],
  );
}
