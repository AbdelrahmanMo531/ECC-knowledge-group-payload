'use client';

import { useEffect, useRef, useState } from 'react';

import { PlayIcon } from '@/components/ui/icons';
import { useT } from '@/lib/i18n/useT';
import { parseVideo, videoEmbedSrc } from '@/lib/video';

/**
 * A play button that opens the video in a modal.
 *
 * Built on the native `<dialog>` element, which brings Escape to close, focus
 * containment and inertness of the page behind it without a library. The
 * iframe is created only when the dialog opens and destroyed when it closes,
 * so an unwatched video costs the page nothing and a closed one stops playing.
 *
 * Renders nothing for a link it cannot parse — a dead play button is worse
 * than none.
 */
export function VideoLightbox({
  url,
  label,
  context,
  className = '',
}: {
  url?: string | null;
  /**
   * The words on the button. Keep them short — this is a button, not a title.
   * Left out, it says "Watch the film" in the language of the page.
   */
  label?: string;
  /**
   * What the film is of, for the accessible name and the dialog's title.
   *
   * A page can carry several of these, and "Watch the film" three times over
   * tells a screen-reader user nothing about which is which. It belongs here
   * rather than in `label`, where a heading-length string would run across the
   * page as button text.
   */
  context?: string;
  className?: string;
}) {
  const t = useT();
  const words = label ?? t('video.watch');

  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const video = parseVideo(url);

  // Keep React's state in step with the dialog's own close paths — Escape and
  // the backdrop both close it without going through our button.
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;

    const onClose = () => setOpen(false);
    element.addEventListener('close', onClose);
    return () => element.removeEventListener('close', onClose);
  }, []);

  if (!video) return null;

  const show = () => {
    setOpen(true);
    dialog.current?.showModal();
  };

  const hide = () => {
    dialog.current?.close();
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-label={context ? `${words}: ${context}` : undefined}
        className={`group/play inline-flex items-center gap-3 rounded-full bg-brand-beige/95 py-2 pe-6 ps-2 text-sm font-medium text-brand-teal shadow-lg shadow-black/20 transition-colors hover:bg-brand-gold ${className}`}
      >
        <span
          aria-hidden
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-brand-beige transition-transform duration-300 group-hover/play:scale-105"
        >
          <PlayIcon width={16} height={16} />
        </span>
        {words}
      </button>

      <dialog
        ref={dialog}
        // `m-auto` is what centres it: the UA stylesheet centres a modal
        // dialog with `margin: auto`, and Tailwind's preflight resets every
        // margin to 0, which pins it to the top of the viewport.
        aria-label={context || words}
        className="m-auto max-h-[90vh] w-[min(64rem,92vw)] rounded-[calc(var(--radius-brand)*1.5)] bg-transparent p-0 backdrop:bg-brand-teal/80"
        onClick={(event) => {
          // A click on the dialog itself is a click on the backdrop: the
          // player sits in a child element that stops it going further.
          if (event.target === dialog.current) hide();
        }}
      >
        <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-black">
          <button
            type="button"
            onClick={hide}
            aria-label={t('video.close')}
            className="absolute end-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal/80 text-brand-beige transition-colors hover:bg-brand-gold hover:text-brand-teal"
          >
            <span aria-hidden>✕</span>
          </button>

          {open ? (
            <iframe
              src={videoEmbedSrc(video)}
              title={words}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
            />
          ) : null}
        </div>
      </dialog>
    </>
  );
}
