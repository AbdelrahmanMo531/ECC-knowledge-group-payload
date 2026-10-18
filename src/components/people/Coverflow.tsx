'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { Person } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { Link } from '@/components/ui/Link';
import { readingAxis } from '@/lib/i18n/direction';

/**
 * A carousel of portraits with the current one centred and forward.
 *
 * The cards are laid out from one number — how far each is from the centre —
 * so position, scale, rotation, dimming and stacking order all fall out of the
 * same value and cannot disagree. Everything is a CSS transform on the
 * compositor, so a wide deck stays smooth without a carousel library.
 *
 * It wraps: from the last card, "next" walks forward to the first rather than
 * springing backwards. Nothing is duplicated to achieve that — each card is
 * placed at its shortest way round, which is also what makes an eleven-person
 * team no more work to render than a three-person one.
 */
export function Coverflow({
  members,
  label,
}: {
  members: Person[];
  /** Names the carousel for assistive technology, e.g. "Board Members". */
  label: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  const count = members.length;

  const go = useCallback(
    (step: number) => setActive((current) => (current + step + count) % count),
    [count],
  );

  // Autoplay, unless the visitor is interacting, has the tab in the background,
  // or has asked their system for less motion.
  useEffect(() => {
    if (count < 2 || paused) return;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (calm.matches) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) go(1);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [count, paused, go]);

  // Arrow keys, once the carousel itself has focus. The key that moves the
  // deck forward is the one pointing the way the page reads, so in Arabic it
  // is the left arrow that reaches the next person.
  const onKeyDown = (event: React.KeyboardEvent) => {
    const axis = readingAxis(event.currentTarget);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(axis);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-axis as 1 | -1);
    }
  };

  // Pointer drag, so a phone can swipe and a mouse can throw.
  const onPointerDown = (event: React.PointerEvent) => {
    drag.current = { x: event.clientX, moved: false };
    setPaused(true);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const start = drag.current;
    if (!start || start.moved) return;

    // Dragging toward the end of the line advances the deck: leftwards in
    // English, rightwards in Arabic.
    const travelled = (event.clientX - start.x) * readingAxis(event.currentTarget);

    if (Math.abs(travelled) > 45) {
      go(travelled < 0 ? 1 : -1);
      drag.current = { x: event.clientX, moved: true };
    }
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  /**
   * How far each card sits from the centre, by the shortest way round.
   *
   * Six of one and half a dozen of the other on an even-sized deck, so the tie
   * breaks forward — the card ahead of you is the one you are about to reach.
   */
  const offsets = useMemo(() => {
    const half = count / 2;

    return members.map((_, index) => {
      const raw = index - active;

      if (raw > half) return raw - count;
      if (raw < -half) return raw + count;

      return raw;
    });
  }, [members, active, count]);

  if (!count) return null;

  return (
    <div
      // `clip` rather than `hidden`: the neighbouring cards are meant to run
      // off both edges, but they must not widen the page on a phone. Unlike
      // `hidden` it does not force the vertical axis to scroll, so the shadow
      // under the centred card still shows.
      className="relative overflow-x-clip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={stage}
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        // Tall enough for the centred card and no taller: at 4/5 a 17rem card is
        // 21.25rem, a 21rem one 26.25rem.
        //
        // The deck fans toward the end of the line, so the whole stage is
        // mirrored in Arabic and each card mirrored back below. Flipping the
        // cards one at a time would not work: they are positioned by an inline
        // transform, and an inline style wins over any utility.
        className="relative h-[22rem] touch-pan-y select-none [perspective:1400px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise/60 rtl:-scale-x-100 sm:h-[27rem]"
      >
        {members.map((member, index) => {
          const offset = offsets[index];
          const distance = Math.abs(offset);
          const direction = Math.sign(offset);

          // Beyond the third card either side there is nothing left to see, so
          // they are folded behind the stack rather than painted.
          const hidden = distance > 3;
          const reach = Math.min(distance, 3);

          return (
            <figure
              key={member.id}
              aria-hidden={distance > 0 ? true : undefined}
              className="absolute left-1/2 top-0 w-[17rem] transition-[transform,opacity] duration-500 ease-[var(--ease-brand)] will-change-transform sm:w-[21rem]"
              style={{
                transform: [
                  `translateX(calc(-50% + ${offset * 58}%))`,
                  `translateZ(${-reach * 130}px)`,
                  `rotateY(${direction * Math.min(distance, 2) * -22}deg)`,
                  `scale(${1 - reach * 0.06})`,
                ].join(' '),
                opacity: hidden ? 0 : 1 - reach * 0.22,
                zIndex: 10 - reach,
                pointerEvents: distance === 0 ? 'auto' : 'none',
                visibility: hidden ? 'hidden' : 'visible',
              }}
            >
              <div
                className={`overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal shadow-2xl transition-shadow duration-500 rtl:-scale-x-100 ${
                  distance === 0 ? 'shadow-brand-teal/30' : 'shadow-black/10'
                }`}
              >
                <div className="relative aspect-[4/5] w-full">
                  {member.photo?.sourceUrl ? (
                    <Image
                      src={member.photo.sourceUrl}
                      alt={member.photo.altText || member.name}
                      fill
                      sizes="(min-width: 640px) 21rem, 17rem"
                      className="object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-brand-beige/40">
                      {member.name.charAt(0)}
                    </span>
                  )}

                  {/* The name plate sits on the photograph, as on the card it
                      is modelled on, so the deck reads as one object. */}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-teal via-brand-teal/85 to-transparent px-5 pb-5 pt-14 text-brand-beige">
                    <p className="text-base font-semibold leading-tight">{member.name}</p>
                    {member.position ? (
                      <p className="mt-1 text-sm text-brand-beige/75">{member.position}</p>
                    ) : null}

                    {/*
                      Only the centred card is reachable — the others are
                      inert — so the link is safe to stretch over the whole
                      photograph without stealing clicks meant for the deck.
                    */}
                    {member.detailPath ? (
                      <Link
                        href={member.detailPath}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-gold transition-colors before:absolute before:inset-0 before:content-[''] hover:text-brand-beige"
                      >
                        Full profile <Arrow />
                      </Link>
                    ) : null}
                  </figcaption>
                </div>
              </div>
            </figure>
          );
        })}
      </div>

      {count > 1 ? (
        <>
          <StepButton direction="previous" onClick={() => go(-1)} />
          <StepButton direction="next" onClick={() => go(1)} />

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {members.map((member, index) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show ${member.name}`}
                aria-current={index === active ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === active
                    ? 'w-7 bg-brand-teal'
                    : 'w-2 bg-brand-teal/25 hover:bg-brand-teal/50'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}

      {/* Announced to a screen reader, which cannot see the deck move. */}
      <p aria-live="polite" className="sr-only">
        {members[active]?.name}
        {members[active]?.position ? `, ${members[active].position}` : ''} — {active + 1} of{' '}
        {count}
      </p>
    </div>
  );
}

function StepButton({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next';
  onClick: () => void;
}) {
  const next = direction === 'next';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${next ? 'Next' : 'Previous'} person`}
      className={`absolute top-[11rem] z-20 flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand bg-white/90 text-brand-teal shadow-lg backdrop-blur transition-colors hover:bg-brand-teal hover:text-brand-beige sm:top-[13rem] ${
        next ? 'end-0 sm:end-4' : 'start-0 sm:start-4'
      }`}
    >
      <svg
        width="11"
        height="20"
        viewBox="0 0 11 20"
        fill="none"
        aria-hidden
        // The chevron is drawn pointing the way English reads. Mirrored in
        // Arabic so "next" still points at what comes next.
        className={`rtl:-scale-x-100 ${next ? '' : 'rotate-180'}`}
      >
        <path
          d="M0.383 20.076a.75.75 0 0 1 0-1.06L9.198 10.2.383 1.465a.75.75 0 1 1 .982-1.06l9.069 9.069a1 1 0 0 1 0 1.414l-9.07 9.069a.75.75 0 0 1-.981.119Z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}
