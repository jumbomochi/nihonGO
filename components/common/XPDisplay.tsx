// components/common/XPDisplay.tsx

import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';

interface XPDisplayProps {
  compact?: boolean;
}

export function XPDisplay({ compact = false }: XPDisplayProps) {
  const xp = useProgressStore((s) => s.xp);
  const level = useProgressStore((s) => s.level);
  const todayXp = useProgressStore((s) => s.todayXp);

  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const progressInLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (progressInLevel / xpNeededForLevel) * 100;

  if (compact) {
    return (
      <View className="flex-row items-center">
        <FontAwesome name="star" size={14} color="#eab308" />
        <Text className="text-sm font-semibold text-yellow-600 ml-1">
          {xp} XP
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full items-center justify-center">
            <Text className="text-lg font-bold text-yellow-600">{level}</Text>
          </View>
          <View className="ml-3">
            <Text className="text-sm text-gray-500">Level {level}</Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {xp} XP
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-400">Today</Text>
          <Text className="text-sm font-semibold text-sakura-600">
            +{todayXp} XP
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <View
          className="h-full bg-yellow-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </View>
      <Text className="text-xs text-gray-400 text-right mt-1">
        {progressInLevel} / {xpNeededForLevel} to Level {level + 1}
      </Text>
    </View>
  );
}
