import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  clock,
  episodeDate,
  nextSpeed,
  searchEpisodes,
  shouldResume,
  step,
  SPEEDS,
} from './podcast.ts';
import type { Episode } from './cms/types.ts';

const episode = (title: string, description = ''): Episode => ({
  id: title,
  title,
  source: 'audio',
  url: 'https://cdn.example.com/ep.mp3',
  description,
});

/* ------------------------------------------------------------------ clock */

test('a clock reads minutes and seconds', () => {
  assert.equal(clock(0), '0:00');
  assert.equal(clock(7), '0:07');
  assert.equal(clock(247), '4:07');
});

test('and grows an hours column only when there is one', () => {
  assert.equal(clock(3599), '59:59');
  assert.equal(clock(3600), '1:00:00');
  assert.equal(clock(3847), '1:04:07');
});

test('a time that is not a time reads as zero, not NaN', () => {
  assert.equal(clock(Number.NaN), '0:00');
  assert.equal(clock(-5), '0:00');
  assert.equal(clock(Number.POSITIVE_INFINITY), '0:00');
});

/* ------------------------------------------------------------------- step */

test('stepping moves through the episodes', () => {
  assert.equal(step(0, 1, 5), 1);
  assert.equal(step(3, -1, 5), 2);
});

test('and wraps at both ends rather than dead-ending', () => {
  assert.equal(step(4, 1, 5), 0);
  assert.equal(step(0, -1, 5), 4);
});

test('a show with no episodes cannot be stepped off', () => {
  assert.equal(step(0, 1, 0), 0);
});

/* ----------------------------------------------------------------- search */

const episodes = [
  episode('Why an MBA now', 'On timing and fees'),
  episode('Studying while working', 'How people fit it around a job'),
  episode('Fees, honestly'),
];

test('search matches titles and descriptions', () => {
  assert.deepEqual(
    searchEpisodes(episodes, 'fees').map((e) => e.title),
    ['Why an MBA now', 'Fees, honestly'],
  );
});

test('it ignores case', () => {
  assert.equal(searchEpisodes(episodes, 'MBA').length, 1);
  assert.equal(searchEpisodes(episodes, 'mba').length, 1);
});

test('every word has to match, in any order', () => {
  assert.deepEqual(
    searchEpisodes(episodes, 'mba fees').map((e) => e.title),
    ['Why an MBA now'],
  );
  assert.deepEqual(
    searchEpisodes(episodes, 'fees mba').map((e) => e.title),
    ['Why an MBA now'],
  );
});

test('an empty search is not a filter', () => {
  assert.equal(searchEpisodes(episodes, '').length, 3);
  assert.equal(searchEpisodes(episodes, '   ').length, 3);
});

/* ---------------------------------------------------------------- resuming */

test('the first few seconds are not worth resuming', () => {
  assert.equal(shouldResume(3, 1800), false);
  assert.equal(shouldResume(19, 1800), false);
  assert.equal(shouldResume(21, 1800), true);
});

test('nor are the last few, which would just replay the outro', () => {
  assert.equal(shouldResume(1790, 1800), false);
  assert.equal(shouldResume(1700, 1800), true);
});

test('an unknown duration still resumes, having nothing to rule it out', () => {
  assert.equal(shouldResume(300, 0), true);
});

/* ------------------------------------------------------------------ speed */

test('speed cycles through the list and back to the start', () => {
  let speed: number = SPEEDS[0];
  const seen: number[] = [];

  for (let i = 0; i < SPEEDS.length; i += 1) {
    speed = nextSpeed(speed);
    seen.push(speed);
  }

  assert.deepEqual(seen, [...SPEEDS.slice(1), SPEEDS[0]]);
});

test('normal speed is where it starts', () => {
  assert.equal(SPEEDS[0], 1);
});

/* ------------------------------------------------------------------ dates */

test('a date is shown the way people here write one', () => {
  assert.equal(episodeDate('2026-03-14'), '14 Mar 2026');
});

test('and an unreadable one is shown as nothing at all', () => {
  assert.equal(episodeDate('soon'), '');
  assert.equal(episodeDate(''), '');
  assert.equal(episodeDate(null), '');
});
