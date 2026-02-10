// Unified Content Types for nihonGO
// These types normalize vocabulary and grammar across all content sources (Genki, JLPT, AI).

export type ContentPartOfSpeech =
  | 'noun' | 'verb' | 'i-adjective' | 'na-adjective'
  | 'adverb' | 'particle' | 'expression' | 'counter'
  | 'prefix' | 'suffix' | 'conjunction' | 'other';

export interface ContentGrammarExample {
  japanese: string;
  reading: string;
  english: string;
  breakdown?: string;
}

export interface ContentVocabulary {
  id: string;
  japanese: string;
  reading: string;
  english: string;
  partOfSpeech: ContentPartOfSpeech;
  romaji?: string;
  category?: string;
  notes?: string;
  example?: { japanese: string; reading: string; english: string };
  audioFile?: string;
  source: 'genki' | 'jlpt' | 'ai';
}

export interface ContentGrammar {
  id: string;
  title?: string;
  pattern: string;
  meaning?: string;
  explanation: string;
  formation?: string;
  culturalNote?: string;
  examples: ContentGrammarExample[];
  notes?: string;
  relatedGrammar?: string[];
  source: 'genki' | 'jlpt' | 'ai';
}
