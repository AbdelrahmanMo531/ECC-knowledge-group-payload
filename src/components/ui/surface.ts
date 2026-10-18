/**
 * Section surfaces.
 *
 * Backgrounds are assigned by the page, not hardcoded per section. Several
 * sections hide themselves when they have no content — no video link, no
 * published posts — and a hardcoded alternation silently collapses when one
 * drops out, leaving two identical bands touching. Letting the page assign
 * surfaces to the sections that actually render keeps the rhythm correct
 * whatever the CMS contains.
 */
export type Surface = 'light' | 'tint' | 'dark';

const CLASSES: Record<Surface, string> = {
  light: 'bg-white',
  // One tint token throughout: two different beiges side by side read as a
  // mistake rather than a rhythm.
  tint: 'bg-brand-beige/60',
  dark: 'bg-brand-teal',
};

export function surfaceClass(surface: Surface = 'light'): string {
  return CLASSES[surface];
}

/**
 * Assigns surfaces across a run of sections.
 *
 * Alternates light and tint, stepping only on sections that actually render.
 * A section pinned to a fixed surface (the video, which is always dark) is
 * passed through without disturbing the alternation on either side of it.
 */
export function assignSurfaces<T extends { visible: boolean; fixed?: Surface }>(
  sections: T[],
): (T & { surface: Surface })[] {
  let light = true;

  return sections.map((section) => {
    if (!section.visible) {
      // Invisible sections must not consume a step, or the sections around
      // them inherit the gap.
      return { ...section, surface: 'light' as Surface };
    }

    if (section.fixed) {
      return { ...section, surface: section.fixed };
    }

    const surface: Surface = light ? 'light' : 'tint';
    light = !light;
    return { ...section, surface };
  });
}
