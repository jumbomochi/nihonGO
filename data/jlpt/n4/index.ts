// JLPT N4 - Elementary Level (Exam-Focused Supplement to Genki II)
// Focus: Test strategies, supplementary vocabulary, exam-style practice
// Complements Genki II content rather than duplicating it

import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import all N4 units
import { unit01 } from './units/unit01-exam-overview-strategies';
import { unit02 } from './units/unit02-vocabulary-intermediate';
import { unit03 } from './units/unit03-vocabulary-work-social';
import { unit04 } from './units/unit04-grammar-intermediate';
import { unit05 } from './units/unit05-grammar-complex-sentences';
import { unit06 } from './units/unit06-reading-notices-instructions';
import { unit07 } from './units/unit07-reading-essays-letters';
import { unit08 } from './units/unit08-listening-conversations';
import { unit09 } from './units/unit09-listening-integrated';
import { unit10 } from './units/unit10-full-practice-test';

// Export all units as an array
export const N4_UNITS: JLPTUnit[] = [
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
export function getN4UnitMeta(): JLPTUnitMeta[] {
  return N4_UNITS.map((unit) => ({
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
export function getN4Units(): JLPTUnit[] {
  return N4_UNITS;
}

// Helper to get a specific unit by ID
export function getN4Unit(unitId: string): JLPTUnit | undefined {
  return N4_UNITS.find((u) => u.id === unitId);
}
