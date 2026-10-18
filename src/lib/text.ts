/**
 * Shortens a paragraph to a lead.
 *
 * Used where a summary is needed and the editor has not written an excerpt:
 * the opening of the body stands in, cut at a sentence if one ends near the
 * limit, otherwise at a word. Never mid-word, and never with an ellipsis on
 * text that was already short enough.
 */
export function summarise(text: string, limit = 240): string {
  const clean = text.trim().replace(/\s+/g, ' ');
  if (clean.length <= limit) return clean;

  const window = clean.slice(0, limit);

  // A sentence ending in the last third of the window reads as a deliberate
  // stop rather than a truncation, so it wins over cutting at a word.
  const sentence = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('! '),
    window.lastIndexOf('? '),
  );
  if (sentence > limit * 0.6) return window.slice(0, sentence + 1);

  const word = window.lastIndexOf(' ');
  return `${(word > 0 ? window.slice(0, word) : window).replace(/[,;:]$/, '')}…`;
}

/**
 * The short form of an institution's name.
 *
 * Names are stored in full — "International Business Academy of Switzerland
 * (IBAS)" — which is right for a heading and far too long inside a sentence.
 * A trailing parenthetical that looks like an acronym is the name people
 * actually use, so it wins; any other parenthetical is simply dropped.
 */
export function shortName(name: string): string {
  const parenthetical = /\(([^()]{2,10})\)\s*$/.exec(name.trim());
  const inside = parenthetical?.[1].trim();

  if (inside && !inside.includes(' ') && inside === inside.toUpperCase()) {
    return inside;
  }

  return name.replace(/\s*\([^()]*\)\s*$/, '').trim();
}

/**
 * Splits an editor's textarea into paragraphs.
 *
 * A blank line starts a new one, which is how people type into a plain
 * textarea; single newlines inside a paragraph are treated as wrapping and
 * collapsed.
 */
export function toParagraphs(text: string | null | undefined): string[] {
  if (!text) return [];

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
