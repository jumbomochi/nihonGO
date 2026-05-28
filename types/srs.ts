// types/srs.ts

export type SrsItemType = 'kana' | 'vocab';

export interface KanaPayload {
  kind: 'kana';
  character: string;
  romaji: string;
  kanaType: 'hiragana' | 'katakana';
}

export interface VocabPayload {
  kind: 'vocab';
  japanese: string;
  reading: string;
  english: string;
  lessonId: string;
}

export type SrsPayload = KanaPayload | VocabPayload;

export interface SrsItem {
  itemKey: string;          // "kana:hiragana-a" | "vocab:greetings-konnichiwa"
  type: SrsItemType;
  refId: string;            // original character id / vocab id
  correctCount: number;
  incorrectCount: number;
  masteryLevel: number;     // 0-5
  lastReviewedAt: string;
  nextReviewDate: string;
  payload: SrsPayload;
}

export interface SrsEnrollInput {
  itemKey: string;
  type: SrsItemType;
  refId: string;
  payload: SrsPayload;
  seedCorrect: boolean;
}

export const SRS_INTERVALS_DAYS = [1, 2, 4, 7, 14, 30] as const;
