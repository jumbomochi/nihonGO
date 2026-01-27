// JLPT N2 - Upper Intermediate Level
// Themes: Business, Politics, Science, Culture, Environment, History, Psychology, Law, Global Issues, Academic

import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import all N2 units
import { unit01 } from './units/unit01-business-economy';
import { unit02 } from './units/unit02-politics-society';
import { unit03 } from './units/unit03-science-technology';
import { unit04 } from './units/unit04-culture-arts';
import { unit05 } from './units/unit05-environment-energy';
import { unit06 } from './units/unit06-history-tradition';
import { unit07 } from './units/unit07-psychology-philosophy';
import { unit08 } from './units/unit08-law-justice';
import { unit09 } from './units/unit09-global-issues';
import { unit10 } from './units/unit10-academic-research';

// Export all units as an array
export const N2_UNITS: JLPTUnit[] = [
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
export function getN2UnitMeta(): JLPTUnitMeta[] {
  return N2_UNITS.map((unit) => ({
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
export function getN2Units(): JLPTUnit[] {
  return N2_UNITS;
}

// Helper to get a specific unit by ID
export function getN2Unit(unitId: string): JLPTUnit | undefined {
  return N2_UNITS.find((u) => u.id === unitId);
}
