/**
 * Merging CMS content over the seeded copy. Pure and import-free, so it runs
 * under `node --test` without the app around it.
 */

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * The CMS's value where it has one, the seeded value where it does not —
 * recursively, so an editor can fill a page one field at a time and the rest
 * keeps working.
 *
 * "Has one" means a non-blank string, a non-empty list, a number, a boolean, or
 * an object. A list replaces the seeded list whole rather than merging row by
 * row: three counters typed in mean three counters, not three plus the seed's
 * fourth.
 */
export function fill<T>(seed: T, cms: unknown): T {
  if (cms === undefined || cms === null) return seed;

  if (typeof cms === 'string') {
    return (cms.trim() ? cms : seed) as T;
  }

  if (Array.isArray(cms)) {
    if (!cms.length) return seed;

    // Rows take the seeded row's shape: an optional text field left empty
    // reads as '' rather than null, which is what the components expect.
    const template = Array.isArray(seed) ? seed.find(isObject) : undefined;
    return (template ? cms.map((row) => (isObject(row) ? shaped(template, row) : row)) : cms) as T;
  }

  if (isObject(cms) && isObject(seed) && !('sourceUrl' in cms)) {
    const out: Json = { ...seed };
    for (const key of new Set([...Object.keys(seed), ...Object.keys(cms)])) {
      out[key] = fill((seed as Json)[key], cms[key]);
    }
    return out as T;
  }

  return cms as T;
}

/** `row` with every string and list `template` has, empty where `row` has none. */
function shaped(template: Json, row: Json): Json {
  const out: Json = { ...row };
  for (const [key, example] of Object.entries(template)) {
    const value = row[key];
    if (value !== null && value !== undefined) {
      if (isObject(example) && isObject(value) && !('sourceUrl' in value)) out[key] = shaped(example, value);
      continue;
    }
    if (typeof example === 'string') out[key] = '';
    else if (Array.isArray(example)) out[key] = [];
    else if (isObject(example) && !('sourceUrl' in example)) out[key] = shaped(example, {});
  }
  return out;
}

