'use client';

import { useId, useState } from 'react';

import type { ValueProp } from '@/lib/cms/types';

/**
 * The fee categories, opened one at a time.
 *
 * Four paragraphs of small print is four paragraphs nobody reads. Four named
 * cards with the detail a click away is a list somebody scans, finds the one
 * they were worried about, and opens — which is the whole promise of the
 * section above it.
 *
 * Several can be open at once on purpose: someone comparing what tuition
 * covers against what the administrative fee covers should not have the first
 * one shut in their face to read the second.
 *
 * The answers are in the HTML whether or not a card is open — hidden with
 * `grid-template-rows`, which animates without measuring anything and leaves
 * the text where a search engine and a find-on-page can still reach it.
 */
export function FeeCards({ items }: { items: ValueProp[] }) {
  const id = useId();
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) =>
    setOpen((was) => {
      const next = new Set(was);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    // `items-start`, so opening one card does not stretch the one beside it.
    <ul className="grid items-start gap-4 lg:grid-cols-2">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panel = `${id}-${index}`;

        return (
          <li key={item.title}>
            <div
              className={`overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border transition-colors duration-300 ${
                isOpen
                  ? 'border-brand-turquoise/40 bg-brand-beige/50'
                  : 'border-brand-sand/70 bg-white hover:border-brand-turquoise/30'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={panel}
                className="group flex w-full items-center gap-4 p-6 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-inset sm:p-7"
              >
                <span
                  aria-hidden
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg font-bold transition-colors duration-300 ${
                    isOpen
                      ? 'bg-brand-gold text-brand-teal'
                      : 'bg-brand-beige text-brand-teal group-hover:bg-brand-gold/40'
                  }`}
                >
                  {index + 1}
                </span>

                <span className="flex-1 text-base font-bold leading-snug text-brand-teal sm:text-lg">
                  {item.title}
                </span>

                <span
                  aria-hidden
                  // The colour is set in each branch and nowhere else: a
                  // `text-brand-teal` in the shared part would be a second
                  // text-colour utility of equal specificity, and which one
                  // won would be decided by the stylesheet rather than by
                  // this line — which is how the open state ended up drawing
                  // a teal cross on a teal circle.
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-[var(--ease-brand)] ${
                    isOpen
                      ? 'rotate-45 border-brand-teal bg-brand-teal text-brand-beige'
                      : 'border-brand-sand text-brand-teal group-hover:border-brand-teal'
                  }`}
                >
                  <PlusIcon />
                </span>
              </button>

              <div
                id={panel}
                className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-brand)] ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-7 text-base leading-relaxed text-brand-ink/70 sm:px-7 sm:ps-[4.75rem]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** A plus that becomes a cross by rotating, rather than swapping icons. */
function PlusIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
