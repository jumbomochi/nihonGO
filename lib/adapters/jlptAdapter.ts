// JLPT -> Content type adapters
// Pure mapping functions from JLPT types to unified Content types.

import { JLPTVocabulary, JLPTGrammar } from '@/data/jlpt/types';
import { ContentVocabulary, ContentGrammar, ContentPartOfSpeech } from '@/types/content';

const VALID_PARTS_OF_SPEECH: ContentPartOfSpeech[] = [
  'noun', 'verb', 'i-adjective', 'na-adjective',
  'adverb', 'particle', 'expression', 'counter',
  'prefix', 'suffix', 'conjunction', 'other',
];

function toContentPartOfSpeech(pos: string): ContentPartOfSpeech {
  if (VALID_PARTS_OF_SPEECH.includes(pos as ContentPartOfSpeech)) {
    return pos as ContentPartOfSpeech;
  }
  return 'other';
}

export function toContentVocabulary(item: JLPTVocabulary): ContentVocabulary {
  return {
    id: item.id,
    japanese: item.word,
    reading: item.reading,
    english: item.meaning,
    partOfSpeech: toContentPartOfSpeech(item.partOfSpeech),
    example: {
      japanese: item.exampleSentence,
      reading: item.exampleReading,
      english: item.exampleMeaning,
    },
    source: 'jlpt',
  };
}

export function toContentGrammar(point: JLPTGrammar): ContentGrammar {
  return {
    id: point.id,
    pattern: point.pattern,
    meaning: point.meaning,
    formation: point.formation,
    explanation: point.explanation,
    examples: point.examples.map((ex) => ({
      japanese: ex.japanese,
      reading: ex.reading,
      english: ex.english,
    })),
    notes: point.notes,
    relatedGrammar: point.similarPatterns,
    source: 'jlpt',
  };
}

export function toContentVocabularyList(items: JLPTVocabulary[]): ContentVocabulary[] {
  return items.map(toContentVocabulary);
}

export function toContentGrammarList(points: JLPTGrammar[]): ContentGrammar[] {
  return points.map(toContentGrammar);
}
