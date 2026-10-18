/**
 * Turning the site's filmed content into something the player understands.
 *
 * Two collections carry video — a graduate's testimonial and a gallery entry —
 * and to a grid and a lightbox they are the same thing. Mapping both onto one
 * shape here is what lets them share a component, so a fix to the player is a
 * fix in both places.
 */

// Relative and extension-qualified, so Node's test runner can load this
// module directly — it resolves neither the `@/` alias nor a bare specifier.
import { parseVideo } from './video.ts';
import type { GalleryVideo, Term, Testimonial, VideoItem } from '@/lib/cms/types';

/** A category, with how many films are filed under it. */
export type CategoryFilter = Term & { count: number };

/**
 * A filmed testimonial as a gallery item.
 *
 * The credit is assembled from what the testimonial knows about the speaker —
 * who they are, what they studied, where they are — which is the line that was
 * under these cards before they shared a component with anything else.
 */
export function testimonialAsVideo(film: Testimonial): VideoItem {
  return {
    id: film.id,
    // Testimonials have no slug of their own in the schema; the ID is stable
    // and unique, which is all a share link needs it to be.
    slug: film.id,
    title: film.videoTitle || film.title || film.authorName,
    credit: [film.authorName, film.program || film.authorRole, film.country]
      .filter(Boolean)
      .join(' · '),
    video: film.video ?? '',
    poster: film.poster,
  };
}

/**
 * The films that can actually be played.
 *
 * A card whose link cannot be read would open an empty dialog, which is worse
 * than not offering it — so anything unparseable is left out of the grid.
 */
export function playable<T extends { video: string }>(films: T[]): T[] {
  return films.filter((film) => parseVideo(film.video));
}

/**
 * Every category in use, with counts, in the order the CMS returns them.
 *
 * Built from the films rather than from the categories collection, so a
 * category nobody has filed anything under never appears as a filter leading
 * to an empty grid. Ordered as the CMS returns them rather than by size:
 * these are a fixed editorial set, and a filter row that reshuffles as videos
 * are added is harder to use than one that stays where it was.
 */
export function categoriesOf(films: GalleryVideo[]): CategoryFilter[] {
  const found = new Map<string, CategoryFilter>();

  for (const film of films) {
    for (const term of film.categories) {
      const existing = found.get(term.slug);

      if (existing) {
        existing.count += 1;
      } else {
        found.set(term.slug, { ...term, count: 1 });
      }
    }
  }

  return [...found.values()];
}

/**
 * The films in one category, or all of them.
 *
 * An unknown slug returns everything rather than nothing: a stale bookmark or
 * a renamed category should show the gallery, not an empty page that looks
 * broken.
 */
export function filterByCategory(
  films: GalleryVideo[],
  slug: string,
): GalleryVideo[] {
  if (!slug) return films;

  const matching = films.filter((film) =>
    film.categories.some((term) => term.slug === slug),
  );

  return matching.length ? matching : films;
}

/** Whether a category slug is one the gallery actually has films for. */
export function isKnownCategory(films: GalleryVideo[], slug: string): boolean {
  return films.some((film) => film.categories.some((term) => term.slug === slug));
}

/**
 * The gallery's own URL, for a given category, page and open film.
 *
 * One function builds every link on the page — the filter chips, the pager and
 * the share link — so a filter survives paging, a page survives filtering, and
 * a shared link carries whichever view it was copied from.
 */
export function galleryHref({
  category = '',
  page = 1,
  video = '',
}: {
  category?: string;
  page?: number;
  video?: string;
} = {}): string {
  const params = new URLSearchParams();

  if (category) params.set('category', category);
  // Page one is the canonical URL: `?page=1` would be a second address for it.
  if (page > 1) params.set('page', String(page));
  if (video) params.set('video', video);

  const query = params.toString();

  return query ? `/video-gallery?${query}` : '/video-gallery';
}
