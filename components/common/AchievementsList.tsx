// components/common/AchievementsList.tsx

import { View, Text, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { ACHIEVEMENTS } from '@/data/achievements';

export function AchievementsList() {
  const unlockedAchievements = useProgressStore((s) => s.unlockedAchievements);

  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 gap-3">
      {sortedAchievements.map((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);

        return (
          <View
            key={achievement.id}
            className={`flex-row items-center p-4 rounded-xl border ${
              isUnlocked
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isUnlocked
                  ? 'bg-yellow-100 dark:bg-yellow-900/40'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FontAwesome
                name={achievement.icon as any}
                size={20}
                color={isUnlocked ? '#eab308' : '#9ca3af'}
              />
            </View>
            <View className="flex-1 ml-3">
              <Text
                className={`font-semibold ${
                  isUnlocked
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {achievement.title}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {achievement.description}
              </Text>
            </View>
            {isUnlocked && (
              <FontAwesome name="check-circle" size={20} color="#22c55e" />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
