'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Container } from '@/components/ui/Container';
import { PlayIcon } from '@/components/ui/icons';
import { parseVideo, videoEmbedSrc } from '@/lib/video';
import type { HomeContent } from '@/lib/cms/types';
import { useT } from '@/lib/i18n/useT';

/**
 * The insight video, embedded as a facade.
 *
 * The player is not loaded until a visitor presses play. A Vimeo or YouTube
 * iframe pulls several hundred kilobytes and sets cookies on sight, which is a
 * poor trade for a video most visitors will scroll past — so what renders
 * initially is just a poster image and a button, and the iframe is injected on
 * click.
 */

export function VideoSection({ video }: { video: HomeContent['video'] }) {
  const t = useT();
  const [playing, setPlaying] = useState(false);
  const parsed = parseVideo(video.url);

  // No link, no section — never a broken embed.
  if (!parsed) return null;

  const src = videoEmbedSrc(parsed);

  return (
    <section className="relative overflow-hidden bg-brand-teal py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -start-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-turquoise/20 blur-3xl"
      />

      <Container size="wide" className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold">
              {video.eyebrow}
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.02em] text-brand-beige sm:text-4xl">
              {video.heading}
            </h2>

            <span aria-hidden className="mt-5 block h-px w-16 bg-brand-gold" />

            <p className="mt-6 text-base leading-relaxed text-brand-beige/75">
              {video.body}
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*2)] bg-teal-900 shadow-2xl shadow-black/25">
              {/* Gold hairline frame, matching the CEO portrait treatment. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 rounded-[calc(var(--radius-brand)*2)] ring-1 ring-inset ring-brand-gold/30"
              />

              <div className="relative aspect-video w-full">
                {playing ? (
                  <iframe
                    src={src}
                    title={video.heading}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 h-full w-full cursor-pointer"
                  >
                    {video.poster?.sourceUrl ? (
                      <Image
                        src={video.poster.sourceUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-105"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="bg-brand-gradient-teal absolute inset-0"
                      />
                    )}

                    <span
                      aria-hidden
                      className="absolute inset-0 bg-brand-teal/35 transition-colors duration-300 group-hover:bg-brand-teal/25"
                    />

                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-beige text-brand-teal shadow-xl transition-transform duration-300 ease-[var(--ease-brand)] group-hover:scale-110">
                        <PlayIcon width={28} height={28} className="ms-1" />
                      </span>
                    </span>

                    <span className="sr-only">
                      Play the video: {video.heading}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {!playing ? (
              <p className="mt-4 text-center text-xs text-brand-beige/45">
                {t('section.video.lazy')}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
