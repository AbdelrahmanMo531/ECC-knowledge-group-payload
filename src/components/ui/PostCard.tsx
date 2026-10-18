import Image from 'next/image';

import type { Post } from '@/lib/cms/types';
import { postHref } from '@/lib/posts';
import { format, translate } from '@/lib/i18n/dictionary';
import { Link } from '@/components/ui/Link';

/**
 * Article card.
 *
 * The date sits as a small block over the image rather than in a metadata row,
 * the category rides on the image, and the author appears in the footer — so
 * the card carries the same information as before but reads as an editorial
 * object rather than a list row.
 */

function formatParts(value: string, language: 'en' | 'ar') {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const locale = language === 'ar' ? 'ar-AE' : 'en-GB';

  return {
    iso: value,
    day: date.toLocaleDateString(locale, { day: '2-digit' }),
    month: date.toLocaleDateString(locale, { month: 'short' }),
    full: date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

/** Rough reading time — enough to set expectations, not a precise claim. */
function readingTime(text: string) {
  const words = text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function PostCard({ post }: { post: Post }) {
  const date = formatParts(post.date, post.language);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand/70 bg-white transition-all duration-300 ease-[var(--ease-brand)] hover:-translate-y-1 hover:border-brand-turquoise/40 hover:shadow-xl hover:shadow-brand-teal/[0.08]">
      <div className="relative overflow-hidden bg-brand-beige">
        {post.featuredImage?.sourceUrl ? (
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.altText || post.title}
            width={720}
            height={450}
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="bg-brand-gradient-teal aspect-[16/10] w-full" />
        )}

        {/* Gradient so overlaid text stays legible on any photograph. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-teal/55 via-transparent to-transparent"
        />

        {date ? (
          <time
            dateTime={date.iso}
            className="absolute start-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-[var(--radius-brand)] bg-brand-beige/95 leading-none shadow-lg backdrop-blur-sm"
          >
            <span className="font-serif text-xl font-bold text-brand-teal">
              {date.day}
            </span>
            <span className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-brand-ink/55">
              {date.month}
            </span>
            <span className="sr-only">{date.full}</span>
          </time>
        ) : null}

        {post.categories[0] ? (
          <span className="absolute bottom-4 start-4 rounded-full bg-brand-gold px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-brand-teal">
            {post.categories[0]}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold leading-snug text-brand-teal transition-colors group-hover:text-brand-turquoise">
          <Link href={postHref(post)} exact className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-ink/70">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-brand-sand/60 pt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            {post.author?.avatar?.sourceUrl ? (
              <Image
                src={post.author.avatar.sourceUrl}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <span className="truncate text-xs text-brand-ink/55">
              {post.author?.name ?? 'ECC Knowledge Group'}
            </span>
          </div>

          <span className="shrink-0 text-xs text-brand-ink/45">
            {format(translate(post.language, 'blog.readTime'), { n: readingTime(post.content || post.excerpt) })}
          </span>
        </div>
      </div>
    </article>
  );
}
