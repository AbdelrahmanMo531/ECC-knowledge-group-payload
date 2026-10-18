'use client';

import { useT } from '@/lib/i18n/useT';
import { totalCredits } from '@/lib/programs/curriculum';
import type { Module } from '@/lib/cms/types';

/**
 * Modules as a credits table.
 *
 * The counterpart to `ModuleList`: some programmes publish a schedule of
 * module, credit value and level rather than a documented syllabus, and
 * thirty accordion rows that open onto nothing serve nobody. Columns that no
 * module fills are dropped, so a table of titles and credits does not carry an
 * empty Level column down the page.
 */
export function ModuleTable({
  modules,
  className = '',
}: {
  modules: Module[];
  className?: string;
}) {
  const t = useT();

  if (modules.length === 0) return null;

  const hasCredits = modules.some((taught) => taught.credits?.trim());
  const hasLevel = modules.some((taught) => taught.level?.trim());
  const total = hasCredits ? totalCredits(modules) : null;

  return (
    // Narrow screens scroll the table sideways rather than the page.
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[30rem] border-collapse text-start">
        <thead>
          <tr className="border-b border-brand-teal/20">
            <th
              scope="col"
              className="py-3 pe-4 text-xs font-medium uppercase tracking-[0.14em] text-brand-teal"
            >
              {t('section.module')}
            </th>
            {hasCredits ? (
              <th
                scope="col"
                className="w-24 py-3 pe-4 text-center text-xs font-medium uppercase tracking-[0.14em] text-brand-teal"
              >
                {t('programme.credits')}
              </th>
            ) : null}
            {hasLevel ? (
              <th
                scope="col"
                className="w-28 py-3 text-center text-xs font-medium uppercase tracking-[0.14em] text-brand-teal"
              >
                {t('fact.level')}
              </th>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {modules.map((taught, index) => (
            <tr
              key={`${index}-${taught.title}`}
              className="border-b border-brand-sand/70 transition-colors duration-150 hover:bg-brand-beige/50"
            >
              <td className="py-3.5 pe-4 text-sm leading-snug text-brand-ink/85">
                {taught.title}
              </td>
              {hasCredits ? (
                <td className="py-3.5 pe-4 text-center text-sm tabular-nums text-brand-ink/70">
                  {taught.credits || '—'}
                </td>
              ) : null}
              {hasLevel ? (
                <td className="py-3.5 text-center text-sm text-brand-ink/70">
                  {taught.level || '—'}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>

        {/*
          Only when every row carries a readable number — a total that quietly
          skipped the rows it could not read would be worse than none.
        */}
        {total ? (
          <tfoot>
            <tr className="border-t-2 border-brand-teal/25">
              <th
                scope="row"
                className="py-4 pe-4 text-sm font-bold text-brand-teal"
              >
                {t('programme.credits.total')}
              </th>
              <td className="py-4 pe-4 text-center text-sm font-bold tabular-nums text-brand-teal">
                {total}
              </td>
              {/* Keeps the total under the Credits column it belongs to. */}
              {hasLevel ? <td /> : null}
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
