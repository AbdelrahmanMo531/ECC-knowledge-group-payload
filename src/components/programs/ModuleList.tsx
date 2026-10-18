'use client';

import type { Module } from '@/lib/cms/types';
import { useT } from '@/lib/i18n/useT';

/**
 * Modules as an accordion.
 *
 * Native `<details>`, like the FAQ: keyboard-accessible and correct for screen
 * readers for free, and the aims and outcomes sit in the HTML whether or not a
 * row is open, so they are indexed either way.
 */
export function ModuleList({
  modules,
  aimsLabel = 'Aims',
  className = '',
}: {
  modules: Module[];
  /**
   * Heading for the aims block. A taught unit on a bachelor's calls these
   * "Unit objectives"; a master's module calls them "Aims".
   */
  aimsLabel?: string;
  className?: string;
}) {
  const t = useT();

  if (modules.length === 0) return null;

  return (
    <ul className={`space-y-3 ${className}`}>
      {/*
        The index is part of the key because a programme can teach a module of
        the same name in more than one stage, and duplicate keys would make
        React reuse the wrong <details> when a list re-renders.
      */}
      {modules.map((module, index) => (
        <li key={`${index}-${module.title}`}>
          <details className="group rounded-[var(--radius-brand)] border border-brand-sand/80 bg-brand-beige/40 transition-colors duration-200 open:border-brand-turquoise/40 hover:border-brand-turquoise/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start [&::-webkit-details-marker]:hidden">
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                <span className="text-base font-bold leading-snug text-brand-teal">
                  {module.title}
                </span>

                {/*
                  A documented module can still carry a credit value and a
                  level. They belong on the closed row — that is the part a
                  visitor scans.
                */}
                {[module.credits, module.level]
                  .filter((value) => value?.trim())
                  .map((value, badge) => (
                    <span
                      key={`${badge}-${value}`}
                      className="rounded-full bg-brand-beige px-2.5 py-0.5 text-[0.7rem] font-medium text-brand-ink/65"
                    >
                      {value}
                    </span>
                  ))}
              </span>

              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-sand text-brand-turquoise transition-all duration-300 group-open:rotate-45 group-open:border-brand-turquoise group-open:bg-brand-turquoise group-open:text-white"
              >
                <svg width="11" height="11" viewBox="0 0 12 12">
                  <path
                    d="M6 1v10M1 6h10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>

            <div className="space-y-5 px-5 pb-5">
              {module.aims ? (
                <div>
                  <h5 className="text-xs font-medium uppercase tracking-[0.14em] text-brand-turquoise">
                    {aimsLabel}
                  </h5>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">
                    {module.aims}
                  </p>
                </div>
              ) : null}

              {module.outcomes.length > 0 ? (
                <div>
                  <h5 className="text-xs font-medium uppercase tracking-[0.14em] text-brand-turquoise">
                    {t('programme.outcomes')}
                  </h5>
                  <ul className="mt-2 space-y-2">
                    {module.outcomes.map((outcome, position) => (
                      <li
                        key={`${position}-${outcome}`}
                        className="flex gap-2.5 text-sm leading-relaxed text-brand-ink/75"
                      >
                        <span
                          aria-hidden
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-gold"
                        />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
