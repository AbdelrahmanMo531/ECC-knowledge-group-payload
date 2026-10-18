'use client';

import { useLeadForm } from '@/components/forms/LeadDialog';
import { Button, buttonClass, type Variant } from '@/components/ui/Button';
import type { FormValues } from '@/lib/forms/definition';

/**
 * A button that opens the enquiry form.
 *
 * Looks exactly like any other button on the site, because it is the same
 * classes — what changes is that it opens a form in place rather than sending
 * someone to the contact page to find one. Losing people on the way to a form
 * is the whole reason this exists.
 *
 * With no form published it quietly becomes the link it replaced, so a site
 * whose CMS has no `lead` form still has working calls to action.
 */
export function LeadTrigger({
  children,
  variant = 'primary',
  className = '',
  defaults,
  fallbackHref = '/contact',
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  /** Answers to open with — the programme being read, say. */
  defaults?: FormValues;
  /** Where to send the visitor when no form is published. */
  fallbackHref?: string;
}) {
  const { available, open } = useLeadForm();

  if (!available) {
    return (
      <Button href={fallbackHref} variant={variant} className={className}>
        {children}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => open(defaults)}
      className={buttonClass(variant, className)}
    >
      {children}
    </button>
  );
}
