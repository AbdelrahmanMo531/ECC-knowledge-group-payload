import assert from 'node:assert/strict';
import { test } from 'node:test';

import { pageNumbers, paginate } from './pagination.ts';

const numbers = Array.from({ length: 25 }, (_, index) => index + 1);

test('a page holds what it should and knows how many there are', () => {
  const page = paginate(numbers, 2, 10);

  assert.deepEqual(page.items, [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  assert.equal(page.current, 2);
  assert.equal(page.total, 3);
  assert.equal(page.count, 25);
});

test('the last page holds the remainder', () => {
  assert.deepEqual(paginate(numbers, 3, 10).items, [21, 22, 23, 24, 25]);
});

test('a page past the end shows the last page rather than an error', () => {
  assert.equal(paginate(numbers, 99, 10).current, 3);
  assert.deepEqual(paginate(numbers, 99, 10).items, [21, 22, 23, 24, 25]);
});

test('a page before the first, or nonsense, is page one', () => {
  assert.equal(paginate(numbers, 0, 10).current, 1);
  assert.equal(paginate(numbers, -4, 10).current, 1);
  assert.equal(paginate(numbers, Number.NaN, 10).current, 1);
});

test('an empty list is still one page, not zero', () => {
  const page = paginate([], 1, 10);

  assert.equal(page.total, 1);
  assert.equal(page.count, 0);
  assert.deepEqual(page.items, []);
});

test('a nonsense page size falls back rather than dividing by zero', () => {
  assert.equal(paginate(numbers, 1, 0).items.length, 12);
  assert.equal(paginate(numbers, 1, -5).items.length, 1);
});

test('a short list shows every page', () => {
  assert.deepEqual(pageNumbers(1, 5), [1, 2, 3, 4, 5]);
});

test('a long list gaps the middle out', () => {
  assert.deepEqual(pageNumbers(10, 20), [1, null, 9, 10, 11, null, 20]);
});

test('near the start the gap is on one side only', () => {
  assert.deepEqual(pageNumbers(2, 20), [1, 2, 3, 4, null, 20]);
});

test('near the end likewise', () => {
  assert.deepEqual(pageNumbers(19, 20), [1, null, 17, 18, 19, 20]);
});

test('the current page is always in the row', () => {
  for (let page = 1; page <= 20; page += 1) {
    assert.ok(pageNumbers(page, 20).includes(page), `page ${page}`);
  }
});
