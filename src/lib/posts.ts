import type { Post } from './cms/types';

/**
 * An article's address, final and with its trailing slash.
 *
 * Articles live at the root — `/<slug>/` — in either language, because that is
 * where WordPress's `/%postname%/` permalinks put them and where their rankings
 * are. One published under a different path keeps that path.
 */
export function postHref(post: Pick<Post, 'path'>): string {
  return `${post.path.replace(/\/+$/, '')}/`;
}

/** How many articles a page of the blog holds. */
export const POSTS_PER_PAGE = 12;
