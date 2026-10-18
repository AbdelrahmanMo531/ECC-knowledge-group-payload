import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { assignSurfaces, type Surface } from './surface.ts';

/**
 * These cover the bug that prompted the helper: the homepage hides several
 * sections when their content is empty, and a hardcoded alternation collapsed
 * whenever one dropped out, leaving two identical bands touching.
 *
 * The invariant is simple — no two *rendered* sections in a row may share a
 * surface — so it is asserted directly rather than by checking a fixed
 * sequence, which would need rewriting every time the page order changes.
 */
function surfacesOf(visibility: boolean[], fixed: Record<number, Surface> = {}) {
  return assignSurfaces(
    visibility.map((visible, index) => ({ visible, fixed: fixed[index] })),
  )
    .filter((section) => section.visible)
    .map((section) => section.surface);
}

function assertAlternates(surfaces: Surface[]) {
  for (let i = 1; i < surfaces.length; i += 1) {
    assert.notEqual(
      surfaces[i],
      surfaces[i - 1],
      `sections ${i - 1} and ${i} share "${surfaces[i]}": ${surfaces.join(' → ')}`,
    );
  }
}

describe('assignSurfaces', () => {
  it('alternates when every section renders', () => {
    assertAlternates(surfacesOf(Array(13).fill(true)));
  });

  it('still alternates when the video is hidden', () => {
    const visibility = Array(13).fill(true);
    visibility[4] = false; // the video slot
    assertAlternates(surfacesOf(visibility, { 4: 'dark' }));
  });

  it('still alternates when the news section is hidden', () => {
    const visibility = Array(13).fill(true);
    visibility[11] = false; // latest news
    assertAlternates(surfacesOf(visibility, { 4: 'dark' }));
  });

  it('still alternates on a nearly empty site', () => {
    // Only the two always-on sections plus programmes survive.
    const visibility = Array(13).fill(false);
    visibility[0] = true;
    visibility[2] = true;
    visibility[12] = true;
    assertAlternates(surfacesOf(visibility, { 4: 'dark' }));
  });

  it('alternates for every single-section-hidden permutation', () => {
    for (let hidden = 0; hidden < 13; hidden += 1) {
      const visibility = Array(13).fill(true);
      visibility[hidden] = false;
      assertAlternates(surfacesOf(visibility, { 4: 'dark' }));
    }
  });

  it('honours a pinned surface without disturbing its neighbours', () => {
    const result = assignSurfaces([
      { visible: true },
      { visible: true, fixed: 'dark' },
      { visible: true },
    ]);

    assert.equal(result[1].surface, 'dark');
    assert.notEqual(result[0].surface, result[1].surface);
    assert.notEqual(result[1].surface, result[2].surface);
    // The pinned section must not consume a step, so the light/tint run
    // continues across it.
    assert.notEqual(result[0].surface, result[2].surface);
  });
});
