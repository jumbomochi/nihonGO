import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { VocabularyItem } from '@/types/genki';
import { QuizQuestion, generateVocabQuiz } from '@/lib/quizUtils';
import { QuizOption } from './QuizOption';
import { QuizResults } from './QuizResults';
import { useProgressStore } from '@/stores/progressStore';

interface VocabQuizProps {
  vocabulary: VocabularyItem[];
  lessonId: string;
  sectionId: string;
  onClose: () => void;
}

const QUESTION_COUNT = 10;
const FEEDBACK_DELAY_MS = 1000;

export function VocabQuiz({
  vocabulary,
  lessonId,
  sectionId,
  onClose,
}: VocabQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const saveQuizScore = useProgressStore((state) => state.saveQuizScore);

  // Generate questions on mount
  useEffect(() => {
    const generated = generateVocabQuiz(vocabulary, QUESTION_COUNT);
    setQuestions(generated);
  }, [vocabulary]);

  const currentQuestion = questions[currentIndex];
  const score = answers.filter(Boolean).length;

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (showFeedback || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setShowFeedback(true);
      setAnswers((prev) => [...prev, isCorrect]);

      // Auto-advance after feedback delay
      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          // Quiz complete
          const finalScore = isCorrect ? score + 1 : score;
          saveQuizScore({
            lessonId,
            sectionId,
            score: finalScore,
            totalQuestions: questions.length,
          });
          setShowResults(true);
        } else {
          // Next question
          setCurrentIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }
      }, FEEDBACK_DELAY_MS);
    },
    [currentQuestion, currentIndex, questions.length, score, showFeedback, lessonId, sectionId, saveQuizScore]
  );

  const handleRetry = useCallback(() => {
    const generated = generateVocabQuiz(vocabulary, QUESTION_COUNT);
    setQuestions(generated);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResults(false);
  }, [vocabulary]);

  const getOptionState = (option: string) => {
    if (!showFeedback) return 'default';
    if (option === currentQuestion?.correctAnswer) return 'correct';
    if (option === selectedAnswer && option !== currentQuestion?.correctAnswer) {
      return 'incorrect';
    }
    return 'default';
  };

  if (showResults) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          onRetry={handleRetry}
          onContinue={onClose}
        />
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-gray-600 dark:text-gray-400 font-medium">
          {currentIndex + 1} / {questions.length}
        </Text>
        <View className="w-8" />
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-gray-200 dark:bg-gray-700">
        <View
          className="h-full bg-sakura-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </View>

      {/* Question */}
      <View className="flex-1 px-6 py-8">
        <View className="items-center mb-8">
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {currentQuestion.type === 'jp-to-en'
              ? 'What does this mean?'
              : 'How do you say this in Japanese?'}
          </Text>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            {currentQuestion.prompt}
          </Text>
        </View>

        {/* Options */}
        <View className="gap-3">
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={`${currentQuestion.id}-${index}`}
              text={option}
              onPress={() => handleSelectAnswer(option)}
              disabled={showFeedback}
              state={getOptionState(option)}
            />
          ))}
        </View>
      </View>

      {/* Score indicator */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-center gap-2">
          <FontAwesome name="check-circle" size={16} color="#22c55e" />
          <Text className="text-gray-600 dark:text-gray-400">
            {score} correct
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
