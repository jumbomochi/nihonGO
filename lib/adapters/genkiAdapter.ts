// Genki -> Content type adapters
// Pure mapping functions from Genki types to unified Content types.

import { VocabularyItem, GrammarPoint } from '@/types/genki';
import { ContentVocabulary, ContentGrammar } from '@/types/content';

export function toContentVocabulary(item: VocabularyItem): ContentVocabulary {
  return {
    id: item.id,
    japanese: item.japanese,
    reading: item.reading,
    english: item.english,
    partOfSpeech: item.partOfSpeech,
    romaji: item.romaji,
    category: item.category,
    notes: item.notes,
    audioFile: item.audioFile,
    source: 'genki',
  };
}

export function toContentGrammar(point: GrammarPoint): ContentGrammar {
  return {
    id: point.id,
    title: point.title,
    pattern: point.pattern,
    explanation: point.explanation,
    culturalNote: point.culturalNote,
    examples: point.examples.map((ex) => ({
      japanese: ex.japanese,
      reading: ex.reading,
      english: ex.english,
      breakdown: ex.breakdown,
    })),
    relatedGrammar: point.relatedGrammar,
    source: 'genki',
  };
}

export function toContentVocabularyList(items: VocabularyItem[]): ContentVocabulary[] {
  return items.map(toContentVocabulary);
}

export function toContentGrammarList(points: GrammarPoint[]): ContentGrammar[] {
  return points.map(toContentGrammar);
}
