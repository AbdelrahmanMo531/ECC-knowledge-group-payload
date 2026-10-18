/**
 * The icon vocabulary a counter can pick from.
 *
 * A contract with `STAT_ICONS` in `src/components/ui/icons.tsx`: a key offered
 * here must exist there, or the counter falls back to one read from its label.
 */
export const STAT_ICONS = [
  'graduate',
  'badge',
  'professor',
  'course',
  'module',
  'lecture',
  'globe',
  'users',
  'star',
  'clock',
] as const;
