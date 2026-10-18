import assert from 'node:assert/strict';
import { describe, it, test } from 'node:test';

import { parseVideo, parseVimeo, videoEmbedSrc, videoThumbnail } from './video.ts';

/**
 * Editors paste whatever Vimeo gives them — a share link, a player link, a
 * channel link, or an unlisted link carrying a privacy hash. Getting the hash
 * wrong is the failure that matters: an unlisted video embedded without it
 * plays as "Sorry, this video is private", which looks like a broken site.
 */
describe('parseVimeo', () => {
  it('reads a plain share link', () => {
    assert.deepEqual(parseVimeo('https://vimeo.com/824804225'), {
      id: '824804225',
      hash: undefined,
    });
  });

  it('reads a player link', () => {
    assert.equal(parseVimeo('https://player.vimeo.com/video/824804225')?.id, '824804225');
  });

  it('reads a channel link', () => {
    assert.equal(
      parseVimeo('https://vimeo.com/channels/staffpicks/824804225')?.id,
      '824804225',
    );
  });

  it('keeps the privacy hash of an unlisted video', () => {
    assert.deepEqual(parseVimeo('https://vimeo.com/824804225/a1b2c3d4e5'), {
      id: '824804225',
      hash: 'a1b2c3d4e5',
    });
  });

  it('ignores a protocol-less or www-prefixed link gracefully', () => {
    assert.equal(parseVimeo('www.vimeo.com/824804225')?.id, '824804225');
  });

  it('returns null for an empty or non-Vimeo URL, so the section hides', () => {
    assert.equal(parseVimeo(''), null);
    assert.equal(parseVimeo('https://youtube.com/watch?v=abc'), null);
    assert.equal(parseVimeo('https://vimeo.com/about'), null);
  });
});

test('YouTube links resolve, whatever shape they take', () => {
  const links = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?list=PL123&v=dQw4w9WgXcQ&t=42',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
  ];

  for (const link of links) {
    assert.deepEqual(parseVideo(link), {
      provider: 'youtube',
      id: 'dQw4w9WgXcQ',
      portrait: false,
    }, link);
  }
});

test('a Short is recognised as the vertical video it is', () => {
  assert.deepEqual(parseVideo('https://www.youtube.com/shorts/dQw4w9WgXcQ'), {
    provider: 'youtube',
    id: 'dQw4w9WgXcQ',
    portrait: true,
  });
});

test('Vimeo wins for a Vimeo link, hash and all', () => {
  assert.deepEqual(parseVideo('https://vimeo.com/76979871/abc123'), {
    provider: 'vimeo',
    id: '76979871',
    hash: 'abc123',
    portrait: false,
  });
});

test('YouTube serves its own still; Vimeo needs a poster uploading', () => {
  const short = parseVideo('https://www.youtube.com/shorts/dQw4w9WgXcQ')!;
  const vimeo = parseVideo('https://vimeo.com/76979871')!;

  assert.equal(
    videoThumbnail(short),
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  );
  assert.equal(videoThumbnail(vimeo), null);
});

test('anything else is not a video', () => {
  assert.equal(parseVideo('https://example.com/watch?v=nope'), null);
  assert.equal(parseVideo(''), null);
  assert.equal(parseVideo(null), null);
});

test('the embed URL matches the provider', () => {
  const vimeo = parseVideo('https://vimeo.com/76979871');
  const youtube = parseVideo('https://youtu.be/dQw4w9WgXcQ');

  assert.ok(videoEmbedSrc(vimeo!).startsWith('https://player.vimeo.com/video/76979871'));
  assert.ok(
    videoEmbedSrc(youtube!).startsWith(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    ),
  );
});
