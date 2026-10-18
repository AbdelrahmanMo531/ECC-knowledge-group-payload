import { Link } from '@/components/ui/Link';
import { t } from '@/lib/i18n/server';
import { pageNumbers } from '@/lib/pagination';

/**
 * Numbered pages, as links.
 *
 * Links rather than buttons: every page is a real URL that can be shared,
 * bookmarked and crawled, and the whole thing works before any JavaScript has
 * loaded. `href` is a function so the caller keeps whatever else its URL
 * carries — a filter, a search — without this component knowing about it.
 */
export function Pagination({
  current,
  total,
  href,
  label = 'Pages',
}: {
  current: number;
  total: number;
  href: (page: number) => string;
  /** Names the row for assistive technology, e.g. "Pages of academics". */
  label?: string;
}) {
  if (total < 2) return null;

  return (
    <nav
      aria-label={label}
      className="mt-14 flex flex-wrap items-center justify-center gap-2"
    >
      <Step
        href={href(current - 1)}
        disabled={current === 1}
        label={t('list.previous')}
      />

      {pageNumbers(current, total).map((page, index) =>
        page === null ? (
          <span key={`gap-${index}`} aria-hidden className="px-1 text-brand-ink/35">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-label={`${t('list.page')} ${page}`}
            aria-current={page === current ? 'page' : undefined}
            scroll={false}
            className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors ${
              page === current
                ? 'bg-brand-teal text-brand-beige'
                : 'text-brand-teal hover:bg-brand-beige'
            }`}
          >
            {page}
          </Link>
        ),
      )}

      <Step
        href={href(current + 1)}
        disabled={current === total}
        label={t('list.next')}
      />
    </nav>
  );
}

/**
 * Previous and next.
 *
 * At either end it becomes a plain span: a link that goes nowhere is a link a
 * keyboard still stops at and a crawler still follows.
 */
function Step({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  const shape =
    'flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium';

  if (disabled) {
    return <span className={`${shape} text-brand-ink/25`}>{label}</span>;
  }

  return (
    <Link href={href} scroll={false} className={`${shape} text-brand-teal hover:bg-brand-beige`}>
      {label}
    </Link>
  );
}
