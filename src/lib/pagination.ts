/**
 * Splitting a list across numbered pages.
 *
 * Shared by the academic staff directory and the video testimonials, both of
 * which hold everything in memory and page it here — a faculty and a shelf of
 * graduate videos are each tens of items, not thousands, so one request and a
 * slice beats cursor pagination and gives every page a real total.
 */

export type Page<T> = {
  items: T[];
  /** 1-based, clamped into range. */
  current: number;
  total: number;
  /** How many items there are before paging. */
  count: number;
};

export const DEFAULT_PER_PAGE = 12;

/**
 * One page of a list.
 *
 * The requested page is clamped rather than 404'd: arriving at page 9 of a list
 * that shrank to three pages should show the last page, not an error.
 */
export function paginate<T>(items: T[], page: number, perPage: number): Page<T> {
  const size = Math.max(1, Math.floor(perPage) || DEFAULT_PER_PAGE);
  const total = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), total);
  const start = (current - 1) * size;

  return {
    items: items.slice(start, start + size),
    current,
    total,
    count: items.length,
  };
}

/**
 * The page numbers to show, with gaps marked.
 *
 * First, last, the current page and its neighbours; `null` is where a run was
 * skipped and an ellipsis belongs. Twenty pages of faculty would otherwise put
 * twenty buttons across the foot of the page.
 */
export function pageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const shown = new Set<number>([1, total, current]);

  for (const near of [current - 1, current + 1]) {
    if (near >= 1 && near <= total) shown.add(near);
  }

  // Keep the row a constant width: near an end there is no gap to spend, so
  // the space goes to more consecutive pages instead.
  if (current <= 3) [2, 3, 4].forEach((page) => shown.add(page));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((page) => shown.add(page));

  const sorted = [...shown].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const withGaps: (number | null)[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) withGaps.push(null);
    withGaps.push(page);
  });

  return withGaps;
}
