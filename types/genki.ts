// Genki Textbook Types for nihonGO

// Book identification
export type GenkiBook = 'genki1' | 'genki2';

// Audio section types matching the folder structure
export type AudioSection = 'jws' | 'kaiwa_bunpo' | 'yomikaki' | 'workbook';

// Lesson section types
export type LessonSectionType =
  | 'dialogue'
  | 'vocabulary'
  | 'grammar'
  | 'expressions'
  | 'culture'
  | 'reading'
  | 'writing'
  | 'practice';

// Part of speech for vocabulary
export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'i-adjective'
  | 'na-adjective'
  | 'adverb'
  | 'particle'
  | 'expression'
  | 'counter'
  | 'prefix'
  | 'suffix'
  | 'conjunction'
  | 'other';

// Vocabulary item with full details
export interface VocabularyItem {
  id: string;
  japanese: string; // Kanji/kana form
  reading: string; // Hiragana reading
  romaji: string; // Romanization for beginners
  english: string; // English translation
  partOfSpeech: PartOfSpeech;
  category?: string; // e.g., "Time", "Family", "Verbs - Ru"
  notes?: string; // Usage notes or cultural context
  audioFile?: string; // Path to pronunciation audio
}

// Grammar example with breakdown
export interface GrammarExample {
  japanese: string;
  reading: string;
  english: string;
  breakdown?: string; // Morphological breakdown
}

// Grammar point with examples
export interface GrammarPoint {
  id: string;
  title: string; // e.g., "X は Y です"
  pattern: string; // The grammar pattern
  explanation: string; // How to use it
  culturalNote?: string; // Why natives use this
  examples: GrammarExample[];
  relatedGrammar?: string[]; // IDs of related grammar points
}

// Grammar comparison for similar grammar points
export interface GrammarComparison {
  id: string;
  grammarA: string; // ID of first grammar point
  grammarB: string; // ID of second grammar point
  keyDifferences: {
    aspect: string; // e.g., "Formality", "Usage"
    grammarA: string; // How A handles this
    grammarB: string; // How B handles this
  }[];
  commonMistakes: string[];
  usageTip: string;
  contrastExamples: {
    situation: string;
    grammarA: { japanese: string; english: string };
    grammarB: { japanese: string; english: string };
  }[];
}

// Dialogue line
export interface DialogueLine {
  speaker: string;
  japanese: string;
  reading: string;
  english: string;
  audioTimestamp?: number; // Seconds into audio file
}

// Dialogue with characters
export interface Dialogue {
  id: string;
  title: string;
  titleJapanese?: string;
  context: string; // Situation description
  characters: string[]; // e.g., ["Mary", "Takeshi"]
  lines: DialogueLine[];
  audioFile?: string; // Path to full dialogue audio
}

// Cultural note
export interface CulturalNote {
  id: string;
  title: string;
  content: string;
  relatedLesson: string;
}

// Exercise for practice
export interface Exercise {
  id: string;
  type: 'fill-blank' | 'translate' | 'match' | 'listen' | 'speak';
  prompt: string;
  promptJapanese?: string;
  answer: string;
  options?: string[]; // For multiple choice
  hint?: string;
}

// Audio track metadata
export interface AudioTrack {
  id: string;
  filename: string; // e.g., "K01_01.mp3"
  section: AudioSection;
  lessonId: string;
  title: string;
  titleJapanese?: string;
  durationSeconds?: number;
  trackNumber: number;
}

// Lesson section content (modular content block)
export interface LessonSectionContent {
  vocabulary?: VocabularyItem[];
  grammar?: GrammarPoint[];
  dialogue?: Dialogue; // Single dialogue (backward compatible)
  dialogues?: Dialogue[]; // Multiple dialogues
  culturalNote?: CulturalNote;
  exercises?: Exercise[];
  text?: string; // For reading/writing sections
}

// Lesson section
export interface LessonSection {
  id: string;
  type: LessonSectionType;
  title: string;
  titleJapanese?: string;
  content: LessonSectionContent;
  audioTracks?: AudioTrack[];
}

// Complete Genki lesson
export interface GenkiLesson {
  id: string; // e.g., "genki1-lesson01"
  book: GenkiBook;
  lessonNumber: number; // 1-12 for Genki I, 13-23 for Genki II
  title: string; // e.g., "New Friends"
  titleJapanese: string; // e.g., "あたらしいともだち"
  description: string;
  objectives: string[]; // Learning goals
  sections: LessonSection[];
  audioTracks: AudioTrack[];
  estimatedMinutes: number;
}

// Book metadata
export interface GenkiBookData {
  id: GenkiBook;
  title: string;
  titleJapanese: string;
  description: string;
  lessons: GenkiLesson[];
  totalLessons: number;
}

// Progress tracking for Genki lessons
export interface GenkiLessonProgress {
  lessonId: string;
  book: GenkiBook;
  completedSections: string[]; // Section IDs completed
  vocabularyMastered: number; // Count of mastered vocab
  audioListened: string[]; // Track IDs listened to
  completedAt?: string;
  timeSpentSeconds: number;
}
