'use client';

import { useId, useState } from 'react';

import { Coverflow } from '@/components/people/Coverflow';
import type { PeopleGroup } from '@/lib/people';
import { readingAxis } from '@/lib/i18n/direction';
import { useT } from '@/lib/i18n/useT';

/**
 * The teams, as tabs, each with its own carousel.
 *
 * A real tab set rather than links: the panels are all on this page and
 * switching between them should not move the page or touch the URL. Arrow keys
 * move between tabs the way the pattern expects, and only the selected tab is
 * in the tab order, so a keyboard reaches the carousel in one more press rather
 * than after every team on the page.
 */
export function PeopleTabs({ groups }: { groups: PeopleGroup[] }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const id = useId();

  if (!groups.length) return null;

  const move = (event: React.KeyboardEvent, index: number) => {
    // Tabs are walked the way they are laid out, and in Arabic they are laid
    // out from the right — so the left arrow reaches the next one.
    const axis = readingAxis(event.currentTarget);

    const keys: Record<string, number> = {
      ArrowRight: index + axis,
      ArrowLeft: index - axis,
      Home: 0,
      End: groups.length - 1,
    };

    const next = keys[event.key];
    if (next === undefined) return;

    event.preventDefault();

    const wrapped = (next + groups.length) % groups.length;
    setActive(wrapped);
    document.getElementById(`${id}-tab-${wrapped}`)?.focus();
  };

  const current = groups[active];

  return (
    <div>
      {groups.length > 1 ? (
        <div
          role="tablist"
          aria-label={t('aria.teams')}
          className="flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {groups.map((group, index) => (
            <button
              key={group.id}
              id={`${id}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => move(event, index)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                index === active
                  ? 'bg-brand-teal text-brand-beige'
                  : 'bg-brand-beige/70 text-brand-teal hover:bg-brand-sand'
              }`}
            >
              {group.label}
              <span className="ms-2 text-xs opacity-60">{group.members.length}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div
        id={`${id}-panel-${active}`}
        role={groups.length > 1 ? 'tabpanel' : undefined}
        aria-labelledby={groups.length > 1 ? `${id}-tab-${active}` : undefined}
        tabIndex={-1}
        className="mt-12 focus:outline-none"
      >
        {current.description ? (
          <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-brand-ink/70">
            {current.description}
          </p>
        ) : null}

        {/*
          Keyed on the team, so switching tabs builds a fresh carousel starting
          at its own first person rather than inheriting the last one's index.
        */}
        <Coverflow key={current.id} members={current.members} label={current.label} />
      </div>
    </div>
  );
}
