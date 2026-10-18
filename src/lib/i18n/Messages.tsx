'use client';

import { createContext, useContext, type ReactNode } from 'react';

/**
 * The interface's own words, carried into the browser.
 *
 * A client component cannot read the request-scoped store the server uses, and
 * it cannot read the CMS on its own, since Payload's Local API runs only on
 * the server — so the layout hands the finished table down once and every
 * control below reads from it. Without this, a close button would still say
 * what the front-end shipped while the heading beside it said what an editor
 * had rewritten.
 *
 * Empty by default, which is what `useT` sees if the provider is ever missing.
 * It falls back to the shipped dictionary, so nothing renders a bare key.
 */
const Context = createContext<Record<string, string>>({});

export function MessagesProvider({
  messages,
  children,
}: {
  messages: Record<string, string>;
  children: ReactNode;
}) {
  return <Context.Provider value={messages}>{children}</Context.Provider>;
}

export function useMessages(): Record<string, string> {
  return useContext(Context);
}
