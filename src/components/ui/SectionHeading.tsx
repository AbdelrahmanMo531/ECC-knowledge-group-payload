import type { ReactNode } from 'react';

/**
 * The guideline sets section titles in bold Somar Sans over a short gold rule —
 * the same treatment used for the page titles throughout the brand book.
 */

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'start',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const isDark = tone === 'dark';

  return (
    <div
      className={`flex flex-col ${
        align === 'center' ? 'items-center text-center' : 'items-start'
      } ${className}`}
    >
      {eyebrow ? (
        <span
          className={`text-xs font-medium uppercase tracking-[0.18em] ${
            isDark ? 'text-brand-gold' : 'text-brand-turquoise'
          }`}
        >
          {eyebrow}
        </span>
      ) : null}

      <h2
        className={`mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl ${
          isDark ? 'text-brand-beige' : 'text-brand-teal'
        }`}
      >
        {title}
      </h2>

      {/* Gold rule, per the brand book's heading treatment. */}
      <span
        aria-hidden
        className="mt-5 block h-px w-16 bg-brand-gold"
      />

      {description ? (
        <p
          className={`mt-5 max-w-2xl text-base leading-relaxed ${
            isDark ? 'text-brand-beige/75' : 'text-brand-ink/75'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
