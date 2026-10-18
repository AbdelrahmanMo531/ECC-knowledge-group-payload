/**
 * An arrow that points the way the page reads.
 *
 * `→` means "onward" in English and "back" in Arabic — the glyph is a
 * direction, and no font turns it around on its own. Flipping it on the
 * horizontal axis is what keeps "next" pointing at the next thing in both
 * languages, and it is why every arrow on the site comes from here rather than
 * being typed into the markup.
 *
 * Always decorative: the link or button around it already says where it goes,
 * and a screen reader announcing "rightwards arrow" adds nothing.
 */
export function Arrow({
  back = false,
  className = '',
}: {
  /** Points at what came before rather than what comes next. */
  back?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block rtl:-scale-x-100 ${className}`.trim()}
    >
      {back ? '←' : '→'}
    </span>
  );
}
