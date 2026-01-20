import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button } from '@/components/common/Button';

interface QuizPromptProps {
  visible: boolean;
  onStartQuiz: () => void;
  onDismiss: () => void;
  bestScore?: { score: number; totalQuestions: number } | null;
}

export function QuizPrompt({
  visible,
  onStartQuiz,
  onDismiss,
  bestScore,
}: QuizPromptProps) {
  if (!visible) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-lg border-t border-gray-200 dark:border-gray-700 px-6 py-5">
      <Pressable
        onPress={onDismiss}
        className="absolute top-4 right-4 p-2"
        accessibilityLabel="Dismiss"
      >
        <FontAwesome name="times" size={18} color="#9ca3af" />
      </Pressable>

      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 bg-sakura-100 dark:bg-sakura-900/30 rounded-full items-center justify-center mr-3">
          <FontAwesome name="graduation-cap" size={18} color="#ec4899" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Ready to practice?
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Test your knowledge with a quick quiz
          </Text>
        </View>
      </View>

      {bestScore && (
        <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 mb-4 flex-row items-center">
          <FontAwesome name="trophy" size={14} color="#22c55e" />
          <Text className="text-green-700 dark:text-green-400 text-sm ml-2">
            Best score: {bestScore.score}/{bestScore.totalQuestions}
          </Text>
        </View>
      )}

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button title="Maybe Later" variant="outline" onPress={onDismiss} />
        </View>
        <View className="flex-1">
          <Button title="Start Quiz" onPress={onStartQuiz} />
        </View>
      </View>
    </View>
  );
}
