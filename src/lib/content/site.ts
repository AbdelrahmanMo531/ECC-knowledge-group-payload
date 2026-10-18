import { toCurriculum } from '@/lib/programs/curriculum';
import type { FormChoice, FormDefinition } from '@/lib/forms/definition';
import type {
  AboutContent,
  AcademicMember,
  ContactContent,
  CeremonyContent,
  FaqContent,
  FeesContent,
  GalleryContent,
  GalleryVideo,
  Major,
  Podcast,
  PodcastContent,
  SocialContent,
  Accreditation,
  FaqItem,
  HomeContent,
  Module,
  NavItem,
  Partner,
  PeopleContent,
  Person,
  Program,
  SiteMenus,
  Testimonial,
  SiteSettings,
  RecognitionContent,
  StaffContent,
  StoriesContent,
} from '@/lib/cms/types';

/**
 * Seeded content.
 *
 * This is the fallback `src/lib/cms/api.ts` serves whenever the database is
 * not reachable or a content type has not been populated yet. Copy is drawn
 * from the ECC Brand Identity Guidelines (2026) and the partner descriptions it
 * contains, so what renders today is the real brand voice — not lorem ipsum.
 *
 * As each content type is authored in Payload, its entry here stops being
 * used automatically. Nothing needs deleting. `npm run seed` loads it into
 * the admin as a starting point.
 */

export const siteSettings: SiteSettings = {
  tagline: 'Crafting Excellence in Every Shade',
  contact: {
    email: 'info@ecc-group.ae',
    phone: '+971 55 893 1013',
    address:
      'Citibank Building, 13th Floor — Al Wasl Branch, Sheikh Rashid Road, next to Wafi City, Dubai, UAE',
    mapUrl: 'https://maps.google.com/?q=Citibank+Building+Sheikh+Rashid+Road+Dubai',
  },
  // WhatsApp leads, and its address is the contact number above.
  social: [
    { label: 'WhatsApp', url: 'https://wa.me/971558931013', sticky: true },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/company/ecc-knowledge-group',
      sticky: true,
    },
    {
      label: 'Instagram',
      url: 'https://www.instagram.com/ecc.knowledge.group',
      sticky: true,
    },
    { label: 'Facebook', url: 'https://www.facebook.com/ecccgrp', sticky: true },
  ],
  // Deliberately empty, and it stays empty.
  //
  // Every other value here is a plausible stand-in for a site whose CMS is
  // unreachable. Tracking code has no plausible stand-in: a made-up pixel id
  // reports visits to somebody else's account, and a real one hard-coded here
  // would keep firing after an editor removed it from the CMS.
  code: { head: '', body: '' },
};

/**
 * The "who we are" section. Drawn from the guideline's articulation of the
 * logo story — knowledge, achievement, heritage and wisdom (p.3).
 */
export const aboutIntro = {
  eyebrow: 'About ECC Knowledge Group',
  headline: 'Where tradition meets innovation',
  body: [
    'ECC Knowledge Group exists to open the gateway to higher qualifications for ambitious professionals across the Middle East and North Africa. We partner with established international institutions to bring their degrees, diplomas and executive programmes within reach — taught in Dubai, delivered flexibly, recognised globally.',
    'Our identity carries that mission. The pen tip stands for knowledge and the power of writing the future. The graduation cap reflects achievement. The falcon, drawn from Emirati heritage, stands for strength, vision and limitless horizons. At the heart lies the book — the eternal source of wisdom and learning.',
  ],
  pillars: [
    {
      title: 'Knowledge',
      description:
        'Curricula built with partner faculties and mapped to international qualification frameworks.',
    },
    {
      title: 'Achievement',
      description:
        'Awards conferred by accredited institutions in Switzerland, Croatia, the UK and Malaysia.',
    },
    {
      title: 'Heritage',
      description:
        'Rooted in the UAE, shaped by Emirati ambition, and built for a regional student body.',
    },
    {
      title: 'Vision',
      description:
        'Flexible, blended delivery designed around working professionals, not around a timetable.',
    },
  ],
};

/**
 * Majors on the IBAS MBA, as supplied by ECC.
 *
 * Only Hospital Management came with an overview and a specialisation module,
 * so the rest carry their names alone — the page renders the full list as a
 * chooser and shows detail for whichever majors have it, rather than inventing
 * copy for sixteen specialisations.
 */
export const mbaMajors: Major[] = [
  {
    id: 'seed-major-hospital',
    slug: 'hospital-management',
    name: 'Hospital Management',
    overview:
      '<p>Hospital Management focuses on the effective administration and operation of healthcare organisations, to ensure high-quality patient care and efficient services. It covers healthcare leadership, hospital operations, health policy, financial management, quality assurance, patient experience, and the healthcare technologies that improve organisational performance and outcomes.</p>',
    modules: [
      {
        title: 'Managing Quality and Service Delivery',
        aims: 'This unit develops the knowledge and skills to plan, monitor and improve the quality of services delivered in a healthcare setting.',
        outcomes: [
          'Understand the principles of quality management in healthcare',
          'Be able to evaluate service delivery against agreed standards',
          'Be able to plan improvements to patient-facing services',
        ],
      },
    ],
  },
  {
    id: 'seed-major-strategic-economic-leadership',
    slug: 'strategic-economic-leadership',
    name: 'Strategic Economic Leadership',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-strategic-thinking',
    slug: 'strategic-thinking',
    name: 'Strategic Thinking',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-entrepreneurial-leadership-and-innovation',
    slug: 'entrepreneurial-leadership-and-innovation',
    name: 'Entrepreneurial Leadership and Innovation',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-artificial-intelligence',
    slug: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-islamic-finance',
    slug: 'islamic-finance',
    name: 'Islamic Finance',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-fintech',
    slug: 'fintech',
    name: 'Fintech',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-banking-and-finance',
    slug: 'banking-and-finance',
    name: 'Banking and Finance',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-human-resources-management',
    slug: 'human-resources-management',
    name: 'Human Resources Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-logistics-supply-chain-management',
    slug: 'logistics-supply-chain-management',
    name: 'Logistics & Supply Chain Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-healthcare-management',
    slug: 'healthcare-management',
    name: 'Healthcare Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-strategic-management',
    slug: 'strategic-management',
    name: 'Strategic Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-quality-management',
    slug: 'quality-management',
    name: 'Quality Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-marketing-management',
    slug: 'marketing-management',
    name: 'Marketing Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-accounting-and-finance-management',
    slug: 'accounting-and-finance-management',
    name: 'Accounting and Finance Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-project-management',
    slug: 'project-management',
    name: 'Project Management',
    overview: null,
    modules: [],
  },
  {
    id: 'seed-major-digital-transformation',
    slug: 'digital-transformation',
    name: 'Digital Transformation',
    overview: null,
    modules: [],
  },
];

/**
 * A BBA unit.
 *
 * Twenty-four of them share one shape, so they are written with a constructor
 * rather than twenty-four object literals. Outcomes are authored as a block of
 * lines, matching how an editor types them into the CMS textarea.
 */
const unit = (
  group: string,
  title: string,
  aims: string,
  outcomes: string,
): Module => ({
  group,
  title,
  aims,
  outcomes: outcomes
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean),
});

/**
 * The bachelor's is taught in years rather than majors, which is the whole
 * reason modules carry a stage. These descriptions give each year its heading;
 * `toCurriculum` matches them to the units below by name.
 */
const bbaStages = [
  {
    title: 'First Year',
    subtitle:
      'The curriculum incorporates case studies, projects and real-world scenarios, so students can apply what they learn to practical situations. The programme is recognised in the United States through its ACBSP accreditation, an American accrediting body recognised by CHEA.',
  },
  {
    title: 'Second Year',
    subtitle:
      'The second year offers a more comprehensive and integrated development of the first, including a mandatory research project drawing the year’s learning together.',
  },
  {
    title: 'Third Year',
    subtitle:
      'The third year offers a broader experience of management. For students wanting to realise their academic interest and potential in the subject fully, it is the opportunity to engage with a wide range of management topics.',
  },
];

const bbaModules: Module[] = [
  unit(
    'First Year',
    'The Business Environment',
    'This unit develops understanding of the national and global business environment, and of the internal and external circumstances in which different organisations operate.',
    `Understand the types of organisations and their purposes
     Understand the structure of organisations
     Understand the impact of the market environment on organisations
     Be able to develop strategy options for an organisation
     Understand the nature of the national environment in which organisations operate`,
  ),
  unit(
    'First Year',
    'Communication Skills for Business',
    'This unit develops knowledge and understanding of communication practices within organisations, introducing the different modes and channels organisations use. Students also develop their own communication skills and apply them to typical organisational requirements.',
    `Understand how internal communication takes place within organisations
     Understand how organisations communicate with customers
     Understand the factors that impact the effectiveness of communications in business
     Be able to present oral information effectively
     Be able to communicate effectively in writing`,
  ),
  unit(
    'First Year',
    'Customer Relationship Management',
    'This unit develops knowledge and understanding of the scope and importance of customer relationship management (CRM), and explores how effective CRM is achieved.',
    `Understand the importance of customer relationship management to business
     Understand how good customer relationship management is achieved
     Understand the use of loyalty schemes in customer relationship management
     Be able to plan improvements to customer relationship management in a chosen organisation`,
  ),
  unit(
    'First Year',
    'Financial and Management Accounting Techniques for Managers',
    'To develop knowledge and understanding of the fundamental financial and management accounting techniques managers use in organisations, and to enable students to apply them.',
    `Understand financial and management accounting systems
     Be able to assess business organisation performance
     Be able to apply management accounting techniques`,
  ),
  unit(
    'First Year',
    'Administrative Services',
    'This unit develops knowledge and understanding of the administrative services offered to managers and departments within organisations. Students also create and use administrative systems, developing the skills effective administration needs.',
    `Understand the range and diversity of administrative skills and services
     Understand how to create and use organisational systems
     Support meetings and events
     Understand the importance of effective communication in providing administrative services in the workplace`,
  ),
  unit(
    'First Year',
    'Managing a Work-based Team Project',
    'This unit develops project management skills for a work-based team project by working through the stages of project development. Students plan, implement and review a project of their own choice.',
    `Develop a proposal for a work-based team project
     Plan the work-based team project
     Implement the plan for a work-based team project
     Evaluate the process and outcomes of the project`,
  ),
  unit(
    'First Year',
    'People in Organisations',
    'This unit develops knowledge and understanding of the aspects of organisations that concern and support people — communication practices, teamwork, remote working and other organisational structures — and uses it to review the impact of workplace practices on people.',
    `Understand communication practices within organisations
     Understand effective teamwork
     Understand the issues associated with remote working
     Understand how organisations monitor and support people in the workplace`,
  ),
  unit(
    'First Year',
    'Resource Management',
    'This unit provides an overview of the human and physical resources a range of organisations need, across the primary, service and manufacturing sectors, and develops the understanding needed to review how effectively an organisation uses them.',
    `Understand the key features of resource management
     Understand the importance of the effective use of physical resources
     Understand how to use human resources effectively
     Understand how to review the effective use of resources`,
  ),

  unit(
    'Second Year',
    'Business Organisation in a Global Context',
    'This unit develops understanding of the issues organisations face operating in a global context, and uses it to review the issues currently affecting business organisations.',
    `Understand differences in global business operations
     Understand the impact of external factors on global business organisations
     Understand the impact of globalisation on the internal operations of business organisations
     Be able to review current issues that impact on business activities of a specified country`,
  ),
  unit(
    'Second Year',
    'People Management',
    'This unit covers how to manage individuals and teams: the organisational factors that influence their behaviour, and the management tools and techniques that make managing them effective.',
    `Understand how structure, culture and other factors impact people in organisations
     Understand how to manage individuals and teams to achieve sustainable business performance
     Understand how to develop individuals and teams to achieve sustainable business performance
     Be able to review people management strategies in an organisation`,
  ),
  unit(
    'Second Year',
    'Managing Communication',
    'This unit develops knowledge and understanding of communication within and between organisations, and asks students to review their own communication skills in an organisational context.',
    `Understand channels of communication within and between organisations and their effectiveness
     Be able to assess the factors that impact workplace communication
     Be able to demonstrate the effective use of your communication skills within the workplace
     Be able to evaluate the effectiveness of communication within an organisation`,
  ),
  unit(
    'Second Year',
    'Marketing Principles and Practice',
    'To develop knowledge and understanding of general marketing principles and how they are applied in business.',
    `Understand the role of marketing in business
     Understand marketing principles
     Understand marketing methods
     Understand how to develop a marketing plan for a specific product or service`,
  ),
  unit(
    'Second Year',
    'Research Project',
    'This unit develops the skills needed to formulate a research question, then to design and carry out a research project that answers it. Students also interpret their findings and present them to an audience.',
    `Be able to design a research project
     Be able to undertake a research project in line with a research project plan
     Be able to evaluate research outcomes
     Be able to present the research outcomes`,
  ),
  unit(
    'Second Year',
    'Finance for Managers',
    'This unit covers the sources and uses of finance in organisations, and how to evaluate and interpret financial data.',
    `Understand the sources of finance available to organisations
     Be able to assess an organisation’s financial performance
     Be able to use costing methods to make informed organisational decisions`,
  ),
  unit(
    'Second Year',
    'Business Ethics',
    'This unit covers the ethical responsibilities organisations carry, and how ethical considerations shape the decisions managers take.',
    `Understand the role of ethics in organisational decision-making
     Be able to assess an organisation’s ethical performance
     Be able to apply ethical frameworks to organisational decisions`,
  ),
  unit(
    'Second Year',
    'Planning a New Business Venture',
    'This unit covers what a new business venture requires: assessing the opportunity, planning the venture and setting out the case for it.',
    `Understand what is involved in starting a new business venture
     Be able to assess the viability of a business opportunity
     Be able to produce a business plan for a new venture`,
  ),

  unit(
    'Third Year',
    'Financial Decision Making for Managers',
    'This unit develops the financial understanding managers need to make decisions, and the ability to review the financial issues currently affecting organisations.',
    `Understand the financial information managers use to make decisions
     Understand the impact of external factors on financial decisions
     Be able to appraise investment decisions
     Be able to review the financial performance of an organisation`,
  ),
  unit(
    'Third Year',
    'Leadership and Management',
    'This unit examines the relationship between leadership and management, the theories behind both, and how each is applied in organisations.',
    `Understand the difference between leadership and management
     Understand leadership styles and their impact on organisations
     Be able to assess leadership within an organisation
     Understand how to develop leadership within an organisation`,
  ),
  unit(
    'Third Year',
    'Personal Leadership and Management Development',
    'This unit asks students to assess their own leadership and management capability and to plan its development.',
    `Understand the skills required of a leader and a manager
     Be able to assess personal leadership and management capability
     Be able to plan personal leadership and management development
     Be able to evaluate personal development against a plan`,
  ),
  unit(
    'Third Year',
    'Risk Management',
    'This unit covers how organisations identify, assess and manage the risks they face, and the frameworks used to do so.',
    `Understand the types of risk organisations face
     Understand risk assessment methods
     Be able to develop a risk management plan
     Understand how organisations monitor and review risk`,
  ),
  unit(
    'Third Year',
    'Managing Quality and Service Delivery',
    'This unit covers how organisations define, deliver and improve quality in the services they provide.',
    `Understand the meaning of quality in service delivery
     Understand quality management systems and standards
     Be able to assess service quality in an organisation
     Be able to plan improvements to service delivery`,
  ),
  unit(
    'Third Year',
    'Human Resource Management',
    'This unit covers the human resource function: how organisations recruit, develop, reward and retain the people they depend on.',
    `Understand the role of the human resource function in organisations
     Understand recruitment and selection practices
     Understand how organisations develop and reward people
     Be able to review human resource practices in an organisation`,
  ),
  unit(
    'Third Year',
    'Marketing Communications',
    'This unit covers how organisations communicate with their markets: the channels available, how campaigns are planned, and how their effectiveness is judged.',
    `Understand the role of marketing communications
     Understand the channels available for marketing communications
     Be able to plan a marketing communications campaign
     Be able to evaluate the effectiveness of marketing communications`,
  ),
  unit(
    'Third Year',
    'Sales',
    'This unit covers the sales function and its relationship to marketing: how sales activity is planned, carried out and measured.',
    `Understand the role of sales within an organisation
     Understand the relationship between sales and marketing
     Be able to plan sales activity
     Be able to evaluate sales performance`,
  ),
];

const mbaCoreModules: Module[] = [
  {
    title: 'Strategic Planning',
    aims: 'This unit aims to develop the knowledge, understanding and skills necessary to develop an organisational strategic plan.',
    outcomes: [
      'Understand the foundations for developing organisational strategy',
      'Understand the external environment affecting organisations',
      'Be able to review an organisation’s strategy and business plans',
      'Be able to develop strategy options for an organisation',
      'Understand how to create a strategic plan to meet business objectives',
    ],
  },
];

export const programs: Program[] = [
  {
    id: 'seed-bba',
    slug: 'bachelor-of-business-administration',
    title: 'Bachelor of Business Administration (BBA)',
    excerpt:
      'A foundation in management, finance and enterprise for students building their first professional qualification.',
    level: 'Bachelor',
    duration: '36 months',
    studyMode: 'Blended · Dubai & online',
    awardingBody: 'IBAS Switzerland',
    highlights: [
      'Core grounding in accounting, marketing, operations and strategy',
      'Assessed through applied business projects rather than exams alone',
      'Direct progression route into the MBA',
    ],
    accreditations: ['ACBSP'],
    learningOutcomes: [],
    careers: [],
    whyStudy: [],
    coreModules: bbaModules,
    curriculum: toCurriculum(bbaModules, bbaStages),
    // A bachelor's has no majors: the breadth is in the three years, not in a
    // specialisation. The majors section and its tab hide themselves.
    partner: {
      slug: 'ibas',
      name: 'International Business Academy of Switzerland (IBAS)',
      country: 'Switzerland',
      countryCode: 'CH',
    },
    majors: [],
  },
  {
    id: 'seed-mba',
    slug: 'master-of-business-administration',
    title: 'Master of Business Administration (MBA)',
    excerpt:
      'The flagship postgraduate programme for managers moving into senior leadership across the Gulf.',
    level: 'Master',
    duration: 'Minimum 8 months',
    studyMode: 'Interactive e-learning',
    awardingBody: 'IBAS — International Business Academy of Switzerland',
    highlights: [
      'Seventeen majors, from Islamic Finance to Artificial Intelligence',
      'Designed around working professionals — evening and weekend delivery',
      'Capstone consultancy project set in the student’s own organisation',
    ],
    credits: '60–90 ECTS',
    language: 'English',
    accreditations: ['ACBSP', 'IACBE', 'ISASAHE'],
    learningOutcomes: [
      'Acquire advanced, specialised knowledge of diverse business environments, demonstrating understanding of management processes and strategic decision-making within complex and dynamic organisational contexts.',
      'Demonstrate expertise in global business and marketing strategies, analysing and applying appropriate approaches across international and multicultural markets.',
      'Critically assess legal, regulatory and ethical frameworks within various industries, ensuring compliance and responsible corporate practices.',
      'Develop strategic acumen to drive long-term sustainable growth, aligning corporate strategies with organisational objectives and global economic trends.',
      'Analyse and interpret complex financial data using advanced financial tools to support informed decision-making and organisational resilience.',
      'Apply rigorous research methodologies to investigate business challenges and generate evidence-based strategic recommendations.',
    ],
    careers: [
      'Business Development Manager',
      'Marketing Manager / Marketing Director',
      'Human Resources Manager',
      'Operations Manager',
    ],
    whyStudy: [
      {
        title: 'A Swiss award, earned from anywhere',
        description:
          'The degree is conferred by the International Business Academy of Switzerland and carries its accreditation, wherever your career takes you next.',
      },
      {
        title: 'Eight months at your own pace',
        description:
          'Interactive e-learning with no fixed timetable. Eight months is the minimum; take longer when work demands it.',
      },
      {
        title: 'Seventeen majors, one degree',
        description:
          'Choose the specialisation that matches where you want to go — from Islamic Finance to Artificial Intelligence — without changing programme.',
      },
      {
        title: 'Assessed on applied work',
        description:
          'Research and projects grounded in real organisations rather than examination halls, so what you study is usable at work immediately.',
      },
    ],
    coreModules: mbaCoreModules,
    curriculum: toCurriculum(mbaCoreModules),
    partner: {
      slug: 'ibas',
      name: 'International Business Academy of Switzerland (IBAS)',
      country: 'Switzerland',
      countryCode: 'CH',
    },
    majors: mbaMajors,
  },
  {
    id: 'seed-dba',
    slug: 'doctor-of-business-administration',
    title: 'Doctor of Business Administration (DBA)',
    excerpt:
      'A professional doctorate for senior executives producing original, applied research in their field.',
    level: 'Doctorate',
    duration: '36–48 months',
    studyMode: 'Supervised research · Dubai & online',
    awardingBody: 'IBAS Switzerland',
    highlights: [
      'Individual supervision from doctoral faculty throughout',
      'Taught research-methods phase before the thesis stage',
      'Applied thesis addressing a live problem in industry',
    ],
    accreditations: [],
    learningOutcomes: [],
    careers: [],
    whyStudy: [],
    coreModules: [],
    curriculum: [],
    partner: {
      slug: 'ibas',
      name: 'International Business Academy of Switzerland (IBAS)',
      country: 'Switzerland',
      countryCode: 'CH',
    },
    majors: [],
  },
  {
    id: 'seed-design-thinking',
    slug: 'design-thinking-certification',
    title: 'Design Thinking Certification',
    excerpt:
      'A practitioner programme in human-centred innovation, delivered with a d.school network member.',
    level: 'Executive',
    duration: '6–12 weeks',
    studyMode: 'Intensive workshops · Dubai',
    awardingBody: 'Genovasi d.school Malaysia',
    highlights: [
      'Taught by facilitators from the global d.school network',
      'Team-based sprints on real organisational challenges',
      'Suited to public-sector and corporate innovation teams',
    ],
    accreditations: [],
    learningOutcomes: [],
    careers: [],
    whyStudy: [],
    coreModules: [],
    curriculum: [],
    partner: {
      slug: 'genovasi-dschool-malaysia',
      name: 'Genovasi d.school Malaysia',
      country: 'Malaysia',
      countryCode: 'MY',
    },
    majors: [],
  },
];

/**
 * The programmes a partner awards.
 *
 * Matched on the partner slug each programme names, which is the seeded
 * equivalent of a programme's partner relationship in the CMS — the same link,
 * resolved server-side there and here in one line.
 */
const awardedBy = (partnerSlug: string): Program[] =>
  programs.filter((program) => program.partner?.slug === partnerSlug);

/**
 * Partner descriptions are quoted from the ECC brand guideline (p.20–34),
 * where each partner supplied their own institutional summary.
 *
 * Mission, values and figures are left empty rather than invented: they are
 * claims about real institutions, and each partner's own page hides those
 * sections until someone authors them in the admin. The programmes are matched
 * from the awarding body already recorded on each programme, which is the same
 * link the CMS makes explicit.
 */
export const partners: Partner[] = [
  {
    id: 'seed-ibas',
    slug: 'ibas',
    name: 'International Business Academy of Switzerland (IBAS)',
    country: 'Switzerland',
    description:
      'IBAS specialises in Master’s and Doctorate programmes in Business Administration. Its curriculum is designed to prepare students to become top professionals in business and management, and to contribute to the world and their own countries through their knowledge.',
    website: null,
    accentColor: '#0A2351',
    countryCode: 'CH',
    about: [],
    values: [],
    stats: [],
    accreditations: [],
    programs: awardedBy('ibas'),
  },
  {
    id: 'seed-vern',
    slug: 'vern-university',
    name: 'VERN University',
    country: 'Croatia',
    description:
      'An international, open, creative and entrepreneurial university from Zagreb. For the last 20 years VERN has been a leading private university in Croatia and the region, currently offering 10 bachelor and 7 graduate programmes, with international mobility at the centre of student and staff life.',
    website: null,
    accentColor: '#004442',
    countryCode: 'HR',
    about: [],
    values: [],
    stats: [],
    accreditations: [],
    programs: awardedBy('vern-university'),
  },
  {
    id: 'seed-cmi',
    slug: 'cmi',
    name: 'CMI',
    country: 'United Kingdom',
    description:
      'A dynamic social enterprise that is both well managed and true to its values. Those values mean that even if you have never worked with CMI before, you know what to expect.',
    website: null,
    accentColor: '#281E72',
    countryCode: 'GB',
    about: [],
    values: [],
    stats: [],
    accreditations: [],
    programs: awardedBy('cmi'),
  },
  {
    id: 'seed-genovasi',
    slug: 'genovasi-dschool-malaysia',
    name: 'Genovasi d.school Malaysia',
    country: 'Malaysia',
    description:
      'Part of the global network of Design Thinking schools alongside the USA, Germany and South Africa. With more than nine years running Design Thinking programmes for the public and private sectors, Genovasi has worked across government ministries and agencies as well as telecommunications, media and consumer goods.',
    website: null,
    accentColor: '#EC8D29',
    countryCode: 'MY',
    about: [],
    values: [],
    stats: [],
    accreditations: [],
    programs: awardedBy('genovasi-dschool-malaysia'),
  },
];

/**
 * Accreditation and awarding bodies, as supplied by ECC.
 *
 * `website` is intentionally left null rather than guessed — the card becomes a
 * "Verify" link only when a real URL is set, and a wrong link is worse than
 * none on a page whose whole job is establishing trust.
 */
export const accreditations: Accreditation[] = [
  {
    id: 'seed-acc-ieb',
    name: 'International Education Board',
    issuer: 'IEB',
    description:
      'Founded in 2012 as the International Skill Education Quality Standards Accreditation and renamed the International Education Board in 2021. It recognises institutions for research performance, student services and teaching quality. IEB accreditation is a voluntary, non-governmental quality assurance and institutional development process.',
    website: null,
  },
  {
    id: 'seed-acc-aaa',
    name: 'The American Accreditation Association',
    issuer: 'United States',
    description:
      'Recognised by the State Corporation Commission of the Commonwealth of Virginia and authorised to transact accreditation services under Title 13.1 of the Code of Virginia. A partner of the International Laboratory Accreditation Cooperation (ILAC) and the International Accreditation Forum (IAF).',
    website: null,
  },
  {
    id: 'seed-acc-eduqual',
    name: 'EduQual',
    issuer: 'United Kingdom',
    description:
      'A UK-based, regulated and globally recognised awarding body providing high-quality, affordable qualifications, with partner centres across Africa, the Americas, Asia and Europe.',
    website: null,
  },
  {
    id: 'seed-acc-cth',
    name: 'CTH',
    issuer: 'United Kingdom',
    description:
      'The Confederation of Tourism and Hospitality, founded in 1982, is the UK’s leading specialist professional awarding body for the sector. Its network of more than two hundred approved learning centres worldwide delivers CTH qualifications to thousands of students each year.',
    website: null,
  },
  {
    id: 'seed-acc-cmi',
    name: 'CMI',
    issuer: 'United Kingdom',
    description:
      'The Chartered Management Institute is the only chartered professional body in the UK dedicated to the highest standards in management and leadership, with a network of over 150,000 professionals.',
    website: null,
  },
  {
    id: 'seed-acc-leb',
    name: 'LEB',
    issuer: 'United Kingdom',
    description:
      'The London Examinations Board is a UK educational body registered with the UK Register of Learning Providers and associated with the Skills Funding Agency.',
    website: null,
  },
];

/**
 * Intentionally empty. Testimonials are attributed to real, named people, so
 * they are only ever shown once genuine ones are entered in the admin — the
 * section hides itself while this list is empty.
 */
export const testimonials: Testimonial[] = [];

/**
 * Fallback navigation, used until the menus in the Navigation global are
 * filled in. Each list maps to one of its menus.
 */
export const navigation: NavItem[] = [
  { id: 'nav-home', label: 'Home', href: '/' },
  { id: 'nav-about', label: 'About Us', href: '/about-us' },
  { id: 'nav-people', label: 'Our People', href: '/our-people' },
  { id: 'nav-programs', label: 'Programmes', href: '/programs' },
  { id: 'nav-partners', label: 'Partners', href: '/partners' },
  { id: 'nav-insights', label: 'Insights', href: '/blog' },
  { id: 'nav-contact', label: 'Contact', href: '/contact' },
];

export const footerProgramsNav: NavItem[] = [
  {
    id: 'fp-bba',
    label: 'BBA',
    href: '/programs/bachelor-of-business-administration',
  },
  {
    id: 'fp-mba',
    label: 'MBA',
    href: '/programs/master-of-business-administration',
  },
  {
    id: 'fp-dba',
    label: 'DBA',
    href: '/programs/doctor-of-business-administration',
  },
  {
    id: 'fp-dt',
    label: 'Design Thinking',
    href: '/programs/design-thinking-certification',
  },
];

/**
 * Legal links. These resolve through the catch-all page route, so they work as
 * soon as pages with matching slugs are published in the admin.
 */
export const footerLegalNav: NavItem[] = [
  { id: 'fl-privacy', label: 'Privacy policy', href: '/privacy-policy' },
  { id: 'fl-terms', label: 'Terms of use', href: '/terms-of-use' },
];

/**
 * The footer's Explore column.
 *
 * Everything the header carries, plus the two pages that would push it onto a
 * second row. A footer column is a list; a header is a line.
 */
export const footerExploreNav: NavItem[] = [
  ...navigation,
  { id: 'fe-staff', label: 'Academic Staff', href: '/our-academic-staff' },
  { id: 'fe-stories', label: 'Testimonials', href: '/testimonials' },
  { id: 'fe-videos', label: 'Video Gallery', href: '/video-gallery' },
  { id: 'fe-podcast', label: 'Podcasts', href: '/podcast' },
  { id: 'fe-fees', label: 'Fees & Tuition', href: '/fees-structure' },
  { id: 'fe-social', label: 'Social Responsibility', href: '/social-responsibility' },
  { id: 'fe-ceremonies', label: 'Graduation Ceremonies', href: '/graduation-ceremonies' },
  { id: 'fe-accreditations', label: 'Accreditations', href: '/accreditations' },
  { id: 'fe-faq', label: 'FAQ', href: '/faq' },
];

export const fallbackMenus: SiteMenus = {
  primary: navigation,
  footerExplore: footerExploreNav,
  footerPrograms: footerProgramsNav,
  footerLegal: footerLegalNav,
};

/**
 * Homepage content.
 *
 * Mirrors the fields on the Home global, and is what shows until that global
 * is filled in. Copy supplied by ECC, edited for the search intent this page
 * targets: professionals in Egypt and the Gulf looking for a globally
 * recognised BBA, MBA or DBA they can study online, around a job.
 */
export const homeContent: HomeContent = {
  hero: {
    eyebrow: 'A new era of knowledge',
    // The H1 carries the qualification names and the two decisive qualifiers —
    // recognised and flexible — because this is the line search engines weigh
    // most heavily and the first thing a visitor reads.
    heading: 'Globally recognised BBA, MBA & DBA degrees — earned around your career',
    body: 'ECC Knowledge Group opens the pathway to international degrees from leading institutions in Switzerland, the United Kingdom, Croatia, Malaysia and Denmark. Study online, on flexible hours built around full-time work, and graduate with an award recognised across the Gulf, Egypt and beyond.',
    ctaLabel: 'Get the prospectus',
    ctaHref: '/contact',
    badges: [
      '100% online',
      'Flexible study hours',
      'Internationally accredited',
      'Monthly intakes',
    ],
  },

  countries: ['Switzerland', 'United Kingdom', 'Croatia', 'Malaysia', 'Denmark'],

  /**
   * Counters supplied by ECC. The source list had its numbers and labels offset
   * by one position; these use the reading that produces plausible figures, and
   * are ordered by persuasive weight rather than by the original order.
   */
  /*
   * The `+` is a prefix, matching how ECC writes these. Icons are left unset so
   * the band renders as plainly as the reference design — add one to a row in
   * the admin and it appears above that number.
   */
  stats: [
    { prefix: '+', number: '5,633', label: 'Graduated Learners' },
    { prefix: '+', number: '81', label: 'Courses' },
    { prefix: '+', number: '130', label: 'Professors' },
    { prefix: '+', number: '1,447', label: 'Modules' },
    { prefix: '+', number: '10,398', label: 'Lectures' },
    { prefix: '+', number: '14', label: 'Accreditations' },
  ],

  why: {
    heading: 'Why professionals across the region choose ECC',
    body: 'Every question a working professional asks before enrolling — answered before you have to ask it.',
    items: [
      {
        title: 'Awards that travel',
        description:
          'Your degree is conferred by an accredited international institution, not by ECC alone — so it holds its value wherever your career takes you.',
      },
      {
        title: 'Built around a full-time job',
        description:
          'Fully online delivery with flexible study hours, designed for managers working across Egypt, the UAE, Saudi Arabia and the wider Gulf.',
      },
      {
        title: 'Credit for what you have already done',
        description:
          'Prior qualifications and senior work experience are assessed and can shorten your route to the award.',
      },
      {
        title: 'One advisor, start to finish',
        description:
          'A single point of contact takes you from eligibility check through to enrolment, with fees set out in writing up front.',
      },
    ],
  },

  about: {
    eyebrow: 'About ECC Knowledge Group',
    heading: 'A knowledge hub built for this region',
    body: 'We exist to make internationally recognised education reachable for the people who need it most — professionals across the MENA region who cannot put their careers on hold to earn a qualification.',
    mission:
      'We make globally recognised education more accessible across the MENA region through flexible academic programmes and innovative learning solutions.',
    vision:
      'To become the leading knowledge hub in the region — empowering learners, professionals and institutions through innovation, technology and internationally connected education.',
    values: [
      {
        title: 'Integrity',
        description: 'We act with transparency and responsibility in every decision.',
      },
      {
        title: 'Customer delight',
        description: 'We create learning experiences that exceed expectations.',
      },
      {
        title: 'Continuous learning',
        description: 'We believe growth never stops.',
      },
      {
        title: 'Innovation',
        description: 'We embrace creativity and forward-thinking solutions.',
      },
    ],
    ctaLabel: 'More about ECC',
    ctaHref: '/about-us',
  },

  video: {
    eyebrow: 'Inside ECC',
    heading: 'See what studying with ECC looks like',
    body: 'A short introduction to the group, our partner institutions and the people behind the programmes.',
    // Empty by design — the section stays hidden until a Vimeo link is set on
    // the Home global in the admin.
    url: '',
    poster: null,
  },

  ceo: {
    eyebrow: 'A word from our CEO',
    heading: 'Transforming dreams into degrees',
    message: [
      'Together, we are transforming education in the Middle East — empowering individuals to pursue their dreams and build brighter futures.',
      'Our mission is to provide affordable, globally recognised degrees that meet your unique needs. In just a few years we have become the largest educational group in the region — not only in numbers, but in the lives we touch and the communities we uplift.',
      'As we look ahead, we embrace a shared responsibility: to expand our reach across the MENA region with programmes that reflect our cultural values and the demands of our markets.',
      'Education is about fostering a community of lifelong learners ready to make a positive impact. Let us support one another on this journey, inspiring change and uplifting our communities.',
      'Thank you for being part of it. Together we can shape the future of education in the Arab world and empower the next generation of leaders.',
    ],
    name: 'Eng. Ayman El Malt',
    role: 'Chief Executive Officer, ECC Knowledge Group',
    photo: null,
  },

  cta: {
    heading: 'Your dreams are our mission',
    body: 'Tell us where you are in your career and an ECC advisor will come back with your eligibility, the fees and the next intake date — usually within one working day.',
    label: 'Apply now',
    href: '/contact',
  },
};

/**
 * Faculty are real, named people with photographs, so they are never seeded —
 * the section stays hidden until academic members are added in the admin.
 */
export const academicMembers: AcademicMember[] = [];

/**
 * Seeded team members — the board, the managers, the student network.
 *
 * Empty for the same reason as the faculty above: these are real, named people
 * with photographs, and inventing them would put a title on somebody who does
 * not hold it.
 */
export const teamMembers: Person[] = [];

/**
 * Seeded FAQs.
 *
 * These double as SEO surface: the homepage emits them as FAQPage structured
 * data, and each one targets a question prospective students actually search
 * for. Answers are deliberately concrete — vague answers convert nobody.
 */
export const faqs: FaqItem[] = [
  {
    id: 'seed-faq-recognition',
    question: 'Are ECC degrees recognised in Egypt and the Gulf?',
    answer:
      '<p>Your award is conferred by an accredited international institution — in Switzerland, the United Kingdom, Croatia, Malaysia or Denmark — and carries that institution’s recognition. Requirements for attesting or equivalating a foreign degree differ by country and by employer, so an ECC advisor will confirm what applies to your situation before you enrol.</p>',
  },
  {
    id: 'seed-faq-working',
    question: 'Can I study while working full time?',
    answer:
      '<p>Yes. Every programme is designed for working professionals. Study hours are flexible, lectures are available on demand, and assessment is built around applied projects you can base on your own organisation rather than fixed examination sittings.</p>',
  },
  {
    id: 'seed-faq-online',
    question: 'Are the programmes fully online?',
    answer:
      '<p>The BBA, MBA and DBA can be completed entirely online from anywhere in the region. Optional in-person workshops run in Dubai for students who want them, but they are never a requirement for the award.</p>',
  },
  {
    id: 'seed-faq-duration',
    question: 'How long does an MBA or DBA take?',
    answer:
      '<p>The MBA typically takes 18 to 24 months and the DBA 36 to 48 months. Recognised prior learning and senior work experience can shorten both. The BBA runs to 36 months.</p>',
  },
  {
    id: 'seed-faq-entry',
    question: 'What are the entry requirements?',
    answer:
      '<p>The MBA normally requires a bachelor’s degree and relevant professional experience; the DBA requires a master’s degree and significant senior experience. Where a formal qualification is missing, substantial management experience is assessed on its own merits — send us your CV and we will tell you where you stand.</p>',
  },
  {
    id: 'seed-faq-fees',
    question: 'What do the programmes cost, and can I pay in instalments?',
    answer:
      '<p>Fees vary by programme and awarding institution, and instalment plans are available. Every fee is set out in writing before you commit — there are no charges introduced later in the process.</p>',
  },
];

/**
 * The About Us page, as supplied by ECC.
 *
 * The partner, accreditation and testimonial cards on that page come from
 * their own collections; only the copy around them is here.
 */
export const aboutContent: AboutContent = {
  intro: {
    eyebrow: 'About us',
    heading: 'ECC Knowledge Group',
    body: [
      'ECC Knowledge Group is a distinguished business education organisation in the MENA region, headquartered in the UAE with a representative office in Egypt.',
      'We are a house of expertise in the education sector: an educational provider that makes international degrees from Switzerland, Malaysia, the UK, Croatia and Denmark reachable from this region.',
      'ECC Knowledge Group has emerged as a leading institution committed to providing high-quality education and promoting business development across the nations it works in.',
    ],
    image: null,
  },
  mission:
    'We make globally recognised education more accessible across the MENA region through flexible academic programmes and innovative learning solutions.',
  vision:
    'To become the leading knowledge hub in the region — empowering learners, professionals and institutions through innovation, technology and internationally connected education.',
  stats: [
    { icon: null, prefix: '+', number: '5,633', suffix: null, label: 'Courses' },
    { icon: null, prefix: '+', number: '81', suffix: null, label: 'Professors' },
    { icon: null, prefix: '+', number: '130', suffix: null, label: 'Accreditations' },
    { icon: null, prefix: '+', number: '14', suffix: null, label: 'Partners' },
  ],
  programmes: {
    heading: 'What you can study with ECC',
    body: 'Bachelor’s, master’s and doctoral degrees, plus executive certifications — each conferred by one of our partner institutions and supported in Dubai by ECC.',
  },
  network: {
    heading: 'Our partners & network',
    body: 'Since 2013, ECC Knowledge Group has maintained esteemed academic and strategic partnerships with prominent international awarding bodies and universities, including the International Business Academy of Switzerland (IBAS), VERN University and EAI Euro American Institute.',
  },
  recognition: {
    heading: 'Full accreditation & recognition',
    body: 'ECC Knowledge Group is a reliable gateway connecting learners with globally accredited universities and international awarding bodies, including QAHE, EAHEA, AAA and ACBSP. We do not issue certificates ourselves; our role is to facilitate access to internationally recognised programmes that blend academic excellence with global credibility. By acting as a trusted intermediary, ECC ensures that students earn qualifications that genuinely advance their careers and personal growth.',
  },
  ceremonies: {
    heading: 'Graduation ceremonies at ECC Knowledge Group',
    body: 'Celebrating achievement, academic excellence and global recognition — across Cairo, Switzerland and beyond. Bringing together graduates, faculty, families and distinguished guests, these occasions honour years of hard work while marking the beginning of new professional opportunities.',
    images: [],
    video: '',
    stats: [
      { icon: null, prefix: null, number: '5', suffix: '+', label: 'Ceremonies hosted' },
      { icon: null, prefix: null, number: '12', suffix: '+', label: 'Years of celebrations' },
      { icon: null, prefix: null, number: '3,200', suffix: '+', label: 'Graduates honoured' },
      { icon: null, prefix: null, number: '4', suffix: '+', label: 'Academic partners' },
    ],
    ctaLabel: 'Talk to an advisor',
    ctaHref: '/contact',
  },
  feedback: {
    heading: 'Student feedback',
    body: 'What graduates say about studying with ECC and its partner institutions.',
  },
};

export const contactContent: ContactContent = {
  intro: {
    eyebrow: 'Contact',
    heading: 'Talk to an advisor',
    body: [
      'Tell us where you are in your career and we will point you at the right programme, entry route and intake.',
      'Advisors answer enquiries in English and Arabic, and can arrange a call at a time that suits you.',
    ],
    hours: ['Sunday – Thursday · 9:00 – 18:00 (GST)', 'Friday & Saturday · closed'],
  },
  form: {
    heading: 'Send us a message',
    body: 'Include the programme you are interested in and your current qualifications, and an advisor will come back to you with entry requirements, fees and the next intake date.',
    slug: 'contact',
  },
  map: {
    heading: 'Find us',
    embedUrl: '',
  },
};

/**
 * Seeded forms.
 *
 * `npm run seed` creates an editable copy of each under Forms, and from then on
 * the CMS is the source. This is what renders before that happens — on a fresh
 * checkout with no database at all, and in the moment between deploying and
 * seeding. Anything submitted against a seeded form still needs a real form of
 * the same slug under Forms to be stored and delivered.
 */
/**
 * The institutions offered by the lead form's first select, and the programmes
 * offered by its second.
 *
 * Both are derived from the content above rather than typed out, for the same
 * reason `getForm` reads them from the CMS: a list of partners maintained by
 * hand is a list that is wrong the week after a partner is added. A programme's
 * group is the institution that awards it, which is what lets the second select
 * narrow to the first one's answer.
 */
const partnerChoices: FormChoice[] = partners.map((partner) => ({
  value: partner.name,
  group: '',
}));

const programmeChoices: FormChoice[] = programs.map((program) => ({
  value: program.title,
  group: program.partner?.name ?? '',
}));

export const forms: FormDefinition[] = [
  {
    slug: 'contact',
    title: 'Contact',
    intro: '',
    submitLabel: 'Send message',
    consent: 'We reply within one working day. Your details are never shared.',
    successMessage:
      'Thank you — your message has reached us. An advisor will reply within one working day.',
    redirectUri: '',
    fields: [
      {
        label: 'Full name',
        name: 'name',
        type: 'text',
        required: true,
        choices: [],
        placeholder: 'Layla Hassan',
        width: 'half',
      },
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        choices: [],
        placeholder: 'you@example.com',
        width: 'half',
      },
      {
        label: 'Phone',
        name: 'phone',
        type: 'tel',
        required: false,
        choices: [],
        placeholder: '+971 55 000 0000',
        width: 'half',
      },
      {
        label: 'Subject',
        name: 'subject',
        type: 'select',
        required: false,
        choices: [
          { value: 'Programme enquiry', group: '' },
          { value: 'Admissions and entry requirements', group: '' },
          { value: 'Fees and payment plans', group: '' },
          { value: 'Accreditation and recognition', group: '' },
          { value: 'Partnership enquiry', group: '' },
          { value: 'Something else', group: '' },
        ],
        placeholder: '',
        width: 'half',
      },
      {
        label: 'Message',
        name: 'message',
        type: 'textarea',
        required: true,
        choices: [],
        placeholder:
          'Tell us about the programme you are interested in and your current qualifications.',
        width: 'full',
      },
    ],
  },
  {
    slug: 'lead',
    title: 'Enquire',
    intro:
      'Tell us where to reach you and what you are considering. An advisor will come back with entry requirements, fees and the next intake date.',
    submitLabel: 'Request a call back',
    consent:
      'We reply within one working day. Your details are never shared.',
    successMessage:
      'Thank you — an advisor has your details and will be in touch within one working day.',
    redirectUri: '',
    fields: [
      {
        label: 'Full name',
        name: 'name',
        type: 'text',
        required: true,
        choices: [],
        placeholder: 'Layla Hassan',
        width: 'half',
      },
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        choices: [],
        placeholder: 'you@example.com',
        width: 'half',
      },
      {
        label: 'Phone',
        name: 'phone',
        type: 'tel',
        required: true,
        choices: [],
        placeholder: '+971 55 000 0000',
        width: 'half',
      },
      {
        label: 'Institution',
        name: 'institution',
        type: 'select',
        required: false,
        choices: partnerChoices,
        placeholder: 'Any institution',
        width: 'half',
      },
      {
        label: 'Programme',
        name: 'programme',
        type: 'select',
        required: false,
        choices: programmeChoices,
        placeholder: 'Any programme',
        width: 'full',
        filterBy: 'institution',
      },
    ],
  },
];

/**
 * The Our People page.
 *
 * Copy only. The people themselves are never seeded — they are real, named
 * individuals with photographs, and inventing them would put words in the
 * mouths of people who did not say them. Until they are added in the admin the
 * page renders its introduction and nothing else.
 */
/**
 * The academic staff directory.
 *
 * Copy only. The academics are never seeded — the specialisation filters are
 * built from whoever is actually published, so an empty directory offers no
 * filters rather than filters that lead nowhere.
 */
/**
 * The graduate stories page.
 *
 * Copy only. The films are testimonial posts carrying a video link; nothing
 * here invents a graduate or puts words in one's mouth.
 */
export const storiesContent: StoriesContent = {
  intro: {
    eyebrow: 'Graduate stories',
    heading: 'Hear it from our graduates',
    body: 'Short films from people who studied with ECC while working — what they took on, what changed, and what they would tell someone deciding now.',
  },
  perPage: 12,
};

/**
 * The FAQ page's own copy. The questions themselves are FAQ posts, shared with
 * the homepage section, so an answer is written once and appears in both.
 */
export const faqPageContent: FaqContent = {
  intro: {
    eyebrow: 'Questions',
    heading: 'Before you enrol',
    body: 'The things prospective students ask us most — recognition, studying around a job, entry requirements and what an award actually costs.',
  },
};

/** The accreditations page's own copy. The bodies are accreditation posts. */
export const recognitionContent: RecognitionContent = {
  intro: {
    eyebrow: 'Accreditations & recognition',
    heading: 'Credentials you can verify',
    body: 'ECC awards are conferred under the institutional accreditation of our partners. Every badge below links to the body that issued it, so you can check the claim rather than take it on trust.',
  },
};

/**
 * The video gallery.
 *
 * Copy only, and no films. A gallery is real footage of real events, and there
 * is nothing to stand in for it — an invented ceremony would be a claim about
 * something that did not happen. Until videos are published the page shows its
 * introduction and says so.
 */
export const galleryContent: GalleryContent = {
  intro: {
    eyebrow: 'Video gallery',
    heading: 'ECC on film',
    body: 'Graduations and ceremonies, seminars and podcasts, visits, community work and the life of the group — filter by what you came to watch.',
  },
  perPage: 12,
};

export const galleryVideos: GalleryVideo[] = [];

/**
 * The podcasts page.
 *
 * Copy only. A show is real recordings of real conversations; there is nothing
 * to stand in for one, so until a podcast is published the page renders its
 * introduction and says an episode is coming.
 */
export const podcastContent: PodcastContent = {
  intro: {
    eyebrow: 'Podcasts',
    heading: 'Conversations worth the commute',
    body: 'Long-form conversations with the academics who teach our programmes and the people who have taken them — on careers, on study, and on what a qualification is actually for.',
  },
};

export const podcasts: Podcast[] = [];

/**
 * The fees page.
 *
 * Supplied copy, seeded verbatim: unlike the pages whose content is real
 * people or real footage, this is writing, and writing is exactly what a
 * fallback is for. No amounts appear here or in the fields behind it — prices
 * differ by programme and by intake, and a number in a shared page is a number
 * nobody remembers to change.
 */
export const feesContent: FeesContent = {
  intro: {
    eyebrow: 'Fees & Tuition',
    heading: 'A transparent investment in your future',
    body: 'Clear pricing, flexible payment plans, and dedicated student support — so you can focus on what matters: your education.',
  },
  highlights: [
    'Flexible Payments',
    'Transparent Fees',
    'Global Programs',
    'Student Support',
    'Installment Plans',
    'All-Inclusive Tuition',
  ],
  breakdown: {
    heading: 'Every fee, fully explained',
    body: 'No surprises. Open each category to see exactly what is included.',
    items: [
      {
        title: 'Tuition Fees',
        description:
          'Cover the full curriculum, learning materials, and access to the Learning Management System (LMS).',
      },
      {
        title: 'Registration Fee',
        description:
          'A one-time payment to confirm admission and secure your study seat.',
      },
      {
        title: 'Administrative Fees',
        description:
          'Include academic support, student services, and file management.',
      },
      {
        title: 'Additional Charges (if applicable)',
        description:
          'Such as re-examination fees, courier services, or extra certificate copies.',
      },
    ],
  },
  quote:
    'Education is the most valuable investment you’ll ever make in your future — and we’re honored to be part of yours.',
  payments: {
    heading: 'Pay your way, on your schedule',
    body: 'Settle in full or spread the cost — whichever fits the year you are having.',
    items: [
      {
        title: 'Full Payment',
        description:
          'Pay tuition in full at enrollment and receive a 5% early-settlement discount.',
      },
      {
        title: 'Installments',
        description:
          'Spread tuition across 3, 6, or 12 monthly installments with zero interest.',
      },
      {
        title: 'Payment Methods',
        description:
          'Bank transfer, credit card, or approved education financing partners.',
      },
    ],
  },
  value: {
    heading: 'The value of your investment',
    body: 'When you pay your fees, you are not just enrolling in a program; you are investing in your future:',
    points: [
      'A globally recognized qualification that enhances international career prospects.',
      'High-quality teaching delivered by expert professors and industry leaders.',
      'Continuous academic and administrative support throughout your study journey.',
    ],
  },
  refund: {
    heading: 'Refund policy',
    body: 'The questions we are asked most, answered in full.',
    questions: [
      {
        question: 'Can I get a refund?',
        answer:
          'Yes. Refund eligibility depends on the timing of your withdrawal request and the program you’re enrolled in. Requests submitted within 14 days of enrollment qualify for a full refund minus the registration fee.',
      },
      {
        question: 'What are the partial refund rules?',
        answer:
          'After the initial 14-day window, partial refunds are calculated on a prorated basis according to the completed portion of the term. Full details are outlined in your enrollment agreement.',
      },
      {
        question: 'How long does processing take?',
        answer:
          'Approved refunds are processed within 21 business days and returned via the original payment method.',
      },
      {
        question: 'Are registration fees refundable?',
        answer:
          'Registration fees are non-refundable as they cover administrative processing already completed at the time of enrollment.',
      },
    ],
  },
};

/**
 * The social responsibility page.
 *
 * Supplied copy, seeded verbatim. The photograph and the film of the People
 * Hospital partnership are real assets rather than writing, so they are left
 * for the CMS: the section renders without them, and inventing a stand-in for
 * a real partnership would be inventing the partnership.
 */
export const socialContent: SocialContent = {
  intro: {
    eyebrow: 'Social responsibility',
    heading: 'Our commitment to responsible education',
    body: 'Building knowledge with integrity. Empowering leaders with purpose. Shaping a more responsible future for business education across the region.',
  },
  tags: [
    'Corporate Social Responsibility',
    'Educational Philosophy',
    'Governance',
  ],
  quote:
    'We believe education is not simply a service — it is a responsibility to empower future leaders and reshape the knowledge landscape of the region.',
  pillars: {
    eyebrow: 'Three strategic pillars',
    heading: 'The foundations of our work',
    body: 'Every program, partnership and policy at ECC rests on three commitments we hold without exception.',
    items: [
      {
        title: 'Responsible Education',
        description:
          'Designing future-focused programs aligned with global workforce needs.',
      },
      {
        title: 'Strategic Governance',
        description:
          'Building trusted international partnerships through transparency and accountability.',
      },
      {
        title: 'Human-Centered Culture',
        description:
          'Empowering the next generation of leaders through inclusive learning environments.',
      },
    ],
  },
  ecosystem: {
    eyebrow: 'The ecosystem',
    heading: 'Stakeholders we serve',
    body: 'ECC sits at the intersection of five communities. Each one shapes — and is shaped by — the knowledge we create.',
    items: [
      {
        title: 'Learners',
        description: 'Our focus, and the basis of our professional goal.',
      },
      {
        title: 'Academic Body',
        description: 'Our partners in knowledge transfer and skills development.',
      },
      {
        title: 'Business Community',
        description:
          'The artery of development for which we are preparing leadership cadres.',
      },
      {
        title: 'Academic Partners',
        description:
          'Our allies in quality assurance and international recognition.',
      },
      {
        title: 'Alumni',
        description:
          'Ambassadors of our success, and future leaders in their sectors.',
      },
    ],
  },
  initiative: {
    eyebrow: 'Featured initiative',
    heading:
      'A strategic partnership carrying 30 scholarships for healthcare workers',
    body: 'This partnership provides 30 scholarships dedicated to the employees of People Hospital, a non-profit health institution, with the aim of qualifying its staff academically and practically to reach higher leadership levels.',
    figure: '30',
    figureLabel: 'scholarships',
    image: null,
    video: '',
  },
};

/**
 * The graduation ceremonies page.
 *
 * Supplied copy, seeded verbatim. Photographs and films are real records of
 * real events, so they are left for the CMS — every section that needs one
 * renders without it rather than showing a placeholder of a ceremony that has
 * a placeholder for a photograph.
 *
 * The four figures pair the numbers with the labels as they read most
 * plausibly; the source they came from had them interleaved, and 3,200
 * academic partners is not a claim anybody meant to make. Worth confirming
 * before this goes live.
 */
export const ceremonyContent: CeremonyContent = {
  intro: {
    eyebrow: 'Graduation ceremonies',
    heading: 'Graduation ceremonies at ECC Knowledge Group',
    body: 'Celebrating achievement, academic excellence, and global recognition — across Cairo, Switzerland, and beyond.',
  },
  stats: [
    { icon: null, prefix: null, number: '5', suffix: '+', label: 'Years of celebrations' },
    { icon: null, prefix: null, number: '3,200', suffix: '+', label: 'Graduates honored' },
    { icon: null, prefix: null, number: '12', suffix: '+', label: 'Academic partners' },
    { icon: null, prefix: null, number: '4', suffix: null, label: 'Ceremonies held' },
  ],
  legacy: {
    eyebrow: 'Our legacy',
    heading: 'A legacy of celebrating success',
    body: 'Our previous ceremonies in Switzerland (2025) and Cairo (2025) brought together hundreds of graduates and academic representatives from international partner universities.',
    points: [
      'Official graduation recognition',
      'International academic partners',
      'Graduate success stories',
      'Media coverage',
      'Networking opportunities',
    ],
    image: null,
  },
  timeline: {
    eyebrow: 'The journey',
    heading: 'Graduation timeline',
    body: 'Three milestones, two continents, one growing community of accomplished leaders.',
    items: [
      {
        status: 'completed',
        year: '2025',
        place: 'Cairo, Egypt',
        description:
          'A landmark celebration honoring BBA, MBA and DBA graduates with regional academic leaders.',
      },
      {
        status: 'completed',
        year: '2025',
        place: 'Switzerland',
        description:
          'An alpine ceremony bringing together international partners and graduating cohorts.',
      },
      {
        status: 'upcoming',
        year: '2026',
        place: 'Switzerland',
        description:
          'Our largest ceremony to date — uniting MBA and DBA graduates from across the globe.',
      },
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    heading: 'Moments that matter',
    images: [],
  },
  films: {
    eyebrow: 'Video highlights',
    heading: 'Relive the celebration',
    items: [],
  },
  highlights: {
    eyebrow: 'What to expect',
    heading: 'Ceremony highlights',
    items: [
      {
        title: 'Academic Panels',
        description:
          'Thought-leading sessions led by global faculty and industry pioneers.',
      },
      {
        title: 'Student Recognition',
        description:
          'Honoring distinguished graduates with awards for academic excellence.',
      },
      {
        title: 'Partner Speeches',
        description:
          'Keynote addresses from our international academic partner universities.',
      },
      {
        title: 'Networking Sessions',
        description:
          'Curated meet-ups connecting graduates, alumni, faculty, and recruiters.',
      },
    ],
  },
  next: {
    eyebrow: 'Switzerland graduation',
    heading: 'Ceremony 2026',
    body: 'This year’s ceremony will bring together graduates from MBA and DBA programs in a prestigious academic celebration attended by partners, families, and international representatives.',
    image: null,
    facts: [
      { label: 'Location', value: 'Switzerland' },
      { label: 'Date', value: '30 August 2026' },
      { label: 'Cohort', value: 'BBA, MBA & DBA' },
      { label: 'Scope', value: 'International' },
    ],
    agenda: [
      { time: '09:00', item: 'Registration & welcome' },
      { time: '10:00', item: 'Opening ceremony' },
      { time: '11:00', item: 'University partner speeches' },
      { time: '12:00', item: 'Certificate awards' },
      { time: '13:00', item: 'Networking session' },
      { time: '14:30', item: 'Gala lunch & closing' },
    ],
  },
  cta: {
    heading: 'Join the celebration',
    body: 'Recognizing your dedication, achievement, and future success. Reserve your seat at the next ECC ceremony.',
  },
};

export const staffContent: StaffContent = {
  intro: {
    eyebrow: 'Academic staff',
    heading: 'Our academic staff',
    body: 'The academics who write, teach and assess our programmes — filter by what they specialise in, or read a full profile.',
  },
  perPage: 12,
};

export const peopleContent: PeopleContent = {
  intro: {
    eyebrow: 'Our people',
    heading: 'Meet the people behind ECC',
    body: 'The board, the managers and the academics who shape our academic direction and teach the programmes — and the student network that connects them.',
  },
  teams: [
    { label: 'Board Members', description: '' },
    { label: 'Our Managers', description: '' },
    { label: 'Academic Team', description: '' },
    { label: 'Global Student Network', description: '' },
  ],
};
