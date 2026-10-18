import type { FaqItem } from '@/lib/cms/types';

/**
 * The questions themselves.
 *
 * Built on native `<details>` / `<summary>` rather than JavaScript state: it is
 * keyboard-accessible and screen-reader-correct for free, works with JS
 * disabled, and — the reason that matters for SEO — the answer text is present
 * in the HTML whether or not the item is open, so crawlers read all of it.
 *
 * Separate from the homepage section so the FAQ page can render the questions
 * under its own page header rather than under a second heading.
 */
export function FaqList({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;

  return (
      <ul className="space-y-3">
        {faqs.map((faq) => (
          <li key={faq.id}>
            <details className="group rounded-[var(--radius-brand)] border border-brand-sand/70 bg-white transition-colors duration-200 open:border-brand-turquoise/40 hover:border-brand-turquoise/40">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 p-6 text-start [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-bold leading-snug text-brand-teal sm:text-lg">
                  {faq.question}
                </h3>

                <span
                  aria-hidden
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-sand text-brand-turquoise transition-all duration-300 group-open:rotate-45 group-open:border-brand-turquoise group-open:bg-brand-turquoise group-open:text-white"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12">
                    <path
                      d="M6 1v10M1 6h10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>

              <div
                className="prose-ecc px-6 pb-6 text-[0.95rem]"
                // Answer HTML, rendered on the server from the rich text editors write in the admin.
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </details>
          </li>
        ))}
      </ul>
  );
}
