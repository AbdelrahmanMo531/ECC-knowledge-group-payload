'use client';

import { useEffect, useState } from 'react';

import { useLeadForm } from '@/components/forms/LeadDialog';
import { useT } from '@/lib/i18n/useT';

/** How far down the page the button starts offering itself. */
const APPEARS_AFTER = 160;

/**
 * The enquiry button that follows the page.
 *
 * Pinned bottom-right, so wherever someone has read to, the way to ask a
 * question is one click away and never scrolled past. It is a labelled pill
 * rather than a bare icon: a floating circle with a symbol in it is a guess,
 * and a guess is not "easy to reach".
 *
 * It appears as soon as the page has been scrolled at all. The hero carries its
 * own call to action, so there is nothing to add while it is still on screen —
 * but the moment someone scrolls past it, this is the only way to apply that
 * does not involve going and finding one.
 */
export function LeadLauncher() {
  const t = useT();
  const { available, open } = useLeadForm();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > APPEARS_AFTER);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!available) return null;

  return (
    <div
      // Sits above the page but below the dialog, which the browser paints in
      // its own top layer regardless.
      className="pointer-events-none fixed bottom-0 end-0 z-40 p-4 sm:p-6"
      // Inline, not a `pb-` utility: `sm:p-6` sets padding on all four sides
      // and would win over it at that breakpoint — two utilities of equal
      // specificity are ordered by the stylesheet, not by the class attribute.
      // This keeps the button clear of the home indicator on a phone.
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <button
        type="button"
        onClick={() => open()}
        // Hidden from everything, not just from sight, until it is offered: a
        // button faded out of view is still a tab stop and still read aloud.
        inert={!shown}
        aria-hidden={shown ? undefined : true}
        // `inert` above is what makes the hidden state unclickable, so the
        // visible state carries no competing `pointer-events` utility — two of
        // those are resolved by stylesheet order, not by which is written last.
        className={`pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-brand-teal py-3.5 ps-5 pe-6 text-sm font-medium text-brand-beige shadow-xl shadow-brand-teal/25 transition-all duration-300 ease-[var(--ease-brand)] hover:bg-brand-gold hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-offset-2 ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <SparkIcon />
        {t('cta.apply')}
      </button>
    </div>
  );
}

/** The brand's four-point spark, the mark used across ECC's own material. */
function SparkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M12 1.8c.9 4.6 2.9 6.9 7.4 8.2v.1c-4.5 1.2-6.5 3.6-7.4 8.2h-.1c-.9-4.6-2.9-7-7.4-8.2v-.1c4.5-1.3 6.5-3.6 7.4-8.2Z" />
      <path d="M18.6 15.6c.4 2 1.3 3 3.2 3.6v.1c-1.9.5-2.8 1.6-3.2 3.5h-.1c-.4-2-1.3-3-3.2-3.5v-.1c1.9-.6 2.8-1.6 3.2-3.6Z" />
    </svg>
  );
}
