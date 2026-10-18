import { Container } from '@/components/ui/Container';
import { MailIcon, PhoneIcon, socialIconFor } from '@/components/ui/icons';
import type { SiteSettings } from '@/lib/cms/types';

/**
 * The utility bar above the header.
 *
 * Deliberately outside the sticky header, so it scrolls away and gives the
 * navigation its full height back once a visitor starts reading. On mobile the
 * social links drop out and the two things worth tapping — phone and email —
 * stay.
 */
export function TopBar({ settings }: { settings: SiteSettings }) {
  const tel = settings.contact.phone.replace(/[^\d+]/g, '');

  return (
    <div className="bg-brand-teal text-brand-beige/80">
      <Container size="wide">
        <div className="flex h-11 items-center justify-between gap-4">
          {/*
            `min-w-0` on both the row and the link: a flex item will not shrink
            below the width of its content by default, so without it `truncate`
            on the address never truncates anything and the bar runs off a
            narrow phone instead.
          */}
          <div className="flex min-w-0 items-center gap-5 sm:gap-7">
            <a
              href={`mailto:${settings.contact.email}`}
              className="group inline-flex min-w-0 items-center gap-2 text-xs transition-colors hover:text-brand-gold sm:text-[0.8125rem]"
            >
              <MailIcon
                width={15}
                height={15}
                className="shrink-0 text-brand-gold/70 transition-colors group-hover:text-brand-gold"
              />
              <span className="truncate">{settings.contact.email}</span>
            </a>

            <a
              href={`tel:${tel}`}
              className="group inline-flex shrink-0 items-center gap-2 text-xs transition-colors hover:text-brand-gold sm:text-[0.8125rem]"
            >
              <PhoneIcon
                width={15}
                height={15}
                className="shrink-0 text-brand-gold/70 transition-colors group-hover:text-brand-gold"
              />
              <span className="whitespace-nowrap">{settings.contact.phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-1">
            {settings.social.length > 0 ? (
              <ul className="hidden items-center gap-1 sm:flex">
                {settings.social.map((item) => {
                  const Icon = socialIconFor(item.label, item.url);

                  return (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-brand-beige/65 transition-all duration-200 hover:bg-brand-beige/10 hover:text-brand-gold"
                      >
                        {Icon ? (
                          <Icon width={15} height={15} />
                        ) : (
                          <span className="text-[0.7rem] font-medium">
                            {item.label.charAt(0)}
                          </span>
                        )}
                        <span className="sr-only">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
