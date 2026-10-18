import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'ar');
  CREATE TYPE "public"."enum_pages_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('en', 'ar');
  CREATE TYPE "public"."enum_posts_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_posts_language" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum__posts_v_version_language" AS ENUM('ar', 'en');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'ar');
  CREATE TYPE "public"."enum_categories_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_programs_majors_icon" AS ENUM('strategy', 'leadership', 'management', 'innovation', 'economy', 'banking', 'accounting', 'fintech', 'islamic', 'ai', 'digital', 'analytics', 'marketing', 'people', 'logistics', 'quality', 'project', 'hospital', 'healthcare', 'law', 'sustainable', 'education');
  CREATE TYPE "public"."enum_programs_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_programs_level" AS ENUM('Bachelor', 'Master', 'Doctorate', 'Diploma', 'Executive');
  CREATE TYPE "public"."enum_partners_stats_icon" AS ENUM('graduate', 'badge', 'professor', 'course', 'module', 'lecture', 'globe', 'users', 'star', 'clock');
  CREATE TYPE "public"."enum_partners_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_academic_members_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_podcasts_episodes_source" AS ENUM('youtube', 'video', 'audio');
  CREATE TYPE "public"."enum_podcasts_layout" AS ENUM('sidebar', 'stacked');
  CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('text', 'email', 'tel', 'number', 'url', 'date', 'textarea', 'select', 'radio', 'checkbox', 'checkboxes');
  CREATE TYPE "public"."enum_forms_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_forms_fields_choices_source" AS ENUM('manual', 'partners', 'programs');
  CREATE TYPE "public"."enum_forms_fields_condition_operator" AS ENUM('is', 'is not', 'is filled', 'is empty');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'seo');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302', '307', '308');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_home_page_figures_stats_icon" AS ENUM('graduate', 'badge', 'professor', 'course', 'module', 'lecture', 'globe', 'users', 'star', 'clock');
  CREATE TYPE "public"."enum_home_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_about_page_purpose_stats_icon" AS ENUM('graduate', 'badge', 'professor', 'course', 'module', 'lecture', 'globe', 'users', 'star', 'clock');
  CREATE TYPE "public"."enum_about_page_ceremonies_stats_icon" AS ENUM('graduate', 'badge', 'professor', 'course', 'module', 'lecture', 'globe', 'users', 'star', 'clock');
  CREATE TYPE "public"."enum_about_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_contact_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_people_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_staff_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_stories_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_gallery_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_podcast_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_faq_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_accreditations_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_fees_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_social_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_ceremonies_page_intro_stats_icon" AS ENUM('graduate', 'badge', 'professor', 'course', 'module', 'lecture', 'globe', 'users', 'star', 'clock');
  CREATE TYPE "public"."enum_ceremonies_page_timeline_items_status" AS ENUM('completed', 'upcoming');
  CREATE TYPE "public"."enum_ceremonies_page_meta_robots" AS ENUM('noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex');
  CREATE TYPE "public"."enum_interface_strings_overrides_key" AS ENUM('nav.skip', 'nav.home', 'nav.menu.open', 'nav.menu.close', 'nav.language', 'nav.language.choose', 'crumb.home', 'blog.page', 'blog.category', 'blog.readTime', 'cta.apply', 'cta.enquire', 'cta.contact', 'cta.advisor', 'cta.advisor.ask', 'cta.whatsapp', 'cta.prospectus', 'cta.programmes', 'cta.programmes.all', 'cta.insights.all', 'cta.profile', 'cta.verify', 'cta.reply', 'form.submit', 'form.thanks', 'form.sending', 'form.sent', 'form.required', 'form.check', 'form.choose', 'form.choose.parent', 'form.choose.empty', 'form.close', 'form.advisor', 'form.failed', 'form.unconnected', 'form.throttled', 'form.error.required', 'form.error.tick', 'form.error.long', 'form.error.listed', 'form.error.choice', 'form.error.filtered', 'form.error.email', 'form.error.tel', 'form.error.number', 'form.error.url', 'video.watch', 'video.close', 'video.previous', 'video.next', 'video.share', 'video.share.copied', 'video.share.link', 'video.of', 'photo.close', 'photo.previous', 'photo.next', 'player.play', 'player.pause', 'player.previous', 'player.next', 'player.back', 'player.forward', 'player.speed', 'player.mute', 'player.unmute', 'player.volume', 'player.fullscreen', 'player.loading', 'player.seek', 'player.search', 'player.search.none', 'player.episode', 'player.channel', 'list.filter.category', 'list.filter.specialisation', 'list.filter.all', 'list.previous', 'list.next', 'list.page', 'list.of', 'list.video', 'list.videos', 'list.story', 'list.stories', 'list.episode', 'list.episodes', 'list.empty', 'page.programs.eyebrow', 'page.programs.title', 'page.programs.body', 'page.programs.all', 'page.programs.pathway', 'page.programs.pathway.body', 'page.partners.eyebrow', 'page.partners.title', 'page.partners.body', 'page.insights.eyebrow', 'page.insights.title', 'page.insights.body', 'section.values', 'section.about.more', 'section.awarded.by', 'section.degrees.from', 'section.agenda', 'section.programme', 'section.outcomes', 'section.careers.body', 'section.majors.eyebrow', 'section.majors.title', 'section.majors.body', 'section.majors.count', 'section.why.with', 'section.recognition.of', 'section.partner.more', 'section.partner.delivered', 'aria.map.of', 'aria.map.office', 'list.academics.count', 'list.academics.count.one', 'list.academics.in', 'list.page.of', 'section.partner.about', 'section.partner.programmes', 'section.partner.awarded', 'section.board.eyebrow', 'section.board.title', 'section.recognition', 'section.recognition.long', 'section.recognition.title', 'section.voices', 'section.why', 'section.why.here', 'section.who', 'section.house', 'fees.what', 'fees.payments', 'fees.value', 'fees.refunds', 'fees.ask', 'section.partners.recognition', 'section.partners.recognition.body', 'section.news.title', 'section.news.body', 'section.video.lazy', 'section.ceo.sign', 'link.programmes.see', 'link.institution', 'link.website', 'link.compare', 'link.map', 'link.eligibility', 'link.deciding', 'link.deciding.short', 'faq.eyebrow', 'faq.title', 'faq.body', 'link.deciding.body', 'link.advisor.talk', 'link.ceremony', 'fact.level', 'fact.credits', 'fact.duration', 'fact.mode', 'fact.language', 'fact.country', 'fact.levels.awarded', 'tab.who', 'tab.figures', 'tab.programmes', 'tab.partners', 'tab.accreditation', 'tab.ceremonies', 'tab.feedback', 'tab.enquire', 'tab.overview', 'tab.why', 'tab.structure', 'tab.curriculum', 'tab.majors', 'tab.apply', 'section.mission', 'section.vision', 'section.mission.short', 'section.values.short', 'section.milestones', 'section.qualifications', 'section.follow', 'section.curriculum', 'section.structure', 'section.core', 'section.structure.body', 'section.structure.body.units', 'section.modules.body', 'section.core.body', 'section.core.body.short', 'section.also.taught', 'aria.photograph', 'meta.programmes', 'schema.awarded.by', 'mail.prospectus', 'meta.home.title', 'meta.home.description', 'meta.contact.description', 'meta.partners.title', 'meta.insights.title', 'photo.position', 'meta.contact', 'meta.about', 'section.major', 'section.module', 'section.verify.title', 'section.verify.body', 'section.partners.title', 'section.partners.body', 'section.grid.title', 'section.grid.body', 'section.grid.home.title', 'section.grid.home.body', 'section.board.body', 'section.voices.title', 'section.people.meet', 'section.academics.meet', 'section.voices.all', 'section.brochure', 'section.teams.academic', 'section.teams.ours', 'aria.nav.primary', 'aria.footer.legal', 'aria.teams', 'aria.shows', 'aria.stakeholders', 'aria.accreditations', 'aria.explore', 'footer.about', 'footer.rights', 'contact.email', 'contact.phone', 'contact.office', 'cta.panel.title', 'cta.panel.body', 'meta.faculty', 'meta.faculty.at', 'meta.programs', 'meta.partners', 'meta.insights', 'notfound.page', 'notfound.article', 'notfound.partner', 'notfound.programme', 'notfound.person', 'notfound.academics', 'aria.sections', 'aria.nav.mobile', 'aria.pages.academics', 'aria.pages.stories', 'aria.specialisations.all', 'aria.hours', 'aria.contact', 'empty.faq', 'empty.people', 'empty.staff', 'empty.stories', 'empty.videos', 'empty.podcast', 'empty.accreditations', 'empty.insights', 'empty.insights.body', 'programme.about', 'programme.glance', 'programme.credits', 'programme.credits.total', 'programme.outcomes', 'programme.careers', 'programme.modules', 'programme.awarded', 'programme.accredited', 'people.qualifications', 'people.experience', 'people.research', 'people.teaching', 'people.linkedin', 'error.404', 'error.404.title', 'error.404.body', 'error.home', 'error.programmes');
  CREATE TABLE "pages_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_pages_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_version_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_version_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_featured_image_id" integer,
  	"version_meta_canonical_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"language" "enum_posts_language" DEFAULT 'ar',
  	"slug" varchar,
  	"legacy_path" varchar,
  	"published_at" timestamp(3) with time zone,
  	"excerpt" varchar,
  	"content" jsonb,
  	"featured_image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"meta_canonical_url" varchar,
  	"author_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_posts_v_version_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_language" "enum__posts_v_version_language" DEFAULT 'ar',
  	"version_slug" varchar,
  	"version_legacy_path" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_featured_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_focus_keyword" varchar,
  	"version_meta_related_keywords" varchar,
  	"version_meta_canonical_url" varchar,
  	"version_author_name" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "categories_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_categories_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "programs_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_highlights_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_accreditations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_accreditations_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_learning_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_learning_outcomes_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_careers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_careers_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_why_study" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_why_study_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_structure_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_structure_groups_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_core_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"credits" varchar,
  	"level" varchar
  );
  
  CREATE TABLE "programs_core_modules_locales" (
  	"group" varchar,
  	"title" varchar NOT NULL,
  	"aims" varchar,
  	"outcomes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_majors_modules" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"credits" varchar,
  	"level" varchar
  );
  
  CREATE TABLE "programs_majors_modules_locales" (
  	"title" varchar NOT NULL,
  	"aims" varchar,
  	"outcomes" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_majors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"icon" "enum_programs_majors_icon",
  	"brochure_id" integer
  );
  
  CREATE TABLE "programs_majors_locales" (
  	"name" varchar NOT NULL,
  	"overview" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_programs_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"order" numeric,
  	"partner_id" integer,
  	"featured_image_id" integer,
  	"level" "enum_programs_level" DEFAULT 'Master' NOT NULL,
  	"brochure_id" integer,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programs_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb,
  	"duration" varchar,
  	"study_mode" varchar,
  	"awarding_body" varchar,
  	"credits" varchar,
  	"language" varchar,
  	"tuition" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "partners_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_about_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners_values_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_partners_stats_icon",
  	"prefix" varchar,
  	"number" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "partners_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "partners_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_partners_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"order" numeric,
  	"country_code" varchar,
  	"accent_color" varchar,
  	"website" varchar,
  	"logo_id" integer,
  	"image_id" integer,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners_locales" (
  	"name" varchar NOT NULL,
  	"country" varchar,
  	"description" varchar,
  	"content" jsonb,
  	"mission" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "accreditations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"website" varchar,
  	"logo_id" integer,
  	"partner_id" integer,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "accreditations_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"issuer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "academic_members_expertise" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "academic_members_expertise_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "academic_members_teaching" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "academic_members_teaching_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "academic_members_research" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "academic_members_research_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "academic_members_qualifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar
  );
  
  CREATE TABLE "academic_members_qualifications_locales" (
  	"title" varchar NOT NULL,
  	"institution" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "academic_members_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "academic_members_experience_locales" (
  	"role" varchar NOT NULL,
  	"organisation" varchar,
  	"period" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "academic_members_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_academic_members_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "academic_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"order" numeric,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "academic_members_locales" (
  	"name" varchar NOT NULL,
  	"position" varchar,
  	"credentials" varchar,
  	"bio" jsonb,
  	"team" varchar,
  	"institution" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "academic_members_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"specializations_id" integer
  );
  
  CREATE TABLE "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"photo_id" integer,
  	"linkedin" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "team_members_locales" (
  	"name" varchar NOT NULL,
  	"position" varchar,
  	"credentials" varchar,
  	"bio" jsonb,
  	"team" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "specializations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "specializations_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"video" varchar,
  	"poster_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials_locales" (
  	"author_name" varchar NOT NULL,
  	"author_role" varchar,
  	"quote" varchar,
  	"program" varchar,
  	"country" varchar,
  	"video_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"video" varchar NOT NULL,
  	"poster_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "videos_locales" (
  	"title" varchar NOT NULL,
  	"credit" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "videos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"video_categories_id" integer
  );
  
  CREATE TABLE "video_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "video_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "podcasts_episodes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"source" "enum_podcasts_episodes_source" DEFAULT 'youtube' NOT NULL,
  	"url" varchar NOT NULL,
  	"thumb" varchar,
  	"date" timestamp(3) with time zone,
  	"duration" varchar
  );
  
  CREATE TABLE "podcasts_episodes_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "podcasts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"cover_id" integer,
  	"channel_url" varchar,
  	"layout" "enum_podcasts_layout" DEFAULT 'sidebar',
  	"search" boolean DEFAULT true,
  	"autoplay_next" boolean DEFAULT true,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "podcasts_locales" (
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"description" jsonb,
  	"channel_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_forms_fields_type" DEFAULT 'text' NOT NULL,
  	"required" boolean,
  	"width" "enum_forms_fields_width" DEFAULT 'full',
  	"choices_source" "enum_forms_fields_choices_source" DEFAULT 'manual',
  	"condition_field" varchar,
  	"condition_operator" "enum_forms_fields_condition_operator" DEFAULT 'is',
  	"condition_value" varchar
  );
  
  CREATE TABLE "forms_fields_locales" (
  	"label" varchar NOT NULL,
  	"placeholder" varchar,
  	"choices" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"redirect_uri" varchar,
  	"webhook_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"submit_label" varchar,
  	"consent" varchar,
  	"success_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"summary" varchar,
  	"data" jsonb NOT NULL,
  	"locale" varchar,
  	"source" varchar,
  	"ip" varchar,
  	"status" "enum_form_submissions_status" DEFAULT 'new',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"programs_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"programs_id" integer,
  	"partners_id" integer,
  	"accreditations_id" integer,
  	"academic_members_id" integer,
  	"team_members_id" integer,
  	"specializations_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"videos_id" integer,
  	"video_categories_id" integer,
  	"podcasts_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_hero_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_hero_badges_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_figures_countries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_figures_countries_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_figures_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_page_figures_stats_icon",
  	"prefix" varchar,
  	"number" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "home_page_figures_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_why_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_why_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_about_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_about_values_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_ceo_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page_ceo_message_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_home_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_cta_href" varchar,
  	"hero_image_id" integer,
  	"about_cta_href" varchar,
  	"about_image_id" integer,
  	"about_image_two_id" integer,
  	"video_url" varchar,
  	"video_poster_id" integer,
  	"ceo_photo_id" integer,
  	"cta_href" varchar,
  	"cta_image_id" integer,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_body" varchar,
  	"hero_cta_label" varchar,
  	"why_heading" varchar,
  	"why_body" varchar,
  	"about_eyebrow" varchar,
  	"about_heading" varchar,
  	"about_body" varchar,
  	"about_mission" varchar,
  	"about_vision" varchar,
  	"about_cta_label" varchar,
  	"video_eyebrow" varchar,
  	"video_heading" varchar,
  	"video_body" varchar,
  	"ceo_eyebrow" varchar,
  	"ceo_heading" varchar,
  	"ceo_name" varchar,
  	"ceo_role" varchar,
  	"cta_heading" varchar,
  	"cta_body" varchar,
  	"cta_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_intro_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page_intro_body_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_purpose_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_purpose_stats_icon",
  	"prefix" varchar,
  	"number" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "about_page_purpose_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_ceremonies_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_about_page_ceremonies_stats_icon",
  	"prefix" varchar,
  	"number" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "about_page_ceremonies_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_about_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_image_id" integer,
  	"ceremonies_video" varchar,
  	"ceremonies_cta_href" varchar,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"purpose_mission" varchar,
  	"purpose_vision" varchar,
  	"sections_programmes_heading" varchar,
  	"sections_programmes_body" varchar,
  	"sections_network_heading" varchar,
  	"sections_network_body" varchar,
  	"sections_recognition_heading" varchar,
  	"sections_recognition_body" varchar,
  	"sections_feedback_heading" varchar,
  	"sections_feedback_body" varchar,
  	"ceremonies_heading" varchar,
  	"ceremonies_body" varchar,
  	"ceremonies_cta_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "contact_page_intro_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_page_intro_body_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page_intro_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_page_intro_hours_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_contact_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_slug" varchar,
  	"map_embed_url" varchar,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"form_heading" varchar,
  	"form_body" varchar,
  	"map_heading" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "people_page_teams" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "people_page_teams_locales" (
  	"label" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "people_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_people_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "people_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "people_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "staff_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_staff_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "staff_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"per_page" numeric,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "staff_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stories_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stories_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "stories_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"per_page" numeric,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "stories_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "gallery_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_gallery_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "gallery_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"per_page" numeric,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "gallery_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "podcast_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_podcast_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "podcast_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "podcast_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "faq_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_faq_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faq_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "faq_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "accreditations_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_accreditations_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "accreditations_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "accreditations_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "fees_page_intro_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fees_page_intro_highlights_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "fees_page_breakdown_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fees_page_breakdown_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "fees_page_payments_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fees_page_payments_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "fees_page_value_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fees_page_value_points_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "fees_page_refund_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fees_page_refund_questions_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "fees_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_fees_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "fees_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "fees_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"breakdown_heading" varchar,
  	"breakdown_body" varchar,
  	"quote_quote" varchar,
  	"payments_heading" varchar,
  	"payments_body" varchar,
  	"value_heading" varchar,
  	"value_body" varchar,
  	"refund_heading" varchar,
  	"refund_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "social_page_intro_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "social_page_intro_tags_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "social_page_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "social_page_pillars_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "social_page_ecosystem_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "social_page_ecosystem_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "social_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_social_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "social_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"initiative_figure" varchar,
  	"initiative_image_id" integer,
  	"initiative_video" varchar,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "social_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"intro_quote" varchar,
  	"pillars_eyebrow" varchar,
  	"pillars_heading" varchar,
  	"pillars_body" varchar,
  	"ecosystem_eyebrow" varchar,
  	"ecosystem_heading" varchar,
  	"ecosystem_body" varchar,
  	"initiative_eyebrow" varchar,
  	"initiative_heading" varchar,
  	"initiative_body" varchar,
  	"initiative_figure_label" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_intro_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_ceremonies_page_intro_stats_icon",
  	"prefix" varchar,
  	"number" varchar NOT NULL,
  	"suffix" varchar
  );
  
  CREATE TABLE "ceremonies_page_intro_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_legacy_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_legacy_points_locales" (
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_timeline_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"status" "enum_ceremonies_page_timeline_items_status" DEFAULT 'completed',
  	"year" varchar
  );
  
  CREATE TABLE "ceremonies_page_timeline_items_locales" (
  	"place" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_gallery_images_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_films_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video" varchar NOT NULL,
  	"poster_id" integer
  );
  
  CREATE TABLE "ceremonies_page_films_items_locales" (
  	"title" varchar NOT NULL,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_highlights_items_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_next_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_next_facts_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_next_agenda" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar
  );
  
  CREATE TABLE "ceremonies_page_next_agenda_locales" (
  	"item" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ceremonies_page_meta_robots" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_ceremonies_page_meta_robots",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ceremonies_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_image_id" integer,
  	"next_image_id" integer,
  	"meta_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ceremonies_page_locales" (
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"legacy_eyebrow" varchar,
  	"legacy_heading" varchar,
  	"legacy_body" varchar,
  	"timeline_eyebrow" varchar,
  	"timeline_heading" varchar,
  	"timeline_body" varchar,
  	"gallery_eyebrow" varchar,
  	"gallery_heading" varchar,
  	"films_eyebrow" varchar,
  	"films_heading" varchar,
  	"highlights_eyebrow" varchar,
  	"highlights_heading" varchar,
  	"next_eyebrow" varchar,
  	"next_heading" varchar,
  	"next_body" varchar,
  	"cta_heading" varchar,
  	"cta_body" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_focus_keyword" varchar,
  	"meta_related_keywords" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"sticky" boolean
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"contact_phone" varchar,
  	"contact_map_url" varchar,
  	"default_og_image_id" integer,
  	"organization_logo_id" integer,
  	"organization_founding_date" varchar,
  	"verification_google" varchar,
  	"verification_bing" varchar,
  	"code_head" varchar,
  	"code_body" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar,
  	"contact_address" varchar,
  	"organization_legal_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_primary_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_primary" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_footer_explore_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_footer_explore" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_footer_programs_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_footer_programs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_footer_legal_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation_footer_legal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "interface_strings_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_interface_strings_overrides_key" NOT NULL
  );
  
  CREATE TABLE "interface_strings_overrides_locales" (
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "interface_strings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_meta_robots" ADD CONSTRAINT "pages_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_meta_robots" ADD CONSTRAINT "_pages_v_version_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_meta_robots" ADD CONSTRAINT "posts_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_meta_robots" ADD CONSTRAINT "_posts_v_version_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_meta_robots" ADD CONSTRAINT "categories_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_highlights" ADD CONSTRAINT "programs_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_highlights_locales" ADD CONSTRAINT "programs_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_accreditations" ADD CONSTRAINT "programs_accreditations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_accreditations_locales" ADD CONSTRAINT "programs_accreditations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_accreditations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_learning_outcomes" ADD CONSTRAINT "programs_learning_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_learning_outcomes_locales" ADD CONSTRAINT "programs_learning_outcomes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_learning_outcomes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_careers" ADD CONSTRAINT "programs_careers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_careers_locales" ADD CONSTRAINT "programs_careers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_why_study" ADD CONSTRAINT "programs_why_study_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_why_study_locales" ADD CONSTRAINT "programs_why_study_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_why_study"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_structure_groups" ADD CONSTRAINT "programs_structure_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_structure_groups_locales" ADD CONSTRAINT "programs_structure_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_structure_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_core_modules" ADD CONSTRAINT "programs_core_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_core_modules_locales" ADD CONSTRAINT "programs_core_modules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_core_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_majors_modules" ADD CONSTRAINT "programs_majors_modules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_majors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_majors_modules_locales" ADD CONSTRAINT "programs_majors_modules_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_majors_modules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_majors" ADD CONSTRAINT "programs_majors_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_majors" ADD CONSTRAINT "programs_majors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_majors_locales" ADD CONSTRAINT "programs_majors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_majors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_meta_robots" ADD CONSTRAINT "programs_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_locales" ADD CONSTRAINT "programs_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_locales" ADD CONSTRAINT "programs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_about" ADD CONSTRAINT "partners_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_about_locales" ADD CONSTRAINT "partners_about_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_values" ADD CONSTRAINT "partners_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_values_locales" ADD CONSTRAINT "partners_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_stats" ADD CONSTRAINT "partners_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_stats_locales" ADD CONSTRAINT "partners_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners_meta_robots" ADD CONSTRAINT "partners_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_locales" ADD CONSTRAINT "partners_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_locales" ADD CONSTRAINT "partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accreditations" ADD CONSTRAINT "accreditations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accreditations" ADD CONSTRAINT "accreditations_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accreditations_locales" ADD CONSTRAINT "accreditations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accreditations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_expertise" ADD CONSTRAINT "academic_members_expertise_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_expertise_locales" ADD CONSTRAINT "academic_members_expertise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members_expertise"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_teaching" ADD CONSTRAINT "academic_members_teaching_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_teaching_locales" ADD CONSTRAINT "academic_members_teaching_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members_teaching"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_research" ADD CONSTRAINT "academic_members_research_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_research_locales" ADD CONSTRAINT "academic_members_research_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members_research"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_qualifications" ADD CONSTRAINT "academic_members_qualifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_qualifications_locales" ADD CONSTRAINT "academic_members_qualifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members_qualifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_experience" ADD CONSTRAINT "academic_members_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_experience_locales" ADD CONSTRAINT "academic_members_experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_meta_robots" ADD CONSTRAINT "academic_members_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members" ADD CONSTRAINT "academic_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "academic_members_locales" ADD CONSTRAINT "academic_members_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "academic_members_locales" ADD CONSTRAINT "academic_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_rels" ADD CONSTRAINT "academic_members_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "academic_members_rels" ADD CONSTRAINT "academic_members_rels_specializations_fk" FOREIGN KEY ("specializations_id") REFERENCES "public"."specializations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_members" ADD CONSTRAINT "team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_members_locales" ADD CONSTRAINT "team_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "specializations_locales" ADD CONSTRAINT "specializations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."specializations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_locales" ADD CONSTRAINT "testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_locales" ADD CONSTRAINT "faqs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "videos_locales" ADD CONSTRAINT "videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_rels" ADD CONSTRAINT "videos_rels_video_categories_fk" FOREIGN KEY ("video_categories_id") REFERENCES "public"."video_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "video_categories_locales" ADD CONSTRAINT "video_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."video_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcasts_episodes" ADD CONSTRAINT "podcasts_episodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcasts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcasts_episodes_locales" ADD CONSTRAINT "podcasts_episodes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcasts_episodes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcasts" ADD CONSTRAINT "podcasts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "podcasts_locales" ADD CONSTRAINT "podcasts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcasts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_locales" ADD CONSTRAINT "forms_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_texts" ADD CONSTRAINT "forms_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accreditations_fk" FOREIGN KEY ("accreditations_id") REFERENCES "public"."accreditations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_academic_members_fk" FOREIGN KEY ("academic_members_id") REFERENCES "public"."academic_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specializations_fk" FOREIGN KEY ("specializations_id") REFERENCES "public"."specializations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_categories_fk" FOREIGN KEY ("video_categories_id") REFERENCES "public"."video_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_podcasts_fk" FOREIGN KEY ("podcasts_id") REFERENCES "public"."podcasts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_badges" ADD CONSTRAINT "home_page_hero_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_badges_locales" ADD CONSTRAINT "home_page_hero_badges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hero_badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_figures_countries" ADD CONSTRAINT "home_page_figures_countries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_figures_countries_locales" ADD CONSTRAINT "home_page_figures_countries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_figures_countries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_figures_stats" ADD CONSTRAINT "home_page_figures_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_figures_stats_locales" ADD CONSTRAINT "home_page_figures_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_figures_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_why_items" ADD CONSTRAINT "home_page_why_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_why_items_locales" ADD CONSTRAINT "home_page_why_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_why_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_about_values" ADD CONSTRAINT "home_page_about_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_about_values_locales" ADD CONSTRAINT "home_page_about_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_about_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_ceo_message" ADD CONSTRAINT "home_page_ceo_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_ceo_message_locales" ADD CONSTRAINT "home_page_ceo_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_ceo_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_meta_robots" ADD CONSTRAINT "home_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_id_media_id_fk" FOREIGN KEY ("about_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_about_image_two_id_media_id_fk" FOREIGN KEY ("about_image_two_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_ceo_photo_id_media_id_fk" FOREIGN KEY ("ceo_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_intro_body" ADD CONSTRAINT "about_page_intro_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_intro_body_locales" ADD CONSTRAINT "about_page_intro_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_intro_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_purpose_stats" ADD CONSTRAINT "about_page_purpose_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_purpose_stats_locales" ADD CONSTRAINT "about_page_purpose_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_purpose_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_ceremonies_stats" ADD CONSTRAINT "about_page_ceremonies_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_ceremonies_stats_locales" ADD CONSTRAINT "about_page_ceremonies_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_ceremonies_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_meta_robots" ADD CONSTRAINT "about_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_rels" ADD CONSTRAINT "about_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_rels" ADD CONSTRAINT "about_page_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_intro_body" ADD CONSTRAINT "contact_page_intro_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_intro_body_locales" ADD CONSTRAINT "contact_page_intro_body_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_intro_body"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_intro_hours" ADD CONSTRAINT "contact_page_intro_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_intro_hours_locales" ADD CONSTRAINT "contact_page_intro_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page_intro_hours"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_meta_robots" ADD CONSTRAINT "contact_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_page_locales" ADD CONSTRAINT "contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_page_teams" ADD CONSTRAINT "people_page_teams_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_page_teams_locales" ADD CONSTRAINT "people_page_teams_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people_page_teams"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_page_meta_robots" ADD CONSTRAINT "people_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."people_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people_page_locales" ADD CONSTRAINT "people_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_page_locales" ADD CONSTRAINT "people_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_page_meta_robots" ADD CONSTRAINT "staff_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_page_locales" ADD CONSTRAINT "staff_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_page_locales" ADD CONSTRAINT "staff_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."staff_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_page_meta_robots" ADD CONSTRAINT "stories_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_page_locales" ADD CONSTRAINT "stories_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_page_locales" ADD CONSTRAINT "stories_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_page_meta_robots" ADD CONSTRAINT "gallery_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."gallery_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_page_locales" ADD CONSTRAINT "gallery_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_page_locales" ADD CONSTRAINT "gallery_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_page_meta_robots" ADD CONSTRAINT "podcast_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."podcast_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "podcast_page_locales" ADD CONSTRAINT "podcast_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "podcast_page_locales" ADD CONSTRAINT "podcast_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."podcast_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_meta_robots" ADD CONSTRAINT "faq_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_page_locales" ADD CONSTRAINT "faq_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "faq_page_locales" ADD CONSTRAINT "faq_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accreditations_page_meta_robots" ADD CONSTRAINT "accreditations_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."accreditations_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "accreditations_page_locales" ADD CONSTRAINT "accreditations_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accreditations_page_locales" ADD CONSTRAINT "accreditations_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."accreditations_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_intro_highlights" ADD CONSTRAINT "fees_page_intro_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_intro_highlights_locales" ADD CONSTRAINT "fees_page_intro_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page_intro_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_breakdown_items" ADD CONSTRAINT "fees_page_breakdown_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_breakdown_items_locales" ADD CONSTRAINT "fees_page_breakdown_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page_breakdown_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_payments_items" ADD CONSTRAINT "fees_page_payments_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_payments_items_locales" ADD CONSTRAINT "fees_page_payments_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page_payments_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_value_points" ADD CONSTRAINT "fees_page_value_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_value_points_locales" ADD CONSTRAINT "fees_page_value_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page_value_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_refund_questions" ADD CONSTRAINT "fees_page_refund_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_refund_questions_locales" ADD CONSTRAINT "fees_page_refund_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page_refund_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_meta_robots" ADD CONSTRAINT "fees_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "fees_page_locales" ADD CONSTRAINT "fees_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "fees_page_locales" ADD CONSTRAINT "fees_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."fees_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_intro_tags" ADD CONSTRAINT "social_page_intro_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_intro_tags_locales" ADD CONSTRAINT "social_page_intro_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page_intro_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_pillars_items" ADD CONSTRAINT "social_page_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_pillars_items_locales" ADD CONSTRAINT "social_page_pillars_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page_pillars_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_ecosystem_items" ADD CONSTRAINT "social_page_ecosystem_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_ecosystem_items_locales" ADD CONSTRAINT "social_page_ecosystem_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page_ecosystem_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page_meta_robots" ADD CONSTRAINT "social_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."social_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "social_page" ADD CONSTRAINT "social_page_initiative_image_id_media_id_fk" FOREIGN KEY ("initiative_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_page_locales" ADD CONSTRAINT "social_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "social_page_locales" ADD CONSTRAINT "social_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."social_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_intro_stats" ADD CONSTRAINT "ceremonies_page_intro_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_intro_stats_locales" ADD CONSTRAINT "ceremonies_page_intro_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_intro_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_legacy_points" ADD CONSTRAINT "ceremonies_page_legacy_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_legacy_points_locales" ADD CONSTRAINT "ceremonies_page_legacy_points_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_legacy_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_timeline_items" ADD CONSTRAINT "ceremonies_page_timeline_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_timeline_items_locales" ADD CONSTRAINT "ceremonies_page_timeline_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_timeline_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_gallery_images" ADD CONSTRAINT "ceremonies_page_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ceremonies_page_gallery_images" ADD CONSTRAINT "ceremonies_page_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_gallery_images_locales" ADD CONSTRAINT "ceremonies_page_gallery_images_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_gallery_images"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_films_items" ADD CONSTRAINT "ceremonies_page_films_items_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ceremonies_page_films_items" ADD CONSTRAINT "ceremonies_page_films_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_films_items_locales" ADD CONSTRAINT "ceremonies_page_films_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_films_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_highlights_items" ADD CONSTRAINT "ceremonies_page_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_highlights_items_locales" ADD CONSTRAINT "ceremonies_page_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_next_facts" ADD CONSTRAINT "ceremonies_page_next_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_next_facts_locales" ADD CONSTRAINT "ceremonies_page_next_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_next_facts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_next_agenda" ADD CONSTRAINT "ceremonies_page_next_agenda_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_next_agenda_locales" ADD CONSTRAINT "ceremonies_page_next_agenda_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page_next_agenda"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page_meta_robots" ADD CONSTRAINT "ceremonies_page_meta_robots_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ceremonies_page" ADD CONSTRAINT "ceremonies_page_legacy_image_id_media_id_fk" FOREIGN KEY ("legacy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ceremonies_page" ADD CONSTRAINT "ceremonies_page_next_image_id_media_id_fk" FOREIGN KEY ("next_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ceremonies_page_locales" ADD CONSTRAINT "ceremonies_page_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ceremonies_page_locales" ADD CONSTRAINT "ceremonies_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ceremonies_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary_children" ADD CONSTRAINT "navigation_primary_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_primary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary" ADD CONSTRAINT "navigation_primary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_explore_children" ADD CONSTRAINT "navigation_footer_explore_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_explore"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_explore" ADD CONSTRAINT "navigation_footer_explore_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_programs_children" ADD CONSTRAINT "navigation_footer_programs_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_programs" ADD CONSTRAINT "navigation_footer_programs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_legal_children" ADD CONSTRAINT "navigation_footer_legal_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_legal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_legal" ADD CONSTRAINT "navigation_footer_legal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interface_strings_overrides" ADD CONSTRAINT "interface_strings_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."interface_strings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "interface_strings_overrides_locales" ADD CONSTRAINT "interface_strings_overrides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."interface_strings_overrides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_meta_robots_order_idx" ON "pages_meta_robots" USING btree ("order");
  CREATE INDEX "pages_meta_robots_parent_idx" ON "pages_meta_robots" USING btree ("parent_id");
  CREATE INDEX "pages_featured_image_idx" ON "pages" USING btree ("featured_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_meta_robots_order_idx" ON "_pages_v_version_meta_robots" USING btree ("order");
  CREATE INDEX "_pages_v_version_meta_robots_parent_idx" ON "_pages_v_version_meta_robots" USING btree ("parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_featured_image_idx" ON "_pages_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "posts_meta_robots_order_idx" ON "posts_meta_robots" USING btree ("order");
  CREATE INDEX "posts_meta_robots_parent_idx" ON "posts_meta_robots" USING btree ("parent_id");
  CREATE INDEX "posts_language_idx" ON "posts" USING btree ("language");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE UNIQUE INDEX "posts_legacy_path_idx" ON "posts" USING btree ("legacy_path");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_version_meta_robots_order_idx" ON "_posts_v_version_meta_robots" USING btree ("order");
  CREATE INDEX "_posts_v_version_meta_robots_parent_idx" ON "_posts_v_version_meta_robots" USING btree ("parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_language_idx" ON "_posts_v" USING btree ("version_language");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_legacy_path_idx" ON "_posts_v" USING btree ("version_legacy_path");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "categories_meta_robots_order_idx" ON "categories_meta_robots" USING btree ("order");
  CREATE INDEX "categories_meta_robots_parent_idx" ON "categories_meta_robots" USING btree ("parent_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_highlights_order_idx" ON "programs_highlights" USING btree ("_order");
  CREATE INDEX "programs_highlights_parent_id_idx" ON "programs_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_highlights_locales_locale_parent_id_unique" ON "programs_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_highlights_locales_parent_id_idx" ON "programs_highlights_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_accreditations_order_idx" ON "programs_accreditations" USING btree ("_order");
  CREATE INDEX "programs_accreditations_parent_id_idx" ON "programs_accreditations" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_accreditations_locales_locale_parent_id_unique" ON "programs_accreditations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_accreditations_locales_parent_id_idx" ON "programs_accreditations_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_learning_outcomes_order_idx" ON "programs_learning_outcomes" USING btree ("_order");
  CREATE INDEX "programs_learning_outcomes_parent_id_idx" ON "programs_learning_outcomes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_learning_outcomes_locales_locale_parent_id_unique" ON "programs_learning_outcomes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_learning_outcomes_locales_parent_id_idx" ON "programs_learning_outcomes_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_careers_order_idx" ON "programs_careers" USING btree ("_order");
  CREATE INDEX "programs_careers_parent_id_idx" ON "programs_careers" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_careers_locales_locale_parent_id_unique" ON "programs_careers_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_careers_locales_parent_id_idx" ON "programs_careers_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_why_study_order_idx" ON "programs_why_study" USING btree ("_order");
  CREATE INDEX "programs_why_study_parent_id_idx" ON "programs_why_study" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_why_study_locales_locale_parent_id_unique" ON "programs_why_study_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_why_study_locales_parent_id_idx" ON "programs_why_study_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_structure_groups_order_idx" ON "programs_structure_groups" USING btree ("_order");
  CREATE INDEX "programs_structure_groups_parent_id_idx" ON "programs_structure_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_structure_groups_locales_locale_parent_id_unique" ON "programs_structure_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_structure_groups_locales_parent_id_idx" ON "programs_structure_groups_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_core_modules_order_idx" ON "programs_core_modules" USING btree ("_order");
  CREATE INDEX "programs_core_modules_parent_id_idx" ON "programs_core_modules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_core_modules_locales_locale_parent_id_unique" ON "programs_core_modules_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_core_modules_locales_parent_id_idx" ON "programs_core_modules_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_majors_modules_order_idx" ON "programs_majors_modules" USING btree ("_order");
  CREATE INDEX "programs_majors_modules_parent_id_idx" ON "programs_majors_modules" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_majors_modules_locales_locale_parent_id_unique" ON "programs_majors_modules_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_majors_modules_locales_parent_id_idx" ON "programs_majors_modules_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_majors_order_idx" ON "programs_majors" USING btree ("_order");
  CREATE INDEX "programs_majors_parent_id_idx" ON "programs_majors" USING btree ("_parent_id");
  CREATE INDEX "programs_majors_slug_idx" ON "programs_majors" USING btree ("slug");
  CREATE INDEX "programs_majors_brochure_idx" ON "programs_majors" USING btree ("brochure_id");
  CREATE UNIQUE INDEX "programs_majors_locales_locale_parent_id_unique" ON "programs_majors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_majors_locales_parent_id_idx" ON "programs_majors_locales" USING btree ("_parent_id");
  CREATE INDEX "programs_meta_robots_order_idx" ON "programs_meta_robots" USING btree ("order");
  CREATE INDEX "programs_meta_robots_parent_idx" ON "programs_meta_robots" USING btree ("parent_id");
  CREATE UNIQUE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_partner_idx" ON "programs" USING btree ("partner_id");
  CREATE INDEX "programs_featured_image_idx" ON "programs" USING btree ("featured_image_id");
  CREATE INDEX "programs_brochure_idx" ON "programs" USING btree ("brochure_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs_meta_meta_image_idx" ON "programs_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "programs_locales_locale_parent_id_unique" ON "programs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_locales_parent_id_idx" ON "programs_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_about_order_idx" ON "partners_about" USING btree ("_order");
  CREATE INDEX "partners_about_parent_id_idx" ON "partners_about" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_about_locales_locale_parent_id_unique" ON "partners_about_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_about_locales_parent_id_idx" ON "partners_about_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_values_order_idx" ON "partners_values" USING btree ("_order");
  CREATE INDEX "partners_values_parent_id_idx" ON "partners_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_values_locales_locale_parent_id_unique" ON "partners_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_values_locales_parent_id_idx" ON "partners_values_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_stats_order_idx" ON "partners_stats" USING btree ("_order");
  CREATE INDEX "partners_stats_parent_id_idx" ON "partners_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "partners_stats_locales_locale_parent_id_unique" ON "partners_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_stats_locales_parent_id_idx" ON "partners_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "partners_meta_robots_order_idx" ON "partners_meta_robots" USING btree ("order");
  CREATE INDEX "partners_meta_robots_parent_idx" ON "partners_meta_robots" USING btree ("parent_id");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_image_idx" ON "partners" USING btree ("image_id");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partners_meta_meta_image_idx" ON "partners_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "partners_locales_locale_parent_id_unique" ON "partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "partners_locales_parent_id_idx" ON "partners_locales" USING btree ("_parent_id");
  CREATE INDEX "accreditations_logo_idx" ON "accreditations" USING btree ("logo_id");
  CREATE INDEX "accreditations_partner_idx" ON "accreditations" USING btree ("partner_id");
  CREATE INDEX "accreditations_updated_at_idx" ON "accreditations" USING btree ("updated_at");
  CREATE INDEX "accreditations_created_at_idx" ON "accreditations" USING btree ("created_at");
  CREATE UNIQUE INDEX "accreditations_locales_locale_parent_id_unique" ON "accreditations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accreditations_locales_parent_id_idx" ON "accreditations_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_expertise_order_idx" ON "academic_members_expertise" USING btree ("_order");
  CREATE INDEX "academic_members_expertise_parent_id_idx" ON "academic_members_expertise" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "academic_members_expertise_locales_locale_parent_id_unique" ON "academic_members_expertise_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "academic_members_expertise_locales_parent_id_idx" ON "academic_members_expertise_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_teaching_order_idx" ON "academic_members_teaching" USING btree ("_order");
  CREATE INDEX "academic_members_teaching_parent_id_idx" ON "academic_members_teaching" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "academic_members_teaching_locales_locale_parent_id_unique" ON "academic_members_teaching_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "academic_members_teaching_locales_parent_id_idx" ON "academic_members_teaching_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_research_order_idx" ON "academic_members_research" USING btree ("_order");
  CREATE INDEX "academic_members_research_parent_id_idx" ON "academic_members_research" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "academic_members_research_locales_locale_parent_id_unique" ON "academic_members_research_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "academic_members_research_locales_parent_id_idx" ON "academic_members_research_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_qualifications_order_idx" ON "academic_members_qualifications" USING btree ("_order");
  CREATE INDEX "academic_members_qualifications_parent_id_idx" ON "academic_members_qualifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "academic_members_qualifications_locales_locale_parent_id_uni" ON "academic_members_qualifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "academic_members_qualifications_locales_parent_id_idx" ON "academic_members_qualifications_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_experience_order_idx" ON "academic_members_experience" USING btree ("_order");
  CREATE INDEX "academic_members_experience_parent_id_idx" ON "academic_members_experience" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "academic_members_experience_locales_locale_parent_id_unique" ON "academic_members_experience_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "academic_members_experience_locales_parent_id_idx" ON "academic_members_experience_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_meta_robots_order_idx" ON "academic_members_meta_robots" USING btree ("order");
  CREATE INDEX "academic_members_meta_robots_parent_idx" ON "academic_members_meta_robots" USING btree ("parent_id");
  CREATE INDEX "academic_members_slug_idx" ON "academic_members" USING btree ("slug");
  CREATE INDEX "academic_members_photo_idx" ON "academic_members" USING btree ("photo_id");
  CREATE INDEX "academic_members_updated_at_idx" ON "academic_members" USING btree ("updated_at");
  CREATE INDEX "academic_members_created_at_idx" ON "academic_members" USING btree ("created_at");
  CREATE INDEX "academic_members_meta_meta_image_idx" ON "academic_members_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "academic_members_locales_locale_parent_id_unique" ON "academic_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "academic_members_locales_parent_id_idx" ON "academic_members_locales" USING btree ("_parent_id");
  CREATE INDEX "academic_members_rels_order_idx" ON "academic_members_rels" USING btree ("order");
  CREATE INDEX "academic_members_rels_parent_idx" ON "academic_members_rels" USING btree ("parent_id");
  CREATE INDEX "academic_members_rels_path_idx" ON "academic_members_rels" USING btree ("path");
  CREATE INDEX "academic_members_rels_specializations_id_idx" ON "academic_members_rels" USING btree ("specializations_id");
  CREATE INDEX "team_members_slug_idx" ON "team_members" USING btree ("slug");
  CREATE INDEX "team_members_photo_idx" ON "team_members" USING btree ("photo_id");
  CREATE INDEX "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "team_members_locales_locale_parent_id_unique" ON "team_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "team_members_locales_parent_id_idx" ON "team_members_locales" USING btree ("_parent_id");
  CREATE INDEX "specializations_slug_idx" ON "specializations" USING btree ("slug");
  CREATE INDEX "specializations_updated_at_idx" ON "specializations" USING btree ("updated_at");
  CREATE INDEX "specializations_created_at_idx" ON "specializations" USING btree ("created_at");
  CREATE UNIQUE INDEX "specializations_locales_locale_parent_id_unique" ON "specializations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "specializations_locales_parent_id_idx" ON "specializations_locales" USING btree ("_parent_id");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_poster_idx" ON "testimonials" USING btree ("poster_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "testimonials_locales_locale_parent_id_unique" ON "testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "testimonials_locales_parent_id_idx" ON "testimonials_locales" USING btree ("_parent_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "faqs_locales_locale_parent_id_unique" ON "faqs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faqs_locales_parent_id_idx" ON "faqs_locales" USING btree ("_parent_id");
  CREATE INDEX "videos_slug_idx" ON "videos" USING btree ("slug");
  CREATE INDEX "videos_poster_idx" ON "videos" USING btree ("poster_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_locales_locale_parent_id_unique" ON "videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "videos_locales_parent_id_idx" ON "videos_locales" USING btree ("_parent_id");
  CREATE INDEX "videos_rels_order_idx" ON "videos_rels" USING btree ("order");
  CREATE INDEX "videos_rels_parent_idx" ON "videos_rels" USING btree ("parent_id");
  CREATE INDEX "videos_rels_path_idx" ON "videos_rels" USING btree ("path");
  CREATE INDEX "videos_rels_video_categories_id_idx" ON "videos_rels" USING btree ("video_categories_id");
  CREATE INDEX "video_categories_slug_idx" ON "video_categories" USING btree ("slug");
  CREATE INDEX "video_categories_updated_at_idx" ON "video_categories" USING btree ("updated_at");
  CREATE INDEX "video_categories_created_at_idx" ON "video_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "video_categories_locales_locale_parent_id_unique" ON "video_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "video_categories_locales_parent_id_idx" ON "video_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "podcasts_episodes_order_idx" ON "podcasts_episodes" USING btree ("_order");
  CREATE INDEX "podcasts_episodes_parent_id_idx" ON "podcasts_episodes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "podcasts_episodes_locales_locale_parent_id_unique" ON "podcasts_episodes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "podcasts_episodes_locales_parent_id_idx" ON "podcasts_episodes_locales" USING btree ("_parent_id");
  CREATE INDEX "podcasts_slug_idx" ON "podcasts" USING btree ("slug");
  CREATE INDEX "podcasts_cover_idx" ON "podcasts" USING btree ("cover_id");
  CREATE INDEX "podcasts_updated_at_idx" ON "podcasts" USING btree ("updated_at");
  CREATE INDEX "podcasts_created_at_idx" ON "podcasts" USING btree ("created_at");
  CREATE UNIQUE INDEX "podcasts_locales_locale_parent_id_unique" ON "podcasts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "podcasts_locales_parent_id_idx" ON "podcasts_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_fields_locales_locale_parent_id_unique" ON "forms_fields_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_fields_locales_parent_id_idx" ON "forms_fields_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_slug_idx" ON "forms" USING btree ("slug");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_locales_parent_id_idx" ON "forms_locales" USING btree ("_parent_id");
  CREATE INDEX "forms_texts_order_parent" ON "forms_texts" USING btree ("order","parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_avatar_idx" ON "users" USING btree ("avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_posts_id_idx" ON "redirects_rels" USING btree ("posts_id");
  CREATE INDEX "redirects_rels_programs_id_idx" ON "redirects_rels" USING btree ("programs_id");
  CREATE INDEX "redirects_rels_partners_id_idx" ON "redirects_rels" USING btree ("partners_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_accreditations_id_idx" ON "payload_locked_documents_rels" USING btree ("accreditations_id");
  CREATE INDEX "payload_locked_documents_rels_academic_members_id_idx" ON "payload_locked_documents_rels" USING btree ("academic_members_id");
  CREATE INDEX "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX "payload_locked_documents_rels_specializations_id_idx" ON "payload_locked_documents_rels" USING btree ("specializations_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_video_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("video_categories_id");
  CREATE INDEX "payload_locked_documents_rels_podcasts_id_idx" ON "payload_locked_documents_rels" USING btree ("podcasts_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_hero_badges_order_idx" ON "home_page_hero_badges" USING btree ("_order");
  CREATE INDEX "home_page_hero_badges_parent_id_idx" ON "home_page_hero_badges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_hero_badges_locales_locale_parent_id_unique" ON "home_page_hero_badges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_badges_locales_parent_id_idx" ON "home_page_hero_badges_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_figures_countries_order_idx" ON "home_page_figures_countries" USING btree ("_order");
  CREATE INDEX "home_page_figures_countries_parent_id_idx" ON "home_page_figures_countries" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_figures_countries_locales_locale_parent_id_unique" ON "home_page_figures_countries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_figures_countries_locales_parent_id_idx" ON "home_page_figures_countries_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_figures_stats_order_idx" ON "home_page_figures_stats" USING btree ("_order");
  CREATE INDEX "home_page_figures_stats_parent_id_idx" ON "home_page_figures_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_figures_stats_locales_locale_parent_id_unique" ON "home_page_figures_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_figures_stats_locales_parent_id_idx" ON "home_page_figures_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_why_items_order_idx" ON "home_page_why_items" USING btree ("_order");
  CREATE INDEX "home_page_why_items_parent_id_idx" ON "home_page_why_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_why_items_locales_locale_parent_id_unique" ON "home_page_why_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_why_items_locales_parent_id_idx" ON "home_page_why_items_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_about_values_order_idx" ON "home_page_about_values" USING btree ("_order");
  CREATE INDEX "home_page_about_values_parent_id_idx" ON "home_page_about_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_about_values_locales_locale_parent_id_unique" ON "home_page_about_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_about_values_locales_parent_id_idx" ON "home_page_about_values_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_ceo_message_order_idx" ON "home_page_ceo_message" USING btree ("_order");
  CREATE INDEX "home_page_ceo_message_parent_id_idx" ON "home_page_ceo_message" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_ceo_message_locales_locale_parent_id_unique" ON "home_page_ceo_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_ceo_message_locales_parent_id_idx" ON "home_page_ceo_message_locales" USING btree ("_parent_id");
  CREATE INDEX "home_page_meta_robots_order_idx" ON "home_page_meta_robots" USING btree ("order");
  CREATE INDEX "home_page_meta_robots_parent_idx" ON "home_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "home_page_hero_hero_image_idx" ON "home_page" USING btree ("hero_image_id");
  CREATE INDEX "home_page_about_about_image_idx" ON "home_page" USING btree ("about_image_id");
  CREATE INDEX "home_page_about_about_image_two_idx" ON "home_page" USING btree ("about_image_two_id");
  CREATE INDEX "home_page_video_video_poster_idx" ON "home_page" USING btree ("video_poster_id");
  CREATE INDEX "home_page_ceo_ceo_photo_idx" ON "home_page" USING btree ("ceo_photo_id");
  CREATE INDEX "home_page_cta_cta_image_idx" ON "home_page" USING btree ("cta_image_id");
  CREATE INDEX "home_page_meta_meta_image_idx" ON "home_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_locales_parent_id_idx" ON "home_page_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_intro_body_order_idx" ON "about_page_intro_body" USING btree ("_order");
  CREATE INDEX "about_page_intro_body_parent_id_idx" ON "about_page_intro_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_intro_body_locales_locale_parent_id_unique" ON "about_page_intro_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_intro_body_locales_parent_id_idx" ON "about_page_intro_body_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_purpose_stats_order_idx" ON "about_page_purpose_stats" USING btree ("_order");
  CREATE INDEX "about_page_purpose_stats_parent_id_idx" ON "about_page_purpose_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_purpose_stats_locales_locale_parent_id_unique" ON "about_page_purpose_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_purpose_stats_locales_parent_id_idx" ON "about_page_purpose_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_ceremonies_stats_order_idx" ON "about_page_ceremonies_stats" USING btree ("_order");
  CREATE INDEX "about_page_ceremonies_stats_parent_id_idx" ON "about_page_ceremonies_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_ceremonies_stats_locales_locale_parent_id_unique" ON "about_page_ceremonies_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_ceremonies_stats_locales_parent_id_idx" ON "about_page_ceremonies_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_meta_robots_order_idx" ON "about_page_meta_robots" USING btree ("order");
  CREATE INDEX "about_page_meta_robots_parent_idx" ON "about_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "about_page_intro_intro_image_idx" ON "about_page" USING btree ("intro_image_id");
  CREATE INDEX "about_page_meta_meta_image_idx" ON "about_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_locales_parent_id_idx" ON "about_page_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_rels_order_idx" ON "about_page_rels" USING btree ("order");
  CREATE INDEX "about_page_rels_parent_idx" ON "about_page_rels" USING btree ("parent_id");
  CREATE INDEX "about_page_rels_path_idx" ON "about_page_rels" USING btree ("path");
  CREATE INDEX "about_page_rels_media_id_idx" ON "about_page_rels" USING btree ("media_id");
  CREATE INDEX "contact_page_intro_body_order_idx" ON "contact_page_intro_body" USING btree ("_order");
  CREATE INDEX "contact_page_intro_body_parent_id_idx" ON "contact_page_intro_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_page_intro_body_locales_locale_parent_id_unique" ON "contact_page_intro_body_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_intro_body_locales_parent_id_idx" ON "contact_page_intro_body_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_page_intro_hours_order_idx" ON "contact_page_intro_hours" USING btree ("_order");
  CREATE INDEX "contact_page_intro_hours_parent_id_idx" ON "contact_page_intro_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_page_intro_hours_locales_locale_parent_id_unique" ON "contact_page_intro_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_intro_hours_locales_parent_id_idx" ON "contact_page_intro_hours_locales" USING btree ("_parent_id");
  CREATE INDEX "contact_page_meta_robots_order_idx" ON "contact_page_meta_robots" USING btree ("order");
  CREATE INDEX "contact_page_meta_robots_parent_idx" ON "contact_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "contact_page_meta_meta_image_idx" ON "contact_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "contact_page_locales_locale_parent_id_unique" ON "contact_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contact_page_locales_parent_id_idx" ON "contact_page_locales" USING btree ("_parent_id");
  CREATE INDEX "people_page_teams_order_idx" ON "people_page_teams" USING btree ("_order");
  CREATE INDEX "people_page_teams_parent_id_idx" ON "people_page_teams" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "people_page_teams_locales_locale_parent_id_unique" ON "people_page_teams_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_page_teams_locales_parent_id_idx" ON "people_page_teams_locales" USING btree ("_parent_id");
  CREATE INDEX "people_page_meta_robots_order_idx" ON "people_page_meta_robots" USING btree ("order");
  CREATE INDEX "people_page_meta_robots_parent_idx" ON "people_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "people_page_meta_meta_image_idx" ON "people_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "people_page_locales_locale_parent_id_unique" ON "people_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "people_page_locales_parent_id_idx" ON "people_page_locales" USING btree ("_parent_id");
  CREATE INDEX "staff_page_meta_robots_order_idx" ON "staff_page_meta_robots" USING btree ("order");
  CREATE INDEX "staff_page_meta_robots_parent_idx" ON "staff_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "staff_page_meta_meta_image_idx" ON "staff_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "staff_page_locales_locale_parent_id_unique" ON "staff_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "staff_page_locales_parent_id_idx" ON "staff_page_locales" USING btree ("_parent_id");
  CREATE INDEX "stories_page_meta_robots_order_idx" ON "stories_page_meta_robots" USING btree ("order");
  CREATE INDEX "stories_page_meta_robots_parent_idx" ON "stories_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "stories_page_meta_meta_image_idx" ON "stories_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "stories_page_locales_locale_parent_id_unique" ON "stories_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stories_page_locales_parent_id_idx" ON "stories_page_locales" USING btree ("_parent_id");
  CREATE INDEX "gallery_page_meta_robots_order_idx" ON "gallery_page_meta_robots" USING btree ("order");
  CREATE INDEX "gallery_page_meta_robots_parent_idx" ON "gallery_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "gallery_page_meta_meta_image_idx" ON "gallery_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "gallery_page_locales_locale_parent_id_unique" ON "gallery_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "gallery_page_locales_parent_id_idx" ON "gallery_page_locales" USING btree ("_parent_id");
  CREATE INDEX "podcast_page_meta_robots_order_idx" ON "podcast_page_meta_robots" USING btree ("order");
  CREATE INDEX "podcast_page_meta_robots_parent_idx" ON "podcast_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "podcast_page_meta_meta_image_idx" ON "podcast_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "podcast_page_locales_locale_parent_id_unique" ON "podcast_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "podcast_page_locales_parent_id_idx" ON "podcast_page_locales" USING btree ("_parent_id");
  CREATE INDEX "faq_page_meta_robots_order_idx" ON "faq_page_meta_robots" USING btree ("order");
  CREATE INDEX "faq_page_meta_robots_parent_idx" ON "faq_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "faq_page_meta_meta_image_idx" ON "faq_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "faq_page_locales_locale_parent_id_unique" ON "faq_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_page_locales_parent_id_idx" ON "faq_page_locales" USING btree ("_parent_id");
  CREATE INDEX "accreditations_page_meta_robots_order_idx" ON "accreditations_page_meta_robots" USING btree ("order");
  CREATE INDEX "accreditations_page_meta_robots_parent_idx" ON "accreditations_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "accreditations_page_meta_meta_image_idx" ON "accreditations_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "accreditations_page_locales_locale_parent_id_unique" ON "accreditations_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "accreditations_page_locales_parent_id_idx" ON "accreditations_page_locales" USING btree ("_parent_id");
  CREATE INDEX "fees_page_intro_highlights_order_idx" ON "fees_page_intro_highlights" USING btree ("_order");
  CREATE INDEX "fees_page_intro_highlights_parent_id_idx" ON "fees_page_intro_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "fees_page_intro_highlights_locales_locale_parent_id_unique" ON "fees_page_intro_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fees_page_intro_highlights_locales_parent_id_idx" ON "fees_page_intro_highlights_locales" USING btree ("_parent_id");
  CREATE INDEX "fees_page_breakdown_items_order_idx" ON "fees_page_breakdown_items" USING btree ("_order");
  CREATE INDEX "fees_page_breakdown_items_parent_id_idx" ON "fees_page_breakdown_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "fees_page_breakdown_items_locales_locale_parent_id_unique" ON "fees_page_breakdown_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fees_page_breakdown_items_locales_parent_id_idx" ON "fees_page_breakdown_items_locales" USING btree ("_parent_id");
  CREATE INDEX "fees_page_payments_items_order_idx" ON "fees_page_payments_items" USING btree ("_order");
  CREATE INDEX "fees_page_payments_items_parent_id_idx" ON "fees_page_payments_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "fees_page_payments_items_locales_locale_parent_id_unique" ON "fees_page_payments_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fees_page_payments_items_locales_parent_id_idx" ON "fees_page_payments_items_locales" USING btree ("_parent_id");
  CREATE INDEX "fees_page_value_points_order_idx" ON "fees_page_value_points" USING btree ("_order");
  CREATE INDEX "fees_page_value_points_parent_id_idx" ON "fees_page_value_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "fees_page_value_points_locales_locale_parent_id_unique" ON "fees_page_value_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fees_page_value_points_locales_parent_id_idx" ON "fees_page_value_points_locales" USING btree ("_parent_id");
  CREATE INDEX "fees_page_refund_questions_order_idx" ON "fees_page_refund_questions" USING btree ("_order");
  CREATE INDEX "fees_page_refund_questions_parent_id_idx" ON "fees_page_refund_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "fees_page_refund_questions_locales_locale_parent_id_unique" ON "fees_page_refund_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fees_page_refund_questions_locales_parent_id_idx" ON "fees_page_refund_questions_locales" USING btree ("_parent_id");
  CREATE INDEX "fees_page_meta_robots_order_idx" ON "fees_page_meta_robots" USING btree ("order");
  CREATE INDEX "fees_page_meta_robots_parent_idx" ON "fees_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "fees_page_meta_meta_image_idx" ON "fees_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "fees_page_locales_locale_parent_id_unique" ON "fees_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "fees_page_locales_parent_id_idx" ON "fees_page_locales" USING btree ("_parent_id");
  CREATE INDEX "social_page_intro_tags_order_idx" ON "social_page_intro_tags" USING btree ("_order");
  CREATE INDEX "social_page_intro_tags_parent_id_idx" ON "social_page_intro_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "social_page_intro_tags_locales_locale_parent_id_unique" ON "social_page_intro_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_page_intro_tags_locales_parent_id_idx" ON "social_page_intro_tags_locales" USING btree ("_parent_id");
  CREATE INDEX "social_page_pillars_items_order_idx" ON "social_page_pillars_items" USING btree ("_order");
  CREATE INDEX "social_page_pillars_items_parent_id_idx" ON "social_page_pillars_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "social_page_pillars_items_locales_locale_parent_id_unique" ON "social_page_pillars_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_page_pillars_items_locales_parent_id_idx" ON "social_page_pillars_items_locales" USING btree ("_parent_id");
  CREATE INDEX "social_page_ecosystem_items_order_idx" ON "social_page_ecosystem_items" USING btree ("_order");
  CREATE INDEX "social_page_ecosystem_items_parent_id_idx" ON "social_page_ecosystem_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "social_page_ecosystem_items_locales_locale_parent_id_unique" ON "social_page_ecosystem_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_page_ecosystem_items_locales_parent_id_idx" ON "social_page_ecosystem_items_locales" USING btree ("_parent_id");
  CREATE INDEX "social_page_meta_robots_order_idx" ON "social_page_meta_robots" USING btree ("order");
  CREATE INDEX "social_page_meta_robots_parent_idx" ON "social_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "social_page_initiative_initiative_image_idx" ON "social_page" USING btree ("initiative_image_id");
  CREATE INDEX "social_page_meta_meta_image_idx" ON "social_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "social_page_locales_locale_parent_id_unique" ON "social_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "social_page_locales_parent_id_idx" ON "social_page_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_intro_stats_order_idx" ON "ceremonies_page_intro_stats" USING btree ("_order");
  CREATE INDEX "ceremonies_page_intro_stats_parent_id_idx" ON "ceremonies_page_intro_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ceremonies_page_intro_stats_locales_locale_parent_id_unique" ON "ceremonies_page_intro_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_intro_stats_locales_parent_id_idx" ON "ceremonies_page_intro_stats_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_legacy_points_order_idx" ON "ceremonies_page_legacy_points" USING btree ("_order");
  CREATE INDEX "ceremonies_page_legacy_points_parent_id_idx" ON "ceremonies_page_legacy_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ceremonies_page_legacy_points_locales_locale_parent_id_uniqu" ON "ceremonies_page_legacy_points_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_legacy_points_locales_parent_id_idx" ON "ceremonies_page_legacy_points_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_timeline_items_order_idx" ON "ceremonies_page_timeline_items" USING btree ("_order");
  CREATE INDEX "ceremonies_page_timeline_items_parent_id_idx" ON "ceremonies_page_timeline_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ceremonies_page_timeline_items_locales_locale_parent_id_uniq" ON "ceremonies_page_timeline_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_timeline_items_locales_parent_id_idx" ON "ceremonies_page_timeline_items_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_gallery_images_order_idx" ON "ceremonies_page_gallery_images" USING btree ("_order");
  CREATE INDEX "ceremonies_page_gallery_images_parent_id_idx" ON "ceremonies_page_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_gallery_images_image_idx" ON "ceremonies_page_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "ceremonies_page_gallery_images_locales_locale_parent_id_uniq" ON "ceremonies_page_gallery_images_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_gallery_images_locales_parent_id_idx" ON "ceremonies_page_gallery_images_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_films_items_order_idx" ON "ceremonies_page_films_items" USING btree ("_order");
  CREATE INDEX "ceremonies_page_films_items_parent_id_idx" ON "ceremonies_page_films_items" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_films_items_poster_idx" ON "ceremonies_page_films_items" USING btree ("poster_id");
  CREATE UNIQUE INDEX "ceremonies_page_films_items_locales_locale_parent_id_unique" ON "ceremonies_page_films_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_films_items_locales_parent_id_idx" ON "ceremonies_page_films_items_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_highlights_items_order_idx" ON "ceremonies_page_highlights_items" USING btree ("_order");
  CREATE INDEX "ceremonies_page_highlights_items_parent_id_idx" ON "ceremonies_page_highlights_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ceremonies_page_highlights_items_locales_locale_parent_id_un" ON "ceremonies_page_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_highlights_items_locales_parent_id_idx" ON "ceremonies_page_highlights_items_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_next_facts_order_idx" ON "ceremonies_page_next_facts" USING btree ("_order");
  CREATE INDEX "ceremonies_page_next_facts_parent_id_idx" ON "ceremonies_page_next_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ceremonies_page_next_facts_locales_locale_parent_id_unique" ON "ceremonies_page_next_facts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_next_facts_locales_parent_id_idx" ON "ceremonies_page_next_facts_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_next_agenda_order_idx" ON "ceremonies_page_next_agenda" USING btree ("_order");
  CREATE INDEX "ceremonies_page_next_agenda_parent_id_idx" ON "ceremonies_page_next_agenda" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ceremonies_page_next_agenda_locales_locale_parent_id_unique" ON "ceremonies_page_next_agenda_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_next_agenda_locales_parent_id_idx" ON "ceremonies_page_next_agenda_locales" USING btree ("_parent_id");
  CREATE INDEX "ceremonies_page_meta_robots_order_idx" ON "ceremonies_page_meta_robots" USING btree ("order");
  CREATE INDEX "ceremonies_page_meta_robots_parent_idx" ON "ceremonies_page_meta_robots" USING btree ("parent_id");
  CREATE INDEX "ceremonies_page_legacy_legacy_image_idx" ON "ceremonies_page" USING btree ("legacy_image_id");
  CREATE INDEX "ceremonies_page_next_next_image_idx" ON "ceremonies_page" USING btree ("next_image_id");
  CREATE INDEX "ceremonies_page_meta_meta_image_idx" ON "ceremonies_page_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "ceremonies_page_locales_locale_parent_id_unique" ON "ceremonies_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ceremonies_page_locales_parent_id_idx" ON "ceremonies_page_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "site_settings_organization_organization_logo_idx" ON "site_settings" USING btree ("organization_logo_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "navigation_primary_children_order_idx" ON "navigation_primary_children" USING btree ("_order");
  CREATE INDEX "navigation_primary_children_parent_id_idx" ON "navigation_primary_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_primary_children_locale_idx" ON "navigation_primary_children" USING btree ("_locale");
  CREATE INDEX "navigation_primary_order_idx" ON "navigation_primary" USING btree ("_order");
  CREATE INDEX "navigation_primary_parent_id_idx" ON "navigation_primary" USING btree ("_parent_id");
  CREATE INDEX "navigation_primary_locale_idx" ON "navigation_primary" USING btree ("_locale");
  CREATE INDEX "navigation_footer_explore_children_order_idx" ON "navigation_footer_explore_children" USING btree ("_order");
  CREATE INDEX "navigation_footer_explore_children_parent_id_idx" ON "navigation_footer_explore_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_explore_children_locale_idx" ON "navigation_footer_explore_children" USING btree ("_locale");
  CREATE INDEX "navigation_footer_explore_order_idx" ON "navigation_footer_explore" USING btree ("_order");
  CREATE INDEX "navigation_footer_explore_parent_id_idx" ON "navigation_footer_explore" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_explore_locale_idx" ON "navigation_footer_explore" USING btree ("_locale");
  CREATE INDEX "navigation_footer_programs_children_order_idx" ON "navigation_footer_programs_children" USING btree ("_order");
  CREATE INDEX "navigation_footer_programs_children_parent_id_idx" ON "navigation_footer_programs_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_programs_children_locale_idx" ON "navigation_footer_programs_children" USING btree ("_locale");
  CREATE INDEX "navigation_footer_programs_order_idx" ON "navigation_footer_programs" USING btree ("_order");
  CREATE INDEX "navigation_footer_programs_parent_id_idx" ON "navigation_footer_programs" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_programs_locale_idx" ON "navigation_footer_programs" USING btree ("_locale");
  CREATE INDEX "navigation_footer_legal_children_order_idx" ON "navigation_footer_legal_children" USING btree ("_order");
  CREATE INDEX "navigation_footer_legal_children_parent_id_idx" ON "navigation_footer_legal_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_legal_children_locale_idx" ON "navigation_footer_legal_children" USING btree ("_locale");
  CREATE INDEX "navigation_footer_legal_order_idx" ON "navigation_footer_legal" USING btree ("_order");
  CREATE INDEX "navigation_footer_legal_parent_id_idx" ON "navigation_footer_legal" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_legal_locale_idx" ON "navigation_footer_legal" USING btree ("_locale");
  CREATE INDEX "interface_strings_overrides_order_idx" ON "interface_strings_overrides" USING btree ("_order");
  CREATE INDEX "interface_strings_overrides_parent_id_idx" ON "interface_strings_overrides" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "interface_strings_overrides_locales_locale_parent_id_unique" ON "interface_strings_overrides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "interface_strings_overrides_locales_parent_id_idx" ON "interface_strings_overrides_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_meta_robots" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v_version_meta_robots" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "posts_meta_robots" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_meta_robots" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories_meta_robots" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "programs_highlights" CASCADE;
  DROP TABLE "programs_highlights_locales" CASCADE;
  DROP TABLE "programs_accreditations" CASCADE;
  DROP TABLE "programs_accreditations_locales" CASCADE;
  DROP TABLE "programs_learning_outcomes" CASCADE;
  DROP TABLE "programs_learning_outcomes_locales" CASCADE;
  DROP TABLE "programs_careers" CASCADE;
  DROP TABLE "programs_careers_locales" CASCADE;
  DROP TABLE "programs_why_study" CASCADE;
  DROP TABLE "programs_why_study_locales" CASCADE;
  DROP TABLE "programs_structure_groups" CASCADE;
  DROP TABLE "programs_structure_groups_locales" CASCADE;
  DROP TABLE "programs_core_modules" CASCADE;
  DROP TABLE "programs_core_modules_locales" CASCADE;
  DROP TABLE "programs_majors_modules" CASCADE;
  DROP TABLE "programs_majors_modules_locales" CASCADE;
  DROP TABLE "programs_majors" CASCADE;
  DROP TABLE "programs_majors_locales" CASCADE;
  DROP TABLE "programs_meta_robots" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_locales" CASCADE;
  DROP TABLE "partners_about" CASCADE;
  DROP TABLE "partners_about_locales" CASCADE;
  DROP TABLE "partners_values" CASCADE;
  DROP TABLE "partners_values_locales" CASCADE;
  DROP TABLE "partners_stats" CASCADE;
  DROP TABLE "partners_stats_locales" CASCADE;
  DROP TABLE "partners_meta_robots" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partners_locales" CASCADE;
  DROP TABLE "accreditations" CASCADE;
  DROP TABLE "accreditations_locales" CASCADE;
  DROP TABLE "academic_members_expertise" CASCADE;
  DROP TABLE "academic_members_expertise_locales" CASCADE;
  DROP TABLE "academic_members_teaching" CASCADE;
  DROP TABLE "academic_members_teaching_locales" CASCADE;
  DROP TABLE "academic_members_research" CASCADE;
  DROP TABLE "academic_members_research_locales" CASCADE;
  DROP TABLE "academic_members_qualifications" CASCADE;
  DROP TABLE "academic_members_qualifications_locales" CASCADE;
  DROP TABLE "academic_members_experience" CASCADE;
  DROP TABLE "academic_members_experience_locales" CASCADE;
  DROP TABLE "academic_members_meta_robots" CASCADE;
  DROP TABLE "academic_members" CASCADE;
  DROP TABLE "academic_members_locales" CASCADE;
  DROP TABLE "academic_members_rels" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "team_members_locales" CASCADE;
  DROP TABLE "specializations" CASCADE;
  DROP TABLE "specializations_locales" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_locales" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_locales" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_locales" CASCADE;
  DROP TABLE "videos_rels" CASCADE;
  DROP TABLE "video_categories" CASCADE;
  DROP TABLE "video_categories_locales" CASCADE;
  DROP TABLE "podcasts_episodes" CASCADE;
  DROP TABLE "podcasts_episodes_locales" CASCADE;
  DROP TABLE "podcasts" CASCADE;
  DROP TABLE "podcasts_locales" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms_fields_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "forms_texts" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_hero_badges" CASCADE;
  DROP TABLE "home_page_hero_badges_locales" CASCADE;
  DROP TABLE "home_page_figures_countries" CASCADE;
  DROP TABLE "home_page_figures_countries_locales" CASCADE;
  DROP TABLE "home_page_figures_stats" CASCADE;
  DROP TABLE "home_page_figures_stats_locales" CASCADE;
  DROP TABLE "home_page_why_items" CASCADE;
  DROP TABLE "home_page_why_items_locales" CASCADE;
  DROP TABLE "home_page_about_values" CASCADE;
  DROP TABLE "home_page_about_values_locales" CASCADE;
  DROP TABLE "home_page_ceo_message" CASCADE;
  DROP TABLE "home_page_ceo_message_locales" CASCADE;
  DROP TABLE "home_page_meta_robots" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "about_page_intro_body" CASCADE;
  DROP TABLE "about_page_intro_body_locales" CASCADE;
  DROP TABLE "about_page_purpose_stats" CASCADE;
  DROP TABLE "about_page_purpose_stats_locales" CASCADE;
  DROP TABLE "about_page_ceremonies_stats" CASCADE;
  DROP TABLE "about_page_ceremonies_stats_locales" CASCADE;
  DROP TABLE "about_page_meta_robots" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "about_page_rels" CASCADE;
  DROP TABLE "contact_page_intro_body" CASCADE;
  DROP TABLE "contact_page_intro_body_locales" CASCADE;
  DROP TABLE "contact_page_intro_hours" CASCADE;
  DROP TABLE "contact_page_intro_hours_locales" CASCADE;
  DROP TABLE "contact_page_meta_robots" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "contact_page_locales" CASCADE;
  DROP TABLE "people_page_teams" CASCADE;
  DROP TABLE "people_page_teams_locales" CASCADE;
  DROP TABLE "people_page_meta_robots" CASCADE;
  DROP TABLE "people_page" CASCADE;
  DROP TABLE "people_page_locales" CASCADE;
  DROP TABLE "staff_page_meta_robots" CASCADE;
  DROP TABLE "staff_page" CASCADE;
  DROP TABLE "staff_page_locales" CASCADE;
  DROP TABLE "stories_page_meta_robots" CASCADE;
  DROP TABLE "stories_page" CASCADE;
  DROP TABLE "stories_page_locales" CASCADE;
  DROP TABLE "gallery_page_meta_robots" CASCADE;
  DROP TABLE "gallery_page" CASCADE;
  DROP TABLE "gallery_page_locales" CASCADE;
  DROP TABLE "podcast_page_meta_robots" CASCADE;
  DROP TABLE "podcast_page" CASCADE;
  DROP TABLE "podcast_page_locales" CASCADE;
  DROP TABLE "faq_page_meta_robots" CASCADE;
  DROP TABLE "faq_page" CASCADE;
  DROP TABLE "faq_page_locales" CASCADE;
  DROP TABLE "accreditations_page_meta_robots" CASCADE;
  DROP TABLE "accreditations_page" CASCADE;
  DROP TABLE "accreditations_page_locales" CASCADE;
  DROP TABLE "fees_page_intro_highlights" CASCADE;
  DROP TABLE "fees_page_intro_highlights_locales" CASCADE;
  DROP TABLE "fees_page_breakdown_items" CASCADE;
  DROP TABLE "fees_page_breakdown_items_locales" CASCADE;
  DROP TABLE "fees_page_payments_items" CASCADE;
  DROP TABLE "fees_page_payments_items_locales" CASCADE;
  DROP TABLE "fees_page_value_points" CASCADE;
  DROP TABLE "fees_page_value_points_locales" CASCADE;
  DROP TABLE "fees_page_refund_questions" CASCADE;
  DROP TABLE "fees_page_refund_questions_locales" CASCADE;
  DROP TABLE "fees_page_meta_robots" CASCADE;
  DROP TABLE "fees_page" CASCADE;
  DROP TABLE "fees_page_locales" CASCADE;
  DROP TABLE "social_page_intro_tags" CASCADE;
  DROP TABLE "social_page_intro_tags_locales" CASCADE;
  DROP TABLE "social_page_pillars_items" CASCADE;
  DROP TABLE "social_page_pillars_items_locales" CASCADE;
  DROP TABLE "social_page_ecosystem_items" CASCADE;
  DROP TABLE "social_page_ecosystem_items_locales" CASCADE;
  DROP TABLE "social_page_meta_robots" CASCADE;
  DROP TABLE "social_page" CASCADE;
  DROP TABLE "social_page_locales" CASCADE;
  DROP TABLE "ceremonies_page_intro_stats" CASCADE;
  DROP TABLE "ceremonies_page_intro_stats_locales" CASCADE;
  DROP TABLE "ceremonies_page_legacy_points" CASCADE;
  DROP TABLE "ceremonies_page_legacy_points_locales" CASCADE;
  DROP TABLE "ceremonies_page_timeline_items" CASCADE;
  DROP TABLE "ceremonies_page_timeline_items_locales" CASCADE;
  DROP TABLE "ceremonies_page_gallery_images" CASCADE;
  DROP TABLE "ceremonies_page_gallery_images_locales" CASCADE;
  DROP TABLE "ceremonies_page_films_items" CASCADE;
  DROP TABLE "ceremonies_page_films_items_locales" CASCADE;
  DROP TABLE "ceremonies_page_highlights_items" CASCADE;
  DROP TABLE "ceremonies_page_highlights_items_locales" CASCADE;
  DROP TABLE "ceremonies_page_next_facts" CASCADE;
  DROP TABLE "ceremonies_page_next_facts_locales" CASCADE;
  DROP TABLE "ceremonies_page_next_agenda" CASCADE;
  DROP TABLE "ceremonies_page_next_agenda_locales" CASCADE;
  DROP TABLE "ceremonies_page_meta_robots" CASCADE;
  DROP TABLE "ceremonies_page" CASCADE;
  DROP TABLE "ceremonies_page_locales" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_primary_children" CASCADE;
  DROP TABLE "navigation_primary" CASCADE;
  DROP TABLE "navigation_footer_explore_children" CASCADE;
  DROP TABLE "navigation_footer_explore" CASCADE;
  DROP TABLE "navigation_footer_programs_children" CASCADE;
  DROP TABLE "navigation_footer_programs" CASCADE;
  DROP TABLE "navigation_footer_legal_children" CASCADE;
  DROP TABLE "navigation_footer_legal" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "interface_strings_overrides" CASCADE;
  DROP TABLE "interface_strings_overrides_locales" CASCADE;
  DROP TABLE "interface_strings" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_meta_robots";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_meta_robots";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_meta_robots";
  DROP TYPE "public"."enum_posts_language";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_meta_robots";
  DROP TYPE "public"."enum__posts_v_version_language";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_categories_meta_robots";
  DROP TYPE "public"."enum_programs_majors_icon";
  DROP TYPE "public"."enum_programs_meta_robots";
  DROP TYPE "public"."enum_programs_level";
  DROP TYPE "public"."enum_partners_stats_icon";
  DROP TYPE "public"."enum_partners_meta_robots";
  DROP TYPE "public"."enum_academic_members_meta_robots";
  DROP TYPE "public"."enum_podcasts_episodes_source";
  DROP TYPE "public"."enum_podcasts_layout";
  DROP TYPE "public"."enum_forms_fields_type";
  DROP TYPE "public"."enum_forms_fields_width";
  DROP TYPE "public"."enum_forms_fields_choices_source";
  DROP TYPE "public"."enum_forms_fields_condition_operator";
  DROP TYPE "public"."enum_form_submissions_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_home_page_figures_stats_icon";
  DROP TYPE "public"."enum_home_page_meta_robots";
  DROP TYPE "public"."enum_about_page_purpose_stats_icon";
  DROP TYPE "public"."enum_about_page_ceremonies_stats_icon";
  DROP TYPE "public"."enum_about_page_meta_robots";
  DROP TYPE "public"."enum_contact_page_meta_robots";
  DROP TYPE "public"."enum_people_page_meta_robots";
  DROP TYPE "public"."enum_staff_page_meta_robots";
  DROP TYPE "public"."enum_stories_page_meta_robots";
  DROP TYPE "public"."enum_gallery_page_meta_robots";
  DROP TYPE "public"."enum_podcast_page_meta_robots";
  DROP TYPE "public"."enum_faq_page_meta_robots";
  DROP TYPE "public"."enum_accreditations_page_meta_robots";
  DROP TYPE "public"."enum_fees_page_meta_robots";
  DROP TYPE "public"."enum_social_page_meta_robots";
  DROP TYPE "public"."enum_ceremonies_page_intro_stats_icon";
  DROP TYPE "public"."enum_ceremonies_page_timeline_items_status";
  DROP TYPE "public"."enum_ceremonies_page_meta_robots";
  DROP TYPE "public"."enum_interface_strings_overrides_key";`)
}
