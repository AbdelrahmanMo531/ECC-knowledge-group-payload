import type { CollectionConfig } from 'payload';

import { anyone, authenticated } from '../access';
import { image, text, textarea, url } from '../fields';
import { revalidates } from '../hooks/revalidate';

/**
 * A body that accredits or recognises ECC — or, when linked to a partner, that
 * partner specifically. A linked one shows on the partner's page instead of
 * the site-wide strip: it accredits the institution, not ECC.
 */
export const Accreditations: CollectionConfig = {
  slug: 'accreditations',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'issuer', 'partner'], group: 'Academics' },
  access: { read: anyone, create: authenticated, update: authenticated, delete: authenticated },
  hooks: revalidates('accreditations', 'partners', 'programs'),
  defaultSort: 'order',
  fields: [
    text('name', { required: true }),
    textarea('description'),
    text('issuer', { admin: { description: 'e.g. "Pearson, UK"' } }),
    url('website', { admin: { description: 'Link to the issuer, so the claim can be verified.' } }),
    image('logo'),
    { name: 'partner', type: 'relationship', relationTo: 'partners', admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', admin: { position: 'sidebar' } },
  ],
};
