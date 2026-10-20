'use client';

import { useEffect, useRef, useState } from 'react';

import { Container } from '@/components/ui/Container';
import { statIcon } from '@/components/ui/icons';
import type { Stat } from '@/lib/cms/types';

/**
 * The counters, as a flat gold band.
 *
 * Gold is the point: the band sits between a dark hero and the sections below,
 * and any tinted-neutral treatment read as part of whichever section it
 * touched. Brand gold belongs to neither neighbour, so the numbers register as
 * their own statement.
 *
 * Numerals are set in the sans face at weight 700 — big, plain and legible at a
 * glance — with the label in turquoise beneath. Prefix and suffix are separate
 * repeater fields, so `+` renders ahead of the digits without the animation
 * having to work out where the number starts.
 */

const DURATION_MS = 1400;

function Counter({
  stat,
  icons,
  compact,
}: {
  stat: Stat;
  icons: boolean;
  compact: boolean;
}) {
  const target = Number(stat.number.replace(/[^\d.-]/g, ''));
  const grouped = stat.number.includes(',');
  const animatable = Number.isFinite(target) && stat.number.trim() !== '';

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(stat.number);

  useEffect(() => {
    if (!animatable) return;

    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let started = false;

    const format = (n: number) =>
      grouped ? Math.round(n).toLocaleString('en-US') : String(Math.round(n));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;

          started = true;
          setDisplay(format(0));

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / DURATION_MS, 1);
            // Ease-out cubic: quick off the mark, gentle settle.
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(format(target * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [animatable, grouped, target]);

  // The icon an editor picked for the row, or one read from its label when
  // none was. A band rendered with `icons={false}` drops them altogether.
  const Icon = icons ? statIcon(stat.icon, stat.label) : null;

  return (
    <div className={`text-center ${compact ? 'px-3 py-1' : 'px-3 py-2'}`}>
      {Icon ? (
        <span
          aria-hidden
          className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center text-brand-teal/70"
        >
          <Icon width={26} height={26} />
        </span>
      ) : null}

      {/*
        Pinned left to right, in both languages. The prefix, the digits and the
        suffix are three flex items, and a flex row lays out along the reading
        direction — so in Arabic "+130" came out as "130+". A number is written
        the same way in Arabic as in English; only the label beneath it turns
        round. `justify-center` means the pinning costs nothing in alignment.
      */}
      <p
        dir="ltr"
        className={`flex items-baseline justify-center font-bold leading-none tracking-[-0.03em] text-brand-ink ${
          compact ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-[2.5rem]'
        }`}
      >
        {stat.prefix ? <span>{stat.prefix}</span> : null}
        <span ref={ref} className="tabular-nums">
          {display}
        </span>
        {stat.suffix ? <span>{stat.suffix}</span> : null}
      </p>

      <p
        className={`leading-snug text-brand-turquoise ${
          compact ? 'mt-2 text-sm' : 'mt-3 text-sm sm:text-base'
        }`}
      >
        {stat.label}
      </p>
    </div>
  );
}

export function Stats({
  stats,
  icons = true,
  compact = false,
  id,
}: {
  stats: Stat[];
  /** Anchor target, so in-page navigation can link to the band. */
  id?: string;
  /** Set false to drop the icon row whatever each counter carries. */
  icons?: boolean;
  /** A shallower band with smaller numerals, for a secondary page. */
  compact?: boolean;
}) {
  if (stats.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-[9.5rem] bg-brand-gold">
      <Container size="wide">
        <dl
          className={`grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between lg:gap-8 ${
            compact ? 'gap-y-8 py-8 lg:py-9' : 'gap-y-7 py-7 lg:py-8'
          }`}
        >
          {stats.map((stat, index) => (
            <div key={`${index}-${stat.label}`} className="lg:flex-1">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <Counter stat={stat} icons={icons} compact={compact} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
