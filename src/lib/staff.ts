/**
 * Filtering and paginating the academic staff directory.
 *
 * Both happen here rather than in the query. A faculty is tens of people, not
 * thousands: one request fetches them all, which means filtering is instant,
 * every filter-and-page combination pre-renders, and the counts beside each
 * specialisation are real rather than a second round trip.
 */

import type { AcademicMember, Term } from '@/lib/cms/types';

/** A specialisation, with how many academics are in it. */
export type SpecializationFilter = Term & { count: number };

/**
 * Every specialisation in use, with counts, most populous first.
 *
 * Built from the academics rather than from the taxonomy, so a specialisation
 * nobody is filed under never appears as a filter that leads to an empty page.
 */
export function specializationsOf(
  members: AcademicMember[],
): SpecializationFilter[] {
  const found = new Map<string, SpecializationFilter>();

  for (const member of members) {
    for (const term of member.specializations) {
      const existing = found.get(term.slug);

      if (existing) {
        existing.count += 1;
      } else {
        found.set(term.slug, { ...term, count: 1 });
      }
    }
  }

  return [...found.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  );
}

/**
 * The academics in one specialisation, or all of them.
 *
 * An unknown slug returns everybody rather than nobody: a stale bookmark or a
 * renamed term should show the directory, not an empty page that looks broken.
 */
export function filterBySpecialization(
  members: AcademicMember[],
  slug: string,
): AcademicMember[] {
  if (!slug) return members;

  const matching = members.filter((member) =>
    member.specializations.some((term) => term.slug === slug),
  );

  return matching.length ? matching : members;
}

/** Whether a slug names a specialisation anyone is actually filed under. */
export function isKnownSpecialization(
  members: AcademicMember[],
  slug: string,
): boolean {
  return members.some((member) =>
    member.specializations.some((term) => term.slug === slug),
  );
}

/**
 * The URL for one state of the directory.
 *
 * Page one and "all specialisations" are the defaults, so they are left out —
 * `/our-academic-staff` and `/our-academic-staff?page=1` would otherwise be two
 * URLs for one page, and search engines would have to pick.
 */
export function staffHref({
  page = 1,
  specialization = '',
}: {
  page?: number;
  specialization?: string;
} = {}): string {
  const params = new URLSearchParams();

  if (specialization) params.set('specialization', specialization);
  if (page > 1) params.set('page', String(page));

  const query = params.toString();

  return query ? `/our-academic-staff?${query}` : '/our-academic-staff';
}
