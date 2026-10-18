import { socialIconFor } from '@/components/ui/icons';
import type { SocialLink } from '@/lib/cms/types';

/**
 * The social links pinned down the left of every page.
 *
 * Only the links an editor marked for it — the tick box beside each URL under
 * Settings → ECC Settings. The header and footer list every link, so this is a
 * shortlist rather than a second copy of the same row: the two or three worth
 * following someone the whole way down a page.
 *
 * Hidden below `lg`. A phone has no margin to put a rail in, and this would
 * either sit on top of the text or fight the enquiry button in the opposite
 * corner. On a phone the footer's own row is a scroll away and does the job.
 */
export function SocialRail({ links }: { links: SocialLink[] }) {
  const shown = links.filter((link) => link.sticky);

  if (!shown.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-0 start-0 z-40 hidden p-4 lg:block"
      // Matches the Apply now button in the opposite corner, and keeps clear
      // of the home indicator on the machines that have one.
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="pointer-events-auto flex flex-col gap-2 rounded-full border border-brand-sand/70 bg-white/85 p-2 shadow-lg shadow-brand-teal/[0.08] backdrop-blur-sm">
        {shown.map((link) => {
          const Icon = socialIconFor(link.label, link.url);

          return (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                // The name, not "link" — a row of unlabelled icons is a row of
                // unlabelled icons to anyone who cannot see the mark.
                aria-label={link.label}
                title={link.label}
                className="flex h-10 w-10 items-center justify-center rounded-full text-brand-teal transition-colors hover:bg-brand-teal hover:text-brand-beige focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise"
              >
                {Icon ? (
                  <Icon width={17} height={17} />
                ) : (
                  // An icon this site does not carry a mark for: the first
                  // letter beats an empty circle.
                  <span className="text-xs font-medium">
                    {link.label.charAt(0)}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
