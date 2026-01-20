import { VocabularyItem } from '@/types/genki';

export interface QuizQuestion {
  id: string;
  type: 'jp-to-en' | 'en-to-jp';
  prompt: string;
  correctAnswer: string;
  options: string[];
  vocabularyId: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateWrongOptions(
  correctItem: VocabularyItem,
  allVocab: VocabularyItem[],
  type: 'jp-to-en' | 'en-to-jp',
  count: number = 3
): string[] {
  const otherVocab = allVocab.filter((v) => v.id !== correctItem.id);
  const shuffled = shuffleArray(otherVocab);

  return shuffled.slice(0, count).map((v) =>
    type === 'jp-to-en' ? v.english : v.japanese
  );
}

export function generateVocabQuiz(
  vocabulary: VocabularyItem[],
  questionCount: number = 10
): QuizQuestion[] {
  if (vocabulary.length === 0) return [];

  // Shuffle vocabulary and take up to questionCount items
  const shuffledVocab = shuffleArray(vocabulary);
  const selectedVocab = shuffledVocab.slice(0, Math.min(questionCount, vocabulary.length));

  const questions: QuizQuestion[] = selectedVocab.map((item, index) => {
    // Alternate between jp-to-en and en-to-jp
    const type: 'jp-to-en' | 'en-to-jp' = index % 2 === 0 ? 'jp-to-en' : 'en-to-jp';

    const prompt = type === 'jp-to-en' ? item.japanese : item.english;
    const correctAnswer = type === 'jp-to-en' ? item.english : item.japanese;

    // Generate wrong options from other vocabulary
    const wrongOptions = generateWrongOptions(item, vocabulary, type, 3);

    // Combine correct answer with wrong options and shuffle
    const options = shuffleArray([correctAnswer, ...wrongOptions]);

    return {
      id: `${item.id}-${type}-${index}`,
      type,
      prompt,
      correctAnswer,
      options,
      vocabularyId: item.id,
    };
  });

  return questions;
}

export function getScoreMessage(score: number, total: number): string {
  const percentage = (score / total) * 100;

  if (percentage >= 80) {
    return 'Great job!';
  } else if (percentage >= 50) {
    return 'Good effort!';
  } else {
    return 'Keep practicing!';
  }
}

export function getScoreEmoji(score: number, total: number): string {
  const percentage = (score / total) * 100;

  if (percentage >= 80) {
    return '🎉';
  } else if (percentage >= 50) {
    return '👍';
  } else {
    return '💪';
  }
}
