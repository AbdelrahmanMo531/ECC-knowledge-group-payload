/**
 * Where the browser should load an uploaded file from.
 *
 * Payload writes upload URLs absolute, on its `serverURL` —
 * `http://localhost:3000/api/media/file/logo.png`. Handed to next/image like
 * that, the optimiser fetches the file over HTTP from its own server, and
 * Next 16 refuses any image whose host resolves to a private address
 * ("resolved to private IP"), so every upload rendered blank in development.
 *
 * Payload's file route is part of this same app, so its files are given as a
 * path instead (`/api/media/file/logo.png`), which next/image serves locally
 * through `images.localPatterns`. Anything else — Vercel Blob, a CDN — is left
 * absolute.
 */
export function mediaUrl(url: string): string {
  const match = url.match(/^https?:\/\/[^/]+(\/api\/media\/file\/.*)$/i);
  return match ? match[1] : url;
}
