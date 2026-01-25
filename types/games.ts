// types/games.ts

export type MatchingPairType = 'hiragana-romaji' | 'katakana-romaji' | 'hiragana-katakana';

export interface MatchingCard {
  id: string;
  content: string;
  type: 'hiragana' | 'katakana' | 'romaji';
  pairId: string; // Links matching cards together
  isMatched: boolean;
  isSelected: boolean;
}

export interface MatchingGameState {
  cards: MatchingCard[];
  selectedCardId: string | null;
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  startTime: number;
  endTime: number | null;
}

export interface SpeedChallengeQuestion {
  id: string;
  prompt: string;
  correctAnswer: string;
  options: string[];
  timeLimit: number; // milliseconds
}

export interface SpeedChallengeState {
  questions: SpeedChallengeQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  timeRemaining: number;
  isComplete: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: AchievementRequirement;
}

export type AchievementRequirement =
  | { type: 'streak'; days: number }
  | { type: 'xp'; amount: number }
  | { type: 'lessons_completed'; count: number }
  | { type: 'perfect_quiz'; count: number }
  | { type: 'characters_mastered'; count: number }
  | { type: 'matching_game'; wins: number }
  | { type: 'speed_challenge'; score: number };

export interface CharacterMastery {
  characterId: string;
  correctCount: number;
  incorrectCount: number;
  lastPracticed: string;
  masteryLevel: number; // 0-5
  nextReviewDate: string;
}
