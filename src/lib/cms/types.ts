/**
 * The site's content, as every component reads it.
 *
 * These are the front-end's own shapes, not Payload's: `src/lib/cms/api.ts`
 * normalises documents into them (media into `MediaItem`, rich text into HTML,
 * `{ value }` rows into strings), and the seeded fallback in
 * `src/lib/content/site.ts` is written in them too. Payload's generated types
 * live in `src/payload-types.ts`.
 */

export type MediaItem = {
  sourceUrl: string;
  altText: string;
  mediaDetails?: { width: number; height: number } | null;
};

/**
 * SEO values authored on a document's SEO tab (`@payloadcms/plugin-seo`, plus
 * the focus keyword, canonical and robots fields the old Rank Math setup had).
 */
export type SeoFields = {
  /** Social share image, absolute. Falls back to the featured image. */
  image?: string | null;
  /** The phrase the page targets; emitted as `keywords` alongside the related ones. */
  focusKeyword?: string | null;
  keywords?: string[] | null;
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  /** Directives such as `index`, `follow`, `noarchive`. */
  robots?: string[] | null;
  openGraph?: {
    title?: string | null;
    description?: string | null;
  } | null;
};

/**
 * A downloadable PDF attached to a programme or one of its majors.
 *
 * Uploaded to the Media collection.
 */
export type Brochure = {
  url: string;
  /** Media library title, used for the accessible link text. */
  title?: string | null;
};

/**
 * Where the same thing lives in another language.
 *
 * A translation can have its own slug, so an Arabic page is not always at
 * the English one's address with a prefix on it. Carried on the node itself,
 * because it is the only thing that knows.
 */
export type Translation = {
  /** A language this site runs in, e.g. `ar`. */
  locale: string;
  slug: string;
  /** The full route, where it is not `<section>/<slug>` — an article's. */
  path?: string;
};

/** Level of study — the `level` select on a programme. */
export type ProgramLevel =
  | 'Bachelor'
  | 'Master'
  | 'Doctorate'
  | 'Diploma'
  | 'Executive';

export type Program = {
  id: string;
  slug: string;
  /** The same thing in the site's other languages, where it exists. */
  translations?: Translation[];
  title: string;
  excerpt: string;
  /** Rich text, rendered to HTML. */
  content?: string | null;
  featuredImage?: MediaItem | null;
  level: ProgramLevel;
  /** Human-readable, e.g. "18–24 months". */
  duration: string;
  /** e.g. "Blended · Dubai & online". */
  studyMode: string;
  /** Institution that confers the award, e.g. "IBAS Switzerland". */
  awardingBody: string;
  /** Optional price line, e.g. "From $4,500". Hidden when empty. */
  tuition?: string | null;
  /** Short selling points shown on the programme card. */
  highlights: string[];
  /** e.g. "60–90 ECTS". */
  credits?: string | null;
  /** Language of instruction. */
  language?: string | null;
  /** Accrediting bodies, e.g. ACBSP, IACBE. */
  accreditations: string[];
  /** Programme-level learning outcomes. */
  learningOutcomes: string[];
  /** Roles graduates move into. */
  careers: string[];
  /** Reasons to choose this programme with this awarding body. */
  whyStudy: ValueProp[];
  /** Modules every student takes, whichever major they choose. */
  coreModules: Module[];
  /**
   * `coreModules` arranged into the stages the programme is taught in.
   *
   * Derived, not authored: a bachelor's runs in years and a master's does not,
   * and both fall out of whether the modules name a stage.
   */
  curriculum: CurriculumGroup[];
  /** Specialisations available on this programme. Empty on a bachelor's. */
  majors: Major[];
  /** Programme brochure PDF. The download buttons hide when absent. */
  brochure?: Brochure | null;
  /** The partner institution awarding this programme, when one is linked. */
  partner?: PartnerRef | null;
  seo?: SeoFields | null;
};

/** A taught module — core, or specific to a major. */
export type Module = {
  title: string;
  /**
   * Credit value as authored, e.g. "6" or "6 ECTS".
   *
   * Free text rather than a number: credit systems differ between awarding
   * bodies, and the total is computed from the numbers found rather than
   * assuming one of them.
   */
  credits?: string | null;
  /** Qualification level of the module, e.g. "MQF 5". */
  level?: string | null;
  aims?: string | null;
  /** One outcome per entry; split from the stored newline-separated value. */
  outcomes: string[];
  /**
   * Stage of the programme this module is taught in, e.g. "First Year".
   *
   * Empty on a programme taught as one flat list — a master's, where the
   * variety lives in the majors rather than in the years.
   */
  group?: string | null;
};

/**
 * A stage of a programme and the modules taught in it.
 *
 * A programme with no stages returns a single group with a null title, which
 * renders as a plain module list.
 */
export type CurriculumGroup = {
  title: string | null;
  subtitle?: string | null;
  modules: Module[];
};

/** A specialisation within a programme. */
export type Major = {
  id: string;
  slug: string;
  name: string;
  /**
   * Which mark is drawn before the name, e.g. `fintech`.
   *
   * A key from `MAJOR_ICON_KEYS`, resolved by `majorIcon()`.
   * Usually empty — where an editor has picked nothing, the mark is read from
   * the major's own name instead.
   */
  icon?: string | null;
  /** Rendered block HTML — the major's overview. */
  overview?: string | null;
  modules: Module[];
  /** Major-specific brochure PDF, independent of the programme's own. */
  brochure?: Brochure | null;
};

export type Partner = {
  id: string;
  slug: string;
  /** The same thing in the site's other languages, where it exists. */
  translations?: Translation[];
  name: string;
  country: string;
  /**
   * One-paragraph summary — the lead in the hero and on the card.
   *
   * The description field when one is written, otherwise the opening of the
   * editor body, shortened. The full body is `content`.
   */
  description: string;
  logo?: MediaItem | null;
  website?: string | null;
  /** Brand colour of the partner, used for the accent rule on their card. */
  accentColor?: string | null;
  /** ISO 3166-1 alpha-2, used to render the flag. Inferred when absent. */
  countryCode?: string | null;
  /** Photograph for the partner's own page — not the logo. */
  image?: MediaItem | null;
  /**
   * Rendered block HTML from the editor — shown in the hero, under the name.
   */
  content?: string | null;
  /**
   * The longer "More about …" text, shown in the About section.
   *
   * Plain text; blank lines separate paragraphs. Separate from `content` so
   * the hero and the About section are two pieces of writing, not one repeated.
   */
  about: string[];
  /** The institution's mission, in its own words. */
  mission?: string | null;
  /** What the institution stands for. */
  values: ValueProp[];
  /** Counters for the partner's own band: students, campuses, years. */
  stats: Stat[];
  /**
   * Programmes this partner awards, resolved server-side from the link on each
   * programme. On listings only the count is used.
   */
  programs: Program[];
  /** Bodies that accredit or recognise this partner specifically. */
  accreditations: Accreditation[];
  seo?: SeoFields | null;
};

/**
 * A partner as referenced from a programme.
 *
 * Deliberately not the full `Partner`: the programme page needs a name and a
 * link, and pulling the partner's own programmes back through it would recurse.
 */
export type PartnerRef = {
  slug: string;
  name: string;
  country?: string | null;
  countryCode?: string | null;
  logo?: MediaItem | null;
  /**
   * The bodies accrediting this institution.
   *
   * Carried on the reference rather than fetched separately, because they are
   * the partner's own and a programme only borrows them: the claim a
   * programme page makes is "the institution awarding this degree is
   * recognised by these", which is the partner's fact, not the programme's.
   */
  accreditations?: Accreditation[];
};

export type Accreditation = {
  id: string;
  name: string;
  description: string;
  /** Issuing body or country, e.g. "Pearson, UK". */
  issuer?: string | null;
  /** Link to the issuer, so the claim is verifiable rather than asserted. */
  website?: string | null;
  logo?: MediaItem | null;
};

/**
 * Somebody the site shows with a photograph, a name and a role.
 *
 * Two collections share this shape: `academic-members` for faculty, and
 * `team-members` for everybody else on the Our People page — the board, the
 * managers, the student network. They are separate collections because
 * everywhere other than that page they are not the same thing: the homepage's
 * academic board is about faculty, and a CFO is not faculty.
 */
export type Person = {
  id: string;
  slug: string;
  /**
   * When they were added to the CMS, as an ISO string.
   *
   * Only the homepage board uses it, to show the most recent additions. Every
   * other listing keeps the order an editor arranged.
   */
  date?: string | null;
  /**
   * Where an editor put them in the list, 1 first.
   *
   * `null` for anybody who has not been given a number, which is most people:
   * they follow everyone who has one, in whatever order they were already in.
   * Applied by `getAcademicMembers`, so every listing without an order of its
   * own gets it — the home page's board is the exception, and shows the most
   * recently added instead.
   */
  order?: number | null;
  /** The same thing in the site's other languages, where it exists. */
  translations?: Translation[];
  name: string;
  position: string;
  credentials?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  photo?: MediaItem | null;
  /**
   * Which tab on the Our People page this person belongs under.
   *
   * Free text matched loosely against the tabs that page lists — see
   * `src/lib/people.ts`. Empty puts them in a general tab.
   */
  team?: string | null;
  /**
   * Where their own page is, when they have one.
   *
   * Academic members do; team members do not, because a board member's entry
   * is a photograph and a title, not a profile worth its own URL.
   */
  detailPath?: string | null;
};

/** A classifying term — currently only an academic's specialisation. */
export type Term = {
  name: string;
  slug: string;
};

/** A degree, chartered status or membership. */
export type Qualification = {
  title: string;
  institution?: string | null;
  year?: string | null;
};

/** A post held. */
export type Experience = {
  role: string;
  organisation?: string | null;
  /** Free text, e.g. "2019–2024" or "Current". */
  period?: string | null;
};

/**
 * Faculty specifically — the homepage's academic board, and the only people
 * with a profile page of their own.
 */
export type AcademicMember = Person & {
  /** Where they hold their position, e.g. "MSA University, Cairo". */
  institution?: string | null;
  expertise: string[];
  teaching: string[];
  research: string[];
  qualifications: Qualification[];
  experience: Experience[];
  /** What they specialise in — the filter on the staff directory. */
  specializations: Term[];
  seo?: SeoFields | null;
};

/** A question and answer, also emitted as FAQPage structured data. */
export type FaqItem = {
  id: string;
  question: string;
  /** Rich text, rendered to HTML. */
  answer: string;
};

export type Testimonial = {
  id: string;
  /** The post's own title — the fallback name for a filmed testimonial. */
  title: string;
  quote: string;
  authorName: string;
  authorRole: string;
  program?: string | null;
  /** Optional country — regional proof converts better than generic praise. */
  country?: string | null;
  avatar?: MediaItem | null;
  /**
   * A YouTube or Vimeo link. Filled in, the testimonial is a film and appears
   * on the graduate stories page; empty, it stays a written quote.
   */
  video?: string | null;
  /** The line on the video card. Falls back to the post title. */
  videoTitle?: string | null;
  /** The still shown in the grid, where one was uploaded. */
  poster?: MediaItem | null;
};

/**
 * The copy at the top of a page whose content is a list of posts.
 *
 * Shared by the FAQ and accreditations pages, which carry nothing else: the
 * questions and the badges are posts of their own.
 */
export type PageIntro = {
  eyebrow: string;
  heading: string;
  body: string;
};

export type FaqContent = { intro: PageIntro };

export type RecognitionContent = { intro: PageIntro };

/**
 * The graduate stories page, authored in the Graduate stories global.
 */
export type StoriesContent = {
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  /** How many films a page of the grid holds. */
  perPage: number;
};

export type Post = {
  id: string;
  slug: string;
  /** The one language the article is written in. */
  language: 'en' | 'ar';
  /**
   * Where it is served, written the way English serves it: `/<slug>` — the
   * old WordPress permalink — or the legacy path it was published at.
   */
  path: string;
  /** The same thing in the site's other languages, where it exists. */
  translations?: Translation[];
  title: string;
  excerpt: string;
  content?: string | null;
  date: string;
  featuredImage?: MediaItem | null;
  categories: string[];
  /** Category slugs, parallel to `categories`. */
  categorySlugs?: string[];
  /** Last edited, for `dateModified` and the sitemap. */
  modified?: string | null;
  author?: { name: string; avatar?: MediaItem | null } | null;
  seo?: SeoFields | null;
};

export type Page = {
  id: string;
  slug: string;
  /** The same thing in the site's other languages, where it exists. */
  translations?: Translation[];
  title: string;
  content: string;
  featuredImage?: MediaItem | null;
  seo?: SeoFields | null;
};

/**
 * A homepage counter.
 *
 * Authored as an array row in the CMS, so the number is separate from its
 * prefix and suffix — the animation counts the number and leaves the rest
 * alone, instead of guessing where the digits end in a free-text value.
 */
export type Stat = {
  /** Icon key from `STAT_ICONS`, e.g. `graduate`. */
  icon?: string | null;
  prefix?: string | null;
  number: string;
  suffix?: string | null;
  label: string;
};

/**
 * A navigation item, from the Navigation global.
 *
 * `href` is front-end-relative for internal links, written the way English
 * serves them; `Link` adds the language prefix.
 */
export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** True when the link points somewhere other than this site. */
  external?: boolean;
  /** From the menu item's "Open link in a new tab" checkbox. */
  newTab?: boolean;
  children?: NavItem[];
};

/** The menus in the Navigation global. */
export type SiteMenus = {
  primary: NavItem[];
  footerExplore: NavItem[];
  footerPrograms: NavItem[];
  footerLegal: NavItem[];
};

/**
 * A film, as the grid and the lightbox need it.
 *
 * Neutral on purpose: a graduate's story and a ceremony reel are the same
 * thing to a player, and giving them one shape means one grid, one lightbox
 * and one place to fix anything either of them gets wrong. Each page maps its
 * own posts onto this.
 */
export type VideoItem = {
  id: string;
  /** Used in the share link, so a film can be opened directly. */
  slug: string;
  title: string;
  /** The small line under the title — a name, a place, a date. */
  credit?: string | null;
  /** The link as authored: YouTube, a Short, or Vimeo. */
  video: string;
  /** The still for the grid. YouTube falls back to its own. */
  poster?: MediaItem | null;
};

/**
 * The video gallery page's own copy.
 *
 * The films and their categories are posts and terms; this is the band above
 * them and how many fit a page.
 */
export type GalleryContent = {
  intro: PageIntro;
  perPage: number;
};

/** A film in the gallery, with the categories it is filed under. */
export type GalleryVideo = VideoItem & {
  description?: string | null;
  categories: Term[];
};

/** What an episode plays — the `source` select on an episode row. */
export type EpisodeSource = 'youtube' | 'video' | 'audio';

/**
 * One episode of a show.
 *
 * A row on the podcast rather than a post of its own: episodes are read as a
 * series, never linked to from anywhere but the player, and forty posts nobody
 * navigates to is forty posts somebody has to keep in order.
 */
export type Episode = {
  /** Stable within its show — used in the share link and to resume playback. */
  id: string;
  title: string;
  source: EpisodeSource;
  /** A YouTube link, or the address of an MP4 or MP3. */
  url: string;
  thumb?: string | null;
  /** ISO date, or empty when the feed did not say. */
  date?: string | null;
  /** As written: `42:10`, `1:02:03`. Display only. */
  duration?: string | null;
  description?: string | null;
};

/** A podcast — the show, and the episodes on it. */
export type Podcast = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  /** Rendered block HTML — the show's own description. */
  description?: string | null;
  cover?: MediaItem | null;
  channelUrl?: string | null;
  channelLabel?: string | null;
  /** `sidebar` puts the episode list beside the player; `stacked`, beneath it. */
  layout: 'sidebar' | 'stacked';
  /** Whether the episode list carries a search box. */
  search: boolean;
  /** Whether finishing an episode rolls into the next. */
  autoplayNext: boolean;
  episodes: Episode[];
};

/** The podcasts page's own copy. The shows are `podcast` posts. */
export type PodcastContent = {
  intro: PageIntro;
};

/** A question answered on the page that asks it. */
export type QuestionAnswer = {
  question: string;
  answer: string;
};

/**
 * The fees page.
 *
 * The only page whose whole content is meta rather than posts: fees are one
 * document read top to bottom, and splitting a document into a collection
 * would mean maintaining an order nobody else needs.
 */
export type FeesContent = {
  intro: PageIntro;
  /** Short reassurances under the heading — "Transparent Fees". */
  highlights: string[];
  breakdown: {
    heading: string;
    body: string;
    /** One card per fee, opened to read what it covers. */
    items: ValueProp[];
  };
  /** Shown as a band between the fees and the payment options. */
  quote: string;
  payments: {
    heading: string;
    body: string;
    items: ValueProp[];
  };
  value: {
    heading: string;
    body: string;
    points: string[];
  };
  refund: {
    heading: string;
    body: string;
    questions: QuestionAnswer[];
  };
};

/** A titled section with an eyebrow and a list under it. */
export type SocialSection = {
  eyebrow: string;
  heading: string;
  body: string;
  items: ValueProp[];
};

/** The social responsibility page. */
export type SocialContent = {
  intro: PageIntro;
  /** The areas the page covers, shown as labels under the introduction. */
  tags: string[];
  quote: string;
  pillars: SocialSection;
  ecosystem: SocialSection;
  initiative: {
    eyebrow: string;
    heading: string;
    body: string;
    /** The number worth remembering, e.g. "30", and what it counts. */
    figure: string;
    figureLabel: string;
    image?: MediaItem | null;
    video: string;
  };
};

/** A photograph in a gallery. */
export type GalleryImage = {
  image: MediaItem;
  caption: string;
};

/** One ceremony on the timeline. */
export type Milestone = {
  status: 'completed' | 'upcoming';
  year: string;
  place: string;
  description: string;
};

/** A labelled detail — location, date, cohort. */
export type Fact = {
  label: string;
  value: string;
};

/** One line of a programme. */
export type AgendaItem = {
  time: string;
  item: string;
};

/** The graduation ceremonies page. */
export type CeremonyContent = {
  intro: PageIntro;
  stats: Stat[];
  legacy: {
    eyebrow: string;
    heading: string;
    body: string;
    points: string[];
    image?: MediaItem | null;
  };
  timeline: {
    eyebrow: string;
    heading: string;
    body: string;
    items: Milestone[];
  };
  gallery: {
    eyebrow: string;
    heading: string;
    images: GalleryImage[];
  };
  films: {
    eyebrow: string;
    heading: string;
    items: VideoItem[];
  };
  highlights: {
    eyebrow: string;
    heading: string;
    items: ValueProp[];
  };
  next: {
    eyebrow: string;
    heading: string;
    body: string;
    image?: MediaItem | null;
    facts: Fact[];
    agenda: AgendaItem[];
  };
  cta: {
    heading: string;
    body: string;
  };
};

/** Global settings, edited in the CMS under Settings → Site settings. */
export type SiteSettings = {
  tagline: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    mapUrl?: string | null;
  };
  social: SocialLink[];
  /**
   * Code an editor pasted to run on every page — analytics and advertising
   * pixels, a tag manager container, a chat widget.
   *
   * Written into the document exactly as it was typed, which is the only form
   * in which such a snippet works. `head` runs before the page content and
   * `body` after it. Both are trusted by construction: only a signed-in CMS
   * user can edit them.
   */
  code: {
    head: string;
    body: string;
  };
  /** Social image used when a page has none of its own, absolute. */
  defaultOgImage?: string | null;
  organization?: {
    legalName?: string | null;
    logo?: string | null;
    foundingDate?: string | null;
  };
  verification?: { google?: string | null; bing?: string | null };
};

/** One social profile, as configured in Site settings (Settings → Site settings in the admin). */
export type SocialLink = {
  /** The network's name — also what picks the icon. */
  label: string;
  url: string;
  /**
   * Whether it belongs in the fixed rail down the left of every page. The
   * header and footer list every link regardless of this.
   */
  sticky: boolean;
};

/** A "Title|Description" pair used by the "Why ECC" grid. */
export type ValueProp = {
  title: string;
  description: string;
};

/**
 * Homepage content, authored in the Home global.
 *
 * Every section falls back to seeded copy independently, so a half-filled page
 * still renders a complete homepage.
 */
export type HomeContent = {
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    badges: string[];
    image?: MediaItem | null;
  };
  countries: string[];
  stats: Stat[];
  why: {
    heading: string;
    body: string;
    items: ValueProp[];
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
    mission: string;
    vision: string;
    values: ValueProp[];
    ctaLabel: string;
    ctaHref: string;
    image?: MediaItem | null;
    /** A landscape second image, under the first. Hidden on small screens. */
    imageTwo?: MediaItem | null;
  };
  video: {
    eyebrow: string;
    heading: string;
    body: string;
    /** Vimeo URL. The section hides itself when empty. */
    url: string;
    poster?: MediaItem | null;
  };
  ceo: {
    eyebrow: string;
    heading: string;
    message: string[];
    name: string;
    role: string;
    photo?: MediaItem | null;
  };
  cta: {
    heading: string;
    body: string;
    label: string;
    href: string;
    image?: MediaItem | null;
  };
};

/**
 * The About Us page, authored in the About us global.
 *
 * Like the homepage, every section falls back independently, so a half-filled
 * page still renders a complete one. The partner, accreditation and testimonial
 * cards come from their own collections — only the surrounding copy is here.
 */
export type AboutContent = {
  intro: {
    eyebrow: string;
    heading: string;
    /** One entry per paragraph. */
    body: string[];
    image?: MediaItem | null;
  };
  mission: string;
  vision: string;
  stats: Stat[];
  programmes: { heading: string; body: string };
  network: { heading: string; body: string };
  recognition: { heading: string; body: string };
  ceremonies: {
    heading: string;
    body: string;
    /** Up to three photographs; the section hides with none. */
    images: MediaItem[];
    /** Vimeo or YouTube link. The play button hides when empty. */
    video: string;
    /** Counters shown under the introduction, not as a separate band. */
    stats: Stat[];
    /** Button under the figures. Needs both halves to render. */
    ctaLabel: string;
    ctaHref: string;
  };
  feedback: { heading: string; body: string };
};

/**
 * The Our People page, authored in the Our people global.
 *
 * The people themselves are academic member posts; this is only the copy above
 * them and the tabs they are sorted into.
 */
export type PeopleContent = {
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  teams: { label: string; description: string }[];
};

/**
 * The academic staff directory, authored in the Academic staff global.
 *
 * The academics come from their own collection and the filters from the
 * specializations collection; this is the copy above them and the page length.
 */
export type StaffContent = {
  intro: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  /** How many academics a page of the directory holds. */
  perPage: number;
};

/**
 * The Contact page, authored in the Contact global.
 *
 * The email address, phone number and postal address stay in Site settings
 * (Settings → Site settings in the admin) — they belong to the site, not to
 * this page, and the footer reads them too. What is here is only what the
 * contact page itself says.
 */
export type ContactContent = {
  intro: {
    eyebrow: string;
    heading: string;
    /** One entry per paragraph. */
    body: string[];
    /** Opening hours, one entry per line. The block hides when empty. */
    hours: string[];
  };
  form: {
    heading: string;
    body: string;
    /**
     * Slug of the form to render in the panel. The form itself — its fields,
     * its confirmation message, where submissions go — is authored under
     * Forms; this page only decides which one appears.
     */
    slug: string;
  };
  map: {
    heading: string;
    /**
     * A Google Maps embed URL. Empty means "build one from the address in
     * settings"; the map only hides when there is no address either.
     */
    embedUrl: string;
  };
};
