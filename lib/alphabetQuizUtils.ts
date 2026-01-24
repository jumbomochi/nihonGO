// lib/alphabetQuizUtils.ts

import { KanaPair } from '@/types/alphabet';

export interface AlphabetQuizQuestion {
  id: string;
  type: 'reading' | 'character';
  prompt: string;
  correctAnswer: string;
  options: string[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateAlphabetQuiz(
  pairs: KanaPair[],
  questionCount: number = 10
): AlphabetQuizQuestion[] {
  const questions: AlphabetQuizQuestion[] = [];
  const allRomaji = pairs.map((p) => p.romaji);
  const allHiragana = pairs.map((p) => p.hiragana.character);
  const allKatakana = pairs.map((p) => p.katakana.character);

  // Generate alternating question types
  for (let i = 0; i < questionCount; i++) {
    const pair = pairs[i % pairs.length];
    const isReadingQuestion = i % 2 === 0;
    const useHiragana = Math.random() > 0.5;

    if (isReadingQuestion) {
      // "What sound is this?" - show character, answer is romaji
      const character = useHiragana
        ? pair.hiragana.character
        : pair.katakana.character;
      const wrongOptions = shuffleArray(
        allRomaji.filter((r) => r !== pair.romaji)
      ).slice(0, 3);

      questions.push({
        id: `q-${i}`,
        type: 'reading',
        prompt: character,
        correctAnswer: pair.romaji,
        options: shuffleArray([pair.romaji, ...wrongOptions]),
      });
    } else {
      // "Which character is X?" - show romaji, answer is character
      const correctChar = useHiragana
        ? pair.hiragana.character
        : pair.katakana.character;
      const charPool = useHiragana ? allHiragana : allKatakana;
      const wrongOptions = shuffleArray(
        charPool.filter((c) => c !== correctChar)
      ).slice(0, 3);

      questions.push({
        id: `q-${i}`,
        type: 'character',
        prompt: pair.romaji,
        correctAnswer: correctChar,
        options: shuffleArray([correctChar, ...wrongOptions]),
      });
    }
  }

  return shuffleArray(questions);
}
