/**
 * Which mark belongs in front of a major's name.
 *
 * The rule only, with no drawings in it: `majorIcons.tsx` holds those and
 * resolves a key to one. Splitting them is what lets this be tested — and the
 * ordering below is the whole substance of the feature, since ECC's majors
 * overlap heavily in their wording.
 */

/**
 * The vocabulary, as key to the name an editor reads in WordPress.
 *
 * A contract in two directions: `Meta::MAJOR_ICONS` in the plugin offers
 * exactly these, and `majorIcons.tsx` draws exactly these. The labels here are
 * the front-end's copy of the plugin's, kept so a test can tell when the two
 * have drifted apart.
 *
 * The set describes the *shape* of a subject rather than the subject itself:
 * "Analytics" serves Business Analytics and Data Science alike, so a major
 * added next year usually finds something without the set growing.
 */
export const MAJOR_ICON_KEYS = {
  strategy: 'Strategy',
  leadership: 'Leadership',
  management: 'Management',
  innovation: 'Innovation & entrepreneurship',
  economy: 'Economics',
  banking: 'Banking & finance',
  accounting: 'Accounting',
  fintech: 'Fintech',
  islamic: 'Islamic finance',
  ai: 'Artificial intelligence',
  digital: 'Digital transformation',
  analytics: 'Data & analytics',
  marketing: 'Marketing',
  people: 'Human resources',
  logistics: 'Logistics & supply chain',
  quality: 'Quality',
  project: 'Project management',
  hospital: 'Hospital management',
  healthcare: 'Healthcare',
  law: 'Law & governance',
  sustainable: 'Sustainability',
  education: 'Education',
} as const;

export type MajorIconKey = keyof typeof MAJOR_ICON_KEYS;

/** Shown when a name suggests nothing and nobody picked. */
export const NEUTRAL_ICON = 'subject';

/**
 * What a major's name suggests, most particular first.
 *
 * Order is the whole of the logic. "Healthcare Management" and "Quality
 * Management" both end in "management", and "Strategic Economic Leadership"
 * contains strategy, economics and leadership at once — so the narrower
 * reading is tried first, and the broad words at the end only catch a name
 * that offered nothing better.
 *
 * Matching is on whole words: "AI" must not fire inside "Sust**ai**nability",
 * and "law" must not fire inside "**Law**rence".
 */
const FROM_NAME: [RegExp, MajorIconKey][] = [
  [/\bhospitals?\b/, 'hospital'],
  [/\b(health|healthcare|medical|clinical|nursing|pharma\w*)\b/, 'healthcare'],
  [/\b(islamic|shari\w*|halal)\b/, 'islamic'],
  [/\bfintech\b/, 'fintech'],
  [/\b(ai|artificial|robotics?)\b/, 'ai'],
  [/\bmachine\s+learning\b/, 'ai'],
  [/\b(digital|transformation|cyber\w*|technology)\b/, 'digital'],
  [/\binformation\s+systems?\b/, 'digital'],
  [/\b(data|analytics?|statistics?)\b/, 'analytics'],
  [/\bbusiness\s+intelligence\b/, 'analytics'],
  [/\b(logistics?|supply|procurement|shipping|transport\w*)\b/, 'logistics'],
  [/\b(quality|iso|assurance)\b/, 'quality'],
  [/\b(projects?|pmp)\b/, 'project'],
  [/\b(marketing|brand\w*|advertising|communications?|sales)\b/, 'marketing'],
  [/\b(hr|human|people|talent|organisational|organizational)\b/, 'people'],
  [/\b(accounting|audit\w*|tax\w*|bookkeeping)\b/, 'accounting'],
  [/\b(banking|banks?|investment|wealth|insurance)\b/, 'banking'],
  [/\b(economics?|economic|econometrics?)\b/, 'economy'],
  [/\b(entrepreneur\w*|innovation|startups?|venture)\b/, 'innovation'],
  [/\b(law|legal|governance|policy|compliance)\b/, 'law'],
  [/\b(sustainab\w*|environment\w*|green|esg|climate)\b/, 'sustainable'],
  [/\b(education|teaching|pedagog\w*|curriculum)\b/, 'education'],
  [/\b(finance|financial)\b/, 'banking'],
  [/\b(strateg\w*|thinking)\b/, 'strategy'],
  [/\b(leaders\w*|leadership|executive)\b/, 'leadership'],
  [/\b(management|managerial|administration|operations?)\b/, 'management'],
];

/**
 * The key of the mark to draw before a major's name.
 *
 * An editor picks one in WordPress; where they have not, it is read from the
 * name. That guess is not a nicety: there are seventeen majors published
 * already with nothing picked on any of them, and a list where some rows carry
 * a mark and others do not reads as broken rather than as unfinished.
 *
 * The guess only understands English. An Arabic translation of a major needs
 * its own pick — or, better, Polylang set to synchronise custom fields, since
 * a mark is the same mark in both languages.
 */
export function majorIconKey(
  picked: string | null | undefined,
  name = '',
): MajorIconKey | typeof NEUTRAL_ICON {
  const chosen = picked?.trim().toLowerCase();
  if (chosen && chosen in MAJOR_ICON_KEYS) {
    return chosen as MajorIconKey;
  }

  const guessed = FROM_NAME.find(([pattern]) => pattern.test(name.toLowerCase()));

  return guessed ? guessed[1] : NEUTRAL_ICON;
}
