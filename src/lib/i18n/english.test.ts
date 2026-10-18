import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

/**
 * English that would reach the Arabic site.
 *
 * Two mistakes keep being made, neither of which fails a build, a type check
 * or any other test — the page simply renders in the wrong language and only a
 * reader of that language notices.
 *
 * Both are checked by reading the source, because both are about how a string
 * came to be rather than what it says, and nothing at runtime can tell the
 * difference between a sentence that went through the dictionary and one that
 * did not.
 */

const ROOTS = ['src/app', 'src/components'];

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return path.endsWith('.tsx') ? [path] : [];
  });
}

const FILES = ROOTS.flatMap(tsxFiles).map((path) => ({
  path,
  source: readFileSync(path, 'utf8'),
}));

test('the source was found at all', () => {
  // A path change that silently matched nothing would make every check below
  // pass by having nothing to check.
  assert.ok(FILES.length > 40, `only ${FILES.length} files`);
});

/**
 * `generateMetadata` runs in its own scope, before the page has said what
 * language it is. `t()` there answers from the default locale whatever the URL
 * says, so an Arabic page gets an English title — see the note on `store()` in
 * `server.ts`. The locale is handed to the function outright; `translate()`
 * takes it.
 */
test('no metadata is translated with t()', () => {
  const offenders: string[] = [];

  for (const { path, source } of FILES) {
    const start = source.indexOf('export async function generateMetadata');
    if (start < 0) continue;

    /*
     * To the next top-level declaration, whether it is exported or not.
     *
     * Stopping only at `export` swallowed a plain `function PartnerSchema`
     * defined below it — a component, rendered from the page, where `t()` is
     * exactly right. The check then reported the file it was standing in.
     */
    const end = source.slice(start + 10).search(/\n(export |function |const |type )/);
    const body = source.slice(start, end < 0 ? source.length : start + 10 + end);

    for (const [, key] of body.matchAll(/\bt\('([^']+)'\)/g)) {
      offenders.push(`${path}: t('${key}')`);
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `use translate(locale, key) in generateMetadata:\n${offenders.join('\n')}`,
  );
});

/**
 * A sentence assembled in the markup never reaches the dictionary.
 *
 * `` `${count} academics` `` and `` `Why study with ${name}` `` are English
 * wherever they render. The fix is one string per language with a `{blank}` in
 * it, filled by `format()` — Arabic puts the value somewhere else in the
 * clause and wants different words around it, so there is no order of
 * concatenation that is right in both.
 *
 * Matched narrowly: a capital letter and two English-looking words on either
 * side of an interpolation. A template holding only a class name, a URL or a
 * single identifier is not prose and is left alone.
 */
test('no English sentence is built out of a template literal', () => {
  const SENTENCE = [
    /`[A-Z][a-z]+ [a-z]+[^`]*\$\{/, // "Why study this programme with ${…}"
    /\$\{[^}]+\}[a-z ]* [a-z]{3,} [a-z]{3,}[^`]*`/, // "${n} of the things"
  ];

  const offenders: string[] = [];

  for (const { path, source } of FILES) {
    for (const line of source.split('\n')) {
      // Only the ones that render. A className, an href or a query is a
      // template literal too, and none of them is prose.
      if (/className|href|url\(|import |from '|@\/|\/graphql|mailto:/.test(line)) continue;
      if (!/\$\{/.test(line)) continue;

      if (SENTENCE.some((pattern) => pattern.test(line))) {
        offenders.push(`${path}: ${line.trim().slice(0, 90)}`);
      }
    }
  }

  assert.deepEqual(
    offenders,
    [],
    `put these in the dictionary and fill them with format():\n${offenders.join('\n')}`,
  );
});
