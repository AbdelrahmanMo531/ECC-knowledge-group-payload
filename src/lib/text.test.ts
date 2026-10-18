import assert from 'node:assert/strict';
import { test } from 'node:test';

import { shortName, summarise, toParagraphs } from './text.ts';

test('text within the limit is returned untouched', () => {
  assert.equal(summarise('A short summary.', 40), 'A short summary.');
});

test('whitespace is collapsed', () => {
  assert.equal(summarise('A  short\n summary.', 40), 'A short summary.');
});

test('a sentence ending near the limit is where it stops', () => {
  const text = 'IBAS is a private business school near Zurich. It offers MBA and DBA programmes to professionals worldwide.';

  assert.equal(
    summarise(text, 60),
    'IBAS is a private business school near Zurich.',
  );
});

test('with no sentence to stop at, it cuts on a word and marks the cut', () => {
  const text = 'a'.repeat(10) + ' ' + 'b'.repeat(10) + ' ' + 'c'.repeat(40);
  const result = summarise(text, 25);

  assert.equal(result, 'aaaaaaaaaa bbbbbbbbbb…');
  assert.ok(!result.includes('  '));
});

test('an early sentence end is not used as the cut', () => {
  // The full stop is at 3 characters of a 100-character limit: stopping there
  // would throw away almost everything asked for.
  const text = `No. ${'word '.repeat(40)}`;
  const result = summarise(text, 100);

  assert.ok(result.length > 90, `expected a full-length lead, got: ${result}`);
  assert.ok(result.endsWith('…'));
});

test('trailing punctuation is not left dangling before the ellipsis', () => {
  const text = 'Zurich, Geneva, Basel, ' + 'x'.repeat(60);

  assert.equal(summarise(text, 24), 'Zurich, Geneva, Basel…');
});

test('an acronym in brackets is the short name', () => {
  assert.equal(
    shortName('International Business Academy of Switzerland (IBAS)'),
    'IBAS',
  );
});

test('a name with no brackets is left alone', () => {
  assert.equal(shortName('Genovasi d.school Malaysia'), 'Genovasi d.school Malaysia');
  assert.equal(shortName('CMI'), 'CMI');
});

test('a bracketed phrase that is not an acronym is dropped, not used', () => {
  assert.equal(shortName('VERN University (Zagreb)'), 'VERN University');
  assert.equal(shortName('Some School (est. 1901)'), 'Some School');
});

test('a blank line starts a new paragraph', () => {
  assert.deepEqual(toParagraphs('One.\n\nTwo.\n\n\nThree.'), [
    'One.',
    'Two.',
    'Three.',
  ]);
});

test('a single newline is wrapping, not a paragraph break', () => {
  assert.deepEqual(toParagraphs('One line\nsame paragraph.'), [
    'One line same paragraph.',
  ]);
});

test('empty input produces no paragraphs', () => {
  assert.deepEqual(toParagraphs(''), []);
  assert.deepEqual(toParagraphs(null), []);
  assert.deepEqual(toParagraphs('   \n\n  '), []);
});
