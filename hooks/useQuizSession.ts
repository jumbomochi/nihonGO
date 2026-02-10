import { useState } from 'react';
import { ContentVocabulary } from '@/types/content';

export function useQuizSession() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizVocabulary, setQuizVocabulary] = useState<ContentVocabulary[]>([]);
  const [quizSectionId, setQuizSectionId] = useState<string>('');

  const handleStartQuiz = (vocabulary: ContentVocabulary[], sectionId: string) => {
    setQuizVocabulary(vocabulary);
    setQuizSectionId(sectionId);
    setShowQuiz(true);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  return {
    showQuiz,
    quizVocabulary,
    quizSectionId,
    handleStartQuiz,
    handleCloseQuiz,
  };
}
