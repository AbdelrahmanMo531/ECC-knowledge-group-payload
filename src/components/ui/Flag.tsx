import { countryCode, flagSrc } from '@/lib/flags';

/**
 * A country flag badge.
 *
 * The SVG is served straight from `public/flags` with a plain `<img>` rather
 * than `next/image`: these are 1–2KB vector files that need no resizing, and
 * routing them through the image optimiser would require turning on
 * `dangerouslyAllowSVG`, which would also apply to editor-uploaded SVGs from
 * WordPress. Not worth it for a 24px flag.
 *
 * With no flag for that country, the code shows in the same badge — a fallback
 * that reads as deliberate rather than broken.
 */
export function Flag({
  country,
  code,
  size = 22,
  className = '',
}: {
  country?: string | null;
  /** Explicit ISO 3166-1 alpha-2. Inferred from the country name when absent. */
  code?: string | null;
  size?: number;
  className?: string;
}) {
  const iso = countryCode(code, country);
  if (!iso) return null;

  const src = flagSrc(iso);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-white/10 ${className}`}
      style={{ width: size, height: Math.round((size * 3) / 4) }}
      title={country ?? iso}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- see above.
        <img
          src={src}
          alt=""
          width={size}
          height={Math.round((size * 3) / 4)}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className="text-[0.6rem] font-medium tracking-wide">{iso}</span>
      )}
    </span>
  );
}
