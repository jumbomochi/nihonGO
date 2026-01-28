// JLPT N4 - Elementary Level
// Themes: Self & Family, Home & Neighborhood, School & Study, Work & Office,
// Shopping & Money, Health & Hospital, Travel & Transport, Seasons & Weather, Hobbies & Sports, Culture & Customs

import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import all N4 units
import { unit01 } from './units/unit01-self-family';
import { unit02 } from './units/unit02-home-neighborhood';
import { unit03 } from './units/unit03-school-study';
import { unit04 } from './units/unit04-work-office';
import { unit05 } from './units/unit05-shopping-money';
import { unit06 } from './units/unit06-health-hospital';
import { unit07 } from './units/unit07-travel-transport';
import { unit08 } from './units/unit08-seasons-weather';
import { unit09 } from './units/unit09-hobbies-sports';
import { unit10 } from './units/unit10-culture-customs';

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
