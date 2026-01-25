// components/games/SpeedChallenge.tsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { KanaPair } from '@/types/alphabet';
import { SpeedChallengeQuestion } from '@/types/games';
import {
  generateSpeedChallengeQuestions,
  calculateSpeedScore,
} from '@/lib/speedChallengeUtils';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';

interface SpeedChallengeProps {
  pairs: KanaPair[];
  questionCount?: number;
  timePerQuestion?: number;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function SpeedChallenge({
  pairs,
  questionCount = 20,
  timePerQuestion = 5000,
  onClose,
  onComplete,
}: SpeedChallengeProps) {
  const [questions, setQuestions] = useState<SpeedChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const questionStartTime = useRef(Date.now());

  const timerProgress = useSharedValue(1);

  const recordSpeedChallengeScore = useProgressStore((s) => s.recordSpeedChallengeScore);
  const updateCharacterMastery = useProgressStore((s) => s.updateCharacterMastery);

  useEffect(() => {
    const generated = generateSpeedChallengeQuestions(
      pairs,
      questionCount,
      timePerQuestion
    );
    setQuestions(generated);
  }, [pairs, questionCount, timePerQuestion]);

  const moveToNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Game complete
      const avgTime =
        responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : timePerQuestion;
      const finalScore = calculateSpeedScore(
        correctCount,
        questions.length,
        avgTime,
        maxStreak
      );
      setScore(finalScore);
      setIsComplete(true);
      recordSpeedChallengeScore(finalScore);
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(timePerQuestion);
      setShowFeedback(null);
    }
  }, [currentIndex, questions.length, correctCount, maxStreak, responseTimes, timePerQuestion, recordSpeedChallengeScore]);

  const handleTimeout = useCallback(() => {
    if (showFeedback) return;

    setShowFeedback('incorrect');
    setStreak(0);

    const currentQuestion = questions[currentIndex];
    if (currentQuestion) {
      updateCharacterMastery(currentQuestion.id, false);
    }

    setTimeout(() => {
      moveToNext();
    }, 500);
  }, [currentIndex, questions, showFeedback, updateCharacterMastery, moveToNext]);

  // Timer countdown
  useEffect(() => {
    if (isComplete || showFeedback || questions.length === 0) return;

    questionStartTime.current = Date.now();
    timerProgress.value = 1;
    timerProgress.value = withTiming(0, { duration: timePerQuestion });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          // Time's up - wrong answer
          handleTimeout();
          return timePerQuestion;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, isComplete, showFeedback, questions.length, timePerQuestion, handleTimeout, timerProgress]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showFeedback) return;

      const responseTime = Date.now() - questionStartTime.current;
      setResponseTimes((prev) => [...prev, responseTime]);

      const currentQuestion = questions[currentIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setMaxStreak((m) => Math.max(m, newStreak));
          return newStreak;
        });
        setShowFeedback('correct');
        updateCharacterMastery(currentQuestion.id, true);
      } else {
        setStreak(0);
        setShowFeedback('incorrect');
        updateCharacterMastery(currentQuestion.id, false);
      }

      setTimeout(() => {
        moveToNext();
      }, 500);
    },
    [currentIndex, questions, showFeedback, moveToNext, updateCharacterMastery]
  );

  const timerStyle = useAnimatedStyle(() => ({
    width: `${timerProgress.value * 100}%`,
  }));

  const currentQuestion = questions[currentIndex];

  if (isComplete) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="bolt" size={64} color="#eab308" />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Speed Challenge Complete!
        </Text>
        <Text className="text-5xl font-bold text-sakura-600 mt-2">
          {score}
        </Text>
        <Text className="text-gray-500">points</Text>

        <View className="flex-row gap-8 mt-6">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {correctCount}/{questions.length}
            </Text>
            <Text className="text-sm text-gray-500">Correct</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-500">{maxStreak}</Text>
            <Text className="text-sm text-gray-500">Best Streak</Text>
          </View>
        </View>

        <View className="flex-row gap-4 mt-8">
          <Button
            title="Play Again"
            onPress={() => {
              const generated = generateSpeedChallengeQuestions(
                pairs,
                questionCount,
                timePerQuestion
              );
              setQuestions(generated);
              setCurrentIndex(0);
              setScore(0);
              setStreak(0);
              setMaxStreak(0);
              setCorrectCount(0);
              setTimeLeft(timePerQuestion);
              setIsComplete(false);
              setResponseTimes([]);
            }}
          />
          <Button
            title="Done"
            variant="outline"
            onPress={() => {
              onComplete(score);
              onClose();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentIndex + 1} / {questions.length}
        </Text>
        <View className="flex-row items-center">
          <FontAwesome name="fire" size={16} color="#f97316" />
          <Text className="text-orange-500 font-bold ml-1">{streak}</Text>
        </View>
      </View>

      {/* Timer bar */}
      <View className="h-2 bg-gray-200 dark:bg-gray-700">
        <Animated.View
          className={`h-full ${
            timeLeft < 2000 ? 'bg-red-500' : 'bg-sakura-500'
          }`}
          style={timerStyle}
        />
      </View>

      {/* Question */}
      <View className="flex-1 items-center justify-center px-6">
        <Text
          className={`text-8xl font-japanese mb-8 ${
            showFeedback === 'correct'
              ? 'text-green-500'
              : showFeedback === 'incorrect'
              ? 'text-red-500'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {currentQuestion.prompt}
        </Text>

        {/* Options */}
        <View className="w-full gap-3">
          {currentQuestion.options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleAnswer(option)}
              disabled={showFeedback !== null}
              className={`p-4 rounded-xl border-2 ${
                showFeedback && option === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : showFeedback === 'incorrect' &&
                    option !== currentQuestion.correctAnswer
                  ? 'border-gray-200 dark:border-gray-700 opacity-50'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <Text
                className={`text-center text-xl font-semibold ${
                  showFeedback && option === currentQuestion.correctAnswer
                    ? 'text-green-600'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Score */}
      <View className="px-6 pb-4">
        <Text className="text-center text-gray-500">
          Score: <Text className="font-bold text-sakura-600">{correctCount * 10}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
