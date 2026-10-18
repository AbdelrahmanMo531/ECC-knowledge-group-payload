import type { SVGProps } from 'react';

import {
  majorIconKey,
  NEUTRAL_ICON,
  type MajorIconKey,
} from '@/lib/programs/majorIcon';

/**
 * Marks for a programme's majors.
 *
 * Seventeen specialisations in a scrolling list are seventeen lines of text,
 * and a visitor looking for Fintech reads all of them to find it. A mark in
 * front of each name gives the eye something to catch, and makes the list
 * scannable rather than merely readable.
 *
 * Kept apart from `icons.tsx`, which is the interface's own small set — this
 * is a vocabulary for a kind of content, it is drawn to one house style, and
 * the rules for choosing between its members are worth testing on their own.
 *
 * Drawn in the same manner as the rest of the site's marks: a 24×24 box,
 * `currentColor` throughout so brand colours apply directly, and stroked
 * rather than filled so they sit at the weight of the text beside them.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: '1.6',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
  focusable: 'false' as const,
  ...props,
});

/* -------------------------------------------------------------------------- */
/* The marks                                                                   */
/* -------------------------------------------------------------------------- */

/** A target and an arrow in it — deciding where to aim. */
function StrategyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="13" r="8" />
      <circle cx="11" cy="13" r="3.4" />
      <path d="m11 13 9-9M16.5 4h3.5v3.5" />
    </svg>
  );
}

/** A flag planted on a summit. */
function LeadershipIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 20V4l9 3-9 3" />
      <path d="M3 20h18" />
    </svg>
  );
}

/** An organisation chart — one box over three. */
function ManagementIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="3" width="6" height="4.5" rx="1" />
      <rect x="2.5" y="16.5" width="5.5" height="4.5" rx="1" />
      <rect x="16" y="16.5" width="5.5" height="4.5" rx="1" />
      <path d="M12 7.5v4.5M5.25 16.5V12h13.5v4.5" />
    </svg>
  );
}

/** A lamp, lit. */
function InnovationIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 17a6 6 0 1 1 5 0v2.5h-5V17Z" />
      <path d="M10 21.5h4" />
    </svg>
  );
}

/** Bars climbing under an arrow. */
function EconomyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 20.5h18" />
      <path d="M6 20.5V14M11 20.5V10.5M16 20.5v-4" />
      <path d="m14 6.5 6-1.5-1.5 6" />
    </svg>
  );
}

/** A columned front — the shape a bank has had for two hundred years. */
function BankingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 9 9-5.5L21 9H3Z" />
      <path d="M6 9v8M10 9v8M14 9v8M18 9v8" />
      <path d="M3.5 20.5h17" />
    </svg>
  );
}

/** A calculator. */
function AccountingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M8.5 6.5h7" />
      <path d="M9 11h.01M12 11h.01M15 11h.01M9 14.5h.01M12 14.5h.01M15 14.5h.01M9 18h.01M12 18h.01M15 18h.01" />
    </svg>
  );
}

/** A card, and the signal of a contactless payment. */
function FintechIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="2" y="5.5" width="14" height="10" rx="2" />
      <path d="M2 9.5h14" />
      <path d="M18.5 8.5a5 5 0 0 1 0 7M21 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

/** A crescent over an arch. */
function IslamicIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 20.5v-7a6 6 0 0 1 12 0v7" />
      <path d="M3.5 20.5h17" />
      <path d="M10 20.5v-4a2 2 0 0 1 4 0v4" />
      <path d="M13.6 3.9a2.4 2.4 0 1 0 0 3.7 3 3 0 0 1 0-3.7Z" />
    </svg>
  );
}

/** A processor with its legs. */
function AiIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
      <rect x="10" y="10" width="4" height="4" rx="0.6" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </svg>
  );
}

/**
 * A device, being turned over.
 *
 * Drawn as two arcs around a block rather than as a screen with the cycle
 * inside it: at eighteen pixels the inner version was a smudge behind a
 * monitor's frame, and this is the same idea with room to be read.
 */
function DigitalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1.2" />
      <path d="M6.2 6.2a8.2 8.2 0 0 1 11.6 0M17.8 17.8a8.2 8.2 0 0 1-11.6 0" />
      <path d="M17.8 2.6v3.6h-3.6M6.2 21.4v-3.6h3.6" />
    </svg>
  );
}

/** A line rising over points. */
function AnalyticsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 20.5h18" />
      <path d="m5 15 4.5-4.5 3.5 3L19 6" />
      <circle cx="9.5" cy="10.5" r="1.3" />
      <circle cx="13" cy="13.5" r="1.3" />
    </svg>
  );
}

/** A megaphone. */
function MarketingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5v5a1.5 1.5 0 0 0 1.5 1.5H8l9 4.5V5L8 9.5H5.5A1.5 1.5 0 0 0 4 11Z" />
      <path d="M8 16v4.5" />
      <path d="M20 10a3.5 3.5 0 0 1 0 4.5" />
    </svg>
  );
}

/** Three people. */
function PeopleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="7.5" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 14.2a6.5 6.5 0 0 1 4 5.8" />
    </svg>
  );
}

/** A lorry. */
function LogisticsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2.5 6.5h10v10h-10z" />
      <path d="M12.5 10.5H17l4 3.5v2.5h-8.5" />
      <circle cx="7" cy="18.5" r="2" />
      <circle cx="17" cy="18.5" r="2" />
      <path d="M9 18.5h6" />
    </svg>
  );
}

/** A shield, checked. */
function QualityIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 2.8 4.5 6v6c0 4.4 3.1 7.9 7.5 9.2 4.4-1.3 7.5-4.8 7.5-9.2V6L12 2.8Z" />
      <path d="m8.75 11.75 2.25 2.25 4.25-4.5" />
    </svg>
  );
}

/** A plan, with its tasks ticked off. */
function ProjectIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M9 2.5h6v3H9z" />
      <path d="m8 11 1.5 1.5L12.5 9" />
      <path d="M14.5 11.5h3M8 16h9.5" />
    </svg>
  );
}

/** A hospital block with its cross. */
function HospitalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20.5V8l8-4.5L20 8v12.5" />
      <path d="M2.5 20.5h19" />
      <path d="M12 8.5v5M9.5 11h5" />
      <path d="M9.5 20.5v-4h5v4" />
    </svg>
  );
}

/** A heart, with a pulse across it. */
function HealthcareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20.5S3.5 15.5 3.5 9.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.6c0 5.9-8.5 10.9-8.5 10.9Z" />
      <path d="M6.5 12h3l1.5-2.5 2 4.5 1.5-2h3" />
    </svg>
  );
}

/** A balance. */
function LawIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3.5v17M7 20.5h10" />
      <path d="M4.5 7h15" />
      <path d="M4.5 7 2 13a2.5 2.5 0 0 0 5 0L4.5 7ZM19.5 7 17 13a2.5 2.5 0 0 0 5 0L19.5 7Z" />
    </svg>
  );
}

/** A leaf, growing. */
function SustainableIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 4c0 9-5.5 13-10 13a5 5 0 0 1-5-5C5 7.5 12.5 4 20 4Z" />
      <path d="M4 21c1.5-5 5-8.5 9.5-11" />
    </svg>
  );
}

/** A mortarboard. */
function EducationIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11v5c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-5" />
      <path d="M21.5 9v5" />
    </svg>
  );
}

/** Nothing more specific — an open book. */
function SubjectIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 6.5S10 4.5 3.5 4.5v13C10 17.5 12 19.5 12 19.5s2-2 8.5-2v-13C14 4.5 12 6.5 12 6.5Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Choosing one                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A drawing for every key in the vocabulary.
 *
 * `Record<MajorIconKey, …>` rather than a loose object: adding a key to
 * `MAJOR_ICON_KEYS` without drawing it here fails the build rather than
 * quietly rendering the neutral mark on a live page.
 */
const DRAWINGS: Record<MajorIconKey | typeof NEUTRAL_ICON, (props: IconProps) => React.JSX.Element> = {
  strategy: StrategyIcon,
  leadership: LeadershipIcon,
  management: ManagementIcon,
  innovation: InnovationIcon,
  economy: EconomyIcon,
  banking: BankingIcon,
  accounting: AccountingIcon,
  fintech: FintechIcon,
  islamic: IslamicIcon,
  ai: AiIcon,
  digital: DigitalIcon,
  analytics: AnalyticsIcon,
  marketing: MarketingIcon,
  people: PeopleIcon,
  logistics: LogisticsIcon,
  quality: QualityIcon,
  project: ProjectIcon,
  hospital: HospitalIcon,
  healthcare: HealthcareIcon,
  law: LawIcon,
  sustainable: SustainableIcon,
  education: EducationIcon,
  subject: SubjectIcon,
};

/**
 * The mark shown before a major's name.
 *
 * The choosing is `majorIconKey()`; this only turns its answer into something
 * that can be rendered.
 */
export function majorIcon(
  picked: string | null | undefined,
  name = '',
): (props: IconProps) => React.JSX.Element {
  return DRAWINGS[majorIconKey(picked, name)];
}
