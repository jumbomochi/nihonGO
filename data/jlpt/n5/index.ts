// JLPT N5 - Beginner Level
// Themes: Greetings & Introductions, Numbers & Time, Daily Activities, Food & Drinks,
// Places & Directions, Family & People, Objects & Things, Adjectives & Descriptions, Verbs & Actions, Basic Conversation

import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import all N5 units
import { unit01 } from './units/unit01-greetings-introductions';
import { unit02 } from './units/unit02-numbers-time';
import { unit03 } from './units/unit03-daily-activities';
import { unit04 } from './units/unit04-food-drinks';
import { unit05 } from './units/unit05-places-directions';
import { unit06 } from './units/unit06-family-people';
import { unit07 } from './units/unit07-objects-things';
import { unit08 } from './units/unit08-adjectives-descriptions';
import { unit09 } from './units/unit09-verbs-actions';
import { unit10 } from './units/unit10-basic-conversation';

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
