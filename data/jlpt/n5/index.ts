// JLPT N5 - Beginner Level (Exam-Focused Supplement to Genki I)
// Focus: Test strategies, supplementary vocabulary, exam-style practice
// Complements Genki I content rather than duplicating it

import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import all N5 units
import { unit01 } from './units/unit01-exam-overview-strategies';
import { unit02 } from './units/unit02-vocabulary-numbers-counters';
import { unit03 } from './units/unit03-vocabulary-supplementary';
import { unit04 } from './units/unit04-grammar-exam-patterns';
import { unit05 } from './units/unit05-reading-signs-menus';
import { unit06 } from './units/unit06-reading-short-passages';
import { unit07 } from './units/unit07-listening-task-based';
import { unit08 } from './units/unit08-listening-quick-response';
import { unit09 } from './units/unit09-practice-test-1';
import { unit10 } from './units/unit10-practice-test-2';

// Export all units as an array
export const N5_UNITS: JLPTUnit[] = [
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
export function getN5UnitMeta(): JLPTUnitMeta[] {
  return N5_UNITS.map((unit) => ({
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
export function getN5Units(): JLPTUnit[] {
  return N5_UNITS;
}

// Helper to get a specific unit by ID
export function getN5Unit(unitId: string): JLPTUnit | undefined {
  return N5_UNITS.find((u) => u.id === unitId);
}
