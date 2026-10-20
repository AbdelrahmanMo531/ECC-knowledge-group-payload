import assert from 'node:assert/strict';
import { test } from 'node:test';

import { mediaUrl } from './media-url.ts';

test("Payload's own uploads become paths, whatever host they were written on", () => {
  assert.equal(mediaUrl('http://localhost:3000/api/media/file/ibas-logo.png'), '/api/media/file/ibas-logo.png');
  assert.equal(mediaUrl('https://ecc-group.ae/api/media/file/a%20b.jpg?2'), '/api/media/file/a%20b.jpg?2');
});

test('already a path, or stored elsewhere: unchanged', () => {
  assert.equal(mediaUrl('/api/media/file/x.png'), '/api/media/file/x.png');
  assert.equal(
    mediaUrl('https://abc.public.blob.vercel-storage.com/x.png'),
    'https://abc.public.blob.vercel-storage.com/x.png',
  );
});
