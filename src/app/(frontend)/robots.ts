import type { MetadataRoute } from 'next';

import { isPublicOrigin } from '@/lib/env';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  /*
    A deployment that is not on the site's own domain is closed to crawlers.

    A preview serves every page publicly, and an index of the whole site under
    a `*.vercel.app` address is not undone by deleting the deployment — the
    pages stay indexed and compete with the real domain. Pointing
    NEXT_PUBLIC_SITE_URL at a real domain opens it up again.
  */
  if (!isPublicOrigin()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/next/'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
