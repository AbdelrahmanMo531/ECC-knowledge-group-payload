/**
 * The words the site says for itself.
 *
 * Everything an editor writes lives in WordPress and is translated with
 * Polylang. This is the rest — the chrome that no editor authors: button
 * labels, the words on a lightbox's controls, what a search box says when it
 * finds nothing. Those cannot come from the CMS, because they exist whether or
 * not anyone has written a page yet.
 *
 * Keys are grouped by where the words appear rather than by what they say, so
 * a component's strings sit together and a missing one is obvious.
 *
 * The Arabic is Modern Standard Arabic, written to be read by the same person
 * the English is written for. It should be reviewed by a native speaker before
 * launch — translation is the one part of this that cannot be verified by a
 * test.
 */

import type { Locale } from './config';

export const DICTIONARY = {
  en: {
    /* -------------------------------------------------------- site chrome */
    'nav.skip': 'Skip to content',
    'nav.home': 'ECC Knowledge Group — home',
    'nav.menu.open': 'Open menu',
    'nav.menu.close': 'Close menu',
    'nav.language': 'Language',
    'nav.language.choose': 'Choose a language',
    'crumb.home': 'Home',
    'blog.page': 'Page {n}',
    'blog.category': 'Articles in {name}',
    'blog.readTime': '{n} min read',

    /* --------------------------------------------------- calls to action */
    'cta.apply': 'Apply now',
    'cta.enquire': 'Apply or enquire',
    'cta.contact': 'Contact us',
    'cta.advisor': 'Speak to an advisor',
    'cta.advisor.ask': 'Ask an advisor',
    'cta.whatsapp': 'WhatsApp an advisor',
    'cta.prospectus': 'Request the prospectus',
    'cta.programmes': 'Explore the programmes',
    'cta.programmes.all': 'All programmes',
    'cta.insights.all': 'All insights',
    'cta.profile': 'Full profile',
    'cta.verify': 'Verify',
    'cta.reply': 'Typical reply within one working day',

    /* ----------------------------------------------------------- the form */
    'form.submit': 'Send message',
    'form.thanks': 'Thank you — your message has reached us.',
    'form.sending': 'Sending…',
    'form.sent': 'Message sent',
    'form.required': 'Required',
    'form.check': 'Please check the highlighted fields.',
    'form.choose': 'Choose one…',
    'form.choose.parent': 'Choose an option above first…',
    'form.choose.empty': 'Nothing listed for that choice',
    'form.close': 'Close the form',
    'form.advisor': 'Speak to an advisor',
    'form.failed':
      'Something went wrong sending your message. Please try again, or email us directly and we will pick it up.',
    'form.unconnected':
      'The form is not connected to a mailbox yet. Please email us directly and we will pick it up.',
    'form.throttled':
      'That is a few messages in a short time. Please try again later, or email us directly.',

    /* --------------------------------- what a form says was wrong with it */
    'form.error.required': '{field} is required.',
    'form.error.tick': 'Please tick "{field}".',
    'form.error.long': 'Please keep {field} under {max} characters.',
    'form.error.listed': 'Please choose from the options listed.',
    'form.error.choice': 'Please choose one of the options.',
    'form.error.filtered': 'That is not offered by the institution selected above.',
    'form.error.email': 'That does not look like an email address.',
    'form.error.tel': 'Please enter a phone number we can call, or leave it empty.',
    'form.error.number': 'Please enter a number.',
    'form.error.url': 'Please enter a full web address, starting with https://',

    /* ------------------------------------------------------- the lightbox */
    'video.watch': 'Watch the film',
    'video.close': 'Close the video',
    'video.previous': 'Previous story',
    'video.next': 'Next story',
    'video.share': 'Share',
    'video.share.copied': 'Copied',
    'video.share.link': 'Link to this video',
    'video.of': 'of',

    'photo.close': 'Close the photograph',
    'photo.previous': 'Previous',
    'photo.next': 'Next',

    /* --------------------------------------------------------- the player */
    'player.play': 'Play',
    'player.pause': 'Pause',
    'player.previous': 'Previous episode',
    'player.next': 'Next episode',
    'player.back': 'Back 15 seconds',
    'player.forward': 'Forward 30 seconds',
    'player.speed': 'Playback speed',
    'player.mute': 'Mute',
    'player.unmute': 'Unmute',
    'player.volume': 'Volume',
    'player.fullscreen': 'Full screen',
    'player.loading': 'Loading…',
    'player.seek': 'Seek within',
    'player.search': 'Search episodes…',
    'player.search.none': 'No episode matches',
    'player.episode': 'Episode',
    'player.channel': 'Watch the channel',

    /* -------------------------------------------------------- collections */
    'list.filter.category': 'Filter by category',
    'list.filter.specialisation': 'Filter by specialisation',
    'list.filter.all': 'All',
    'list.previous': 'Previous',
    'list.next': 'Next',
    'list.page': 'page',
    'list.of': 'of',
    'list.video': 'video',
    'list.videos': 'videos',
    'list.story': 'story',
    'list.stories': 'stories',
    'list.episode': 'episode',
    'list.episodes': 'episodes',
    'list.empty': 'Nothing published here yet',

    /* ------------------------ the words on the pages the app writes itself */
    'page.programs.eyebrow': 'Programmes',
    'page.programs.title': 'Study with ECC Knowledge Group',
    'page.programs.body':
      'From a first degree to a professional doctorate, every programme is conferred by an accredited partner institution and delivered around a working schedule.',
    'page.programs.all': 'All programmes',
    'page.programs.pathway': 'Choose your pathway',
    'page.programs.pathway.body':
      'Each listing states the awarding body, the study mode and the time commitment up front.',

    'page.partners.eyebrow': 'Academic partners',
    'page.partners.title': 'The institutions behind our awards',
    'page.partners.body':
      'ECC does not award its own degrees. Every qualification is conferred by a partner institution, each with its own accreditation and academic governance.',

    'page.insights.eyebrow': 'Insights',
    'page.insights.title': 'News and guidance',
    'page.insights.body':
      'Admissions guidance, partner announcements and perspectives on professional education across the Gulf.',

    /* --------------------------------------- headings inside other pages */
    'section.values': 'Our values',
    'section.about.more': 'More about us',
    'section.awarded.by': 'Accredited & awarded by',
    'section.degrees.from': 'Degrees awarded from',
    'section.agenda': 'Event agenda',
    'section.programme': 'Programme',
    'section.outcomes': 'Programme learning outcomes',
    'section.careers.body': 'Roles graduates move into across industries.',
    'section.majors.eyebrow': 'Degree majors',
    'section.majors.title': 'Choose your focus area',
    'section.majors.body':
      'Full details for this major are available from an ECC advisor — ask us for the module handbook and current intake dates.',
    // Sentences with a value in them. One string per language, not a sentence
    // built by concatenation: Arabic puts the value somewhere else in the
    // clause and wants different words around it.
    'section.majors.count':
      'This programme offers {count} specialisations. Pick one to see what it covers — the degree awarded is the same whichever you choose.',
    'section.why.with': 'Why study this programme with {awarder}?',
    'section.recognition.of':
      'The bodies that accredit {partner} and make its awards portable beyond the country that issues them.',
    'section.partner.more': 'More about {partner}',
    'section.partner.delivered':
      'Taught and supported in Dubai by {site}; the award itself is conferred by {partner}.',
    'aria.map.of': 'Map showing {place}',
    'aria.map.office': 'the ECC Knowledge Group office',
    // Counts. Arabic has no one-or-many split of the English kind, so the
    // count is a value inside a whole sentence rather than a word chosen by a
    // ternary in the markup.
    'list.academics.count': '{count} academics',
    'list.academics.count.one': '1 academic',
    'list.academics.in': '{count} in {specialisation}',
    'list.page.of': 'page {current} of {total}',
    'section.partner.about': 'About the partner',
    'section.partner.programmes': 'Programmes you can study with ECC',
    'section.partner.awarded': 'Awarded by this partner',

    'section.board.eyebrow': 'Academic board',
    'section.board.title': 'Taught by people who have done the work',
    'section.recognition': 'Accreditations & recognition',
    'section.recognition.long': 'Accreditation & international recognition',
    'section.recognition.title': 'Independently recognised',
    'section.voices': 'Student voices',
    'section.why': 'Why ECC',
    'section.why.here': 'Why here',
    'section.who': 'Who we are',
    'section.house': 'A house of expertise',
    'fees.what': 'What you pay for',
    'fees.payments': 'Payment options',
    'fees.value': 'Why it is worth it',
    'fees.refunds': 'Refund policy',
    'fees.ask': 'Want the figure for a specific programme?',

    'section.partners.recognition': 'Recognition held by our partners',
    'section.partners.recognition.body':
      'Every ECC award is conferred by a partner institution under its own accreditation. Those bodies accredit the institution rather than ECC, so they are listed on each partner’s page alongside the programmes they cover.',
    'section.news.title': 'Latest from ECC',
    'section.news.body':
      'Admissions guidance, partner announcements and perspectives on professional education across the region.',
    'section.video.lazy': 'The Vimeo player loads only when you press play.',
    'section.ceo.sign': 'Your dreams are our mission.',

    /* ------------------------------------------------- links and buttons */
    'link.programmes.see': 'See the programmes',
    'link.institution': 'Visit the institution',
    'link.website': 'Website',
    'link.compare': 'Compare programmes',
    'link.map': 'Open in Google Maps',
    'link.eligibility': 'Check my eligibility',
    'link.deciding': 'Still deciding?',
    'link.deciding.short':
      'Still deciding? Send your CV and we will tell you which programmes you are eligible for.',
    'faq.eyebrow': 'Questions',
    'faq.title': 'Before you enrol',
    'faq.body':
      'The things prospective students ask us most. If yours is not here, an advisor will answer it directly.',
    'link.deciding.body':
      'Send your CV and we will tell you which programmes you are eligible for, and what each one would cost.',
    'link.advisor.talk': 'Talk to an advisor',
    'link.ceremony': 'Watch a ceremony',

    'fact.level': 'Level',
    'fact.credits': 'Credits',
    'fact.duration': 'Duration',
    'fact.mode': 'Study mode',
    'fact.language': 'Language',
    'fact.country': 'Country',
    'fact.levels.awarded': 'Levels awarded',

    /* ------------------------------------ the tabs down a long page */
    'tab.who': 'Who we are',
    'tab.figures': 'Figures',
    'tab.programmes': 'Programmes',
    'tab.partners': 'Partners',
    'tab.accreditation': 'Accreditation',
    'tab.ceremonies': 'Ceremonies',
    'tab.feedback': 'Feedback',
    'tab.enquire': 'Enquire',
    'tab.overview': 'Overview',
    'tab.why': 'Why here',
    'tab.structure': 'Structure',
    'tab.curriculum': 'Curriculum',
    'tab.majors': 'Degree majors',
    'tab.apply': 'Apply',

    'section.mission': 'Our mission',
    'section.vision': 'Our vision',
    'section.mission.short': 'Mission',
    'section.values.short': 'Values',
    'section.milestones': 'Milestones',
    'section.qualifications': 'Qualifications',
    'section.follow': 'Follow',
    'section.curriculum': 'Curriculum',
    'section.structure': 'Programme structure',
    'section.core': 'Core modules',
    'section.structure.body':
      'What you study, stage by stage, with the credit value of every module.',
    'section.structure.body.units':
      'What you study, year by year. Open any unit for its objectives and learning outcomes.',
    'section.modules.body':
      'Every module on the programme, with its credit value and level.',
    'section.core.body':
      'Taken by every student on the programme, whichever major they choose.',
    'section.core.body.short':
      'The modules every student on the programme takes.',
    'section.also.taught': 'Also taught',
    'aria.photograph': 'Photograph',
    'meta.programmes': 'Programmes',
    'schema.awarded.by': 'Programmes awarded by {partner}',
    'mail.prospectus': 'Prospectus request — {programme}',
    'meta.home.title':
      'Globally Recognised BBA, MBA & DBA Degrees Online | ECC Knowledge Group',
    'meta.home.description':
      'Earn an internationally accredited BBA, MBA or DBA from partner institutions in Switzerland, the UK, Croatia, Malaysia and Denmark. Study online with flexible hours across Egypt and the Gulf.',
    'meta.contact.description':
      'Speak to an ECC Knowledge Group advisor in Dubai about programmes, entry requirements, fees and intake dates.',
    'meta.partners.title': 'Partners',
    'meta.insights.title': 'Insights',
    'photo.position': '{current} of {total}',
    'meta.contact': 'Contact',
    'meta.about': 'About Us',
    'section.major': 'Major',
    'section.module': 'Module',
    'section.verify.title': 'Credentials you can verify',
    'section.verify.body':
      'ECC awards are conferred under the institutional accreditation of our partners. Every programme page states exactly who confers the award.',
    'section.partners.title': 'Global institutions, delivered locally',
    'section.partners.body':
      'ECC works with accredited universities and institutes across Europe, Asia and the Gulf so that a qualification earned in Dubai carries weight everywhere.',
    'section.grid.title': 'Qualifications that travel with you',
    'section.grid.body':
      'Every ECC programme is delivered with an international partner institution and built around the realities of working in the Gulf.',
    'section.grid.home.title': 'Choose the qualification that fits where you are',
    'section.grid.home.body':
      'Every route leads to an internationally recognised award, conferred by an accredited partner institution and delivered around a working schedule.',
    'section.board.body':
      'Our faculty combine doctoral research with senior industry practice, so what you study on Monday is usable at work on Tuesday.',
    'section.voices.title': 'What our graduates say',
    'section.people.meet': 'Meet our people',
    'section.academics.meet': 'Meet the academic team',
    'section.voices.all': 'Read more graduate stories',
    'section.brochure': 'Download brochure',
    'section.teams.academic': 'Academic Team',
    'section.teams.ours': 'Our Team',

    /* ------------------------------ names for things a screen reader reads */
    'aria.nav.primary': 'Primary',
    'aria.footer.legal': 'Legal',
    'aria.teams': 'Teams',
    'aria.shows': 'Shows',
    'aria.stakeholders': 'Stakeholders',
    'aria.accreditations': 'Accreditations',
    'aria.explore': 'Explore',

    'footer.about':
      'Internationally accredited business and management qualifications, delivered from Dubai across the MENA region.',
    'footer.rights': '© {year} {site}. All rights reserved.',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.office': 'Office',
    'cta.panel.title': 'Ready to take the next step?',
    'cta.panel.body':
      'Speak to an ECC advisor about entry requirements, fees and intake dates — or request the full programme prospectus.',
    'meta.faculty': '{who}. Faculty at {site}.',
    'meta.faculty.at': ' at {where}',
    'meta.programs':
      'Internationally accredited bachelor, master, doctorate and executive programmes delivered from Dubai with ECC Knowledge Group partner institutions.',
    'meta.partners':
      'ECC Knowledge Group partners with IBAS Switzerland, VERN University Croatia, CMI in the United Kingdom and Genovasi d.school Malaysia.',
    'meta.insights':
      'News, guidance and analysis from ECC Knowledge Group on postgraduate study, accreditation and professional development in the MENA region.',

    /* ----------------------------------------- when a page is not there */
    'notfound.page': 'Page not found',
    'notfound.article': 'Article not found',
    'notfound.partner': 'Partner not found',
    'notfound.programme': 'Programme not found',
    'notfound.person': 'Not found',
    'notfound.academics': 'No academics published yet.',

    /* ------------------------------ names for things a screen reader reads */
    'aria.sections': 'Page sections',
    'aria.nav.mobile': 'Primary (mobile)',
    'aria.pages.academics': 'Pages of academics',
    'aria.pages.stories': 'Pages of graduate stories',
    'aria.specialisations.all': 'All specialisations',
    'aria.hours': 'Office hours',
    'aria.contact': 'Get in touch',

    /* -------------------------------------- when there is nothing to show */
    'empty.faq':
      'Questions are being added here shortly. In the meantime, ask an advisor anything —',
    'empty.people':
      'Our team is being added here shortly. In the meantime, an advisor can put you in touch with the right person —',
    'empty.staff':
      'Our academics are being added here shortly. In the meantime, an advisor can tell you who teaches what —',
    'empty.stories':
      'Graduate films are being added here shortly. In the meantime, an advisor can put you in touch with someone who has taken the programme you are considering —',
    'empty.videos':
      'Films are being added here shortly. In the meantime, an advisor can send whatever you were looking for —',
    'empty.podcast':
      'The first episode is on its way. Tell us what you would like to hear and we will pass it to the producers —',
    'empty.accreditations':
      'Our accreditations are being added here shortly. An advisor can send the current documentation —',
    'empty.insights': 'No articles published yet',
    'empty.insights.body':
      'Posts published in the ECC WordPress admin appear here automatically.',

    /* ---------------------------------------------------------- programmes */
    'programme.about': 'About this programme',
    'programme.glance': 'At a glance',
    'programme.credits': 'Credits',
    'programme.credits.total': 'Total credits',
    'programme.outcomes': 'Learning outcomes',
    'programme.careers': 'Career opportunities',
    'programme.modules': 'Specialisation modules',
    'programme.awarded': 'Awarded by',
    'programme.accredited': 'Accredited & awarded by',

    /* ------------------------------------------------------------- people */
    'people.qualifications': 'Qualifications',
    'people.experience': 'Professional experience',
    'people.research': 'Research interests',
    'people.teaching': 'Teaching subjects',
    'people.linkedin': 'View LinkedIn profile',

    /* ------------------------------------------------------------- errors */
    'error.404': 'Error 404',
    'error.404.title': 'We couldn’t find that page',
    'error.404.body':
      'The page may have moved, or the link may be out of date. Our programmes and contact details are a click away.',
    'error.home': 'Back to home',
    'error.programmes': 'Browse programmes',
  },

  ar: {
    /* -------------------------------------------------------- site chrome */
    'nav.skip': 'تخطَّ إلى المحتوى',
    'nav.home': 'مجموعة إي سي سي المعرفية — الرئيسية',
    'nav.menu.open': 'فتح القائمة',
    'nav.menu.close': 'إغلاق القائمة',
    'nav.language': 'اللغة',
    'nav.language.choose': 'اختر اللغة',
    'crumb.home': 'الرئيسية',
    'blog.page': 'الصفحة {n}',
    'blog.category': 'مقالات في {name}',
    'blog.readTime': 'قراءة {n} دقائق',

    /* --------------------------------------------------- calls to action */
    'cta.apply': 'قدّم الآن',
    'cta.enquire': 'قدّم أو استفسر',
    'cta.contact': 'تواصل معنا',
    'cta.advisor': 'تحدّث إلى مستشار',
    'cta.advisor.ask': 'اسأل مستشارًا',
    'cta.whatsapp': 'تواصل عبر واتساب',
    'cta.prospectus': 'اطلب دليل البرامج',
    'cta.programmes': 'استكشف البرامج',
    'cta.programmes.all': 'كل البرامج',
    'cta.insights.all': 'كل المقالات',
    'cta.profile': 'الملف الكامل',
    'cta.verify': 'تحقّق',
    'cta.reply': 'نردّ عادةً خلال يوم عمل واحد',

    /* ----------------------------------------------------------- the form */
    'form.submit': 'إرسال الرسالة',
    'form.thanks': 'شكرًا لك — وصلتنا رسالتك.',
    'form.sending': 'جارٍ الإرسال…',
    'form.sent': 'تم إرسال رسالتك',
    'form.required': 'مطلوب',
    'form.check': 'يرجى مراجعة الحقول المحدّدة.',
    'form.choose': 'اختر…',
    'form.choose.parent': 'اختر من الحقل أعلاه أولًا…',
    'form.choose.empty': 'لا توجد خيارات لهذا الاختيار',
    'form.close': 'إغلاق النموذج',
    'form.advisor': 'تحدّث إلى مستشار',
    'form.failed':
      'تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى، أو مراسلتنا مباشرة وسنتابعها.',
    'form.unconnected':
      'لم يُربط هذا النموذج بصندوق بريد بعد. يرجى مراسلتنا مباشرة وسنتابعها.',
    'form.throttled':
      'هذه رسائل كثيرة في وقت قصير. يرجى المحاولة لاحقًا، أو مراسلتنا مباشرة.',

    /* --------------------------------- what a form says was wrong with it */
    'form.error.required': 'حقل {field} مطلوب.',
    'form.error.tick': 'يرجى تحديد «{field}».',
    'form.error.long': 'يرجى ألّا يتجاوز {field} {max} حرفًا.',
    'form.error.listed': 'يرجى الاختيار من الخيارات المتاحة.',
    'form.error.choice': 'يرجى اختيار أحد الخيارات.',
    'form.error.filtered': 'هذا الخيار غير متاح لدى الجهة المختارة أعلاه.',
    'form.error.email': 'هذا لا يبدو بريدًا إلكترونيًا صحيحًا.',
    'form.error.tel': 'يرجى إدخال رقم هاتف يمكننا الاتصال به، أو تركه فارغًا.',
    'form.error.number': 'يرجى إدخال رقم.',
    'form.error.url': 'يرجى إدخال عنوان ويب كامل يبدأ بـ https://',

    /* ------------------------------------------------------- the lightbox */
    'video.watch': 'شاهد الفيلم',
    'video.close': 'إغلاق الفيديو',
    'video.previous': 'القصة السابقة',
    'video.next': 'القصة التالية',
    'video.share': 'مشاركة',
    'video.share.copied': 'تم النسخ',
    'video.share.link': 'رابط هذا الفيديو',
    'video.of': 'من',

    'photo.close': 'إغلاق الصورة',
    'photo.previous': 'السابق',
    'photo.next': 'التالي',

    /* --------------------------------------------------------- the player */
    'player.play': 'تشغيل',
    'player.pause': 'إيقاف مؤقت',
    'player.previous': 'الحلقة السابقة',
    'player.next': 'الحلقة التالية',
    'player.back': 'رجوع ١٥ ثانية',
    'player.forward': 'تقدّم ٣٠ ثانية',
    'player.speed': 'سرعة التشغيل',
    'player.mute': 'كتم الصوت',
    'player.unmute': 'إلغاء الكتم',
    'player.volume': 'مستوى الصوت',
    'player.fullscreen': 'ملء الشاشة',
    'player.loading': 'جارٍ التحميل…',
    'player.seek': 'التنقّل داخل',
    'player.search': 'ابحث في الحلقات…',
    'player.search.none': 'لا توجد حلقة مطابقة',
    'player.episode': 'الحلقة',
    'player.channel': 'شاهد القناة',

    /* -------------------------------------------------------- collections */
    'list.filter.category': 'التصفية حسب الفئة',
    'list.filter.specialisation': 'التصفية حسب التخصص',
    'list.filter.all': 'الكل',
    'list.previous': 'السابق',
    'list.next': 'التالي',
    'list.page': 'صفحة',
    'list.of': 'من',
    'list.video': 'فيديو',
    'list.videos': 'فيديو',
    'list.story': 'قصة',
    'list.stories': 'قصة',
    'list.episode': 'حلقة',
    'list.episodes': 'حلقة',
    'list.empty': 'لا يوجد محتوى منشور هنا بعد',

    /* ------------------------ the words on the pages the app writes itself */
    'page.programs.eyebrow': 'البرامج',
    'page.programs.title': 'ادرس مع مجموعة إي سي سي المعرفية',
    'page.programs.body':
      'من الدرجة الجامعية الأولى إلى الدكتوراه المهنية، تُمنح كل برامجنا من مؤسسة شريكة معتمدة، وتُقدَّم بما يتناسب مع جدول العمل.',
    'page.programs.all': 'كل البرامج',
    'page.programs.pathway': 'اختر مسارك',
    'page.programs.pathway.body':
      'يذكر كل برنامج الجهة المانحة وطريقة الدراسة والوقت المطلوب منذ البداية.',

    'page.partners.eyebrow': 'الشركاء الأكاديميون',
    'page.partners.title': 'المؤسسات التي تمنح شهاداتنا',
    'page.partners.body':
      'لا تمنح إي سي سي شهاداتها بنفسها. كل مؤهل تمنحه مؤسسة شريكة، لكل منها اعتمادها وحوكمتها الأكاديمية.',

    'page.insights.eyebrow': 'المقالات',
    'page.insights.title': 'أخبار وإرشادات',
    'page.insights.body':
      'إرشادات القبول، وأخبار الشركاء، ورؤى حول التعليم المهني في منطقة الخليج.',

    /* --------------------------------------- headings inside other pages */
    'section.values': 'قيمنا',
    'section.about.more': 'المزيد عنّا',
    'section.awarded.by': 'معتمد وممنوح من',
    'section.degrees.from': 'شهادات ممنوحة من',
    'section.agenda': 'برنامج الحفل',
    'section.programme': 'البرنامج',
    'section.outcomes': 'مخرجات التعلّم في البرنامج',
    'section.careers.body': 'الأدوار التي ينتقل إليها الخريجون في مختلف القطاعات.',
    'section.majors.eyebrow': 'تخصصات الدرجة',
    'section.majors.title': 'اختر مجال تركيزك',
    'section.majors.body':
      'تفاصيل هذا التخصص متاحة من مستشاري إي سي سي — اطلب منّا دليل المقررات ومواعيد الالتحاق الحالية.',
    'section.majors.count':
      'يقدّم هذا البرنامج {count} تخصصًا. اختر أحدها لتطّلع على محتواه — والدرجة الممنوحة واحدة مهما كان اختيارك.',
    'section.why.with': 'لماذا تدرس هذا البرنامج مع {awarder}؟',
    'section.recognition.of':
      'الجهات التي تعتمد {partner} وتجعل شهاداتها معترفًا بها خارج البلد الذي يمنحها.',
    'section.partner.more': 'المزيد عن {partner}',
    'section.partner.delivered':
      'يُدرَّس ويُدعَم في دبي من {site}، أما الدرجة نفسها فتمنحها {partner}.',
    'aria.map.of': 'خريطة تُظهر {place}',
    'aria.map.office': 'مقر مجموعة إي سي سي للمعرفة',
    'list.academics.count': '{count} من أعضاء الهيئة الأكاديمية',
    'list.academics.count.one': 'عضو واحد من الهيئة الأكاديمية',
    'list.academics.in': '{count} في {specialisation}',
    'list.page.of': 'صفحة {current} من {total}',
    'section.partner.about': 'عن الشريك',
    'section.partner.programmes': 'برامج يمكنك دراستها مع إي سي سي',
    'section.partner.awarded': 'ممنوحة من هذا الشريك',

    'section.board.eyebrow': 'المجلس الأكاديمي',
    'section.board.title': 'يُدرّسك من مارس العمل فعلًا',
    'section.recognition': 'الاعتمادات والاعتراف',
    'section.recognition.long': 'الاعتماد والاعتراف الدولي',
    'section.recognition.title': 'معترف به من جهات مستقلة',
    'section.voices': 'أصوات الطلاب',
    'section.why': 'لماذا إي سي سي',
    'section.why.here': 'لماذا هنا',
    'section.who': 'من نحن',
    'section.house': 'بيت خبرة',
    'fees.what': 'ما الذي تدفع مقابله',
    'fees.payments': 'خيارات الدفع',
    'fees.value': 'لماذا يستحق ذلك',
    'fees.refunds': 'سياسة الاسترداد',
    'fees.ask': 'تريد الرقم الخاص ببرنامج بعينه؟',

    'section.partners.recognition': 'اعتمادات يحملها شركاؤنا',
    'section.partners.recognition.body':
      'كل شهادة تمنحها إي سي سي تصدر عن مؤسسة شريكة تحت اعتمادها الخاص. وهذه الجهات تعتمد المؤسسة نفسها لا إي سي سي، لذلك تُدرَج في صفحة كل شريك إلى جانب البرامج التي تغطيها.',
    'section.news.title': 'أحدث ما لدى إي سي سي',
    'section.news.body':
      'إرشادات القبول، وأخبار الشركاء، ورؤى حول التعليم المهني في المنطقة.',
    'section.video.lazy': 'لا يبدأ مشغّل فيميو بالتحميل إلا عند الضغط على التشغيل.',
    'section.ceo.sign': 'أحلامكم هي مهمتنا.',

    /* ------------------------------------------------- links and buttons */
    'link.programmes.see': 'اطّلع على البرامج',
    'link.institution': 'زيارة المؤسسة',
    'link.website': 'الموقع الإلكتروني',
    'link.compare': 'قارن بين البرامج',
    'link.map': 'افتح في خرائط جوجل',
    'link.eligibility': 'تحقّق من أهليتي',
    'link.deciding': 'ما زلت تفكّر؟',
    'link.deciding.short':
      'ما زلت تفكّر؟ أرسل سيرتك الذاتية وسنخبرك بالبرامج المؤهّل لها.',
    'faq.eyebrow': 'الأسئلة',
    'faq.title': 'قبل التسجيل',
    'faq.body':
      'أكثر ما يسألنا عنه الطلاب المحتملون. وإن لم يكن سؤالك هنا، سيجيبك أحد المستشارين مباشرة.',
    'link.deciding.body':
      'أرسل سيرتك الذاتية وسنخبرك بالبرامج المؤهّل لها، وتكلفة كل منها.',
    'link.advisor.talk': 'تحدّث إلى مستشار',
    'link.ceremony': 'شاهد حفل تخرّج',

    'fact.level': 'المستوى',
    'fact.credits': 'الساعات المعتمدة',
    'fact.duration': 'المدة',
    'fact.mode': 'طريقة الدراسة',
    'fact.language': 'لغة الدراسة',
    'fact.country': 'الدولة',
    'fact.levels.awarded': 'المستويات الممنوحة',

    /* ------------------------------------ the tabs down a long page */
    'tab.who': 'من نحن',
    'tab.figures': 'أرقام',
    'tab.programmes': 'البرامج',
    'tab.partners': 'الشركاء',
    'tab.accreditation': 'الاعتماد',
    'tab.ceremonies': 'حفلات التخرج',
    'tab.feedback': 'آراء الخريجين',
    'tab.enquire': 'استفسر',
    'tab.overview': 'نظرة عامة',
    'tab.why': 'لماذا هنا',
    'tab.structure': 'الهيكل',
    'tab.curriculum': 'المقررات',
    'tab.majors': 'التخصصات',
    'tab.apply': 'التقديم',

    'section.mission': 'رسالتنا',
    'section.vision': 'رؤيتنا',
    'section.mission.short': 'الرسالة',
    'section.values.short': 'القيم',
    'section.milestones': 'محطات',
    'section.qualifications': 'المؤهلات',
    'section.follow': 'تابعنا',
    'section.curriculum': 'المقررات',
    'section.structure': 'هيكل البرنامج',
    'section.core': 'المقررات الأساسية',
    'section.structure.body':
      'ما ستدرسه، مرحلة بمرحلة، مع الساعات المعتمدة لكل مقرر.',
    'section.structure.body.units':
      'ما ستدرسه، سنة بسنة. افتح أي وحدة للاطلاع على أهدافها ومخرجات التعلّم فيها.',
    'section.modules.body':
      'كل مقررات البرنامج، مع ساعاته المعتمدة ومستواه.',
    'section.core.body':
      'يدرسها كل طالب في البرنامج، أيًّا كان التخصص الذي يختاره.',
    'section.core.body.short':
      'المقررات التي يدرسها كل طالب في البرنامج.',
    'section.also.taught': 'تُدرَّس أيضًا',
    'aria.photograph': 'صورة',
    'meta.programmes': 'البرامج',
    'schema.awarded.by': 'البرامج التي تمنحها {partner}',
    'mail.prospectus': 'طلب دليل البرنامج — {programme}',
    'meta.home.title':
      'درجات بكالوريوس وماجستير ودكتوراه في إدارة الأعمال معتمدة دوليًا | مجموعة إي سي سي للمعرفة',
    'meta.home.description':
      'احصل على درجة بكالوريوس أو ماجستير أو دكتوراه في إدارة الأعمال معتمدة دوليًا من مؤسسات شريكة في سويسرا والمملكة المتحدة وكرواتيا وماليزيا والدنمارك. ادرس عن بُعد بساعات مرنة من مصر ودول الخليج.',
    'meta.contact.description':
      'تحدّث إلى أحد مستشاري مجموعة إي سي سي للمعرفة في دبي حول البرامج وشروط القبول والرسوم ومواعيد الالتحاق.',
    'meta.partners.title': 'الشركاء',
    'meta.insights.title': 'رؤى ومقالات',
    'photo.position': '{current} من {total}',
    'meta.contact': 'اتصل بنا',
    'meta.about': 'من نحن',
    'section.major': 'التخصص',
    'section.module': 'المقرر',
    'section.verify.title': 'مؤهلات يمكنك التحقّق منها',
    'section.verify.body':
      'تُمنح شهادات إي سي سي تحت الاعتماد المؤسسي لشركائنا. وتذكر صفحة كل برنامج بدقّة الجهة التي تمنح الشهادة.',
    'section.partners.title': 'مؤسسات عالمية، تُدرَّس محليًا',
    'section.partners.body':
      'تعمل إي سي سي مع جامعات ومعاهد معتمدة في أوروبا وآسيا والخليج، ليكون للمؤهل الذي تناله في دبي وزنه في كل مكان.',
    'section.grid.title': 'مؤهلات ترافقك أينما ذهبت',
    'section.grid.body':
      'يُقدَّم كل برنامج من برامج إي سي سي بالشراكة مع مؤسسة دولية، ومصمَّم بما يتناسب مع واقع العمل في الخليج.',
    'section.grid.home.title': 'اختر المؤهل الذي يناسب موقعك اليوم',
    'section.grid.home.body':
      'كل مسار يقودك إلى شهادة معترف بها دوليًا، تمنحها مؤسسة شريكة معتمدة، وتُدرَّس بما يتناسب مع جدول عملك.',
    'section.board.body':
      'يجمع أعضاء هيئة التدريس لدينا بين البحث الأكاديمي والخبرة المهنية الرفيعة، فما تدرسه يوم الاثنين تستخدمه في عملك يوم الثلاثاء.',
    'section.voices.title': 'ماذا يقول خرّيجونا',
    'section.people.meet': 'تعرّف على فريقنا',
    'section.academics.meet': 'تعرّف على الفريق الأكاديمي',
    'section.voices.all': 'اقرأ المزيد من قصص الخريجين',
    'section.brochure': 'تحميل الدليل',
    'section.teams.academic': 'الفريق الأكاديمي',
    'section.teams.ours': 'فريقنا',

    /* ------------------------------ names for things a screen reader reads */
    'aria.nav.primary': 'القائمة الرئيسية',
    'aria.footer.legal': 'روابط قانونية',
    'aria.teams': 'الفرق',
    'aria.shows': 'البرامج الصوتية',
    'aria.stakeholders': 'الأطراف المعنية',
    'aria.accreditations': 'الاعتمادات',
    'aria.explore': 'استكشف',

    'footer.about':
      'مؤهلات معتمدة دوليًا في الأعمال والإدارة، تُقدَّم من دبي إلى منطقة الشرق الأوسط وشمال أفريقيا.',
    'footer.rights': '© {year} {site}. جميع الحقوق محفوظة.',
    'contact.email': 'البريد الإلكتروني',
    'contact.phone': 'الهاتف',
    'contact.office': 'المكتب',
    'cta.panel.title': 'هل أنت مستعد للخطوة التالية؟',
    'cta.panel.body':
      'تحدّث إلى أحد مستشاري إي سي سي عن شروط القبول والرسوم ومواعيد الالتحاق — أو اطلب الدليل الكامل للبرنامج.',
    'meta.faculty': '{who}. عضو هيئة تدريس في {site}.',
    'meta.faculty.at': ' في {where}',
    'meta.programs':
      'برامج بكالوريوس وماجستير ودكتوراه وبرامج تنفيذية معتمدة دوليًا، تُقدَّم من دبي بالشراكة مع مؤسسات مجموعة إي سي سي المعرفية.',
    'meta.partners':
      'تتشارك مجموعة إي سي سي المعرفية مع IBAS في سويسرا، وجامعة VERN في كرواتيا، وCMI في المملكة المتحدة، وGenovasi d.school في ماليزيا.',
    'meta.insights':
      'أخبار وإرشادات وتحليلات من مجموعة إي سي سي المعرفية حول الدراسات العليا والاعتماد والتطوير المهني في منطقة الشرق الأوسط وشمال أفريقيا.',

    /* ----------------------------------------- when a page is not there */
    'notfound.page': 'الصفحة غير موجودة',
    'notfound.article': 'المقال غير موجود',
    'notfound.partner': 'الشريك غير موجود',
    'notfound.programme': 'البرنامج غير موجود',
    'notfound.person': 'غير موجود',
    'notfound.academics': 'لا يوجد أعضاء هيئة تدريس منشورون بعد.',

    /* ------------------------------ names for things a screen reader reads */
    'aria.sections': 'أقسام الصفحة',
    'aria.nav.mobile': 'القائمة الرئيسية (الجوال)',
    'aria.pages.academics': 'صفحات أعضاء هيئة التدريس',
    'aria.pages.stories': 'صفحات قصص الخريجين',
    'aria.specialisations.all': 'كل التخصصات',
    'aria.hours': 'ساعات العمل',
    'aria.contact': 'تواصل معنا',

    /* -------------------------------------- when there is nothing to show */
    'empty.faq':
      'يجري إضافة الأسئلة هنا قريبًا. وحتى ذلك الحين، اسأل أحد مستشارينا عن أي شيء —',
    'empty.people':
      'يجري إضافة فريقنا هنا قريبًا. وحتى ذلك الحين، يمكن لمستشارٍ أن يوصلك بالشخص المناسب —',
    'empty.staff':
      'يجري إضافة أعضاء هيئة التدريس هنا قريبًا. وحتى ذلك الحين، يمكن لمستشارٍ أن يخبرك من يُدرّس ماذا —',
    'empty.stories':
      'يجري إضافة أفلام الخريجين هنا قريبًا. وحتى ذلك الحين، يمكن لمستشارٍ أن يوصلك بمن درس البرنامج الذي تفكّر فيه —',
    'empty.videos':
      'يجري إضافة الأفلام هنا قريبًا. وحتى ذلك الحين، يمكن لمستشارٍ أن يرسل لك ما تبحث عنه —',
    'empty.podcast':
      'الحلقة الأولى في طريقها إليك. أخبرنا بما تودّ سماعه وسننقله إلى فريق الإنتاج —',
    'empty.accreditations':
      'يجري إضافة اعتماداتنا هنا قريبًا. ويمكن لمستشارٍ أن يرسل إليك الوثائق الحالية —',
    'empty.insights': 'لا توجد مقالات منشورة بعد',
    'empty.insights.body':
      'تظهر هنا تلقائيًا المقالات المنشورة في لوحة تحكم ووردبريس.',

    /* ---------------------------------------------------------- programmes */
    'programme.about': 'عن هذا البرنامج',
    'programme.glance': 'نظرة سريعة',
    'programme.credits': 'الساعات المعتمدة',
    'programme.credits.total': 'إجمالي الساعات',
    'programme.outcomes': 'مخرجات التعلّم',
    'programme.careers': 'الفرص المهنية',
    'programme.modules': 'مقررات التخصص',
    'programme.awarded': 'الجهة المانحة',
    'programme.accredited': 'معتمد وممنوح من',

    /* ------------------------------------------------------------- people */
    'people.qualifications': 'المؤهلات',
    'people.experience': 'الخبرة المهنية',
    'people.research': 'الاهتمامات البحثية',
    'people.teaching': 'المقررات التي يدرّسها',
    'people.linkedin': 'عرض ملف لينكدإن',

    /* ------------------------------------------------------------- errors */
    'error.404': 'خطأ ٤٠٤',
    'error.404.title': 'لم نتمكّن من العثور على هذه الصفحة',
    'error.404.body':
      'قد تكون الصفحة قد نُقلت، أو أن الرابط لم يعد صالحًا. برامجنا وبيانات التواصل على بُعد نقرة واحدة.',
    'error.home': 'العودة إلى الرئيسية',
    'error.programmes': 'تصفّح البرامج',
  },
} as const;

/** Every key the dictionary carries. English is the shape of record. */
export type MessageKey = keyof (typeof DICTIONARY)['en'];

/**
 * One string, in one language.
 *
 * Falls back to English rather than showing a key: a visitor should never see
 * `player.mute` on the page, and an untranslated word in the right place is
 * more use than a correct one nobody can read.
 */
export function translate(locale: Locale, key: MessageKey): string {
  const table = DICTIONARY[locale] as Record<string, string | undefined>;

  return table[key] ?? DICTIONARY.en[key];
}

/**
 * One string with its blanks filled in.
 *
 * A message like "{field} is required" has to be one string per language, not
 * a sentence assembled from pieces: Arabic puts the field name in a different
 * place and needs a different word around it, and there is no order of
 * concatenation that is right in both.
 */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole,
  );
}

/** The whole table for a language, for handing to a client component once. */
export function messagesFor(locale: Locale): Record<string, string> {
  return { ...DICTIONARY.en, ...DICTIONARY[locale] };
}
