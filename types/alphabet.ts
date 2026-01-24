// types/alphabet.ts

export type KanaType = 'hiragana' | 'katakana';
export type KanaRow = 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa';

export interface KanaCharacter {
  id: string;
  character: string;
  type: KanaType;
  romaji: string;
  row: KanaRow;
  strokeCount: number;
  strokeOrder: string[]; // SVG path data for each stroke
}

export interface KanaPair {
  romaji: string;
  hiragana: KanaCharacter;
  katakana: KanaCharacter;
}

export interface AlphabetLesson {
  id: string;
  type: 'kana' | 'kanji';
  lessonNumber: number;
  title: string;
  titleJapanese: string;
  row: KanaRow;
  pairs: KanaPair[];
}

export interface AlphabetProgress {
  lessonId: string;
  learnCompleted: boolean;
  writeCompleted: boolean;
  quizBestScore: number | null;
  quizTotalQuestions: number | null;
  completedAt: string | null;
}
