'use client';

import Image from 'next/image';
import { useId, useState } from 'react';

import type { ValueProp } from '@/lib/cms/types';
import { readingAxis } from '@/lib/i18n/direction';
import { useT } from '@/lib/i18n/useT';

/**
 * The communities ECC sits between, drawn as a ring around the mark.
 *
 * The sentence above this says ECC sits at the intersection of five
 * communities. A stacked list says the opposite — that they come one after
 * another, and that the first matters most. A ring says what the sentence
 * says, which is the whole reason to draw one.
 *
 * Tabs, semantically: five buttons and five panels, so it is one arrow key per
 * stakeholder for anyone not using a mouse, and every description is in the
 * HTML whether or not it is the one showing.
 *
 * The ring is a wide-screen treatment. Below `lg` there is no room for a
 * circle with legible labels on it, so the same tabs stack into a row above
 * the panel — same markup, same behaviour, no second component to keep in step.
 */
export function EcosystemOrbit({ items }: { items: ValueProp[] }) {
  const t = useT();
  const id = useId();
  const [active, setActive] = useState(0);

  if (!items.length) return null;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* ------------------------------------------------------ the ring -- */}
      <div
        role="tablist"
        aria-label={t('aria.stakeholders')}
        aria-orientation="horizontal"
        className="flex flex-wrap justify-center gap-2.5 lg:relative lg:mx-auto lg:block lg:aspect-square lg:w-full lg:max-w-[30rem]"
      >
        {/*
          The connectors and the mark, drawn behind the ring. Decorative: the
          relationship they show is stated in the copy beside them.
        */}
        <svg
          viewBox="0 0 100 100"
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          {items.map((item, index) => {
            const { x, y } = pointOn(index, items.length, 34);

            return (
              <line
                key={item.title}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth={index === active ? 0.6 : 0.3}
                className={
                  index === active ? 'text-brand-gold' : 'text-brand-teal/25'
                }
              />
            );
          })}
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.3"
            strokeDasharray="1.5 2"
            className="text-brand-teal/20"
          />
        </svg>

        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-brand-sand bg-white shadow-lg shadow-brand-teal/[0.06] lg:grid"
        >
          <Image
            src="/brand/ecc-mark.svg"
            alt=""
            width={340}
            height={432}
            className="h-14 w-auto"
          />
        </span>

        {items.map((item, index) => {
          const { x, y } = pointOn(index, items.length, 34);
          const selected = index === active;

          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                // Down always means onward; the horizontal pair follows the
                // way the page reads, which is right to left in Arabic.
                const axis = readingAxis(event.currentTarget);

                const by =
                  event.key === 'ArrowRight'
                    ? axis
                    : event.key === 'ArrowLeft'
                      ? -axis
                      : event.key === 'ArrowDown'
                        ? 1
                        : event.key === 'ArrowUp'
                          ? -1
                          : 0;

                if (!by) return;

                event.preventDefault();
                const next = (index + by + items.length) % items.length;
                setActive(next);
                document.getElementById(`${id}-tab-${next}`)?.focus();
              }}
              // Positioned on the ring only where there is a ring: the
              // percentages are ignored while the container is a flex row.
              style={{ ['--x' as string]: `${x}%`, ['--y' as string]: `${y}%` }}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-offset-2 lg:absolute lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:whitespace-nowrap lg:px-5 lg:py-3 ${
                selected
                  ? 'border-brand-teal bg-brand-teal text-brand-beige shadow-lg shadow-brand-teal/20 lg:scale-105'
                  : 'border-brand-sand bg-white text-brand-teal hover:border-brand-teal'
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* ----------------------------------------------------- the panel -- */}
      <div>
        {items.map((item, index) => (
          <div
            key={item.title}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={index !== active}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-brand-turquoise">
              {String(index + 1).padStart(2, '0')} — Stakeholder
            </p>
            <h3 className="mt-3 font-serif text-3xl font-bold leading-tight text-brand-teal">
              {item.title}
            </h3>
            <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />
            <p className="mt-5 text-lg leading-relaxed text-brand-ink/75">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Where the nth of `count` points sits on a circle, in percent.
 *
 * Starting at the top and running clockwise, which is the order the list is
 * written in — a ring that starts on the right reads as though it began in the
 * middle of the sentence.
 */
function pointOn(index: number, count: number, radius: number) {
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2;

  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}
