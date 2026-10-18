import Image from 'next/image';

/**
 * The ECC logo, per the guideline's variation rules (p.6) and background
 * rules (p.8): full colour on light surfaces, solid beige on teal/turquoise,
 * and a single-tone dark variant for monochrome contexts.
 */

type Variant = 'color' | 'cream' | 'mono';
type Lockup = 'horizontal' | 'vertical' | 'mark';

const FILES: Record<Lockup, Record<Variant, string>> = {
  horizontal: {
    color: '/brand/ecc-logo-horizontal.svg',
    cream: '/brand/ecc-logo-horizontal-cream.svg',
    mono: '/brand/ecc-logo-horizontal-mono.svg',
  },
  vertical: {
    color: '/brand/ecc-logo-vertical.svg',
    cream: '/brand/ecc-logo-vertical-cream.svg',
    mono: '/brand/ecc-logo-vertical-mono.svg',
  },
  mark: {
    color: '/brand/ecc-mark.svg',
    cream: '/brand/ecc-mark-cream.svg',
    mono: '/brand/ecc-mark-mono.svg',
  },
};

/** Intrinsic aspect ratios of the generated SVGs. */
const RATIO: Record<Lockup, number> = {
  horizontal: 2.93,
  vertical: 0.83,
  mark: 0.787,
};

type LogoProps = {
  lockup?: Lockup;
  variant?: Variant;
  /** Rendered height in pixels. Width follows the lockup's aspect ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({
  lockup = 'horizontal',
  variant = 'color',
  height = 48,
  className,
  priority = false,
}: LogoProps) {
  return (
    <Image
      src={FILES[lockup][variant]}
      alt="ECC Knowledge Group"
      height={height}
      width={Math.round(height * RATIO[lockup])}
      className={className}
      priority={priority}
      // The mark is vector; Next should serve it untouched.
      unoptimized
    />
  );
}
