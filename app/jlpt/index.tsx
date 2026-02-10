import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { LevelCard } from '@/components/jlpt';
import { JLPTLevel } from '@/data/jlpt/types';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { InfoCard } from '@/components/ui/InfoCard';

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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScreenHeader
        title="JLPT Courses"
        subtitle="Japanese Language Proficiency Test"
        onBack={() => router.back()}
      />

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
        <InfoCard variant="info" title="About JLPT Levels" className="mt-6">
          <Text className="text-xs text-blue-600 dark:text-blue-400">
            N5 and N4 provide exam-focused content that supplements Genki textbooks. N3-N1 are complete courses with vocabulary, kanji, grammar, reading, and listening practice.
          </Text>
        </InfoCard>
      </ScrollView>
    </SafeAreaView>
  );
}
