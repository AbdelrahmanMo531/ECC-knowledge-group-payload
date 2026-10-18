import type { SVGProps } from 'react';

/**
 * Inline icon set.
 *
 * Hand-inlined rather than pulled from an icon package: the set is small, it
 * keeps the bundle free of a dependency that would ship far more than we use,
 * and every icon inherits `currentColor` so brand colours apply directly.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  'aria-hidden': true as const,
  focusable: 'false' as const,
  ...props,
});

/* -------------------------------------------------------------------------- */
/* Social — solid marks, drawn to each platform's own glyph                    */
/* -------------------------------------------------------------------------- */

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.81 3.81 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.97 5.97 0 0 0-2.16 1.4A5.97 5.97 0 0 0 .58 4.19c-.3.75-.5 1.63-.56 2.9C-.04 8.38 0 8.79 0 12.05c0 3.25-.01 3.66.05 4.94.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.4 2.13a5.9 5.9 0 0 0 2.13 1.39c.76.3 1.63.5 2.9.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.14-.26 2.9-.56a5.9 5.9 0 0 0 2.13-1.39 5.9 5.9 0 0 0 1.4-2.13c.29-.76.49-1.63.55-2.91.06-1.28.07-1.69.07-4.94 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.55-2.9a5.9 5.9 0 0 0-1.4-2.14A5.9 5.9 0 0 0 19.84.63c-.76-.3-1.63-.5-2.9-.56C15.66.01 15.25 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.5h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94a6.83 6.83 0 0 1-5.42 2.94c-1.23.07-2.46-.26-3.51-.88-1.74-1.03-2.97-2.92-3.15-4.94-.02-.43-.03-.86-.01-1.28a6.86 6.86 0 0 1 2.5-4.62 6.77 6.77 0 0 1 5.5-1.34c.02 1.48-.04 2.96-.04 4.44a3.1 3.1 0 0 0-3.96 1.92 3.6 3.6 0 0 0-.13 1.46 3.07 3.07 0 0 0 3.16 2.59 3.03 3.03 0 0 0 2.5-1.45c.16-.29.35-.58.36-.92.09-1.56.05-3.11.06-4.67.01-3.5-.01-7 .02-10.5Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.82 9.82 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88ZM20.5 3.49A11.76 11.76 0 0 0 12.05 0C5.5 0 .18 5.32.17 11.86c0 2.09.55 4.13 1.59 5.93L.07 24l6.36-1.67a11.86 11.86 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.87-11.86a11.8 11.8 0 0 0-3.46-8.4Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M3 6.5h18v11H3zM3 7l9 6 9-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M5 3h3.5l1.8 4.4-2.2 1.3a11.5 11.5 0 0 0 5.2 5.2l1.3-2.2 4.4 1.8V17a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor">
      <path d="M8 5.14v13.72L19 12 8 5.14Z" />
    </svg>
  );
}

/**
 * Resolves a social link to its icon by label, falling back to the hostname —
 * an editor who types "Our LinkedIn" or leaves the label blank still gets the
 * right mark.
 */
/** Mission — a compass, for the direction an organisation sets itself. */
export function CompassIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m15.5 8.5-2 5-5 2 2-5 5-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Vision — a telescope, for the distance an organisation looks. */
export function TelescopeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" {...props}>
      <path
        d="M3 13.5 15.5 8l1.8 4.2L4.8 17.7 3 13.5ZM17.3 12.2 21 10.7l-1.6-3.8-3.6 1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 15.5 12 21M8 21h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function socialIconFor(label: string, url: string) {
  const haystack = `${label} ${url}`.toLowerCase();

  if (haystack.includes('linkedin')) return LinkedInIcon;
  if (haystack.includes('instagram')) return InstagramIcon;
  if (haystack.includes('facebook') || haystack.includes('fb.com')) return FacebookIcon;
  if (haystack.includes('youtube') || haystack.includes('youtu.be')) return YouTubeIcon;
  if (haystack.includes('tiktok')) return TikTokIcon;
  if (haystack.includes('whatsapp') || haystack.includes('wa.me')) return WhatsAppIcon;
  if (
    haystack.includes('twitter') ||
    haystack.includes('x.com') ||
    haystack.trim().endsWith(' x')
  ) {
    return XIcon;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Counters                                                                    */
/* -------------------------------------------------------------------------- */

function GraduateIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 3 2 8l10 5 10-5-10-5Z M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BadgeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="9" r="6" />
      <path
        d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7M9.8 9l1.5 1.6L14.4 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TeacherIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
    </svg>
  );
}

function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="M4 4.5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4v-13ZM20 4.5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6v-13Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ModulesIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function LectureIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="4.5" width="19" height="12" rx="2" />
      <path d="M8 20.5h8M12 16.5v4" strokeLinecap="round" />
      <path d="m10.5 8.5 4 2.5-4 2.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * A globe — a stat about reach, and the mark the language switcher is read by.
 */
export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.5 9.5h17M3.5 14.5h17M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </svg>
  );
}

function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="7.5" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
      <path
        d="M16 5.2a3.2 3.2 0 0 1 0 6M17.5 14.2a6.5 6.5 0 0 1 4 5.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path
        d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9L3.5 9.7l5.9-.8L12 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The icon vocabulary offered in a counter row's icon select in the admin.
 *
 * These keys are a contract with `STAT_ICONS` in `src/payload/fields/icons.ts`:
 * a key present there must exist here, or the counter falls back to the globe.
 */
const STAT_ICONS = {
  graduate: GraduateIcon,
  badge: BadgeIcon,
  professor: TeacherIcon,
  course: BookIcon,
  module: ModulesIcon,
  lecture: LectureIcon,
  globe: GlobeIcon,
  users: UsersIcon,
  star: StarIcon,
  clock: ClockIcon,
} as const;

/**
 * Resolves a counter's icon.
 *
 * Editors pick one explicitly in the repeater. When a row has no icon — which
 * includes counters authored before the repeater existed — the label's wording
 * still supplies a sensible one, so nothing renders bare.
 */
export function statIcon(key: string | null | undefined, label: string) {
  const chosen = key?.trim().toLowerCase();
  if (chosen && chosen in STAT_ICONS) {
    return STAT_ICONS[chosen as keyof typeof STAT_ICONS];
  }

  const text = label.toLowerCase();

  if (text.includes('graduat') || text.includes('learner') || text.includes('student')) {
    return GraduateIcon;
  }
  if (text.includes('accredit') || text.includes('award') || text.includes('recognition')) {
    return BadgeIcon;
  }
  if (text.includes('professor') || text.includes('faculty') || text.includes('tutor')) {
    return TeacherIcon;
  }
  if (text.includes('course') || text.includes('programme') || text.includes('program')) {
    return BookIcon;
  }
  if (text.includes('module') || text.includes('subject')) return ModulesIcon;
  if (text.includes('lecture') || text.includes('video')) return LectureIcon;
  if (text.includes('hour') || text.includes('time')) return ClockIcon;

  return GlobeIcon;
}
