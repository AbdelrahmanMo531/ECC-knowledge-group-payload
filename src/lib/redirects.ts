import 'server-only';

import { permanentRedirect, redirect } from 'next/navigation';

import { findRedirect } from '@/lib/cms/api';
import { encodePath } from '@/lib/i18n/config';

/**
 * Follows a redirect an editor set up under SEO → Redirects, if there is one
 * for `path`; returns otherwise, so the caller can 404.
 *
 * Checked only once a route has found nothing, so it costs nothing on a page
 * that exists. `path` is the address as requested, language prefix included.
 */
export async function redirectIfMoved(path: string): Promise<void> {
  const rule = await findRedirect(path);
  if (!rule) return;

  const external = /^https?:\/\//i.test(rule.to);
  const withSlash = external || rule.to.endsWith('/') || /\.[a-z0-9]{2,5}$/i.test(rule.to) ? rule.to : `${rule.to}/`;
  const target = external ? encodeURI(decodeURI(withSlash)) : encodePath(withSlash);

  if (rule.permanent) permanentRedirect(target);
  redirect(target);
}
