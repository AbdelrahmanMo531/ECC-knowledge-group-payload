import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  categoriesOf,
  filterByCategory,
  galleryHref,
  isKnownCategory,
  playable,
  testimonialAsVideo,
} from './videos.ts';
import type { GalleryVideo, Testimonial } from './cms/types.ts';

const film = (
  slug: string,
  categories: string[],
  video = 'https://youtu.be/abc123',
): GalleryVideo => ({
  id: `id-${slug}`,
  slug,
  title: slug,
  video,
  categories: categories.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/ /g, '-'),
  })),
});

const gallery: GalleryVideo[] = [
  film('graduation-2026', ['Ceremonies']),
  film('cohort-day', ['Ceremonies', 'Internal Vibes']),
  film('beach-clean', ['CSR']),
  film('episode-one', ['Podcasts']),
];

/* -------------------------------------------------------------- categories */

test('categories are counted from the films that use them', () => {
  assert.deepEqual(
    categoriesOf(gallery).map((term) => `${term.name}:${term.count}`),
    ['Ceremonies:2', 'Internal Vibes:1', 'CSR:1', 'Podcasts:1'],
  );
});

test('a category nobody has filed anything under is not offered', () => {
  assert.equal(
    categoriesOf(gallery).some((term) => term.name === 'Seminars'),
    false,
  );
});

test('filtering keeps only the films in that category', () => {
  assert.deepEqual(
    filterByCategory(gallery, 'ceremonies').map((f) => f.slug),
    ['graduation-2026', 'cohort-day'],
  );
});

test('a film in two categories appears under both', () => {
  assert.deepEqual(
    filterByCategory(gallery, 'internal-vibes').map((f) => f.slug),
    ['cohort-day'],
  );
});

test('an unknown category shows the gallery rather than nothing', () => {
  assert.deepEqual(filterByCategory(gallery, 'nonsense'), gallery);
  assert.deepEqual(filterByCategory(gallery, ''), gallery);
});

test('isKnownCategory is what tells the two apart', () => {
  assert.equal(isKnownCategory(gallery, 'csr'), true);
  assert.equal(isKnownCategory(gallery, 'seminars'), false);
});

/* ------------------------------------------------------------- playability */

test('a film whose link cannot be read is left out of the grid', () => {
  const mixed = [
    film('good', ['CSR'], 'https://vimeo.com/12345678'),
    film('short', ['CSR'], 'https://www.youtube.com/shorts/dQw4w9WgXcQ'),
    film('bad', ['CSR'], 'https://example.com/not-a-video'),
    film('empty', ['CSR'], ''),
  ];

  assert.deepEqual(
    playable(mixed).map((f) => f.slug),
    ['good', 'short'],
  );
});

/* ------------------------------------------------------------------ links */

test('the gallery URL carries whichever view it describes', () => {
  assert.equal(galleryHref(), '/video-gallery');
  assert.equal(galleryHref({ category: 'csr' }), '/video-gallery?category=csr');
  assert.equal(galleryHref({ page: 3 }), '/video-gallery?page=3');
  assert.equal(
    galleryHref({ category: 'csr', page: 2, video: 'beach-clean' }),
    '/video-gallery?category=csr&page=2&video=beach-clean',
  );
});

test('page one is never written into the URL', () => {
  assert.equal(galleryHref({ page: 1 }), '/video-gallery');
  assert.equal(galleryHref({ category: 'csr', page: 1 }), '/video-gallery?category=csr');
});

/* ----------------------------------------------------------- testimonials */

const graduate: Testimonial = {
  id: 'cG9zdDox',
  title: 'A DBA that fitted around the job',
  quote: '',
  authorName: 'Layla Hassan',
  authorRole: 'Finance Director',
  program: 'Doctor of Business Administration',
  country: 'UAE',
  video: 'https://youtu.be/abc123',
};

test('a filmed testimonial becomes a gallery item', () => {
  const item = testimonialAsVideo(graduate);

  assert.equal(item.title, 'A DBA that fitted around the job');
  assert.equal(
    item.credit,
    'Layla Hassan · Doctor of Business Administration · UAE',
  );
  assert.equal(item.slug, 'cG9zdDox');
});

test('the video title wins over the post title, as it did before', () => {
  const item = testimonialAsVideo({
    ...graduate,
    videoTitle: 'Why I chose the DBA',
  });

  assert.equal(item.title, 'Why I chose the DBA');
});

test('the credit skips what the testimonial does not say', () => {
  const item = testimonialAsVideo({
    ...graduate,
    program: null,
    country: null,
  });

  assert.equal(item.credit, 'Layla Hassan · Finance Director');
});
