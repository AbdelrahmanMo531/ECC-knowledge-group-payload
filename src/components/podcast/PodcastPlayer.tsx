'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  clock,
  episodeDate,
  nextSpeed,
  searchEpisodes,
  shouldResume,
  step,
} from '@/lib/podcast';
import { useT } from '@/lib/i18n/useT';
import { parseVideo } from '@/lib/video';
import type { Podcast } from '@/lib/cms/types';

/** `HTMLMediaElement.HAVE_METADATA` — the duration is known. */
const HAVE_METADATA = 1;

/**
 * One shell for three kinds of episode.
 *
 * A YouTube video, an MP4 and an MP3 are three different players with three
 * different sets of controls and three different ideas of what a button looks
 * like. Putting ECC's own controls over all three means a show can move from
 * YouTube to a hosted file without the page changing, and means the player
 * looks like the site rather than like whoever is hosting the file.
 *
 * YouTube runs through its IFrame API so the same buttons drive it; MP4 and
 * MP3 run through one `<video>` element, since an audio file in a video
 * element is an audio file with a poster frame — which is exactly what an
 * episode of a podcast wants.
 */
export function PodcastPlayer({ show }: { show: Podcast }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);

  const media = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const youtube = useRef<YouTubePlayer | null>(null);
  const shell = useRef<HTMLDivElement>(null);

  const episode = show.episodes[index];
  const isYouTube = episode?.source === 'youtube';
  const videoId = isYouTube ? youTubeId(episode.url) : null;

  /* ------------------------------------------------------------ storage -- */

  const positionKey = `ecc-podcast:${show.slug}`;

  const remember = useCallback(
    (id: string, at: number) => {
      try {
        const saved = JSON.parse(localStorage.getItem(positionKey) ?? '{}');
        saved[id] = Math.floor(at);
        localStorage.setItem(positionKey, JSON.stringify(saved));
      } catch {
        // A private window, a full quota, a browser that says no. Remembering
        // where someone stopped is a courtesy, not a feature to fail over.
      }
    },
    [positionKey],
  );

  const rememberedFor = useCallback(
    (id: string): number => {
      try {
        return Number(JSON.parse(localStorage.getItem(positionKey) ?? '{}')[id] ?? 0);
      } catch {
        return 0;
      }
    },
    [positionKey],
  );

  /* ------------------------------------------------------- the controls -- */

  const seekTo = useCallback(
    (to: number) => {
      const target = Math.max(0, duration ? Math.min(to, duration) : to);

      if (youtube.current) youtube.current.seekTo(target, true);
      else if (media.current) media.current.currentTime = target;

      setPosition(target);
    },
    [duration],
  );

  const toggle = useCallback(() => setPlaying((was) => !was), []);

  const goTo = useCallback(
    (next: number, autoplay = true) => {
      // Choosing the episode already open is a request to play it, not to
      // start it again: someone who paused, scrolled the list and pressed the
      // same row wants it back, from where they were.
      if (next !== index) {
        setIndex(next);
        setPosition(0);
        setDuration(0);
        setReady(false);
        // Kept, so moving on and coming back does not restart the episode.
        if (episode) remember(episode.id, position);
      }

      if (autoplay) setPlaying(true);
    },
    [episode, index, position, remember],
  );

  const move = useCallback(
    (by: number) => goTo(step(index, by, show.episodes.length)),
    [goTo, index, show.episodes.length],
  );

  /**
   * The element follows the state.
   *
   * `playing` is set by the buttons, by the keyboard, by choosing an episode
   * and by rolling into the next one — and every one of those has to reach the
   * player. Doing it in one effect rather than at each call site is what stops
   * the two from disagreeing: before this, choosing the episode that was
   * already open set the flag and told nothing to play, so the row looked
   * dead. Acting only when they differ keeps it clear of the element's own
   * play and pause events, which set the same flag.
   */
  useEffect(() => {
    const player = youtube.current;

    if (isYouTube) {
      if (!player) return;
      if (playing) player.playVideo();
      else player.pauseVideo();
      return;
    }

    const element = media.current;
    if (!element) return;

    if (playing && element.paused) element.play().catch(() => setPlaying(false));
    if (!playing && !element.paused) element.pause();
  }, [playing, isYouTube, index, ready]);

  /* --------------------------------------------------- the media element -- */

  // One `<video>` for both files. Switching `src` is what changes episode; the
  // element itself is never torn down, so playback state survives the move.
  useEffect(() => {
    const element = media.current;
    if (!element || isYouTube || !episode) return;

    const onLoaded = () => {
      setDuration(element.duration || 0);
      setReady(true);

      const saved = rememberedFor(episode.id);
      if (shouldResume(saved, element.duration)) element.currentTime = saved;
    };

    const onTime = () => setPosition(element.currentTime);
    const onEnd = () => {
      remember(episode.id, 0);
      if (show.autoplayNext) move(1);
      else setPlaying(false);
    };

    // A file that is already loaded will never fire `loadedmetadata` again,
    // and on a reload the browser starts fetching the moment the element is
    // parsed — well before React attaches this listener. Without catching
    // that, resuming works only when the network is slow enough to lose the
    // race, which is to say almost never on a second visit.
    if (element.readyState >= HAVE_METADATA) onLoaded();

    element.addEventListener('loadedmetadata', onLoaded);
    element.addEventListener('timeupdate', onTime);
    element.addEventListener('play', () => setPlaying(true));
    element.addEventListener('pause', () => setPlaying(false));
    element.addEventListener('ended', onEnd);

    return () => {
      element.removeEventListener('loadedmetadata', onLoaded);
      element.removeEventListener('timeupdate', onTime);
      element.removeEventListener('ended', onEnd);
    };
    // `playing` is deliberately absent: this wires the element up for an
    // episode, and re-running it on every play and pause would rebind on
    // every click.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode?.id, isYouTube]);

  useEffect(() => {
    if (media.current) {
      media.current.playbackRate = speed;
      media.current.volume = volume;
      media.current.muted = muted;
    }

    if (youtube.current) {
      youtube.current.setPlaybackRate(speed);
      youtube.current.setVolume(Math.round(volume * 100));
      if (muted) youtube.current.mute();
      else youtube.current.unMute();
    }
  }, [speed, volume, muted, index]);

  /* ------------------------------------------------------------ YouTube -- */

  useEffect(() => {
    if (!isYouTube || !videoId) {
      youtube.current?.destroy?.();
      youtube.current = null;
      return;
    }

    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled || !frame.current) return;

      youtube.current?.destroy?.();

      youtube.current = new YT.Player(frame.current, {
        videoId,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, playsinline: 1 },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            setDuration(event.target.getDuration());
            setReady(true);

            const saved = rememberedFor(episode.id);
            if (shouldResume(saved, event.target.getDuration())) {
              event.target.seekTo(saved, true);
            }
          },
          onStateChange: (event: { data: number }) => {
            // 1 playing, 2 paused, 0 ended.
            if (event.data === 1) setPlaying(true);
            if (event.data === 2) setPlaying(false);
            if (event.data === 0) {
              remember(episode.id, 0);
              if (show.autoplayNext) move(1);
              else setPlaying(false);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, isYouTube]);

  // YouTube reports no time as it plays, so it is asked.
  useEffect(() => {
    if (!isYouTube || !playing) return;

    const timer = window.setInterval(() => {
      const player = youtube.current;
      if (!player) return;

      setPosition(player.getCurrentTime());
      setDuration(player.getDuration());
    }, 500);

    return () => window.clearInterval(timer);
  }, [isYouTube, playing]);

  /* ------------------------------------------------- remember, and keys -- */

  useEffect(() => {
    if (!episode || position < 1) return;

    const timer = window.setTimeout(() => remember(episode.id, position), 1000);
    return () => window.clearTimeout(timer);
  }, [episode, position, remember]);

  // Only while focus is inside the player: a page-wide space bar would take
  // the space key away from everything else on the page.
  useEffect(() => {
    const element = shell.current;
    if (!element) return;

    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const keys: Record<string, () => void> = {
        ' ': toggle,
        ArrowLeft: () => seekTo(position - 5),
        ArrowRight: () => seekTo(position + 5),
        n: () => move(1),
        p: () => move(-1),
      };

      const action = keys[event.key];

      if (action) {
        event.preventDefault();
        action();
      }
    };

    element.addEventListener('keydown', onKey);
    return () => element.removeEventListener('keydown', onKey);
  }, [toggle, seekTo, move, position]);

  /* ------------------------------------------------------------- render -- */

  const listed = useMemo(
    () => (show.search ? searchEpisodes(show.episodes, query) : show.episodes),
    [show.episodes, show.search, query],
  );

  if (!episode) return null;

  const still = episode.thumb || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);
  const audioOnly = episode.source === 'audio';

  return (
    <div
      ref={shell}
      tabIndex={-1}
      className={`grid gap-8 focus:outline-none ${
        show.layout === 'sidebar' ? 'lg:grid-cols-[minmax(0,1fr)_22rem]' : ''
      }`}
    >
      <div className="min-w-0">
        {/* ------------------------------------------------------ stage -- */}
        <div className="relative overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] bg-brand-teal">
          <div className={audioOnly ? 'relative aspect-[16/7]' : 'relative aspect-video'}>
            {isYouTube ? (
              <div className="absolute inset-0 [&>iframe]:h-full [&>iframe]:w-full">
                <div ref={frame} className="h-full w-full" />
              </div>
            ) : (
              <video
                ref={media}
                src={episode.url}
                poster={still ?? undefined}
                playsInline
                preload="metadata"
                className={`absolute inset-0 h-full w-full ${
                  audioOnly ? 'sr-only' : 'object-contain'
                }`}
              />
            )}

            {/*
              An audio episode has nothing to look at, so the stage becomes the
              cover art with the show's gradient over it rather than a black
              rectangle that looks like a video failing to load.
            */}
            {audioOnly ? (
              <div className="bg-brand-gradient-teal absolute inset-0">
                {still || show.cover?.sourceUrl ? (
                  <Image
                    src={still || show.cover!.sourceUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 44rem, 100vw"
                    className="object-cover opacity-25"
                  />
                ) : null}

                <div className="absolute inset-0 flex items-center gap-5 p-7 sm:p-9">
                  {show.cover?.sourceUrl ? (
                    <Image
                      src={show.cover.sourceUrl}
                      alt=""
                      width={96}
                      height={96}
                      className="hidden h-20 w-20 shrink-0 rounded-[var(--radius-brand)] object-cover sm:block"
                    />
                  ) : null}

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-brand-gold">
                      {show.title}
                    </p>
                    <p className="mt-2 line-clamp-2 font-serif text-xl font-bold leading-tight text-brand-beige sm:text-2xl">
                      {episode.title}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {!ready ? (
              <div className="absolute inset-0 grid place-items-center bg-brand-teal/40">
                <span className="text-sm text-brand-beige/70">{t('player.loading')}</span>
              </div>
            ) : null}
          </div>

          {/* --------------------------------------------------- controls -- */}
          <div className="bg-brand-teal px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
            <Scrubber
              position={position}
              duration={duration}
              onSeek={seekTo}
              label={episode.title}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-y-3">
              <div className="flex items-center gap-1">
                <Control onClick={() => move(-1)} label={t('player.previous')}>
                  <SkipIcon back />
                </Control>
                <Control onClick={() => seekTo(position - 15)} label={t('player.back')}>
                  <ReplayIcon />
                </Control>

                <button
                  type="button"
                  onClick={toggle}
                  aria-label={t(playing ? 'player.pause' : 'player.play')}
                  className="mx-1.5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold text-brand-teal transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-beige"
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>

                <Control onClick={() => seekTo(position + 30)} label={t('player.forward')}>
                  <ForwardIcon />
                </Control>
                <Control onClick={() => move(1)} label={t('player.next')}>
                  <SkipIcon />
                </Control>
              </div>

              <div className="flex items-center gap-1">
                <Control
                  onClick={() => setSpeed(nextSpeed(speed))}
                  label={`${t('player.speed')} — ${speed}×`}
                >
                  <span className="text-xs font-semibold tabular-nums">{speed}×</span>
                </Control>

                <Control
                  onClick={() => setMuted((was) => !was)}
                  label={t(muted ? 'player.unmute' : 'player.mute')}
                >
                  {muted ? <MutedIcon /> : <VolumeIcon />}
                </Control>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(event) => {
                    setVolume(Number(event.target.value));
                    setMuted(Number(event.target.value) === 0);
                  }}
                  aria-label={t('player.volume')}
                  className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full bg-brand-beige/25 accent-brand-gold sm:block"
                />

                {!audioOnly && !isYouTube ? (
                  <Control
                    onClick={() => media.current?.requestFullscreen?.()}
                    label={t('player.fullscreen')}
                  >
                    <ExpandIcon />
                  </Control>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------- what is playing -- */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-turquoise">
            {t('player.episode')} {index + 1} {t('list.of')}{' '}
            {show.episodes.length}
            {episode.date ? ` · ${episodeDate(episode.date)}` : ''}
          </p>
          <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-brand-teal">
            {episode.title}
          </h3>
          {episode.description ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink/70">
              {episode.description}
            </p>
          ) : null}

          {show.channelUrl ? (
            <a
              href={show.channelUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-teal px-5 py-2.5 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-beige"
            >
              {show.channelLabel || t('player.channel')}
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
      </div>

      {/* -------------------------------------------------- episode list -- */}
      <div className="min-w-0">
        {show.search ? (
          <label className="block">
            <span className="sr-only">{t('player.search')}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('player.search')}
              className="w-full rounded-full border border-brand-sand bg-white px-5 py-3 text-sm text-brand-ink outline-none transition-colors placeholder:text-brand-ink/35 focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20"
            />
          </label>
        ) : null}

        <ul
          className={`mt-4 space-y-1.5 ${
            show.layout === 'sidebar'
              ? 'lg:max-h-[34rem] lg:overflow-y-auto lg:pe-1'
              : ''
          }`}
        >
          {listed.map((item) => {
            const at = show.episodes.indexOf(item);
            const active = at === index;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(at)}
                  aria-current={active ? 'true' : undefined}
                  className={`flex w-full items-start gap-3 rounded-[var(--radius-brand)] px-4 py-3 text-start transition-colors ${
                    active
                      ? 'bg-brand-teal text-brand-beige'
                      : 'hover:bg-brand-beige/60'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold ${
                      active
                        ? 'bg-brand-gold text-brand-teal'
                        : 'bg-brand-sand/60 text-brand-teal'
                    }`}
                  >
                    {active && playing ? '❚❚' : at + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-snug">
                      {item.title}
                    </span>
                    <span
                      className={`mt-1 block text-xs ${
                        active ? 'text-brand-beige/65' : 'text-brand-ink/50'
                      }`}
                    >
                      {[episodeDate(item.date), item.duration]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {show.search && !listed.length ? (
          <p className="mt-4 px-4 text-sm text-brand-ink/55">
            {t('player.search.none')} — “{query}”.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- pieces -- */

function Scrubber({
  position,
  duration,
  onSeek,
  label,
}: {
  position: number;
  duration: number;
  onSeek: (to: number) => void;
  label: string;
}) {
  const t = useT();
  const pct = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="flex items-center gap-3 text-brand-beige">
      <span className="w-12 shrink-0 text-xs tabular-nums text-brand-beige/70">
        {clock(position)}
      </span>

      {/*
        The played portion is painted behind the slider rather than into it, so
        the bar reads as progress rather than as an anonymous track. A gradient
        would have done it in one element, but `to right` is a physical
        direction and CSS has no logical equivalent — an Arabic page runs the
        slider from the right, and the fill would have crept in from the wrong
        end. A `start`-anchored element mirrors on its own.
      */}
      <div className="relative h-1.5 w-full">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand-beige/25"
        />
        <span
          aria-hidden
          className="absolute inset-y-0 start-0 rounded-full bg-brand-gold"
          style={{ width: `${pct}%` }}
        />

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={1}
          value={position}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label={`${t('player.seek')} ${label}`}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-brand-gold"
        />
      </div>

      <span className="w-12 shrink-0 text-end text-xs tabular-nums text-brand-beige/70">
        {clock(duration)}
      </span>
    </div>
  );
}

function Control({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-brand-beige/80 transition-colors hover:bg-brand-beige/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- icons -- */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  );
}

function SkipIcon({ back = false }: { back?: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={back ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M5 5.5v13l9-6.5-9-6.5ZM16 5h2.5v14H16z" />
    </svg>
  );
}

function ReplayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.2 4.5v4.2h4.2" />
      <text x="12" y="15.5" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">
        15
      </text>
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.8 4.5v4.2h-4.2" />
      <text x="12" y="15.5" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">
        30
      </text>
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden {...stroke}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  );
}

/* ------------------------------------------------------------- YouTube -- */

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  destroy?: () => void;
};

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: Record<string, unknown>,
  ) => YouTubePlayer;
};

declare global {
  interface Window {
    YT?: YouTubeApi & { loading?: number };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** The 11-character video ID inside any YouTube address. */
function youTubeId(url: string): string | null {
  const parsed = parseVideo(url);

  return parsed?.provider === 'youtube' ? parsed.id : null;
}

let apiPromise: Promise<YouTubeApi> | null = null;

/**
 * Loads YouTube's IFrame API, once per page.
 *
 * The script is only fetched when a YouTube episode is actually opened — a
 * show of MP3s never pays for it — and the promise is shared, so two players
 * on one page do not race to add two copies of the same script tag.
 */
function loadYouTubeApi(): Promise<YouTubeApi> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previous = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YouTubeApi);
    };

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });

  return apiPromise;
}
