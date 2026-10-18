'use client';

import { useT } from '@/lib/i18n/useT';
import type { Brochure } from '@/lib/cms/types';

type Tone = 'onDark' | 'solid' | 'quiet';

const TONES: Record<Tone, string> = {
  /** On the teal hero. */
  onDark:
    'border border-brand-beige/30 bg-transparent text-brand-beige hover:border-brand-gold hover:bg-brand-gold hover:text-brand-teal',
  /** On a light ground, where the brochure is the primary action. */
  solid: 'bg-brand-teal text-brand-beige hover:bg-brand-turquoise',
  /** In the tab bar and the major panel, where it sits beside other copy. */
  quiet:
    'border border-brand-sand bg-white text-brand-teal hover:border-brand-teal hover:bg-brand-beige/70',
};

const SIZES = {
  md: 'px-6 py-3 text-sm',
  sm: 'px-4 py-2 text-xs',
};

/**
 * Link to a brochure PDF.
 *
 * Opens in a new tab rather than navigating away from the programme. The
 * `download` attribute is a hint only: it forces a save dialogue for
 * same-origin files, but the brochures are served from the WordPress origin, so
 * most browsers will show them in their built-in PDF viewer instead — from
 * where the visitor can still save the file.
 *
 * Renders nothing without a file, so an editor who has not uploaded one yet
 * gets no dead button.
 */
export function BrochureButton({
  brochure,
  label,
  context,
  tone = 'quiet',
  size = 'md',
  className = '',
}: {
  brochure?: Brochure | null;
  label?: string;
  /** Names what the brochure is about, for screen readers. */
  context?: string;
  tone?: Tone;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const t = useT();
  const text = label ?? t('section.brochure');

  if (!brochure?.url) return null;

  return (
    <a
      href={brochure.url}
      target="_blank"
      rel="noreferrer noopener"
      download
      aria-label={context ? `${text} — ${context} (PDF)` : `${text} (PDF)`}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 ease-[var(--ease-brand)] ${TONES[tone]} ${SIZES[size]} ${className}`}
    >
      <svg
        aria-hidden
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M8 2v8m0 0L4.75 6.75M8 10l3.25-3.25M2.5 12.5h11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{text}</span>
      <span className="opacity-60">PDF</span>
    </a>
  );
}
