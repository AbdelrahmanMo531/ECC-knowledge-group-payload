import type { SiteSettings } from '@/lib/cms/types';

/**
 * Code an editor pasted into ECC Settings, written into every page.
 *
 * This is how an advertising or analytics pixel gets onto the site — Meta,
 * Snapchat, TikTok, a Google tag, a tag manager container — without a deploy.
 * The snippet goes in under Settings → ECC Settings and appears on every page
 * of both languages.
 *
 * `dangerouslySetInnerHTML` is not a shortcut here, it is the requirement: a
 * pixel is `<script>` tags and JavaScript, and anything that escapes it
 * produces text on the page instead of code that runs. What makes that safe is
 * where the string comes from — WordPress only lets a user who may already
 * post unfiltered HTML edit these two boxes, so anyone who can set them can
 * already put a script on the site by other means. It is never visitor input
 * and never a URL parameter.
 *
 * Inline scripts run as the browser parses them, so `head` code placed at the
 * top of the document body runs before the page's own content — which is what
 * every pixel's "paste this in the header" instruction is actually asking for.
 * React does not hoist inline scripts into `<head>`, and the App Router has no
 * way to put raw markup there, so this is the earliest the code can honestly
 * be run.
 */
export function SiteCode({
  code,
  slot,
}: {
  code: SiteSettings['code'];
  /** `head` runs before the page content, `body` after it. */
  slot: 'head' | 'body';
}) {
  const html = code?.[slot]?.trim();
  if (!html) return null;

  /*
   * A plain wrapper, not a hidden one.
   *
   * Raw HTML has to be set on some element, and the temptation is to mark it
   * `hidden` since a pixel is invisible anyway. But not everything pasted into
   * these boxes is invisible — a chat widget's markup is the usual exception —
   * and `display: none` would swallow it with no clue why. A div holding only
   * scripts already occupies nothing.
   */
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
