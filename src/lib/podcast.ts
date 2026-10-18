/**
 * Podcast playback, minus the DOM.
 *
 * The parts of a player that are worth testing are the parts with no player in
 * them: what a clock reads, which episode comes next, what a search box
 * matches, whether a saved position is worth resuming. They live here so they
 * can be checked without a browser.
 */

import type { Episode } from './cms/types.ts';

/** How far in the position of a half-played episode is remembered. */
export const RESUME_AFTER = 20;

/**
 * How close to the end counts as finished.
 *
 * Resuming someone four seconds from the end replays the outro and nothing
 * else, so past this point the episode starts again from the beginning.
 */
export const RESUME_UNTIL = 15;

/** Seconds as a clock: `4:07`, or `1:04:07` once there is an hour in it. */
export function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = whole % 60;

  const pad = (value: number) => String(value).padStart(2, '0');

  return hours
    ? `${hours}:${pad(minutes)}:${pad(rest)}`
    : `${minutes}:${pad(rest)}`;
}

/**
 * The next episode's index, wrapping at the end.
 *
 * Wrapping matters more than it sounds: a listener who reaches the end of a
 * show and finds the Next button dead has been told the player is broken,
 * where one that returns to the first episode has been told they finished.
 */
export function step(current: number, by: number, count: number): number {
  if (count < 1) return 0;

  return (current + by + count) % count;
}

/**
 * Episodes matching a search.
 *
 * Titles and descriptions, case-insensitively, on whole words the visitor
 * typed rather than the phrase as one string — someone searching "mba fees"
 * means both words, in either order, not that pair of words adjacent.
 */
export function searchEpisodes(episodes: Episode[], query: string): Episode[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (!terms.length) return episodes;

  return episodes.filter((episode) => {
    const haystack = `${episode.title} ${episode.description ?? ''}`.toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });
}

/**
 * Whether a remembered position is worth going back to.
 *
 * Not the first few seconds — that is where everyone is, and resuming there
 * says nothing. Not the last few either, where the episode is effectively
 * over and resuming means replaying the credits.
 */
export function shouldResume(position: number, duration: number): boolean {
  if (!Number.isFinite(position) || position < RESUME_AFTER) return false;
  if (!Number.isFinite(duration) || duration <= 0) return true;

  return position < duration - RESUME_UNTIL;
}

/** Playback speeds, in the order the button cycles them. */
export const SPEEDS = [1, 1.25, 1.5, 2, 0.75] as const;

/** The speed after this one. */
export function nextSpeed(current: number): number {
  const at = SPEEDS.indexOf(current as (typeof SPEEDS)[number]);

  return SPEEDS[(at + 1) % SPEEDS.length];
}

/** A date an editor or a feed supplied, as something readable. */
export function episodeDate(value: string | null | undefined): string {
  if (!value) return '';

  const when = new Date(value);

  if (Number.isNaN(when.getTime())) return '';

  return when.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
