// NOTE: `cache` is process-lifetime. Tests that need fresh data must call
// `_resetCacheForTesting()` before (or after) each test that touches this module.
import { VocabularyItem } from '@/types/genki';
import { getBookLessons } from '@/data/genki';

let cache: VocabularyItem[] | null = null;

export function getAllVocabularyForLevel(): VocabularyItem[] {
  if (cache) return cache;
  const all: VocabularyItem[] = [];
  const lessons = [...getBookLessons('genki1'), ...getBookLessons('genki2')];
  for (const lesson of lessons) {
    for (const section of lesson.sections) {
      if (section.content.vocabulary) {
        all.push(...section.content.vocabulary);
      }
    }
  }
  cache = all;
  return all;
}

export function _resetCacheForTesting(): void {
  cache = null;
}
