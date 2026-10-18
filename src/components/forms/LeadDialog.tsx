'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { DynamicForm } from '@/components/forms/DynamicForm';
import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { useT } from '@/lib/i18n/useT';
import type { FormDefinition, FormValues } from '@/lib/forms/definition';

/**
 * The enquiry form, once, for the whole site.
 *
 * Every trigger — the floating button, the calls to action, the button in a
 * programme's hero — opens this one dialog rather than carrying a form of its
 * own. One form on the page means one set of field IDs, one submission in
 * flight and one place for the answers to live, and it means a trigger can be
 * dropped anywhere without thinking about what else is on the page.
 *
 * A trigger may open it with answers already filled in: opening it from a
 * programme page pre-selects that programme, so someone who has been reading
 * about the DBA is not asked which programme they mean.
 */
type LeadContext = {
  /** Whether there is a form to open at all. */
  available: boolean;
  open: (defaults?: FormValues) => void;
};

const Context = createContext<LeadContext>({
  available: false,
  open: () => {},
});

/**
 * How a trigger reaches the dialog.
 *
 * Safe to call from anywhere under the provider — with no form published, the
 * hook reports `available: false` and a trigger sends the visitor to the
 * contact page instead of opening an empty box.
 */
export function useLeadForm(): LeadContext {
  return useContext(Context);
}

export function LeadDialogProvider({
  form,
  locale = DEFAULT_LOCALE,
  fallbackEmail,
  children,
}: {
  /** Null when no `lead` form is published: every trigger then falls back. */
  form: FormDefinition | null;
  /** The language the layout read the form in, carried down to the action. */
  locale?: Locale;
  fallbackEmail: string;
  children: React.ReactNode;
}) {
  const t = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);

  const [defaults, setDefaults] = useState<FormValues>({});

  // Bumped on every open, and used as the form's key. A dialog that has been
  // submitted and closed must not reopen showing the last visitor's thank-you
  // note, and one opened from a different programme must not keep the previous
  // one selected — remounting is the only thing that reliably clears both.
  const [session, setSession] = useState(0);

  const open = useCallback((values: FormValues = {}) => {
    opener.current = document.activeElement;
    setDefaults(values);
    setSession((count) => count + 1);
    dialog.current?.showModal();
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  // Focus goes back to whatever opened it, however it was closed — the button
  // in the page, not the top of the document.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    const onClose = () => {
      const trigger = opener.current;
      if (trigger instanceof HTMLElement) trigger.focus();
    };

    element.addEventListener('close', onClose);
    return () => element.removeEventListener('close', onClose);
  }, []);

  const value = useMemo(
    () => ({ available: Boolean(form), open }),
    [form, open],
  );

  return (
    <Context.Provider value={value}>
      {children}

      {form ? (
        <dialog
          ref={dialog}
          aria-labelledby="lead-form-title"
          // `m-auto` centres it: the UA stylesheet does that with `margin:
          // auto`, which Tailwind's preflight resets to zero.
          className="m-auto w-[min(42rem,94vw)] max-w-none overflow-visible rounded-[calc(var(--radius-brand)*1.5)] bg-transparent p-0 backdrop:bg-brand-teal/85 backdrop:backdrop-blur-sm"
          onClick={(event) => {
            // A click landing on the dialog itself is a click on the backdrop:
            // the panel below stops one going any further.
            if (event.target === dialog.current) close();
          }}
        >
          <div
            // Unlike the video lightbox, this one may legitimately be taller
            // than the screen — a form is as tall as its fields. So it scrolls
            // inside itself, and `overscroll-contain` stops that scroll running
            // on into the page behind once it reaches the end.
            className="max-h-[92dvh] overflow-y-auto overscroll-contain rounded-[calc(var(--radius-brand)*1.5)] bg-white shadow-2xl"
          >
            <div className="bg-brand-gradient-teal relative px-7 py-6 sm:px-9">
              <div
                aria-hidden
                className="bg-logo-pattern pointer-events-none absolute inset-0 opacity-[0.05]"
              />

              <div className="relative flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-brand-gold">
                    {t('form.advisor')}
                  </p>
                  <h2
                    id="lead-form-title"
                    className="mt-2 font-serif text-2xl font-bold leading-tight text-brand-beige"
                  >
                    {form.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={close}
                  aria-label={t('form.close')}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-beige/25 text-brand-beige transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <span aria-hidden>✕</span>
                </button>
              </div>
            </div>

            <div className="px-7 py-7 sm:px-9">
              <DynamicForm
                key={session}
                form={form}
                locale={locale}
                fallbackEmail={fallbackEmail}
                defaults={defaults}
              />
            </div>
          </div>
        </dialog>
      ) : null}
    </Context.Provider>
  );
}
