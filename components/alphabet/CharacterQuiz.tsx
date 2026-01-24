// components/alphabet/CharacterQuiz.tsx

import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { KanaPair } from '@/types/alphabet';
import {
  AlphabetQuizQuestion,
  generateAlphabetQuiz,
} from '@/lib/alphabetQuizUtils';
import { QuizOption } from '@/components/practice/QuizOption';
import { QuizResults } from '@/components/practice/QuizResults';

interface CharacterQuizProps {
  pairs: KanaPair[];
  lessonId: string;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

const QUESTION_COUNT = 10;
const FEEDBACK_DELAY_MS = 1000;

export function CharacterQuiz({
  pairs,
  lessonId,
  onClose,
  onComplete,
}: CharacterQuizProps) {
  const [questions, setQuestions] = useState<AlphabetQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const generated = generateAlphabetQuiz(pairs, QUESTION_COUNT);
    setQuestions(generated);
  }, [pairs]);

  const currentQuestion = questions[currentIndex];
  const score = useMemo(() => answers.filter(Boolean).length, [answers]);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (showFeedback || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setShowFeedback(true);

      setAnswers((prev) => {
        const newAnswers = [...prev, isCorrect];

        setTimeout(() => {
          if (currentIndex + 1 >= questions.length) {
            const finalScore = newAnswers.filter(Boolean).length;
            onComplete(finalScore, questions.length);
            setShowResults(true);
          } else {
            setCurrentIndex((i) => i + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
          }
        }, FEEDBACK_DELAY_MS);

        return newAnswers;
      });
    },
    [currentQuestion, currentIndex, questions.length, showFeedback, onComplete]
  );

  const handleRetry = useCallback(() => {
    const generated = generateAlphabetQuiz(pairs, QUESTION_COUNT);
    setQuestions(generated);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResults(false);
  }, [pairs]);

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
            {currentQuestion.type === 'reading'
              ? 'What sound is this?'
              : 'Which character is this?'}
          </Text>
          <Text
            className={`font-bold text-gray-900 dark:text-white text-center ${
              currentQuestion.type === 'reading'
                ? 'text-7xl font-japanese'
                : 'text-4xl'
            }`}
          >
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
              large={currentQuestion.type === 'character'}
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
