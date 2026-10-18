import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig, type Field } from 'payload';
import sharp from 'sharp';

import { Accreditations } from './payload/collections/Accreditations';
import { Faqs } from './payload/collections/Faqs';
import { FormSubmissions, Forms } from './payload/collections/Forms';
import { Media } from './payload/collections/Media';
import { Pages } from './payload/collections/Pages';
import { Partners } from './payload/collections/Partners';
import { AcademicMembers, Specializations, TeamMembers } from './payload/collections/People';
import { Podcasts } from './payload/collections/Podcasts';
import { Categories, Posts } from './payload/collections/Posts';
import { Programs } from './payload/collections/Programs';
import { Testimonials } from './payload/collections/Testimonials';
import { Users } from './payload/collections/Users';
import { VideoCategories, Videos } from './payload/collections/Videos';
import { seoExtraFields } from './payload/fields/seo';
import { PAGE_GLOBALS } from './payload/globals/pages';
import { InterfaceStrings, Navigation, SiteSettings } from './payload/globals/settings';
import { revalidates } from './payload/hooks/revalidate';
import { generateDescription, generateTitle, generateURL } from './payload/seo';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const smtp = process.env.SMTP_HOST;

function shouldPush(): boolean {
  const override = process.env.PAYLOAD_DB_PUSH;
  if (override === 'true') return true;
  if (override === 'false' || process.env.NODE_ENV === 'production') return false;

  try {
    const { hostname } = new URL(process.env.DATABASE_URI || '');
    return ['localhost', '127.0.0.1', '::1', 'host.docker.internal'].includes(hostname);
  } catch {
    return false;
  }
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' — ECC CMS' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'العربية', code: 'ar', rtl: true },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [
    Pages,
    Posts,
    Categories,
    Programs,
    Partners,
    Accreditations,
    AcademicMembers,
    TeamMembers,
    Specializations,
    Testimonials,
    Faqs,
    Videos,
    VideoCategories,
    Podcasts,
    Forms,
    FormSubmissions,
    Media,
    Users,
  ],
  globals: [...PAGE_GLOBALS, SiteSettings, Navigation, InterfaceStrings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Schema changes are pushed automatically in development — but only to a
    // database on this machine. Push inspects the whole schema on every start
    // (hundreds of queries), which against a hosted database such as Neon
    // makes each cold page take 10–20 seconds. A hosted database uses the
    // committed migrations (`npm run migrate`), as production does.
    // PAYLOAD_DB_PUSH=true / false overrides either way.
    push: shouldPush(),
    migrationDir: path.resolve(dirname, 'migrations'),
    // DB_LOG=true prints every SQL query — for finding slow pages.
    logger: process.env.DB_LOG === 'true',
  }),
  sharp,
  email: smtp
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'no-reply@ecc-group.ae',
        defaultFromName: 'ECC Knowledge Group',
        transportOptions: {
          host: smtp,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  plugins: [
    seoPlugin({
      collections: ['pages', 'programs', 'partners', 'academic-members', 'categories'],
      globals: PAGE_GLOBALS.map((global) => global.slug),
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle,
      generateDescription,
      generateURL,
      fields: ({ defaultFields }) => [...defaultFields, ...seoExtraFields],
    }),
    redirectsPlugin({
      collections: ['pages', 'posts', 'programs', 'partners'],
      redirectTypes: ['301', '302', '307', '308'],
      overrides: {
        admin: { group: 'SEO' },
        hooks: revalidates('redirects'),
        fields: ({ defaultFields }) =>
          defaultFields.map((field) =>
            'name' in field && field.name === 'from'
              ? ({
                  ...field,
                  admin: {
                    ...field.admin,
                    description:
                      'The old path, e.g. /old-article/ or /blog/2025/10/02/some-post/. Arabic may be typed as Arabic or percent-encoded.',
                  },
                } as Field)
              : field,
          ),
      },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: false },
});
