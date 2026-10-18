/**
 * Reading the interesting number out of a payment option.
 *
 * "Pay in full and receive a 5% early-settlement discount" has one thing in it
 * a visitor is scanning for, and it is the 5%. Pulling it onto a badge is the
 * difference between a card that gets read and three paragraphs that get
 * skimmed.
 *
 * Deliberately narrow. It matches two shapes and nothing else, and anything it
 * does not recognise gets no badge — a card with no badge is a card, where a
 * badge built from a half-understood sentence is wrong on the page. Editors
 * write prose; this reads it, and has to be wrong quietly when they write
 * something new.
 */

/** The number worth pulling out of a payment option, if there is one. */
export type PaymentAccent =
  | { kind: 'discount'; label: string }
  | { kind: 'installments'; options: string[] }
  | null;

/** e.g. "a 5% early-settlement discount" → 5%. */
const DISCOUNT = /(\d{1,2}(?:\.\d+)?)\s*%/;

/**
 * e.g. "3, 6, or 12 monthly installments" → 3, 6, 12.
 *
 * Anchored on the word, so "within 14 days" in some other sentence is not
 * mistaken for a plan.
 */
const INSTALLMENTS = /([\d,\s]*\d)(?:\s*,?\s*(?:or|and)\s*(\d+))?\s*(?:monthly\s+)?instal?lments?/i;

export function paymentAccent(description: string): PaymentAccent {
  const text = description.toLowerCase();

  // A percentage only counts when the sentence says what it is. A bare "5%"
  // could be anything — a pass rate, a fee, an interest charge.
  if (text.includes('discount')) {
    const found = description.match(DISCOUNT);

    if (found) return { kind: 'discount', label: `${found[1]}%` };
  }

  const plan = description.match(INSTALLMENTS);

  if (plan) {
    const options = `${plan[1]} ${plan[2] ?? ''}`
      .split(/[,\s]+/)
      .map((part) => part.trim())
      .filter((part) => /^\d+$/.test(part));

    // One number is a sentence about one plan, not a set of choices worth
    // laying out as a row of options.
    if (options.length > 1) return { kind: 'installments', options };
  }

  return null;
}

/**
 * Whether an option is the one to lead with.
 *
 * A page of equal-weight cards asks the visitor to compare three things they
 * have no basis to compare. The one carrying a discount is the one with an
 * answer in it, so it gets the emphasis.
 */
export function isFeatured(accent: PaymentAccent): boolean {
  return accent?.kind === 'discount';
}
