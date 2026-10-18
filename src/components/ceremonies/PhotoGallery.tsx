'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { GalleryImage } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { readingAxis } from '@/lib/i18n/direction';
import { format } from '@/lib/i18n/dictionary';
import { useT } from '@/lib/i18n/useT';

/**
 * A grid of photographs that opens into a lightbox.
 *
 * The same shape as the video gallery — a grid, a dialog, arrow keys, wrapping
 * — because a visitor who has used one should not have to learn the other.
 * What differs is what it is showing: a still needs no player, so the dialog
 * is the photograph at whatever size the screen allows, and the caption under
 * it rather than a title above.
 */
export function PhotoGallery({ images }: { images: GalleryImage[] }) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const show = (index: number, trigger: HTMLButtonElement) => {
    opener.current = trigger;
    setOpen(index);
    dialog.current?.showModal();
  };

  const hide = useCallback(() => dialog.current?.close(), []);

  const step = useCallback(
    (by: number) =>
      setOpen((at) => (at === null ? null : (at + by + images.length) % images.length)),
    [images.length],
  );

  // Escape and the backdrop close it without going through our button, so
  // React's state is kept in step with the element's own close paths — and
  // focus goes back to the photograph that opened it.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    const onClose = () => {
      setOpen(null);
      opener.current?.focus();
    };

    element.addEventListener('close', onClose);
    return () => element.removeEventListener('close', onClose);
  }, []);

  useEffect(() => {
    if (open === null) return;

    // The arrow that moves forward is the one pointing the way the page
    // reads: in Arabic that is the left one.
    const onKey = (event: KeyboardEvent) => {
      const axis = readingAxis(document.documentElement);

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(axis);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-axis);
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, step]);

  if (!images.length) return null;

  const current = open === null ? null : images[open];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((photo, index) => (
          <li
            key={photo.image.sourceUrl}
            // The first photograph is given the width of two, so the grid
            // opens on something worth looking at rather than a row of equal
            // squares.
            className={index === 0 ? 'sm:col-span-2 sm:row-span-2' : undefined}
          >
            <button
              type="button"
              onClick={(event) => show(index, event.currentTarget)}
              className="group relative block h-full w-full overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-offset-2"
            >
              {/*
                `relative`, or the photograph has nothing to fill.

                A `fill` image positions against its nearest positioned
                ancestor, and this box had no position of its own — so every
                photograph in the gallery sized itself against the button
                instead and the browser logged the mismatch on every render.
                The two boxes happen to be the same, because the gradient and
                the caption are overlays rather than flow content, so this
                fixes the warning without moving anything.
              */}
              <span className="relative block aspect-[4/3]">
                <Image
                  src={photo.image.sourceUrl}
                  alt={photo.caption || photo.image.altText || ''}
                  fill
                  sizes={
                    index === 0
                      ? '(min-width: 1024px) 40rem, 100vw'
                      : '(min-width: 1024px) 20rem, 50vw'
                  }
                  className="object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
                />
              </span>

              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-teal/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {photo.caption ? (
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-start text-sm text-brand-beige opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {photo.caption}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current?.caption || t('aria.photograph')}
        // `m-auto` centres it: the UA stylesheet does that with `margin: auto`,
        // which Tailwind's preflight resets to zero.
        className="m-auto max-h-[100dvh] w-[min(72rem,94vw)] max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-brand-teal/90 backdrop:backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === dialog.current) hide();
        }}
      >
        {current ? (
          <div className="flex max-h-[100dvh] flex-col gap-4 py-4">
            <div className="flex items-start justify-between gap-6 text-brand-beige">
              <p className="text-sm text-brand-beige/70">
                {format(t('photo.position'), {
                  current: open! + 1,
                  total: images.length,
                })}
              </p>

              <button
                type="button"
                onClick={hide}
                aria-label={t('photo.close')}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-beige/25 transition-colors hover:border-brand-gold hover:text-brand-gold"
              >
                <span aria-hidden>✕</span>
              </button>
            </div>

            {/*
              An explicit height, not `flex-1`. A flex child grows into space
              its parent has, and this column is sized by its own contents —
              so `flex-1` resolved to zero and the photograph rendered at no
              height at all. Measuring from the viewport instead leaves the
              header, the caption and the controls their room and gives the
              picture the rest.
            */}
            <div
              className="relative w-full"
              style={{ height: 'calc(100dvh - 12rem)' }}
            >
              <Image
                key={current.image.sourceUrl}
                src={current.image.sourceUrl}
                alt={current.caption || current.image.altText || ''}
                fill
                sizes="94vw"
                className="rounded-[calc(var(--radius-brand)*1.5)] object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-4 text-brand-beige">
              <Nav direction="previous" onClick={() => step(-1)} />

              {current.caption ? (
                <p className="hidden max-w-xl text-center text-sm text-brand-beige/70 sm:block">
                  {current.caption}
                </p>
              ) : null}

              <Nav direction="next" onClick={() => step(1)} />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function Nav({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next';
  onClick: () => void;
}) {
  const t = useT();
  const next = direction === 'next';

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-beige/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand-gold hover:text-brand-gold"
    >
      {next ? null : <Arrow back />}
      {t(next ? 'photo.next' : 'photo.previous')}
      {next ? <Arrow /> : null}
    </button>
  );
}
