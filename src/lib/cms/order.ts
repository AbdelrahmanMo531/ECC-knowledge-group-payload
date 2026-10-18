/**
 * The order an editor arranged people in.
 *
 * An academic member has an **Order** field: a position in the list, 1 first.
 * Most people are given no number, and that is the point — putting the head of
 * faculty at the top should cost one number rather than numbering all forty.
 *
 * Its own module rather than a helper inside the reader, because the rule is
 * worth testing on its own and the reader cannot be imported outside a server.
 */

/** Anything carrying the editor's position field. */
export type Ordered = { order?: number | null };

/**
 * Sorts by the editor's position, leaving everyone else where they were.
 *
 * Numbered people come first, ascending. Everyone unnumbered follows, in the
 * order they arrived. The sort is stable, which is what makes that true and
 * what settles two people given the same number: they keep the order the CMS
 * sent them in rather than swapping about between requests.
 *
 * Zero, negative numbers and `null` all mean "not set". WordPress stored an
 * empty number box as 0, and the imported content still carries those zeros;
 * nobody is in position zero.
 */
export function inEditorOrder<T extends Ordered>(items: T[]): T[] {
  const at = (item: T) =>
    typeof item.order === 'number' && item.order > 0
      ? item.order
      : Number.POSITIVE_INFINITY;

  return [...items].sort((a, b) => at(a) - at(b));
}
