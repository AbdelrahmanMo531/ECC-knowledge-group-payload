'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react';

import type { ReactNode } from 'react';

import { Container } from '@/components/ui/Container';

import { readingAxis } from '@/lib/i18n/direction';
import { useT } from '@/lib/i18n/useT';

/** Height of the site header, which the bar pins beneath (`h-20`). */
const HEADER_HEIGHT = 80;

/** Gap left between the bar and the section a tab click lands on. */
const LANDING_GAP = 8;

/**
 * How far below the bar a section's top may still be and count as current.
 *
 * Comfortably more than `LANDING_GAP`: a click lands the section a few pixels
 * below the bar, and if the two numbers were equal — as they were — a single
 * pixel of rounding left the *previous* tab highlighted on the section you had
 * just asked for. The slack also makes scrolling up feel right, since a
 * section becomes current as it reaches the bar rather than after it passes.
 */
const ACTIVE_SLACK = 32;

export type PageSection = {
  /** Must match the `id` on the corresponding <section>. */
  id: string;
  label: string;
};

/**
 * Sticky in-page navigation.
 *
 * Sits directly after a hero and pins itself below the site header, so the
 * page's structure stays visible however far down a visitor has read. The rail
 * beneath it tracks how much is left: it fills to the full width as the last
 * section clears the viewport.
 *
 * The links are ordinary anchors, so the navigation works before hydration and
 * without JavaScript; only the highlight and the progress rail need the client.
 * `trackId` names the element the progress is measured against — everything
 * from this bar to the end of the page's content.
 *
 * `action` is an optional control pinned to the right of the bar: the
 * brochure download on a programme, nothing on a partner.
 */
export function SectionTabs({
  sections,
  trackId,
  action,
}: {
  sections: PageSection[];
  trackId: string;
  action?: ReactNode;
}) {
  const t = useT();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<string, HTMLAnchorElement>());
  const correction = useRef<number>(undefined);
  /** The tab being scrolled to; scroll-driven updates defer to it. */
  const pending = useRef<string | null>(null);

  const setTabRef = useCallback(
    (id: string) => (node: HTMLAnchorElement | null) => {
      if (node) tabRefs.current.set(id, node);
      else tabRefs.current.delete(id);
    },
    [],
  );

  useEffect(() => {
    if (sections.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      const track = document.getElementById(trackId);
      if (track) {
        const top = track.getBoundingClientRect().top + window.scrollY;
        // The rail is full once the track's last pixel is on screen, not once
        // the document stops scrolling — the footer is not part of the
        // programme.
        const distance = track.offsetHeight - window.innerHeight;
        const ratio = distance > 0 ? (window.scrollY - top) / distance : 1;
        setProgress(Math.min(1, Math.max(0, ratio)));
      }

      // A tab click sets the active tab itself and holds it until the scroll
      // settles; letting the scroll handler fight it mid-animation is what
      // made a click land on one section with another tab lit.
      if (pending.current) return;

      // The active tab is the last section to have reached the bar, which is
      // what a reader perceives as "the section I am in".
      const line = (barRef.current?.getBoundingClientRect().bottom ?? 0) + ACTIVE_SLACK;
      let current = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= line) {
          current = section.id;
        }
      }

      // At the very bottom of the page the last section is what fills the
      // screen, even if its top never crossed the line — a short final
      // section would otherwise leave the previous tab lit for good.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections, trackId]);

  // On narrow screens the tabs scroll sideways; keep the current one in view.
  // Only the bar's own scroll position is touched, never the page's.
  useEffect(() => {
    const tab = tabRefs.current.get(activeId);
    const scroller = scrollerRef.current;
    if (!tab || !scroller) return;

    // `offsetLeft` is measured from the physical left edge whichever way the
    // page reads, but `scrollLeft` counts away from the *start* — zero at the
    // right in Arabic, and negative from there. Converting between the two is
    // what the axis is for; clamping toward zero keeps the bar from being
    // scrolled past its own beginning in either direction.
    const axis = readingAxis(scroller);
    const left = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2;
    const target =
      axis === 1 ? Math.max(0, left) : Math.min(0, left - (scroller.scrollWidth - scroller.clientWidth));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollTo({
      left: target,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }, [activeId]);

  /**
   * Scrolls to a section, rather than letting the browser's anchor jump do it.
   *
   * Two reasons. The bar is sticky, so the browser would land the section
   * under it; `scroll-margin-top` handles that, but only if the page height is
   * final — and images further down load *during* a long smooth scroll, which
   * moves the target underneath the animation and leaves the visitor at the
   * end of the previous section. Measuring at click time and correcting once
   * the animation settles fixes both.
   */
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    event.preventDefault();

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offsetFor = () => {
      const bar = barRef.current?.getBoundingClientRect();
      // The bar's own height plus whatever sits above it — the site header
      // when it is pinned — measured now rather than assumed.
      return (bar ? bar.height : 0) + HEADER_HEIGHT + LANDING_GAP;
    };

    const scroll = (behavior: ScrollBehavior) => {
      const top =
        document.getElementById(id)!.getBoundingClientRect().top +
        window.scrollY -
        offsetFor();

      window.scrollTo({ top: Math.max(0, top), behavior });
    };

    pending.current = id;
    setActiveId(id);
    history.replaceState(null, '', `#${id}`);
    scroll(reduced ? 'auto' : 'smooth');

    // One correction pass: if anything resized on the way, land it exactly,
    // then hand control back to the scroll handler.
    window.clearTimeout(correction.current);
    correction.current = window.setTimeout(
      () => {
        const drift = Math.abs(
          document.getElementById(id)!.getBoundingClientRect().top - offsetFor(),
        );
        if (drift > 2) scroll('auto');

        // A second frame: `scrollTo` above has not been applied yet when the
        // callback returns, and releasing early would let a stale measurement
        // move the highlight off the section just landed on.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            pending.current = null;
          });
        });
      },
      reduced ? 0 : 700,
    );
  };

  if (sections.length === 0) return null;

  return (
    <div
      ref={barRef}
      // Opaque, not translucent: the bar sits over photography and dark
      // sections as often as over white ones, and text showing through it
      // makes the tabs unreadable.
      className="sticky top-20 z-40 border-b border-brand-sand/70 bg-white shadow-[0_6px_16px_-12px_rgba(0,68,66,0.45)]"
    >
      <Container size="wide">
        <nav aria-label={t('aria.sections')} className="flex items-center gap-4">
          <div
            ref={scrollerRef}
            className="flex flex-1 gap-1 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((section) => {
              const isActive = section.id === activeId;

              return (
                <a
                  key={section.id}
                  ref={setTabRef(section.id)}
                  href={`#${section.id}`}
                  onClick={(event) => goTo(event, section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? 'bg-brand-teal font-medium text-brand-beige'
                      : 'text-brand-ink/65 hover:bg-brand-beige/70 hover:text-brand-teal'
                  }`}
                >
                  {section.label}
                </a>
              );
            })}
          </div>

          {/*
            Hidden on small screens, where the tabs need the full width — the
            hero carries the same control a short scroll away. The wrapper does
            the hiding rather than a class on the child: `hidden` and
            `inline-flex` are both display utilities, so which one wins is
            decided by stylesheet order, not by the class attribute.
          */}
          {action ? (
            <div className="hidden shrink-0 py-2 sm:block">{action}</div>
          ) : null}
        </nav>
      </Container>

      {/* Scroll progress. Decorative — it restates the scrollbar. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-brand-sand/40">
        <div
          className="h-full bg-brand-gold"
          style={{ width: `${(progress * 100).toFixed(2)}%` }}
        />
      </div>
    </div>
  );
}
