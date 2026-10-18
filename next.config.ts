import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

type Pattern = { protocol: 'http' | 'https'; hostname: string; port?: string };

function patternFrom(value: string): Pattern | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const { protocol, hostname, port } = new URL(candidate);
    if (protocol !== 'http:' && protocol !== 'https:') return null;
    return { protocol: protocol.replace(':', '') as 'http' | 'https', hostname, port };
  } catch {
    return null;
  }
}

/**
 * Hosts allowed to serve images through next/image.
 *
 * Uploads are served by Payload from this same app (`/api/media/file/…`,
 * allowed through `localPatterns`) or from Vercel Blob when it is configured.
 * YouTube stills back films with no uploaded poster. Anything else — a CDN, the
 * old WordPress uploads during migration — goes in NEXT_PUBLIC_IMAGE_HOSTS.
 */
function imagePatterns(): Pattern[] {
  const patterns: Pattern[] = [
    { protocol: 'https', hostname: 'i.ytimg.com' },
    { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
  ];

  for (const host of [process.env.NEXT_PUBLIC_SITE_URL ?? '', ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '').split(',')]) {
    const pattern = patternFrom(host);
    if (pattern) patterns.push(pattern);
  }

  if (process.env.NODE_ENV !== 'production') {
    for (const hostname of ['localhost', '127.0.0.1']) patterns.push({ protocol: 'http', hostname });
  }

  return patterns;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  // Trailing slashes are decided by `src/proxy.ts`, which adds them to pages
  // and leaves Payload's admin and API alone. Next's own normalisation would
  // strip them from every URL the old site ranked with.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: imagePatterns(),
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/brand/**' }, { pathname: '/flags/**' }],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // The WordPress (Rank Math) sitemap addresses already submitted to
      // Search Console, folded into the one sitemap this site serves.
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/:name([a-z0-9_-]+-sitemap[0-9]*\\.xml)', destination: '/sitemap.xml', permanent: true },
    ];
  },
  turbopack: { root: path.resolve(dirname) },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
