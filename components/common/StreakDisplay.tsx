// components/common/StreakDisplay.tsx

import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';

interface StreakDisplayProps {
  compact?: boolean;
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const streakFreezeAvailable = useProgressStore((s) => s.streakFreezeAvailable);

  if (compact) {
    return (
      <View className="flex-row items-center">
        <FontAwesome
          name="fire"
          size={14}
          color={currentStreak > 0 ? '#f97316' : '#9ca3af'}
        />
        <Text
          className={`text-sm font-semibold ml-1 ${
            currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          {currentStreak}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              currentStreak > 0
                ? 'bg-orange-100 dark:bg-orange-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <FontAwesome
              name="fire"
              size={24}
              color={currentStreak > 0 ? '#f97316' : '#9ca3af'}
            />
          </View>
          <View className="ml-3">
            <Text className="text-sm text-gray-500">Current Streak</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs text-gray-400">Best</Text>
          <Text className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {longestStreak}
          </Text>
        </View>
      </View>

      {streakFreezeAvailable && (
        <View className="flex-row items-center mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <FontAwesome name="snowflake-o" size={14} color="#3b82f6" />
          <Text className="text-xs text-blue-600 ml-2">
            Streak freeze available
          </Text>
        </View>
      )}
    </View>
  );
}
