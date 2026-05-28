// lib/srs/migration.ts

import { SrsItem } from '@/types/srs';
import { CharacterMastery } from '@/types/games';
import { ALL_HIRAGANA, ALL_KATAKANA } from '@/data/alphabet';
import * as Sentry from '@sentry/react-native';

const KANA_BY_ID = new Map<
  string,
  { character: string; romaji: string; kanaType: 'hiragana' | 'katakana' }
>();
for (const k of ALL_HIRAGANA) {
  KANA_BY_ID.set(k.id, { character: k.character, romaji: k.romaji, kanaType: 'hiragana' });
}
for (const k of ALL_KATAKANA) {
  KANA_BY_ID.set(k.id, { character: k.character, romaji: k.romaji, kanaType: 'katakana' });
}

export function migrateCharacterMasteryToSrs(
  oldMap: Record<string, CharacterMastery>
): Record<string, SrsItem> {
  const result: Record<string, SrsItem> = {};

  for (const [id, entry] of Object.entries(oldMap)) {
    const kana = KANA_BY_ID.get(id);
    if (!kana) {
      Sentry.captureMessage(`SRS migration: dropping orphan character id "${id}"`, 'info');
      continue;
    }

    result[`kana:${id}`] = {
      itemKey: `kana:${id}`,
      type: 'kana',
      refId: id,
      correctCount: entry.correctCount,
      incorrectCount: entry.incorrectCount,
      masteryLevel: entry.masteryLevel,
      lastReviewedAt: entry.lastPracticed,
      nextReviewDate: entry.nextReviewDate,
      payload: {
        kind: 'kana',
        character: kana.character,
        romaji: kana.romaji,
        kanaType: kana.kanaType,
      },
    };
  }

  return result;
}
