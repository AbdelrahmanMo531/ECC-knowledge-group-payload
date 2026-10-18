import type { ReactNode } from 'react';

import type { NavItem } from '@/lib/cms/types';
import { Link } from '@/components/ui/Link';

/**
 * Renders a menu item as the right kind of link.
 *
 * WordPress menus mix internal pages with custom links, so an item may point
 * off-site or ask to open in a new tab. Internal links go through `next/link`
 * for client-side navigation; external ones stay plain anchors with the
 * `noreferrer noopener` pair that `target="_blank"` requires.
 */
export function NavLink({
  item,
  className,
  children,
  ariaCurrent,
}: {
  item: NavItem;
  className?: string;
  children?: ReactNode;
  ariaCurrent?: 'page';
}) {
  const label = children ?? item.label;

  if (item.external || item.href.startsWith('mailto:') || item.href.startsWith('tel:')) {
    return (
      <a
        href={item.href}
        className={className}
        target={item.newTab ? '_blank' : undefined}
        rel={item.newTab ? 'noreferrer noopener' : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={ariaCurrent}
      target={item.newTab ? '_blank' : undefined}
      rel={item.newTab ? 'noreferrer noopener' : undefined}
    >
      {label}
    </Link>
  );
}
