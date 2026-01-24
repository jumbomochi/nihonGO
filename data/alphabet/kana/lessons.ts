// data/alphabet/kana/lessons.ts

import { AlphabetLesson, KanaCharacter, KanaPair, KanaRow } from '@/types/alphabet';
import {
  HIRAGANA_A_ROW, KATAKANA_A_ROW,
  HIRAGANA_KA_ROW, KATAKANA_KA_ROW,
  HIRAGANA_SA_ROW, KATAKANA_SA_ROW,
  HIRAGANA_TA_ROW, KATAKANA_TA_ROW,
  HIRAGANA_NA_ROW, KATAKANA_NA_ROW,
  HIRAGANA_HA_ROW, KATAKANA_HA_ROW,
  HIRAGANA_MA_ROW, KATAKANA_MA_ROW,
  HIRAGANA_YA_ROW, KATAKANA_YA_ROW,
  HIRAGANA_RA_ROW, KATAKANA_RA_ROW,
  HIRAGANA_WA_ROW, KATAKANA_WA_ROW,
} from './characters';

// Helper to create pairs from hiragana and katakana arrays
function createPairs(
  hiragana: KanaCharacter[],
  katakana: KanaCharacter[]
): KanaPair[] {
  if (hiragana.length !== katakana.length) {
    throw new Error(
      `Hiragana and katakana arrays must have the same length. Got ${hiragana.length} hiragana and ${katakana.length} katakana.`
    );
  }
  return hiragana.map((h, i) => ({
    romaji: h.romaji,
    hiragana: h,
    katakana: katakana[i],
  }));
}

// Helper to create a lesson
function createLesson(
  lessonNumber: number,
  row: KanaRow,
  title: string,
  titleJapanese: string,
  hiragana: KanaCharacter[],
  katakana: KanaCharacter[]
): AlphabetLesson {
  return {
    id: `kana-lesson-${lessonNumber.toString().padStart(2, '0')}`,
    type: 'kana',
    lessonNumber,
    title,
    titleJapanese,
    row,
    pairs: createPairs(hiragana, katakana),
  };
}

export const KANA_LESSONS: AlphabetLesson[] = [
  createLesson(1, 'a', 'A-row (あ行)', 'あ行', HIRAGANA_A_ROW, KATAKANA_A_ROW),
  createLesson(2, 'ka', 'Ka-row (か行)', 'か行', HIRAGANA_KA_ROW, KATAKANA_KA_ROW),
  createLesson(3, 'sa', 'Sa-row (さ行)', 'さ行', HIRAGANA_SA_ROW, KATAKANA_SA_ROW),
  createLesson(4, 'ta', 'Ta-row (た行)', 'た行', HIRAGANA_TA_ROW, KATAKANA_TA_ROW),
  createLesson(5, 'na', 'Na-row (な行)', 'な行', HIRAGANA_NA_ROW, KATAKANA_NA_ROW),
  createLesson(6, 'ha', 'Ha-row (は行)', 'は行', HIRAGANA_HA_ROW, KATAKANA_HA_ROW),
  createLesson(7, 'ma', 'Ma-row (ま行)', 'ま行', HIRAGANA_MA_ROW, KATAKANA_MA_ROW),
  createLesson(8, 'ya', 'Ya-row (や行)', 'や行', HIRAGANA_YA_ROW, KATAKANA_YA_ROW),
  createLesson(9, 'ra', 'Ra-row (ら行)', 'ら行', HIRAGANA_RA_ROW, KATAKANA_RA_ROW),
  createLesson(10, 'wa', 'Wa-row + N (わ行・ん)', 'わ行・ん', HIRAGANA_WA_ROW, KATAKANA_WA_ROW),
];

export function getKanaLesson(lessonId: string): AlphabetLesson | undefined {
  return KANA_LESSONS.find((l) => l.id === lessonId);
}

export function getAllKanaLessonIds(): string[] {
  return KANA_LESSONS.map((l) => l.id);
}
