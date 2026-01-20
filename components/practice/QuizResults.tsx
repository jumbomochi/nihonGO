import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button } from '@/components/common/Button';
import { getScoreMessage } from '@/lib/quizUtils';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onContinue: () => void;
}

export function QuizResults({
  score,
  totalQuestions,
  onRetry,
  onContinue,
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const message = getScoreMessage(score, totalQuestions);

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getIcon = (): { name: 'star' | 'thumbs-up' | 'refresh'; color: string } => {
    if (percentage >= 80) return { name: 'star', color: '#22c55e' };
    if (percentage >= 50) return { name: 'thumbs-up', color: '#d97706' };
    return { name: 'refresh', color: '#ef4444' };
  };

  const icon = getIcon();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm items-center shadow-lg">
        <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mb-4">
          <FontAwesome name={icon.name} size={36} color={icon.color} />
        </View>

        <Text className={`text-5xl font-bold ${getScoreColor()} mb-2`}>
          {score}/{totalQuestions}
        </Text>

        <Text className="text-gray-500 dark:text-gray-400 text-lg mb-2">
          {percentage}% correct
        </Text>

        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
          {message}
        </Text>

        <View className="w-full gap-3">
          <Button title="Try Again" variant="outline" onPress={onRetry} />
          <Button title="Continue" onPress={onContinue} />
        </View>
      </View>
    </View>
  );
}
