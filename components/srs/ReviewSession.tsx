// components/srs/ReviewSession.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, SafeAreaView, Pressable, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { srsAdapters } from '@/lib/srs/adapters';
import { SrsItem } from '@/types/srs';
import { Button } from '@/components/common/Button';

interface ReviewSessionProps {
  visible: boolean;
  onClose: () => void;
}

const SESSION_CAP = 20;
const FEEDBACK_DELAY_MS = 700;

interface SessionQuestion {
  item: SrsItem;
  options: string[];
  correctAnswer: string;
}

export function ReviewSession({ visible, onClose }: ReviewSessionProps) {
  const getDueSrsItems = useProgressStore((s) => s.getDueSrsItems);
  const gradeSrsItem = useProgressStore((s) => s.gradeSrsItem);
  const addXp = useProgressStore((s) => s.addXp);
  const recordPerfectQuiz = useProgressStore((s) => s.recordPerfectQuiz);

  const questions = useMemo<SessionQuestion[]>(() => {
    if (!visible) return [];
    const due = getDueSrsItems().slice(0, SESSION_CAP);
    const allDue = getDueSrsItems();
    return due.map((item) => {
      const adapter = srsAdapters[item.type];
      const correct = adapter.answerText(item);
      const distractors = adapter.generateDistractors(item, allDue);
      const options = [...distractors, correct].sort(() => Math.random() - 0.5);
      return { item, options, correctAnswer: correct };
    });
  }, [visible, getDueSrsItems]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (visible) {
      setIndex(0);
      setSelected(null);
      setStreak(0);
      setCorrectCount(0);
      setShowFeedback(false);
    }
  }, [visible]);

  const isComplete = index >= questions.length && questions.length > 0;
  const current = questions[index];

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showFeedback || !current) return;
      const correct = answer === current.correctAnswer;
      setSelected(answer);
      setShowFeedback(true);

      gradeSrsItem(current.item.itemKey, correct);
      addXp(correct ? 10 : 5);
      if (correct) {
        setCorrectCount((c) => c + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }

      setTimeout(() => {
        setSelected(null);
        setShowFeedback(false);
        setIndex((i) => i + 1);
      }, FEEDBACK_DELAY_MS);
    },
    [current, showFeedback, gradeSrsItem, addXp]
  );

  useEffect(() => {
    if (isComplete && questions.length > 0 && correctCount === questions.length) {
      recordPerfectQuiz();
    }
  }, [isComplete, correctCount, questions.length, recordPerfectQuiz]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        {questions.length === 0 ? (
          <EmptyState onClose={onClose} />
        ) : isComplete ? (
          <CompletionState
            correct={correctCount}
            total={questions.length}
            onClose={onClose}
          />
        ) : (
          <QuestionView
            question={current}
            index={index}
            total={questions.length}
            streak={streak}
            selected={selected}
            showFeedback={showFeedback}
            onAnswer={handleAnswer}
            onClose={onClose}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

function QuestionView({
  question,
  index,
  total,
  streak,
  selected,
  showFeedback,
  onAnswer,
  onClose,
}: {
  question: SessionQuestion;
  index: number;
  total: number;
  streak: number;
  selected: string | null;
  showFeedback: boolean;
  onAnswer: (a: string) => void;
  onClose: () => void;
}) {
  const adapter = srsAdapters[question.item.type];
  const prompt = adapter.promptText(question.item);
  const hint = adapter.promptHint?.(question.item);

  const optionState = (option: string) => {
    if (!showFeedback) return 'default';
    if (option === question.correctAnswer) return 'correct';
    if (option === selected && option !== question.correctAnswer) return 'incorrect';
    return 'default';
  };

  return (
    <>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-gray-600 dark:text-gray-400 font-medium">
          {index + 1} / {total}
        </Text>
        <View className="flex-row items-center">
          <FontAwesome name="fire" size={14} color={streak > 0 ? '#f97316' : '#9ca3af'} />
          <Text className={`ml-1 font-semibold ${streak > 0 ? 'text-orange-500' : 'text-gray-400'}`}>{streak}</Text>
        </View>
      </View>

      <View className="h-1 bg-gray-200 dark:bg-gray-700">
        <View className="h-full bg-sakura-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </View>

      <View className="flex-1 px-6 py-8">
        <View className="items-center mb-8">
          <Text
            className={`${
              question.item.type === 'kana' ? 'text-8xl font-japanese' : 'text-4xl font-bold'
            } text-gray-900 dark:text-white text-center`}
          >
            {prompt}
          </Text>
          {hint && hint !== prompt && (
            <Text className="text-base text-gray-500 dark:text-gray-400 mt-2 font-japanese">{hint}</Text>
          )}
        </View>

        <View className="gap-3">
          {question.options.map((option, i) => {
            const state = optionState(option);
            const bg =
              state === 'correct'
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : state === 'incorrect'
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
            return (
              <Pressable
                key={`${question.item.itemKey}-${i}`}
                disabled={showFeedback}
                onPress={() => onAnswer(option)}
                className={`p-4 rounded-xl border-2 ${bg}`}
              >
                <Text className="text-center text-lg text-gray-900 dark:text-white">{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );
}

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <FontAwesome name="check-circle" size={64} color="#22c55e" />
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">All caught up!</Text>
      <Text className="text-gray-500 mt-2 text-center">Nothing due for review right now.</Text>
      <View className="mt-8">
        <Button title="Close" onPress={onClose} />
      </View>
    </View>
  );
}

function CompletionState({ correct, total, onClose }: { correct: number; total: number; onClose: () => void }) {
  const xp = correct * 10 + (total - correct) * 5;
  return (
    <View className="flex-1 items-center justify-center px-6">
      <FontAwesome name="trophy" size={64} color="#eab308" />
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Review complete!</Text>
      <Text className="text-5xl font-bold text-sakura-600 mt-4">
        {correct}/{total}
      </Text>
      <Text className="text-gray-500 mt-2">+{xp} XP</Text>
      <View className="mt-8">
        <Button title="Done" onPress={onClose} />
      </View>
    </View>
  );
}
