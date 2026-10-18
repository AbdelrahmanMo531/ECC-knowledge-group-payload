import type { Access, Where } from 'payload';

/** Anyone signed in to the admin. */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);

/** Everyone — content the site publishes. */
export const anyone: Access = () => true;

/**
 * Published documents for the public, everything for editors.
 *
 * Only applies to REST and GraphQL: the site reads through the Local API,
 * which bypasses access control, so its queries filter on `_status` themselves.
 */
export const publishedOrAuthenticated: Access = ({ req: { user } }) => {
  if (user) return true;

  return { _status: { equals: 'published' } } satisfies Where;
};
