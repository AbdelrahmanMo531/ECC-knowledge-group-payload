'use client';

import { useState } from 'react';

import { BrochureButton } from '@/components/programs/BrochureButton';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Modules } from '@/components/programs/Modules';
import { majorIcon } from '@/components/ui/majorIcons';
import type { Major } from '@/lib/cms/types';
import { Arrow } from '@/components/ui/Arrow';
import { format } from '@/lib/i18n/dictionary';
import { useT } from '@/lib/i18n/useT';

/**
 * The majors chooser.
 *
 * Seventeen specialisations is too many to stack down the page, and an
 * accordion of seventeen closed rows tells a visitor nothing. A list of names
 * beside a detail panel lets someone scan every option at once and read only
 * the one that matters to them.
 *
 * Every major renders in the list even when it has no overview yet — the names
 * themselves are the selling point, and hiding the undocumented ones would
 * understate the programme.
 */
export function MajorExplorer({ id, majors }: { id?: string; majors: Major[] }) {
  const t = useT();
  const [activeId, setActiveId] = useState(majors[0]?.id ?? '');

  if (majors.length === 0) return null;

  const active = majors.find((major) => major.id === activeId) ?? majors[0];
  const ActiveIcon = majorIcon(active.icon, active.name);

  return (
    <section
      id={id}
      className="scroll-mt-[9.5rem] bg-brand-beige/60 py-20 lg:py-24"
    >
      <Container size="wide">
        <SectionHeading
          eyebrow={t('section.majors.eyebrow')}
          title={t('section.majors.title')}
          description={format(t('section.majors.count'), {
            count: majors.length,
          })}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Chooser */}
          <div className="lg:col-span-4">
            <ul
              className="max-h-[30rem] overflow-y-auto rounded-[var(--radius-brand)] border border-brand-sand bg-white p-2"
              // The list scrolls independently so the detail panel stays put
              // while a visitor works through seventeen options.
            >
              {majors.map((major) => {
                const isActive = major.id === active.id;
                const Icon = majorIcon(major.icon, major.name);

                return (
                  <li key={major.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(major.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-start text-sm transition-colors duration-200 ${
                        isActive
                          ? 'bg-brand-teal font-medium text-brand-beige'
                          : 'text-brand-ink/75 hover:bg-brand-beige/70 hover:text-brand-teal'
                      }`}
                    >
                      {/*
                        `shrink-0`, or a two-line name squeezes the mark into an
                        oval. Dimmed on the inactive rows so the column of marks
                        guides the eye without competing with the names.
                      */}
                      <Icon
                        className={`shrink-0 ${isActive ? '' : 'text-brand-turquoise/70'}`}
                      />

                      {/* Takes the slack, so the arrow sits hard against the
                          end of the row rather than against the name. */}
                      <span className="flex-1">{major.name}</span>

                      {isActive ? <Arrow /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          <div className="lg:col-span-8">
            <div className="h-full rounded-[calc(var(--radius-brand)*1.5)] border border-brand-sand bg-white p-8 sm:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-turquoise">
                    {t('section.major')}
                  </span>

                  {/*
                    The same mark again, at the size of the heading it sits
                    with. Without it the panel and the list look like two
                    different things, and the mark a visitor just clicked
                    disappears at the moment it should be confirming their
                    choice.
                  */}
                  <h3 className="mt-3 flex items-center gap-3 text-2xl font-bold leading-tight text-brand-teal sm:text-3xl">
                    <ActiveIcon
                      width={30}
                      height={30}
                      className="shrink-0 text-brand-turquoise"
                    />
                    {active.name}
                  </h3>
                </div>

                {/*
                  The major's own brochure, not the programme's — it changes
                  with the selection, and majors without a file simply show no
                  button.
                */}
                <BrochureButton
                  brochure={active.brochure}
                  context={active.name}
                  tone="solid"
                  size="sm"
                />
              </div>

              <span aria-hidden className="mt-5 block h-px w-14 bg-brand-gold" />

              {active.overview ? (
                <div
                  className="prose-ecc mt-6"
                  // Overview HTML, rendered on the server from the rich text in the admin.
                  dangerouslySetInnerHTML={{ __html: active.overview }}
                />
              ) : (
                <p className="mt-6 text-base leading-relaxed text-brand-ink/60">
                  {t('section.majors.body')}
                </p>
              )}

              {active.modules.length > 0 ? (
                <div className="mt-9">
                  <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-brand-ink/45">
                    {t('programme.modules')}
                  </h4>
                  <Modules modules={active.modules} className="mt-5" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
