/**
 * Video URL parsing, for Vimeo and YouTube.
 *
 * Lives outside the component so it is unit-testable — Node's type stripping
 * cannot load a .tsx file, and this is the part with the edge cases anyway.
 */

/**
 * Extracts the numeric id from any of Vimeo's URL shapes:
 * vimeo.com/123, vimeo.com/channels/x/123, player.vimeo.com/video/123,
 * and unlisted links carrying a private hash (vimeo.com/123/abcdef).
 */
export function parseVimeo(url: string): { id: string; hash?: string } | null {
  if (!url) return null;

  const match = url.match(
    /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)(?:\/([\w]+))?/i,
  );

  return match ? { id: match[1], hash: match[2] } : null;
}

/** Builds the player src, carrying the privacy hash for unlisted videos. */
export function vimeoEmbedSrc(parsed: { id: string; hash?: string }): string {
  return (
    `https://player.vimeo.com/video/${parsed.id}` +
    `?autoplay=1&title=0&byline=0&portrait=0` +
    (parsed.hash ? `&h=${parsed.hash}` : '')
  );
}

/** A video resolved to the one thing a player needs: an embed URL. */
export type ParsedVideo = {
  provider: 'vimeo' | 'youtube';
  id: string;
  /** Vimeo's privacy hash, for unlisted videos. */
  hash?: string;
  /**
   * Whether the video is taller than it is wide.
   *
   * A YouTube Short is always vertical, and framing one in a 16:9 player
   * leaves two black columns wider than the video. Nothing in a Vimeo URL
   * says which way up it is, so those are assumed landscape.
   */
  portrait: boolean;
};

/**
 * Extracts the id from a YouTube URL.
 *
 * Covers watch links, youtu.be short links, /embed/, /v/ and /shorts/, with or
 * without the extra query parameters a share link carries.
 */
export function parseYouTube(url: string): { id: string; portrait: boolean } | null {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i,
  );

  if (!match) return null;

  return { id: match[1], portrait: /\/shorts\//i.test(url) };
}

/** Resolves any supported video link. Returns null for anything else. */
export function parseVideo(url: string | null | undefined): ParsedVideo | null {
  if (!url) return null;

  const vimeo = parseVimeo(url);
  if (vimeo) return { provider: 'vimeo', portrait: false, ...vimeo };

  const youtube = parseYouTube(url);
  if (youtube) return { provider: 'youtube', ...youtube };

  return null;
}

/**
 * A thumbnail for a video, where one can be had without an API key.
 *
 * YouTube serves stills off a predictable URL, so a video posted without an
 * uploaded poster still shows its own frame. `hqdefault` rather than
 * `maxresdefault`: the latter 404s on plenty of videos, including most Shorts,
 * and a missing image is worse than a smaller one.
 *
 * Vimeo has no keyless equivalent — its thumbnails come from an API call — so
 * a Vimeo testimonial needs a poster uploaded, or it falls back to the branded
 * placeholder.
 */
export function videoThumbnail(video: ParsedVideo): string | null {
  return video.provider === 'youtube'
    ? `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
    : null;
}

/**
 * The player URL for a parsed video, set to autoplay.
 *
 * Autoplay is right here because the iframe only exists after a visitor has
 * pressed play — nothing starts on its own.
 */
export function videoEmbedSrc(video: ParsedVideo): string {
  if (video.provider === 'vimeo') return vimeoEmbedSrc(video);

  return (
    `https://www.youtube-nocookie.com/embed/${video.id}` +
    '?autoplay=1&rel=0&modestbranding=1'
  );
}
