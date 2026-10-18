'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import { PlayIcon } from '@/components/ui/icons';
import { parseVideo, videoEmbedSrc, videoThumbnail } from '@/lib/video';
import type { VideoItem } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { readingAxis } from '@/lib/i18n/direction';
import { useT } from '@/lib/i18n/useT';

/**
 * A grid of graduate films, opening into a lightbox you can walk through.
 *
 * The grid never embeds a player. Sixteen iframes on one page is sixteen
 * third-party scripts, a slow page and a wall of mismatched player chrome — so
 * a card is a still, a title and a play mark in the brand's own colours, and
 * the only iframe on the page is the one inside the open lightbox. It is built
 * when the dialog opens and destroyed when it closes, so nothing keeps playing
 * behind a closed dialog and an unwatched film costs nothing.
 */
/**
 * Height the dialog spends on everything that is not the film — the title and
 * credit, the gaps, the row of controls — with a little to spare.
 */
const CHROME = '11rem';

export function VideoGallery({
  films,
  onShow,
  share,
  openAt = null,
}: {
  films: VideoItem[];
  /** Told which film is open, so a page can put it in the URL. */
  onShow?: (film: VideoItem | null) => void;
  /** Renders a share control inside the lightbox, for the open film. */
  share?: (film: VideoItem) => React.ReactNode;
  /** Index to open on arrival — a shared link naming one film. */
  openAt?: number | null;
}) {
  const t = useT();
  const [open, setOpen] = useState<number | null>(openAt);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const show = (index: number, trigger: HTMLButtonElement) => {
    opener.current = trigger;
    setOpen(index);
    dialog.current?.showModal();
  };

  // A link that names a film arrives with the dialog already in state but not
  // yet shown — `showModal()` needs an element, which only exists after the
  // first paint. Runs once: reopening on every render would make the dialog
  // impossible to close.
  useEffect(() => {
    if (openAt !== null) dialog.current?.showModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hide = useCallback(() => dialog.current?.close(), []);

  const step = useCallback(
    (by: number) =>
      setOpen((current) =>
        current === null ? null : (current + by + films.length) % films.length,
      ),
    [films.length],
  );

  // Escape and the backdrop close the dialog without going through our button,
  // so React's state is kept in step with the element's own close paths — and
  // focus goes back to the card that opened it.
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

  // Arrow keys walk the collection while the lightbox is open. The dialog is
  // modal, so this listener cannot fire against the page behind it.
  useEffect(() => {
    if (open === null) return;

    const onKey = (event: KeyboardEvent) => {
      // Forward is whichever arrow points the way the page reads.
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

  const current = open === null ? null : films[open];
  const video = current ? parseVideo(current.video) : null;

  // Reported after paint rather than during render, so the page that owns the
  // URL is never asked to update while this one is still rendering.
  useEffect(() => {
    onShow?.(current);
  }, [current, onShow]);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {films.map((film, index) => (
          <li key={film.id}>
            <FilmCard film={film} onOpen={(trigger) => show(index, trigger)} />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current ? current.title : 'Video'}
        // `m-auto` is what centres it: the UA stylesheet centres a modal dialog
        // with `margin: auto`, and Tailwind's preflight resets every margin to
        // zero, which pins it to the top of the viewport.
        // `overflow-hidden` replaces the UA's `overflow: auto`: the contents
        // are sized to fit below, and a scrollbar inside a lightbox is a sign
        // something has been mis-measured rather than something to scroll.
        className="m-auto max-h-[100dvh] max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-brand-teal/85 backdrop:backdrop-blur-sm"
        // The width follows the film, so the title, the player and the
        // controls share one column instead of a wide header floating above a
        // narrow video. Inline rather than a class, because two arbitrary
        // width utilities are ordered by the stylesheet and one would win
        // wherever it was written.
        style={{ width: video?.portrait ? 'min(30rem, 94vw)' : 'min(64rem, 94vw)' }}
        onClick={(event) => {
          // A click on the dialog itself is a click on the backdrop: the player
          // sits in a child element that stops it going further.
          if (event.target === dialog.current) hide();
        }}
      >
        {current && video ? (
          <div className="flex max-h-[100dvh] flex-col justify-center gap-4 py-3">
            <div className="flex items-start justify-between gap-6 text-brand-beige">
              <div>
                <p className="text-base font-semibold sm:text-lg">{current.title}</p>
                {current.credit ? (
                  <p className="mt-1 text-sm text-brand-beige/65">{current.credit}</p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {share?.(current)}

                <button
                  type="button"
                  onClick={hide}
                  aria-label={t('video.close')}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-beige/25 text-brand-beige transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  <span aria-hidden>✕</span>
                </button>
              </div>
            </div>

            {/*
              The player is sized from the height that is actually left over,
              not from a fraction of the viewport: whatever the screen or the
              orientation, the title, the film and the controls together fit
              without the dialog ever needing to scroll. `CHROME` is what the
              rest of the dialog takes; the width follows from it and the
              aspect ratio, so the film is never distorted to make it fit.
            */}
            <div
              className="mx-auto w-full"
              style={{
                width: `min(100%, calc((100dvh - ${CHROME}) * ${
                  video.portrait ? '9 / 16' : '16 / 9'
                }))`,
                aspectRatio: video.portrait ? '9 / 16' : '16 / 9',
              }}
            >
              <iframe
                // Keyed on the film, so moving to the next one replaces the
                // player rather than asking an existing one to change source.
                key={current.id}
                src={videoEmbedSrc(video)}
                title={current.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full rounded-[calc(var(--radius-brand)*1.5)] bg-black"
              />
            </div>

            {films.length > 1 ? (
              <div className="flex items-center justify-between gap-4 text-brand-beige">
                <Nav direction="previous" onClick={() => step(-1)} />

                <p aria-live="polite" className="text-sm text-brand-beige/60">
                  {open! + 1} of {films.length}
                </p>

                <Nav direction="next" onClick={() => step(1)} />
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}

/**
 * One film in the grid.
 *
 * A still with a play mark over it, on the brand's teal, with the gold rule
 * every card on this site carries. The whole card is the button — a play
 * target the size of a thumbnail rather than the size of an icon.
 */
function FilmCard({
  film,
  onOpen,
}: {
  film: VideoItem;
  onOpen: (trigger: HTMLButtonElement) => void;
}) {
  const video = parseVideo(film.video);
  const source = film.poster?.sourceUrl ?? (video ? videoThumbnail(video) : null);

  // YouTube's still is a guess at a URL, not a promise: some videos have no
  // frame at the size asked for and answer 404. Falling back on the error
  // means the worst case is the brand gradient rather than a broken image.
  const [failed, setFailed] = useState(false);
  const still = failed ? null : source;

  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      className="group block h-full w-full overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-brand-beige/30 text-start transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-teal/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-teal">
        {still ? (
          <Image
            src={still}
            alt=""
            fill
            sizes="(min-width: 1280px) 20rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.05]"
            onError={() => setFailed(true)}
          />
        ) : (
          // No still to be had — a Vimeo film with no poster uploaded, or a
          // YouTube one whose frame 404s. The brand's own gradient beats a grey
          // box or a broken image icon.
          <div aria-hidden className="bg-brand-gradient-teal absolute inset-0" />
        )}

        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-teal via-brand-teal/35 to-transparent"
        />

        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-beige/95 text-brand-teal shadow-xl transition-all duration-300 ease-[var(--ease-brand)] group-hover:scale-110 group-hover:bg-brand-gold"
        >
          <PlayIcon width={18} height={18} />
        </span>

        <span className="absolute inset-x-0 bottom-0 p-5 text-brand-beige">
          <span className="block text-base font-semibold leading-snug">
            {film.title}
          </span>
          {film.credit ? (
            <span className="mt-1 block text-sm text-brand-beige/70">
              {film.credit}
            </span>
          ) : null}
        </span>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-brand-gold"
        />
      </div>
    </button>
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
      className="inline-flex items-center gap-2 rounded-full border border-brand-beige/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-brand-gold hover:text-brand-gold"
    >
      {next ? null : <Arrow back />}
      {t(next ? 'video.next' : 'video.previous')}
      {next ? <Arrow /> : null}
    </button>
  );
}
