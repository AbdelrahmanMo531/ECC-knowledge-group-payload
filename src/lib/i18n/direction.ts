/**
 * Which way the page reads, asked of the page itself.
 *
 * The CSS in this project is written in logical properties, so a layout
 * mirrors for Arabic without anything having to be told about it. Scripting is
 * the part that cannot: `scrollLeft`, `clientX` and `scrollBy` are all
 * measured along the physical X axis, and in a right-to-left page the axis
 * runs against the reading order. A carousel that pages "next" by adding to
 * `scrollLeft` pages backwards in Arabic.
 *
 * Read from the element rather than from a prop, because the answer is the
 * browser's: `dir` can be set on the document, on a subtree, or inherited from
 * a translated fragment, and computed style is the only thing that knows which
 * of those won.
 */

/** `'rtl'` where the given element sits, `'ltr'` everywhere else. */
export function readingDirection(
  element: Element | null | undefined,
): 'ltr' | 'rtl' {
  if (!element || typeof window === 'undefined') return 'ltr';

  return window.getComputedStyle(element).direction === 'rtl' ? 'rtl' : 'ltr';
}

/**
 * `1` where reading and the X axis agree, `-1` where they do not.
 *
 * Multiply any horizontal distance by this to turn "onward" into pixels.
 */
export function readingAxis(element: Element | null | undefined): 1 | -1 {
  return readingDirection(element) === 'rtl' ? -1 : 1;
}
