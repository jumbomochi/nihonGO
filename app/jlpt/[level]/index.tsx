import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { UnitCard } from '@/components/jlpt';
import { JLPTLevel, JLPTUnit } from '@/data/jlpt/types';
import { getN3Units } from '@/data/jlpt/n3';
import { getN2Units } from '@/data/jlpt/n2';
import { getN1Units } from '@/data/jlpt/n1';
import { getN4Units } from '@/data/jlpt/n4';
import { getN5Units } from '@/data/jlpt/n5';

export default function JLPTLevelScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const jlptLevel = level?.toUpperCase() as JLPTLevel;
  const { getJLPTLevelProgress } = useProgressStore();

  const progress = getJLPTLevelProgress(jlptLevel);
  const completedUnits = new Set(progress?.unitsCompleted || []);

  // Get units for this level
  const getUnitsForLevel = (level: JLPTLevel): JLPTUnit[] => {
    switch (level) {
      case 'N5':
        return getN5Units();
      case 'N4':
        return getN4Units();
      case 'N3':
        return getN3Units();
      case 'N2':
        return getN2Units();
      case 'N1':
        return getN1Units();
      default:
        return [];
    }
  };
  const units = getUnitsForLevel(jlptLevel);

  const handleUnitPress = (unitId: string) => {
    router.push(`/jlpt/${level}/${unitId}` as any);
  };

  const handleMockExam = () => {
    router.push(`/jlpt/${level}/mock-exam` as any);
  };

  const handleBack = () => {
    router.back();
  };

  const levelTitles: Record<JLPTLevel, string> = {
    N5: 'Beginner',
    N4: 'Elementary',
    N3: 'Intermediate',
    N2: 'Upper Intermediate',
    N1: 'Advanced',
  };
  const levelTitle = levelTitles[jlptLevel] || '';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <FontAwesome name="arrow-left" size={20} color="#6b7280" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            JLPT {jlptLevel}
          </Text>
          <Text className="text-sm text-sakura-600">{levelTitle}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Progress Overview */}
        <View className="bg-gradient-to-r from-purple-50 to-sakura-50 dark:from-purple-900/20 dark:to-sakura-900/20 rounded-2xl p-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Progress
            </Text>
            <Text className="text-sm text-gray-500">
              {completedUnits.size}/{units.length} units
            </Text>
          </View>
          <View className="h-3 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
            <View
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${(completedUnits.size / units.length) * 100}%` }}
            />
          </View>
        </View>

        {/* Units */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Themed Units
        </Text>

        {units.length > 0 ? (
          units.map((unit) => (
            <UnitCard
              key={unit.id}
              unitNumber={unit.unitNumber}
              theme={unit.theme}
              themeJapanese={unit.themeJapanese}
              description={unit.description}
              vocabularyCount={unit.vocabularyCount}
              kanjiCount={unit.kanjiCount}
              grammarCount={unit.grammarCount}
              isCompleted={completedUnits.has(unit.id)}
              onPress={() => handleUnitPress(unit.id)}
            />
          ))
        ) : (
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 items-center">
            <FontAwesome name="book" size={32} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center">
              Content coming soon...
            </Text>
          </View>
        )}

        {/* Mock Exam Card */}
        {units.length > 0 && (
          <Pressable
            onPress={handleMockExam}
            className="mt-6 bg-sakura-500 rounded-2xl p-5"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center">
                <FontAwesome name="graduation-cap" size={24} color="#fff" />
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-lg font-semibold text-white">
                  {jlptLevel} Mock Exam
                </Text>
                <Text className="text-sm text-white/80">
                  80 questions • 100 minutes • Pass: 60%
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#fff" />
            </View>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
