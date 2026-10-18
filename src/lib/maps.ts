/**
 * The Google Maps embed URL for the contact page.
 *
 * An editor can paste the `src` out of Google's own embed snippet, in which
 * case it is used as-is. Otherwise the address from site settings is turned
 * into an embed — which needs no API key, so the map works on a fresh install
 * with nothing configured.
 *
 * Anything that is not a Google Maps URL is rejected rather than framed: this
 * value ends up in an iframe `src`, and an iframe is a page, not an image.
 */
export function mapEmbedUrl(embedUrl: string, address: string): string | null {
  const configured = embedUrl.trim();

  if (configured) {
    let url: URL;

    try {
      url = new URL(configured);
    } catch {
      return null;
    }

    // Any subdomain of any Google country domain — maps.google.ae as readily
    // as www.google.com — but nothing that merely contains the word, which is
    // what `google.com.example.test` is banking on.
    const host = url.hostname.toLowerCase();
    const allowed = /^(?:[a-z0-9-]+\.)*google(?:\.[a-z]{2,3}){1,2}$/.test(host);

    if (url.protocol === 'https:' && allowed) return configured;

    return null;
  }

  const query = address.trim();
  if (!query) return null;

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
