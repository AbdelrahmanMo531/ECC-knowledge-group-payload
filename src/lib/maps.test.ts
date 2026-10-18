import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mapEmbedUrl } from './maps.ts';

test('a configured Google embed URL is used as it stands', () => {
  const embed = 'https://www.google.com/maps/embed?pb=!1m18!1m12';

  assert.equal(mapEmbedUrl(embed, 'Dubai'), embed);
});

test('with no embed configured, the address becomes one', () => {
  assert.equal(
    mapEmbedUrl('', 'Sheikh Rashid Road, Dubai'),
    'https://www.google.com/maps?q=Sheikh%20Rashid%20Road%2C%20Dubai&output=embed',
  );
});

test('with neither, there is no map', () => {
  assert.equal(mapEmbedUrl('', '   '), null);
});

test('a non-Google or insecure URL is not framed', () => {
  assert.equal(mapEmbedUrl('https://example.com/maps', 'Dubai'), null);
  assert.equal(mapEmbedUrl('http://www.google.com/maps', 'Dubai'), null);
  assert.equal(mapEmbedUrl('not a url', 'Dubai'), null);
  assert.equal(mapEmbedUrl('https://google.com.evil.test/x', 'Dubai'), null);
});

test('Google country domains are accepted', () => {
  const embed = 'https://maps.google.ae/maps?q=Dubai&output=embed';

  assert.equal(mapEmbedUrl(embed, 'Dubai'), embed);
});
