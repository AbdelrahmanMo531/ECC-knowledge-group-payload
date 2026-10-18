import { ModuleList } from '@/components/programs/ModuleList';
import { ModuleTable } from '@/components/programs/ModuleTable';
import { isTabular } from '@/lib/programs/curriculum';
import type { Module } from '@/lib/cms/types';

/**
 * A set of modules, rendered the way the data asks to be rendered.
 *
 * Programmes are documented two ways. Some describe every module — aims and
 * learning outcomes — which reads best as an accordion. Others publish a
 * schedule of module, credits and level, which is a table. The editor picks by
 * filling in one set of columns or the other, not by choosing a display mode.
 */
export function Modules({
  modules,
  aimsLabel,
  className = '',
}: {
  modules: Module[];
  aimsLabel?: string;
  className?: string;
}) {
  if (modules.length === 0) return null;

  return isTabular(modules) ? (
    <ModuleTable modules={modules} className={className} />
  ) : (
    <ModuleList modules={modules} aimsLabel={aimsLabel} className={className} />
  );
}
