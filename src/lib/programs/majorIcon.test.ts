import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import {
  majorIconKey,
  MAJOR_ICON_KEYS,
  NEUTRAL_ICON,
} from './majorIcon.ts';

/** ECC's seventeen published majors, and the mark each should find unaided. */
const LIVE: [string, string][] = [
  ['Hospital Management', 'hospital'],
  ['Strategic Economic Leadership', 'economy'],
  ['Strategic Thinking', 'strategy'],
  ['Entrepreneurial Leadership and Innovation', 'innovation'],
  ['Artificial Intelligence', 'ai'],
  ['Islamic Finance', 'islamic'],
  ['Fintech', 'fintech'],
  ['Banking and Finance', 'banking'],
  ['Human Resources Management', 'people'],
  ['Logistics & Supply Chain Management', 'logistics'],
  ['Healthcare Management', 'healthcare'],
  ['Strategic Management', 'strategy'],
  ['Quality Management', 'quality'],
  ['Marketing Management', 'marketing'],
  ['Accounting and Finance Management', 'accounting'],
  ['Project Management', 'project'],
  ['Digital Transformation', 'digital'],
];

for (const [name, expected] of LIVE) {
  test(`"${name}" finds its own mark`, () => {
    assert.equal(majorIconKey(null, name), expected);
  });
}

test('not one of the live majors falls back to the neutral mark', () => {
  const fallenBack = LIVE.map(([name]) => name).filter(
    (name) => majorIconKey(null, name) === NEUTRAL_ICON,
  );

  assert.deepEqual(fallenBack, []);
});

test('the seventeen do not collapse onto a handful of marks', () => {
  const distinct = new Set(LIVE.map(([name]) => majorIconKey(null, name)));

  // Strategic Thinking and Strategic Management share one, deliberately.
  assert.equal(distinct.size, 16);
});

/* ------------------------------------------------------- the editor wins -- */

test('a picked mark beats whatever the name says', () => {
  assert.equal(majorIconKey('marketing', 'Hospital Management'), 'marketing');
});

test('a pick is read case- and space-insensitively', () => {
  assert.equal(majorIconKey('  Fintech  ', 'Anything'), 'fintech');
});

test('a key nothing is drawn for falls through to the name', () => {
  assert.equal(majorIconKey('no-such-icon', 'Islamic Finance'), 'islamic');
});

test('an empty pick is the same as no pick', () => {
  for (const empty of ['', null, undefined]) {
    assert.equal(majorIconKey(empty, 'Fintech'), 'fintech');
  }
});

/* -------------------------------------------------- the ordering matters -- */

test('the narrower word wins over "management"', () => {
  assert.equal(majorIconKey(null, 'Quality Management'), 'quality');
  assert.equal(majorIconKey(null, 'Project Management'), 'project');
  assert.equal(majorIconKey(null, 'Healthcare Management'), 'healthcare');
  assert.equal(majorIconKey(null, 'Human Resources Management'), 'people');
});

test('"management" alone still finds the org chart', () => {
  assert.equal(majorIconKey(null, 'Management'), 'management');
  assert.equal(majorIconKey(null, 'Business Administration'), 'management');
});

test('hospital beats the broader healthcare reading', () => {
  assert.equal(majorIconKey(null, 'Hospital Management'), 'hospital');
  assert.equal(majorIconKey(null, 'Health Services'), 'healthcare');
});

test('Islamic Finance is Islamic, not banking', () => {
  assert.equal(majorIconKey(null, 'Islamic Finance'), 'islamic');
  assert.equal(majorIconKey(null, 'Islamic Banking and Finance'), 'islamic');
});

test('Fintech is not read as finance', () => {
  assert.equal(majorIconKey(null, 'Fintech'), 'fintech');
});

test('accounting beats the bare word finance', () => {
  assert.equal(majorIconKey(null, 'Accounting and Finance Management'), 'accounting');
  assert.equal(majorIconKey(null, 'Finance'), 'banking');
});

/* ------------------------------------------------- whole words, not parts -- */

test('"AI" does not fire inside another word', () => {
  assert.equal(majorIconKey(null, 'Sustainability'), 'sustainable');
});

test('"law" does not fire inside another word', () => {
  assert.notEqual(majorIconKey(null, 'Lawrence Business School'), 'law');
});

test('"AI" on its own does fire', () => {
  assert.equal(majorIconKey(null, 'AI and Robotics'), 'ai');
  assert.equal(majorIconKey(null, 'Applied AI'), 'ai');
});

/* ----------------------------------------------------------- the edges --- */

test('a name that says nothing gets the neutral mark', () => {
  assert.equal(majorIconKey(null, 'Track B'), NEUTRAL_ICON);
  assert.equal(majorIconKey(null, ''), NEUTRAL_ICON);
  assert.equal(majorIconKey(null), NEUTRAL_ICON);
});

/* ------------------------------------------------------- the two contracts */

/**
 * The vocabulary is written down in three places, and all three have to agree:
 * here, the drawings in `majorIcons.tsx`, and the dropdown the admin offers.
 * A key added to one and forgotten in another shows up as a missing mark on a
 * live page and nowhere else, so it is checked by reading the files.
 */
const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('every key in the vocabulary is drawn', () => {
  const drawings = read('../../components/ui/majorIcons.tsx');
  const map = drawings.slice(drawings.indexOf('const DRAWINGS'));

  const undrawn = Object.keys(MAJOR_ICON_KEYS).filter(
    (key) => !new RegExp(`^\\s{2}${key}:`, 'm').test(map),
  );

  assert.deepEqual(undrawn, []);
});

test('the neutral mark is drawn too', () => {
  const drawings = read('../../components/ui/majorIcons.tsx');

  assert.match(drawings.slice(drawings.indexOf('const DRAWINGS')), /^\s{2}subject:/m);
});

// The CMS's icon select is built from MAJOR_ICON_KEYS itself
// (src/payload/collections/Programs.ts), so the two cannot drift apart.

