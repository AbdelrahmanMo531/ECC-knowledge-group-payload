/**
 * Grouping people into the tabs of the Our People page.
 *
 * The page lists the tabs and their order; each person names their team in
 * their own field. Matching the two is deliberately forgiving — an editor
 * typing "Board members" on one screen and "Board Members" on the other should
 * not produce two tabs — and deliberately lossless: someone whose team is not
 * listed still appears, in a tab of their own, rather than vanishing from a
 * page whose whole job is to show them.
 */

import type { Person } from '@/lib/cms/types';

/** A tab as the editor defined it. */
export type Team = {
  label: string;
  description: string;
};

/**
 * The tab each collection falls into when a person names no team of their own.
 *
 * Publishing people without touching the Our People page then still produces
 * two sensible tabs rather than one bucket called "everybody".
 */
export const DEFAULT_TEAMS = {
  academic: 'Academic Team',
  team: 'Our Team',
} as const;

/** A tab with its people. */
export type PeopleGroup = {
  /** Stable key for the tab, derived from the label. */
  id: string;
  label: string;
  description: string;
  members: Person[];
};

/** Case, spacing and punctuation are not what makes two team names different. */
export function teamKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Arranges people into tabs.
 *
 * Listed teams come first, in the order the page gives them; teams that only
 * the people mention follow, in the order they are first met. Empty tabs are
 * dropped — a tab you can click to see nothing is worse than no tab.
 */
export function groupByTeam(members: Person[], teams: Team[]): PeopleGroup[] {
  const groups = new Map<string, PeopleGroup>();

  for (const team of teams) {
    const label = team.label.trim();
    if (!label) continue;

    groups.set(teamKey(label), {
      id: teamKey(label),
      label,
      description: team.description.trim(),
      members: [],
    });
  }

  for (const member of members) {
    const label = (member.team ?? '').trim() || DEFAULT_TEAMS.team;
    const key = teamKey(label);

    // A team nobody listed still gets a tab, at the end, named as the person
    // wrote it — losing someone off this page is the one unacceptable outcome.
    const group = groups.get(key) ?? {
      id: key,
      label,
      description: '',
      members: [],
    };

    group.members.push(member);
    groups.set(key, group);
  }

  return [...groups.values()].filter((group) => group.members.length > 0);
}

/**
 * Fills in the tab for anyone who named none.
 *
 * Applied per source, so faculty default to one tab and everyone else to
 * another — see `DEFAULT_TEAMS`.
 */
export function withDefaultTeam(people: Person[], team: string): Person[] {
  return people.map((person) =>
    (person.team ?? '').trim() ? person : { ...person, team },
  );
}
