import type { CollectionConfig } from 'payload';



export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'role'], group: 'Admin' },
  auth: true,
  hooks: {
    // The first account — made on /admin's "create first user" screen — has to
    // be able to add everyone else.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({ collection: 'users', req });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id,
    delete: ({ req: { user } }) => user?.role === 'admin',
    admin: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'SEO', value: 'seo' },
      ],
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
      saveToJWT: true,
    },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
  ],
};
