import assert from 'node:assert/strict';
import { test } from 'node:test';

import { fill } from './fill.ts';

test('a field the CMS left empty keeps the seeded value', () => {
  assert.deepEqual(fill({ heading: 'Seed', body: 'Seed body' }, { heading: 'Typed', body: '  ' }), {
    heading: 'Typed',
    body: 'Seed body',
  });
});

test('a list typed in the CMS replaces the seeded one whole', () => {
  assert.deepEqual(fill({ items: ['a', 'b', 'c'] }, { items: ['x'] }), { items: ['x'] });
  assert.deepEqual(fill({ items: ['a'] }, { items: [] }), { items: ['a'] });
});

test('rows take the seeded row shape, so empty optional text is a string', () => {
  const seed = { teams: [{ label: 'Board', description: 'Who leads' }] };
  assert.deepEqual(fill(seed, { teams: [{ label: 'Faculty', description: null }] }), {
    teams: [{ label: 'Faculty', description: '' }],
  });
});

test('nested groups fill field by field', () => {
  const seed = { hero: { eyebrow: 'E', heading: 'H', badges: ['one'] } };
  assert.deepEqual(fill(seed, { hero: { heading: 'New', badges: null } }), {
    hero: { eyebrow: 'E', heading: 'New', badges: ['one'] },
  });
});

test('nothing from the CMS is the seed', () => {
  const seed = { a: 'b' };
  assert.equal(fill(seed, null), seed);
  assert.equal(fill(seed, undefined), seed);
});
