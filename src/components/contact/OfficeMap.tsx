import { Container } from '@/components/ui/Container';
import { mapEmbedUrl } from '@/lib/maps';
import { format } from '@/lib/i18n/dictionary';
import { t } from '@/lib/i18n/server';

/**
 * The office on Google Maps.
 *
 * Either the embed URL an editor pasted from Google's own share dialog, or one
 * built from the address in site settings — the second form needs no API key,
 * so the map is there on a fresh install with nothing configured. Renders
 * nothing when there is neither, rather than an empty grey box.
 *
 * The iframe is lazy: a map is heavy, and it sits at the foot of the page where
 * most visitors never reach it.
 */
export function OfficeMap({
  heading,
  embedUrl,
  address,
  directionsUrl,
}: {
  heading: string;
  embedUrl: string;
  address: string;
  /** "Open in Google Maps" — the map itself is not a route planner. */
  directionsUrl?: string | null;
}) {
  const src = mapEmbedUrl(embedUrl, address);

  if (!src) return null;

  const directions =
    directionsUrl ||
    (address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : null);

  return (
    <section className="bg-brand-beige/40 py-16 lg:py-20" id="find-us">
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-teal sm:text-3xl">
              {heading}
            </h2>
            {address ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-ink/70">
                {address}
              </p>
            ) : null}
          </div>

          {directions ? (
            <a
              href={directions}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-brand-teal px-5 py-2.5 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-beige"
            >
              {t('link.map')}
            </a>
          ) : null}
        </div>

        <div className="mt-8 overflow-hidden rounded-[var(--radius-brand)] border border-brand-sand">
          <iframe
            src={src}
            title={format(t('aria.map.of'), {
              place: address || t('aria.map.office'),
            })}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-[22rem] w-full border-0 sm:h-[26rem]"
          />
        </div>
      </Container>
    </section>
  );
}
