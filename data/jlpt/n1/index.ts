// JLPT N1 - Advanced Level
// Themes: Advanced Business, Advanced Politics, Advanced Science, Literature & Criticism,
// Philosophy & Ethics, Advanced Law, Economics & Finance, Medicine & Health, Media & Journalism, Classical & Modern Japanese

import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import all N1 units
import { unit01 } from './units/unit01-advanced-business';
import { unit02 } from './units/unit02-advanced-politics';
import { unit03 } from './units/unit03-advanced-science';
import { unit04 } from './units/unit04-literature-criticism';
import { unit05 } from './units/unit05-philosophy-ethics';
import { unit06 } from './units/unit06-advanced-law';
import { unit07 } from './units/unit07-economics-finance';
import { unit08 } from './units/unit08-medicine-health';
import { unit09 } from './units/unit09-media-journalism';
import { unit10 } from './units/unit10-classical-modern';

// Export all units as an array
export const N1_UNITS: JLPTUnit[] = [
  unit01,
  unit02,
  unit03,
  unit04,
  unit05,
  unit06,
  unit07,
  unit08,
  unit09,
  unit10,
];

// Helper function to get unit metadata for listing
export function getN1UnitMeta(): JLPTUnitMeta[] {
  return N1_UNITS.map((unit) => ({
    id: unit.id,
    level: unit.level,
    unitNumber: unit.unitNumber,
    theme: unit.theme,
    themeJapanese: unit.themeJapanese,
    description: unit.description,
    vocabularyCount: unit.sections.vocabulary.length,
    kanjiCount: unit.sections.kanji.length,
    grammarCount: unit.sections.grammar.length,
  }));
}

// Helper to get all units
export function getN1Units(): JLPTUnit[] {
  return N1_UNITS;
}

// Helper to get a specific unit by ID
export function getN1Unit(unitId: string): JLPTUnit | undefined {
  return N1_UNITS.find((u) => u.id === unitId);
}
