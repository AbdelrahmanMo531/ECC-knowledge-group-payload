import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  DEFAULT_TEAMS,
  groupByTeam,
  teamKey,
  withDefaultTeam,
  type Team,
} from './people.ts';
import type { Person } from './cms/types.ts';

const person = (name: string, team = ''): Person => ({
  id: name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  position: 'Academic Member',
  team,
});

const team = (label: string): Team => ({ label, description: '' });

const teams = [team('Board Members'), team('Our Managers'), team('Academic Team')];

test('people are grouped into the tabs the page lists, in that order', () => {
  const groups = groupByTeam(
    [
      person('Amina', 'Academic Team'),
      person('Yusuf', 'Board Members'),
      person('Rana', 'Our Managers'),
    ],
    teams,
  );

  assert.deepEqual(
    groups.map((group) => group.label),
    ['Board Members', 'Our Managers', 'Academic Team'],
  );
  assert.deepEqual(
    groups.map((group) => group.members.map((m) => m.name)),
    [['Yusuf'], ['Rana'], ['Amina']],
  );
});

test('a tab nobody is in is dropped', () => {
  const groups = groupByTeam([person('Yusuf', 'Board Members')], teams);

  assert.deepEqual(
    groups.map((group) => group.label),
    ['Board Members'],
  );
});

test('team names match loosely, so capitals and spacing do not split a tab', () => {
  const groups = groupByTeam(
    [person('Yusuf', 'board members'), person('Rana', 'Board  Members')],
    [team('Board Members')],
  );

  assert.equal(groups.length, 1);
  assert.equal(groups[0].label, 'Board Members');
  assert.equal(groups[0].members.length, 2);
});

test('a team the page never listed still gets a tab, at the end', () => {
  const groups = groupByTeam(
    [person('Yusuf', 'Board Members'), person('Sara', 'Global Student Network')],
    [team('Board Members')],
  );

  assert.deepEqual(
    groups.map((group) => group.label),
    ['Board Members', 'Global Student Network'],
  );
});

test('people with no team of their own are not lost', () => {
  const groups = groupByTeam([person('Sara')], teams);

  assert.deepEqual(
    groups.map((group) => group.label),
    ['Our Team'],
  );
  assert.equal(groups[0].members[0].name, 'Sara');
});

test('with no tabs listed at all, the people decide the tabs', () => {
  const groups = groupByTeam(
    [person('Yusuf', 'Board Members'), person('Rana', 'Our Managers')],
    [],
  );

  assert.deepEqual(
    groups.map((group) => group.label),
    ['Board Members', 'Our Managers'],
  );
});

test('a blank row in the tab list is ignored', () => {
  const groups = groupByTeam([person('Yusuf', 'Board Members')], [
    team('   '),
    team('Board Members'),
  ]);

  assert.deepEqual(
    groups.map((group) => group.label),
    ['Board Members'],
  );
});

test('the tab id is stable and slug-like', () => {
  assert.equal(teamKey('Our GSN (Global Student Network)'), 'our-gsn-global-student-network');
  assert.equal(teamKey('  Board Members  '), 'board-members');
});

test('someone with no team falls into their post type\'s own tab', () => {
  const faculty = withDefaultTeam([person('Amina')], DEFAULT_TEAMS.academic);
  const staff = withDefaultTeam([person('Rana')], DEFAULT_TEAMS.team);

  assert.deepEqual(
    groupByTeam([...staff, ...faculty], []).map((group) => group.label),
    ['Our Team', 'Academic Team'],
  );
});

test('a default is only filled in where the person named none', () => {
  const people = withDefaultTeam(
    [person('Amina', 'Board Members'), person('Rana')],
    DEFAULT_TEAMS.academic,
  );

  assert.deepEqual(
    people.map((p) => p.team),
    ['Board Members', 'Academic Team'],
  );
});

test('faculty and other staff can share a tab', () => {
  const groups = groupByTeam(
    [person('Rana', 'Board Members'), person('Amina', 'Board Members')],
    [team('Board Members')],
  );

  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].members.map((p) => p.name), ['Rana', 'Amina']);
});
