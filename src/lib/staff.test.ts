import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  filterBySpecialization,
  isKnownSpecialization,
  specializationsOf,
  staffHref,
} from './staff.ts';
import type { AcademicMember } from './cms/types.ts';

const academic = (name: string, ...specializations: string[]): AcademicMember => ({
  id: name,
  slug: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  position: 'Academic Member',
  expertise: [],
  teaching: [],
  research: [],
  qualifications: [],
  experience: [],
  specializations: specializations.map((term) => ({
    name: term,
    slug: term.toLowerCase().replace(/\s+/g, '-'),
  })),
});

const faculty = [
  academic('One', 'Accounting', 'Finance'),
  academic('Two', 'Accounting'),
  academic('Three', 'Marketing'),
  academic('Four'),
];

/* -------------------------------------------------------------------------- */
/* Specialisations                                                            */
/* -------------------------------------------------------------------------- */

test('specialisations are counted and ordered by how many are in them', () => {
  assert.deepEqual(
    specializationsOf(faculty).map((term) => [term.name, term.count]),
    [
      ['Accounting', 2],
      ['Finance', 1],
      ['Marketing', 1],
    ],
  );
});

test('ties break alphabetically, so the order does not wander', () => {
  const terms = specializationsOf([academic('A', 'Zoology'), academic('B', 'Anatomy')]);

  assert.deepEqual(terms.map((term) => term.name), ['Anatomy', 'Zoology']);
});

test('a specialisation nobody is in is never offered as a filter', () => {
  assert.equal(
    specializationsOf(faculty).some((term) => term.slug === 'astrophysics'),
    false,
  );
});

test('filtering keeps only the academics in that specialisation', () => {
  assert.deepEqual(
    filterBySpecialization(faculty, 'accounting').map((m) => m.name),
    ['One', 'Two'],
  );
});

test('an academic in two specialisations appears under both', () => {
  assert.deepEqual(filterBySpecialization(faculty, 'finance').map((m) => m.name), ['One']);
  assert.ok(filterBySpecialization(faculty, 'accounting').some((m) => m.name === 'One'));
});

test('no filter means everybody', () => {
  assert.equal(filterBySpecialization(faculty, '').length, faculty.length);
});

test('a stale filter shows the directory rather than an empty page', () => {
  assert.equal(filterBySpecialization(faculty, 'renamed-last-week').length, faculty.length);
  assert.equal(isKnownSpecialization(faculty, 'renamed-last-week'), false);
  assert.equal(isKnownSpecialization(faculty, 'accounting'), true);
});

/* -------------------------------------------------------------------------- */
/* Links                                                                      */
/* -------------------------------------------------------------------------- */

test('the default state is the bare path, so there is one URL for it', () => {
  assert.equal(staffHref(), '/our-academic-staff');
  assert.equal(staffHref({ page: 1 }), '/our-academic-staff');
});

test('a filter and a page each show up when they are not the default', () => {
  assert.equal(staffHref({ page: 3 }), '/our-academic-staff?page=3');
  assert.equal(
    staffHref({ specialization: 'accounting' }),
    '/our-academic-staff?specialization=accounting',
  );
  assert.equal(
    staffHref({ specialization: 'accounting', page: 2 }),
    '/our-academic-staff?specialization=accounting&page=2',
  );
});
