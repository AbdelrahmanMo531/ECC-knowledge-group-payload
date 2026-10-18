'use client';

import { useCallback, useState } from 'react';

import { VideoGallery } from '@/components/video/VideoGallery';
import { useT } from '@/lib/i18n/useT';
import { galleryHref } from '@/lib/videos';
import type { VideoItem } from '@/lib/cms/types';

/**
 * The grid, plus everything about sharing what is open.
 *
 * Opening a film puts it in the address bar, so the URL always describes what
 * is on screen: copy it at any moment and whoever opens it lands on the same
 * film, in the same category, on the same page of the grid. Closing takes it
 * back out again.
 *
 * The URL is rewritten with `replaceState` rather than by routing. This is a
 * server-rendered page behind a modal; asking Next to navigate would re-run
 * the page for something that has already happened in the browser, and would
 * fill the history with one entry per film — turning Back, which people expect
 * to close the lightbox, into a walk back through everything they watched.
 */
export function GalleryBrowser({
  films,
  category,
  page,
  openAt,
}: {
  films: VideoItem[];
  category: string;
  page: number;
  /** Index of the film named in the URL, or null to open nothing. */
  openAt: number | null;
}) {
  const onShow = useCallback(
    (film: VideoItem | null) => {
      const href = galleryHref({ category, page, video: film?.slug });

      if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== href) {
        window.history.replaceState(null, '', href);
      }
    },
    [category, page],
  );

  return (
    <VideoGallery
      films={films}
      openAt={openAt}
      onShow={onShow}
      share={(film) => (
        <ShareButton href={galleryHref({ category, page, video: film.slug })} />
      )}
    />
  );
}

/**
 * Copies a link to the film that is open.
 *
 * The clipboard is offered first because it is what someone wants: a link to
 * paste into a message. Where the browser refuses — an insecure origin, or a
 * permission denied — the URL is put in a field and selected, so the answer is
 * never "nothing happened".
 */
function ShareButton({ href }: { href: string }) {
  const t = useT();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  const copy = async () => {
    const url = new URL(href, window.location.origin).toString();

    try {
      await navigator.clipboard.writeText(url);
      setState('copied');
      window.setTimeout(() => setState('idle'), 2400);
    } catch {
      setState('failed');
    }
  };

  if (state === 'failed') {
    return (
      <input
        readOnly
        value={new URL(href, window.location.origin).toString()}
        aria-label={t('video.share.link')}
        onFocus={(event) => event.currentTarget.select()}
        autoFocus
        className="w-52 rounded-full border border-brand-beige/25 bg-transparent px-4 py-2 text-xs text-brand-beige"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-brand-beige/25 px-4 text-sm text-brand-beige transition-colors hover:border-brand-gold hover:text-brand-gold"
    >
      <LinkIcon />
      {/* Announced when it changes, so the outcome is not colour and motion. */}
      <span aria-live="polite">
        {t(state === 'copied' ? 'video.share.copied' : 'video.share')}
      </span>
    </button>
  );
}

function LinkIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden
      focusable="false"
    >
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}
