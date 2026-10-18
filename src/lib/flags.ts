/**
 * Country flags.
 *
 * Drawn from SVGs bundled in `public/flags`, not from emoji. Emoji flags need
 * no assets, but Windows ships no colour flag glyphs at all: Chrome and Edge
 * there render the two regional-indicator letters instead, so a Swiss flag
 * shows as "CH" and reads as a bug rather than as a flag.
 *
 * The SVGs come from the MIT-licensed flag-icons project (see
 * `public/flags/LICENSE`). Only the countries ECC works with are bundled —
 * adding another is one file plus one entry in `BUNDLED_FLAGS` below. Anything
 * not bundled falls back to the country code in a badge, which is legible
 * everywhere.
 */

/**
 * Country names to ISO codes, covering the countries ECC actually works with.
 *
 * Only a fallback — editors can set the code explicitly on each partner, which
 * always wins over this lookup.
 */
const NAME_TO_CODE: Record<string, string> = {
  switzerland: 'CH',
  'united kingdom': 'GB',
  uk: 'GB',
  britain: 'GB',
  'great britain': 'GB',
  england: 'GB',
  croatia: 'HR',
  malaysia: 'MY',
  denmark: 'DK',
  'united states': 'US',
  usa: 'US',
  'united states of america': 'US',
  germany: 'DE',
  'south africa': 'ZA',
  'united arab emirates': 'AE',
  uae: 'AE',
  egypt: 'EG',
  'saudi arabia': 'SA',
  qatar: 'QA',
  kuwait: 'KW',
  bahrain: 'BH',
  oman: 'OM',
  jordan: 'JO',
  france: 'FR',
  spain: 'ES',
  italy: 'IT',
  netherlands: 'NL',
  canada: 'CA',
  australia: 'AU',
  india: 'IN',
  singapore: 'SG',
};

/**
 * ISO codes with an SVG in `public/flags`.
 *
 * Listed explicitly rather than probed at runtime: the component has to know
 * whether a file exists before it renders, and a missing file would otherwise
 * be a broken image rather than a graceful fall back to the code.
 */
export const BUNDLED_FLAGS = new Set([
  'ae', 'au', 'bh', 'ca', 'ch', 'de', 'dk', 'dz', 'eg', 'es',
  'fr', 'gb', 'hr', 'in', 'iq', 'it', 'jo', 'ke', 'kw', 'lb',
  'ma', 'my', 'ng', 'nl', 'om', 'pk', 'qa', 'sa', 'se', 'sg',
  'tn', 'tr', 'us', 'za',
]);

/** Path to a bundled flag, or null when that country has no SVG here. */
export function flagSrc(code: string | null | undefined): string | null {
  const lower = code?.trim().toLowerCase();
  return lower && BUNDLED_FLAGS.has(lower) ? `/flags/${lower}.svg` : null;
}

/** Resolves an ISO code from an explicit value or the country's name. */
export function countryCode(
  explicit: string | null | undefined,
  name: string | null | undefined,
): string | null {
  const code = explicit?.trim().toUpperCase();
  if (code && /^[A-Z]{2}$/.test(code)) return code;

  const key = name?.trim().toLowerCase();
  return key ? (NAME_TO_CODE[key] ?? null) : null;
}

/**
 * Converts an ISO code to its emoji flag.
 *
 * Kept for contexts where an image cannot go — a page title, a plain-text
 * export. Not used for the flag badges, which render the bundled SVGs.
 */
export function flagEmoji(code: string | null): string | null {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return null;

  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}
