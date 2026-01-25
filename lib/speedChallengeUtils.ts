// lib/speedChallengeUtils.ts

import { KanaPair } from '@/types/alphabet';
import { SpeedChallengeQuestion } from '@/types/games';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSpeedChallengeQuestions(
  pairs: KanaPair[],
  questionCount: number = 20,
  timePerQuestion: number = 5000 // 5 seconds default
): SpeedChallengeQuestion[] {
  const questions: SpeedChallengeQuestion[] = [];
  const allRomaji = pairs.map((p) => p.romaji);

  for (let i = 0; i < questionCount; i++) {
    const pair = pairs[i % pairs.length];
    const useHiragana = Math.random() > 0.5;
    const character = useHiragana
      ? pair.hiragana.character
      : pair.katakana.character;

    // Generate wrong options
    const wrongOptions = shuffleArray(
      allRomaji.filter((r) => r !== pair.romaji)
    ).slice(0, 3);

    questions.push({
      id: `speed-q-${i}`,
      prompt: character,
      correctAnswer: pair.romaji,
      options: shuffleArray([pair.romaji, ...wrongOptions]),
      timeLimit: timePerQuestion,
    });
  }

  return shuffleArray(questions);
}

export function calculateSpeedScore(
  correctAnswers: number,
  totalQuestions: number,
  averageResponseTime: number,
  streak: number
): number {
  // Base score: 10 points per correct answer
  const baseScore = correctAnswers * 10;

  // Speed bonus: faster = more points
  const speedBonus = Math.max(0, Math.floor((3000 - averageResponseTime) / 100));

  // Streak bonus: consecutive correct answers
  const streakBonus = streak * 2;

  // Accuracy multiplier
  const accuracy = correctAnswers / totalQuestions;
  const accuracyMultiplier = accuracy >= 0.9 ? 1.5 : accuracy >= 0.7 ? 1.2 : 1;

  return Math.floor((baseScore + speedBonus + streakBonus) * accuracyMultiplier);
}
