// components/alphabet/ReviewQueue.tsx

import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { ALL_HIRAGANA, ALL_KATAKANA } from '@/data/alphabet';
import { Button } from '@/components/common/Button';

interface ReviewQueueProps {
  onStartReview: (characterIds: string[]) => void;
}

export function ReviewQueue({ onStartReview }: ReviewQueueProps) {
  const characterMastery = useProgressStore((s) => s.characterMastery);
  const getCharactersDueForReview = useProgressStore(
    (s) => s.getCharactersDueForReview
  );

  const dueCharacters = getCharactersDueForReview();
  const totalMastered = Object.values(characterMastery).filter(
    (m) => m.masteryLevel >= 4
  ).length;
  const totalCharacters = ALL_HIRAGANA.length + ALL_KATAKANA.length;

  if (dueCharacters.length === 0) {
    return (
      <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <View className="flex-row items-center">
          <FontAwesome name="check-circle" size={24} color="#22c55e" />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-green-800 dark:text-green-200">
              All caught up!
            </Text>
            <Text className="text-sm text-green-600 dark:text-green-400">
              No characters due for review
            </Text>
          </View>
        </View>
        <View className="mt-3">
          <Text className="text-xs text-green-600 dark:text-green-400">
            Mastery: {totalMastered} / {totalCharacters} characters
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <FontAwesome name="refresh" size={20} color="#f97316" />
          <Text className="font-semibold text-orange-800 dark:text-orange-200 ml-2">
            Review Due
          </Text>
        </View>
        <View className="bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded-full">
          <Text className="text-sm font-bold text-orange-800 dark:text-orange-200">
            {dueCharacters.length}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-orange-700 dark:text-orange-300 mb-4">
        Characters need reinforcement to maintain mastery
      </Text>

      <Button
        title={`Review ${dueCharacters.length} Characters`}
        onPress={() => onStartReview(dueCharacters.map((c) => c.characterId))}
      />

      <View className="mt-3">
        <Text className="text-xs text-orange-600 dark:text-orange-400">
          Mastery: {totalMastered} / {totalCharacters} characters
        </Text>
      </View>
    </View>
  );
}
