'use client';

import { useRef, useState, type PointerEvent, type ReactNode } from 'react';

import { Arrow } from '@/components/ui/Arrow';
import { readingAxis } from '@/lib/i18n/direction';
import { useT } from '@/lib/i18n/useT';

/**
 * A row of cards that becomes a scroller once there are too many for a row.
 *
 * Up to `limit` items it is an ordinary grid — a slider holding three cards
 * that already fit is a control with nothing to do. Past that, a grid grows
 * down the page and pushes everything after it out of view, so the cards
 * become a horizontal scroller instead: snap points, arrows on pointer
 * devices, and a native swipe on touch. Nothing is ever hidden — the scroller
 * holds every card, and the page still scrolls vertically past it.
 */
export function CardSlider({
  items,
  limit = 3,
  gridClassName = 'sm:grid-cols-2 lg:grid-cols-3',
  itemClassName = 'w-[19rem] sm:w-[21rem]',
  tone = 'light',
  label,
  heading,
  className = '',
}: {
  items: ReactNode[];
  /** Up to this many render as a grid. */
  limit?: number;
  gridClassName?: string;
  /** Width of one card in scroller mode. */
  itemClassName?: string;
  tone?: 'light' | 'dark';
  /** Names the scroller for screen readers, e.g. "Programmes". */
  label: string;
  /**
   * Rendered above the cards, with the arrows aligned to its right.
   *
   * A node rather than a render prop: this component runs on the client and a
   * function cannot cross that boundary from a server component.
   */
  heading?: ReactNode;
  className?: string;
}) {
  const t = useT();
  const scroller = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /*
   * Dragging with a mouse.
   *
   * Touch is left alone entirely: a touch screen already scrolls this, with
   * momentum and rubber-banding that no amount of pointer maths reproduces.
   * Taking it over would replace something good with something worse.
   *
   * `drag.current` holds where the pointer went down and how far the scroller
   * had travelled at that moment, so every move is measured from the start of
   * the gesture rather than from the last frame — accumulating deltas drifts.
   */
  const drag = useRef<{ pointer: number; scroll: number; moved: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType === 'touch' || event.button !== 0) return;

    drag.current = {
      pointer: event.clientX,
      scroll: event.currentTarget.scrollLeft,
      moved: 0,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    const start = drag.current;
    if (!start) return;

    const travelled = event.clientX - start.pointer;
    start.moved = Math.max(start.moved, Math.abs(travelled));

    // Below the threshold this is still a click on a card, not a drag. Waiting
    // is what stops a slightly unsteady click from being eaten.
    if (start.moved < 5) return;

    if (!dragging) setDragging(true);

    // The pointer capture keeps the gesture alive when it leaves the scroller,
    // and stops the browser starting a text or image selection.
    event.currentTarget.setPointerCapture(event.pointerId);

    // `scrollLeft` is physical. Content follows the pointer, so the scroller
    // moves the opposite way — in either direction, because both the pointer
    // delta and `scrollLeft` are measured along the same physical axis.
    event.currentTarget.scrollLeft = start.scroll - travelled;
  };

  const endDrag = (event: PointerEvent<HTMLUListElement>) => {
    const start = drag.current;
    drag.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    // Cleared on the next frame, not now: the click event that follows
    // pointerup has to find the guard still up, or a drag that finished over a
    // card would open it.
    if (start && start.moved >= 5) {
      requestAnimationFrame(() => setDragging(false));
      return;
    }

    setDragging(false);
  };

  /*
   * A drag that ends on a card must not also be a click on it.
   *
   * Mostly this is already true without help: once the gesture takes the
   * pointer capture the release retargets to the scroller, so the click lands
   * on the row rather than on the card and the card's link never fires. That
   * is a browser's behaviour rather than a guarantee, and the capture can fail
   * to be taken at all, so the guard stays as the thing that does not depend
   * on either.
   */
  const onClickCapture = (event: PointerEvent<HTMLUListElement>) => {
    if (!dragging) return;

    event.preventDefault();
    event.stopPropagation();
  };

  if (items.length === 0) return null;

  const isSlider = items.length > limit;

  const onScroll = () => {
    const element = scroller.current;
    if (!element) return;

    // `scrollLeft` is zero at the start in both directions and counts away
    // from it — negative in a right-to-left scroller, which is why the
    // distance travelled is the absolute value rather than the number itself.
    const travelled = Math.abs(element.scrollLeft);

    setAtStart(travelled <= 8);
    setAtEnd(travelled + element.clientWidth >= element.scrollWidth - 8);
  };

  const page = (direction: 1 | -1) => {
    const element = scroller.current;
    if (!element) return;

    // One card plus its gap, so a click lands on the next snap point.
    const card = element.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 24 : element.clientWidth;

    // `left` is a physical distance: paging onward means subtracting from it
    // in a right-to-left scroller, not adding.
    element.scrollBy({
      left: step * direction * readingAxis(element),
      behavior: 'smooth',
    });
  };

  const buttons = isSlider ? (
    <div className="flex gap-2">
      {([-1, 1] as const).map((direction) => (
        <button
          key={direction}
          type="button"
          onClick={() => page(direction)}
          disabled={direction === -1 ? atStart : atEnd}
          aria-label={`${t(
            direction === -1 ? 'list.previous' : 'list.next',
          )} ${label.toLowerCase()}`}
          className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-30 ${
            tone === 'dark'
              ? 'border-brand-beige/30 text-brand-beige hover:border-brand-gold hover:bg-brand-gold hover:text-brand-teal'
              : 'border-brand-sand text-brand-teal hover:border-brand-teal hover:bg-brand-teal hover:text-brand-beige'
          }`}
        >
          <Arrow back={direction === -1} />
        </button>
      ))}
    </div>
  ) : null;

  return (
    <>
      {heading || buttons ? (
        /*
          With a heading the arrows sit opposite it; without one they belong at
          the end of the row rather than adrift at its start, which is where
          `justify-between` leaves a single child.

          `mb-6` keeps the arrows off the cards. It collapses against whatever
          top margin a caller puts on the row below, so a section that already
          spaces the two apart keeps its own spacing rather than gaining this
          on top of it.
        */
        <div
          className={`mb-6 flex flex-wrap items-end gap-6 ${
            heading ? 'justify-between' : 'justify-end'
          }`}
        >
          {heading}
          {buttons}
        </div>
      ) : null}

      {isSlider ? (
        <>
          <ul
            ref={scroller}
            onScroll={onScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
            // Links and images are draggable by default, so a mouse drag
            // starting on a card would pick the card's photograph up as a
            // browser drag-and-drop rather than scrolling the row. Cancelled
            // here for every descendant at once, rather than annotating each
            // card that happens to contain a link or an image.
            onDragStart={(event) => event.preventDefault()}
            aria-label={label}
            className={`flex gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
              // Snapping is turned off for the duration of a drag: with it on,
              // the scroller fights the pointer, jumping back to the nearest
              // snap point on every frame.
              dragging
                ? 'cursor-grabbing select-none'
                : 'cursor-grab snap-x snap-mandatory'
            } ${className}`}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`flex shrink-0 snap-start ${itemClassName}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className={`grid gap-6 ${gridClassName} ${className}`}>
          {items.map((item, index) => (
            <li key={index} className="flex">
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
