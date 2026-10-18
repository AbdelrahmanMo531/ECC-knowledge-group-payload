import assert from 'node:assert/strict';
import { test } from 'node:test';

import { inEditorOrder } from './order.ts';

/** A person, reduced to a name and whatever an editor typed in the box. */
const person = (name: string, order?: number | null) => ({ name, order });

const names = (people: { name: string }[]) => people.map((p) => p.name);

test('nobody numbered leaves the list exactly as it was', () => {
  const people = [person('Amina'), person('Bilal'), person('Carla')];

  assert.deepEqual(names(inEditorOrder(people)), ['Amina', 'Bilal', 'Carla']);
});

test('one person numbered 1 goes first, the rest keep their order', () => {
  const people = [person('Amina'), person('Bilal'), person('Carla', 1)];

  assert.deepEqual(names(inEditorOrder(people)), ['Carla', 'Amina', 'Bilal']);
});

test('numbers run in sequence ahead of everyone unnumbered', () => {
  const people = [
    person('Amina'),
    person('Bilal', 2),
    person('Carla', 3),
    person('Dana'),
    person('Emre', 1),
  ];

  assert.deepEqual(names(inEditorOrder(people)), [
    'Emre',
    'Bilal',
    'Carla',
    'Amina',
    'Dana',
  ]);
});

test('gaps in the numbering are fine — it is a position, not an index', () => {
  const people = [person('Amina', 50), person('Bilal', 7), person('Carla', 900)];

  assert.deepEqual(names(inEditorOrder(people)), ['Bilal', 'Amina', 'Carla']);
});

test('two people on the same number keep the order they arrived in', () => {
  const people = [
    person('Amina', 2),
    person('Bilal', 1),
    person('Carla', 2),
    person('Dana', 1),
  ];

  assert.deepEqual(names(inEditorOrder(people)), [
    'Bilal',
    'Dana',
    'Amina',
    'Carla',
  ]);
});

test('zero is how an empty box is stored, and is not a position', () => {
  const people = [person('Amina', 0), person('Bilal', 1), person('Carla', 0)];

  assert.deepEqual(names(inEditorOrder(people)), ['Bilal', 'Amina', 'Carla']);
});

test('a negative number is treated as unset rather than sorted before 1', () => {
  const people = [person('Amina', -5), person('Bilal', 1)];

  assert.deepEqual(names(inEditorOrder(people)), ['Bilal', 'Amina']);
});

test('null and a missing field mean the same thing', () => {
  const people = [person('Amina', null), person('Bilal'), person('Carla', 1)];

  assert.deepEqual(names(inEditorOrder(people)), ['Carla', 'Amina', 'Bilal']);
});

test('the input is left alone', () => {
  const people = [person('Amina'), person('Bilal', 1)];
  const before = names(people);

  inEditorOrder(people);

  assert.deepEqual(names(people), before);
});

test('an empty list is an empty list', () => {
  assert.deepEqual(inEditorOrder([]), []);
});
