import { JLPTUnit, JLPTUnitMeta } from '../types';

// Import units (will be generated)
import { unit01 } from './units/unit01-daily-life';
import { unit02 } from './units/unit02-work-office';
import { unit03 } from './units/unit03-health';
import { unit04 } from './units/unit04-travel';
import { unit05 } from './units/unit05-shopping';
import { unit06 } from './units/unit06-education';
import { unit07 } from './units/unit07-media';
import { unit08 } from './units/unit08-relationships';
import { unit09 } from './units/unit09-nature';

export const N3_UNITS: JLPTUnit[] = [
  unit01,
  unit02,
  unit03,
  unit04,
  unit05,
  unit06,
  unit07,
  unit08,
  unit09,
];

export function getN3Units(): JLPTUnitMeta[] {
  return N3_UNITS.map((unit) => ({
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

export function getN3Unit(unitId: string): JLPTUnit | undefined {
  return N3_UNITS.find((u) => u.id === unitId);
}

export { unit01, unit02, unit03, unit04, unit05, unit06, unit07, unit08, unit09 };
