import Image from 'next/image';

import { Container } from '@/components/ui/Container';

/**
 * The beige band every inner page opens with.
 *
 * The mark on the right is a watermark, not a logo: it sits at a low opacity
 * behind the heading so the band reads as ECC's without competing with the
 * words, which are what the visitor came for. It is decorative — the real logo
 * is in the header, one element up the page — so it is hidden from assistive
 * technology and never announced twice.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Anything the page wants inside the band, under the description. */
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-beige">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-24 -top-40 h-[26rem] w-[26rem] rounded-full bg-brand-turquoise/[0.07] blur-3xl"
      />

      {/*
        Anchored to the band's own trailing edge rather than the container's,
        so it sits against the edge of the screen on a wide monitor — but fully
        inside it. Hanging it off the edge cropped the mark, which read as a
        rendering fault rather than as a bleed. Logical, so it crosses to the
        left of an Arabic page along with everything else.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute end-6 top-1/2 hidden -translate-y-1/2 opacity-[0.06] sm:block lg:end-12"
      >
        <Image
          src="/brand/ecc-mark.svg"
          alt=""
          width={340}
          height={432}
          priority={false}
          className="h-[15rem] w-auto lg:h-[19rem]"
        />
      </div>

      <Container size="wide" className="relative">
        <div className="py-16 lg:py-20">
          <div className="max-w-3xl">
            {eyebrow ? (
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-turquoise">
                {eyebrow}
              </span>
            ) : null}

            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-[-0.025em] text-brand-teal sm:text-5xl">
              {title}
            </h1>

            <span aria-hidden className="mt-6 block h-px w-16 bg-brand-gold" />

            {description ? (
              <p className="mt-6 text-lg leading-relaxed text-brand-ink/75">
                {description}
              </p>
            ) : null}
          </div>

          {/*
            Outside the text column on purpose. A measure that suits a
            paragraph is too narrow for a row of counters or a row of pills,
            which want the width of the container.
          */}
          {children}
        </div>
      </Container>
    </section>
  );
}
