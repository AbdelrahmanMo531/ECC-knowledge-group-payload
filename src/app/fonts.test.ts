import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

/**
 * Every font the stylesheet asks for is actually there.
 *
 * A missing webfont is the quietest failure the site has. Nothing throws,
 * nothing fails to build, no test goes red — the browser requests the file,
 * gets a 404 into a console nobody is reading, and renders the whole site in
 * a system font. It stayed that way through months of work, with the brand's
 * typography absent from every page and the stylesheet still declaring it.
 *
 * So the declarations are read out of the stylesheet rather than listed here:
 * adding a weight nobody uploaded fails, and so does deleting a file that is
 * still declared.
 */

const CSS = readFileSync('src/app/(frontend)/globals.css', 'utf8');
const PUBLIC = 'public';

/** Every `src: url(...)` in the stylesheet's @font-face blocks. */
const declared = [...CSS.matchAll(/src:\s*url\('([^']+)'\)/g)].map(
  ([, url]) => url,
);

test('the stylesheet declares fonts at all', () => {
  // A rewrite that moved the @font-face blocks elsewhere would otherwise make
  // every check below pass by having nothing to check.
  assert.ok(declared.length >= 5, `found ${declared.length} declarations`);
});

/**
 * This one is expected to be red until somebody acts on it.
 *
 * Somar Sans is licensed and cannot be committed, so the files are not here
 * and the site is not rendering in its own brand face. Both ways of clearing
 * this are things that ought to happen, and neither is a change to make on
 * somebody else's behalf:
 *
 *   - drop the three licensed .woff2 files into public/fonts, or
 *   - decide the site is not using Somar Sans and delete its @font-face
 *     blocks and the two stacks that name it in globals.css.
 *
 * A green suite would forget. This does not.
 */
test('every declared font file exists', () => {
  const missing = declared.filter((url) => !existsSync(join(PUBLIC, url)));

  assert.deepEqual(
    missing,
    [],
    [
      `Declared in globals.css but not in ${PUBLIC}/fonts:`,
      ...missing.map((url) => `  ${url}`),
      '',
      'Every page is rendering in a fallback face until these arrive.',
      'Either add the licensed files, or remove the @font-face blocks that',
      'ask for them — see the note at the top of globals.css.',
    ].join('\n'),
  );
});

test('none of them is a placeholder', () => {
  // A zero-byte or truncated file is worse than a missing one: it 200s, so
  // there is not even a 404 to notice.
  const tiny = declared
    .filter((url) => existsSync(join(PUBLIC, url)))
    .filter((url) => statSync(join(PUBLIC, url)).size < 4096);

  assert.deepEqual(tiny, [], `suspiciously small:\n${tiny.join('\n')}`);
});

test('every font that ships carries its licence', () => {
  const families = new Set(
    declared
      .filter((url) => existsSync(join(PUBLIC, url)))
      .map((url) => url.split('/').pop()!.split('-')[0]),
  );

  const unlicensed = [...families].filter(
    (family) => !existsSync(join(PUBLIC, 'fonts', `${family}-OFL.txt`)),
  );

  // Only the open-licensed ones are committed, and each has to bring its
  // licence with it. A licensed face dropped in by hand is the site owner's
  // to account for, so it is named here rather than failing the build.
  assert.deepEqual(
    unlicensed.filter((family) => family !== 'SomarSans'),
    [],
    `committed without a licence file:\n${unlicensed.join('\n')}`,
  );
});
