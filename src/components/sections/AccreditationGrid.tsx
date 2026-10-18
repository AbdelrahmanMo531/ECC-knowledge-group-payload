import { AccreditationCard } from '@/components/sections/AccreditationCard';
import type { Accreditation } from '@/lib/cms/types';

/**
 * Every badge, as a grid.
 *
 * The accreditations page shows all of them at once under its own page header
 * — there is no "see the rest" to send anyone to, so a grid that grows down the
 * page is exactly right there. The homepage slides them instead, because the
 * page below has somewhere else to be.
 */
export function AccreditationGrid({ items }: { items: Accreditation[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id} className="flex">
          <AccreditationCard item={item} />
        </li>
      ))}
    </ul>
  );
}
