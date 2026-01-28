import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { LevelCard } from '@/components/jlpt';
import { JLPTLevel } from '@/data/jlpt/types';

const JLPT_LEVELS: {
  level: JLPTLevel;
  title: string;
  subtitle: string;
  totalUnits: number;
  unlockRequirement: string;
}[] = [
  {
    level: 'N5',
    title: 'JLPT N5',
    subtitle: 'Beginner - Exam Prep',
    totalUnits: 10,
    unlockRequirement: 'Always available',
  },
  {
    level: 'N4',
    title: 'JLPT N4',
    subtitle: 'Elementary - Exam Prep',
    totalUnits: 10,
    unlockRequirement: 'Always available',
  },
  {
    level: 'N3',
    title: 'JLPT N3',
    subtitle: 'Intermediate',
    totalUnits: 10,
    unlockRequirement: 'Complete Genki 2 to unlock',
  },
  {
    level: 'N2',
    title: 'JLPT N2',
    subtitle: 'Upper Intermediate',
    totalUnits: 10,
    unlockRequirement: 'Pass N3 mock exam to unlock',
  },
  {
    level: 'N1',
    title: 'JLPT N1',
    subtitle: 'Advanced',
    totalUnits: 10,
    unlockRequirement: 'Pass N2 mock exam to unlock',
  },
];

export default function JLPTHubScreen() {
  const { isJLPTLevelUnlocked, getJLPTLevelProgress } = useProgressStore();

  const handleLevelPress = (level: JLPTLevel) => {
    router.push(`/jlpt/${level.toLowerCase()}` as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <FontAwesome name="arrow-left" size={20} color="#6b7280" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            JLPT Courses
          </Text>
          <Text className="text-sm text-sakura-600">
            Japanese Language Proficiency Test
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Introduction */}
        <View className="bg-gradient-to-r from-sakura-50 to-purple-50 dark:from-sakura-900/20 dark:to-purple-900/20 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your JLPT Journey
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            Progress from N5 (beginner) to N1 (advanced). Complete each level and pass the mock exam to unlock the next.
          </Text>
        </View>

        {/* Level Cards */}
        <View className="gap-4">
          {JLPT_LEVELS.map((levelInfo) => {
            const progress = getJLPTLevelProgress(levelInfo.level);
            const isUnlocked = isJLPTLevelUnlocked(levelInfo.level);

            return (
              <LevelCard
                key={levelInfo.level}
                level={levelInfo.level}
                title={levelInfo.title}
                subtitle={levelInfo.subtitle}
                unitsCompleted={progress?.unitsCompleted.length || 0}
                totalUnits={levelInfo.totalUnits}
                isUnlocked={isUnlocked}
                unlockRequirement={levelInfo.unlockRequirement}
                onPress={() => handleLevelPress(levelInfo.level)}
              />
            );
          })}
        </View>

        {/* Info Card */}
        <View className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="info-circle" size={16} color="#3b82f6" />
            <Text className="text-sm font-medium text-blue-700 dark:text-blue-300 ml-2">
              About JLPT Levels
            </Text>
          </View>
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            N5 and N4 provide exam-focused content that supplements Genki textbooks. N3-N1 are complete courses with vocabulary, kanji, grammar, reading, and listening practice.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
