import type { ReactNode } from 'react';

import { Link } from '@/components/ui/Link';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onDarkSolid';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 ease-[var(--ease-brand)] disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-teal text-brand-beige hover:bg-brand-turquoise hover:shadow-lg hover:shadow-brand-teal/20',
  secondary:
    'border border-brand-teal/25 bg-transparent text-brand-teal hover:border-brand-teal hover:bg-brand-teal hover:text-brand-beige',
  ghost:
    'px-0 text-brand-turquoise hover:text-brand-teal underline underline-offset-4 decoration-brand-gold',
  onDark:
    'border border-brand-beige/30 bg-transparent text-brand-beige hover:border-brand-gold hover:bg-brand-gold hover:text-brand-teal',
  // Filled beige on a teal ground — the inverse of `primary`. Kept as its own
  // variant rather than a className override, because utilities of equal
  // specificity are ordered by the stylesheet, not by the class attribute.
  onDarkSolid:
    'bg-brand-beige text-brand-teal hover:bg-brand-gold hover:text-brand-teal',
};

/**
 * The classes behind a button, for the cases that cannot be a link.
 *
 * A trigger that opens a dialog is a `<button>`, not an anchor — it goes
 * nowhere, and giving it an `href` would put it in the browser's history and
 * offer "open in new tab" on something that cannot be opened in one. Sharing
 * the classes rather than the component keeps the two looking identical.
 */
export function buttonClass(variant: Variant = 'primary', className = ''): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:');
  const classes = buttonClass(variant, className);

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
