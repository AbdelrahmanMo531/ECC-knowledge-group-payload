import assert from 'node:assert/strict';
import { test } from 'node:test';

import { isStaged, isTabular, toCurriculum, totalCredits } from './curriculum.ts';
import type { Module } from '@/lib/cms/types';

const taught = (title: string, group?: string): Module => ({
  title,
  group: group ?? null,
  aims: null,
  outcomes: [],
});

/** A module documented as a table row: credits and level, no prose. */
const row = (title: string, credits?: string, level?: string): Module => ({
  title,
  group: null,
  aims: null,
  outcomes: [],
  credits: credits ?? null,
  level: level ?? null,
});

test('no modules produces no groups', () => {
  assert.deepEqual(toCurriculum([]), []);
});

test('modules without a stage collapse into one unnamed group', () => {
  const groups = toCurriculum([taught('Strategy'), taught('Finance')]);

  assert.equal(groups.length, 1);
  assert.equal(groups[0].title, null);
  assert.equal(groups[0].modules.length, 2);
  assert.equal(isStaged(groups), false);
});

test('modules split by stage, in the declared order', () => {
  const groups = toCurriculum(
    [
      taught('Business Ethics', 'Second Year'),
      taught('The Business Environment', 'First Year'),
      taught('Sales', 'Third Year'),
      taught('Communication Skills', 'First Year'),
    ],
    [
      { title: 'First Year', subtitle: 'Foundations.' },
      { title: 'Second Year', subtitle: 'Integration.' },
      { title: 'Third Year' },
    ],
  );

  assert.deepEqual(
    groups.map((group) => group.title),
    ['First Year', 'Second Year', 'Third Year'],
  );
  assert.deepEqual(
    groups[0].modules.map((m) => m.title),
    ['The Business Environment', 'Communication Skills'],
  );
  assert.equal(groups[0].subtitle, 'Foundations.');
  assert.equal(groups[2].subtitle, null);
  assert.equal(isStaged(groups), true);
});

test('a stage no module uses is dropped rather than rendered empty', () => {
  const groups = toCurriculum(
    [taught('The Business Environment', 'First Year')],
    [{ title: 'First Year' }, { title: 'Second Year', subtitle: 'Not written yet.' }],
  );

  assert.deepEqual(
    groups.map((group) => group.title),
    ['First Year'],
  );
});

test('a stage with no description still renders, after the declared ones', () => {
  const groups = toCurriculum(
    [taught('Sales', 'Third Year'), taught('Ethics', 'First Year')],
    [{ title: 'First Year', subtitle: 'Foundations.' }],
  );

  assert.deepEqual(
    groups.map((group) => group.title),
    ['First Year', 'Third Year'],
  );
});

test('stage names match regardless of case and surrounding space', () => {
  const groups = toCurriculum(
    [taught('A', 'First Year'), taught('B', ' first year ')],
    [{ title: 'First Year', subtitle: 'Foundations.' }],
  );

  assert.equal(groups.length, 1);
  assert.equal(groups[0].title, 'First Year');
  assert.equal(groups[0].modules.length, 2);
});

test('a mix of staged and unstaged modules keeps the unstaged ones', () => {
  const groups = toCurriculum(
    [taught('Induction'), taught('Sales', 'Third Year')],
    [{ title: 'Third Year' }],
  );

  assert.deepEqual(
    groups.map((group) => group.title),
    ['Third Year', null],
  );
  assert.equal(isStaged(groups), true);
});

test('modules with credits and no prose are a table', () => {
  assert.equal(isTabular([row('Macroeconomics', '6', 'MQF 5')]), true);
});

test('modules with prose stay an accordion even when they carry credits', () => {
  const documented: Module = { ...row('Strategy', '6'), aims: 'This unit aims to…' };

  assert.equal(isTabular([documented]), false);
});

test('modules with neither credits nor level are not a table', () => {
  assert.equal(isTabular([taught('Strategy')]), false);
  assert.equal(isTabular([]), false);
});

test('credits total, carrying a unit every row agrees on', () => {
  assert.equal(totalCredits([row('A', '6 ECTS'), row('B', '6 ECTS')]), '12 ECTS');
  assert.equal(totalCredits([row('A', '6'), row('B', '6')]), '12');
});

test('a row without a readable credit value means no total', () => {
  assert.equal(totalCredits([row('A', '6'), row('B')]), null);
  assert.equal(totalCredits([row('A', '6'), row('B', 'varies')]), null);
  assert.equal(totalCredits([]), null);
});

test('mixed units total without claiming one of them', () => {
  assert.equal(totalCredits([row('A', '6 ECTS'), row('B', '6 credits')]), '12');
});

test('fractional credits do not print trailing zeros', () => {
  assert.equal(totalCredits([row('A', '7.5'), row('B', '7.5')]), '15');
});
