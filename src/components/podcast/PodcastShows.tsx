'use client';

import Image from 'next/image';
import { useState } from 'react';

import { PodcastPlayer } from '@/components/podcast/PodcastPlayer';
import type { Podcast } from '@/lib/cms/types';
import { useT } from '@/lib/i18n/useT';

/**
 * The shows, and one player.
 *
 * With a single show this is just the player under its own heading, which is
 * what a podcast page usually is. With several, the shows become tabs and only
 * the chosen one is mounted — two players on a page is two things that can be
 * playing at once, and a listener who cannot find which one is making the
 * noise blames the site rather than the tab.
 */
export function PodcastShows({ shows }: { shows: Podcast[] }) {
  const t = useT();
  const [at, setAt] = useState(0);
  const show = shows[at];

  if (!show) return null;

  return (
    <div>
      {shows.length > 1 ? (
        <div
          role="tablist"
          aria-label={t('aria.shows')}
          className="mb-10 flex flex-wrap gap-2.5"
        >
          {shows.map((one, index) => {
            const active = index === at;

            return (
              <button
                key={one.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setAt(index)}
                className={`inline-flex items-center gap-3 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-brand-teal bg-brand-teal text-brand-beige'
                    : 'border-brand-sand text-brand-ink/70 hover:border-brand-teal hover:text-brand-teal'
                }`}
              >
                {one.cover?.sourceUrl ? (
                  <Image
                    src={one.cover.sourceUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : null}
                {one.title}
                <span className={active ? 'text-xs opacity-70' : 'text-xs opacity-50'}>
                  {one.episodes.length}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-teal">
            {show.title}
          </h2>
          {show.subtitle ? (
            <p className="mt-2 text-base text-brand-ink/65">{show.subtitle}</p>
          ) : null}
        </div>

        <p className="text-sm text-brand-ink/55">
          {show.episodes.length}{' '}
          {show.episodes.length === 1 ? t('list.episode') : t('list.episodes')}
        </p>
      </div>

      {/*
        Keyed on the show, so switching tabs builds a new player rather than
        handing a running one a different episode list — which would leave it
        playing the previous show's audio under the new show's title.
      */}
      <PodcastPlayer key={show.id} show={show} />

      {show.description ? (
        <div
          className="prose-ecc mt-12 max-w-3xl"
          // HTML rendered on the server from the rich text editors write in the admin.
          dangerouslySetInnerHTML={{ __html: show.description }}
        />
      ) : null}
    </div>
  );
}
