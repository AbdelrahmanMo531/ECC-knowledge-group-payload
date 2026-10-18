import type { CurriculumGroup, Module } from '@/lib/cms/types';

/**
 * Groups a programme's modules into the stages it is taught in.
 *
 * Programmes are not all shaped the same. A master's runs one flat set of core
 * modules and puts its variety in the majors; a bachelor's has no majors at all
 * and is taught in years, each with its own introduction. Rather than model
 * those as two different field sets, a module carries an optional stage name
 * and the shape falls out of the data:
 *
 *   - no module names a stage  → one unnamed group, rendered as a plain list
 *   - modules name stages      → one group per stage, in `order`'s order first,
 *                                then any stage `order` does not mention, in
 *                                the order the modules introduce it
 *
 * A stage named only in `order` and used by no module is dropped: an editor who
 * writes an introduction for a year they have not filled in yet should not get
 * an empty heading on the live site.
 */
export function toCurriculum(
  modules: Module[],
  order: { title: string; subtitle?: string | null }[] = [],
): CurriculumGroup[] {
  if (modules.length === 0) return [];

  // Stage names are matched leniently — an editor typing "first year" in one
  // row and "First Year" in the next means the same year, and splitting them
  // into two headings would be a silently wrong page.
  const key = (name: string) => name.trim().toLowerCase();

  const introductions = new Map<string, { title: string; subtitle?: string | null }>();
  for (const entry of order) {
    const title = entry.title?.trim();
    if (title && !introductions.has(key(title))) {
      introductions.set(key(title), { title, subtitle: entry.subtitle });
    }
  }

  const groups = new Map<string, CurriculumGroup>();

  // Named `taught` rather than `module`: assigning to `module` trips Next's
  // no-assign-module-variable rule, which exists to stop CommonJS confusion.
  for (const taught of modules) {
    const name = taught.group?.trim() ?? '';
    const id = name ? key(name) : '';

    let group = groups.get(id);
    if (!group) {
      const introduction = introductions.get(id);
      group = {
        // The introduction's spelling wins, so one typo in the modules table
        // does not change the heading.
        title: introduction?.title ?? (name || null),
        subtitle: introduction?.subtitle?.trim() || null,
        modules: [],
      };
      groups.set(id, group);
    }

    group.modules.push(taught);
  }

  const declared = [...introductions.keys()].filter((id) => groups.has(id));
  const undeclared = [...groups.keys()].filter((id) => !introductions.has(id));

  return [...declared, ...undeclared].map((id) => groups.get(id) as CurriculumGroup);
}

/** True when the curriculum is taught in named stages rather than one list. */
export function isStaged(groups: CurriculumGroup[]): boolean {
  return groups.some((group) => Boolean(group.title));
}

/**
 * True when these modules are a credits table rather than an accordion.
 *
 * Some programmes document every module with objectives and outcomes; others
 * publish a plain schedule of module, credit value and level. An accordion of
 * thirty rows that open onto nothing is the worst of both, so the presence of
 * credit or level data with no prose is taken as "this is a table".
 */
export function isTabular(modules: Module[]): boolean {
  if (modules.length === 0) return false;

  const hasProse = modules.some(
    (taught) => taught.aims?.trim() || taught.outcomes.length > 0,
  );
  const hasColumns = modules.some(
    (taught) => taught.credits?.trim() || taught.level?.trim(),
  );

  return hasColumns && !hasProse;
}

/**
 * Sums the credit values of a set of modules, e.g. "180 ECTS".
 *
 * Returns null unless every module carries a number, because a total that
 * silently omits the rows it could not read is worse than no total at all.
 * Units are free text ("6", "6 ECTS", "6 credits"): the unit is carried through
 * only when every row agrees on it.
 */
export function totalCredits(modules: Module[]): string | null {
  if (modules.length === 0) return null;

  let sum = 0;
  const units = new Set<string>();

  for (const taught of modules) {
    const match = /^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(taught.credits?.trim() ?? '');
    if (!match) return null;

    sum += Number(match[1].replace(',', '.'));
    if (match[2].trim()) units.add(match[2].trim().toLowerCase());
  }

  // Trailing zeros help nobody: 180, not 180.00.
  const total = String(Number(sum.toFixed(2)));

  return units.size === 1 ? `${total} ${[...units][0].toUpperCase()}` : total;
}
