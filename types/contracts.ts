// Layer Contracts for nihonGO
//
// Dependency Direction (enforced by convention):
//   Screens (app/)           -> Hooks, UI Components, Adapters
//   Hooks (hooks/)           -> Stores, Lib utilities
//   UI Primitives (ui/)      -> Tokens ONLY (no store imports!)
//   Adapters (lib/adapters/) -> Types only
//   Content (data/)          -> Types only
//   Stores (stores/)         -> AsyncStorage, no UI imports

import { ContentVocabulary, ContentGrammar } from './content';

// --- Content Provider ---
// Any data source (Genki, JLPT, AI, future sources) must implement this
// interface to feed content to UI components.

export interface ContentProvider {
  readonly source: 'genki' | 'jlpt' | 'ai';
  getVocabulary(): ContentVocabulary[];
  getGrammar(): ContentGrammar[];
}

// --- Store Selector Types ---
// Typed selectors for Zustand stores to enforce narrow reads.

export interface ProgressSelectors {
  isLessonCompleted: (lessonId: string) => boolean;
  getBestScore: (lessonId: string, sectionId: string) => { score: number; total: number; percentage: number; date: string } | null;
}

export interface SettingsSelectors {
  isOnline: boolean;
  aiProvider: string;
  apiKey: string | null;
}

// --- Adapter Contract ---
// All adapters must provide these conversion functions.

export interface VocabularyAdapter<TSource> {
  toContentVocabulary(item: TSource): ContentVocabulary;
  toContentVocabularyList(items: TSource[]): ContentVocabulary[];
}

export interface GrammarAdapter<TSource> {
  toContentGrammar(item: TSource): ContentGrammar;
  toContentGrammarList(items: TSource[]): ContentGrammar[];
}
