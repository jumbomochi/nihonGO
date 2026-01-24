// app/(tabs)/alphabets.tsx

import { memo } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { KANA_LESSONS } from '@/data/alphabet';
import { AlphabetLesson } from '@/types/alphabet';

export default function AlphabetsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6"
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-sm text-sakura-600 font-medium mb-1">
            Japanese Writing
          </Text>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Alphabets
          </Text>
        </View>

        {/* Kana Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hiragana & Katakana
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 mb-4">
            Learn both scripts together, organized by sound rows.
          </Text>

          <View className="gap-3">
            {KANA_LESSONS.map((lesson) => (
              <KanaLessonCard key={lesson.id} lesson={lesson} />
            ))}
          </View>
        </View>

        {/* Kanji Section (Coming Soon) */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="lock" size={16} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-400 ml-2">
              Kanji
            </Text>
          </View>
          <Text className="text-gray-400">
            Complete kana lessons to unlock kanji learning.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const KanaLessonCard = memo(function KanaLessonCard({
  lesson,
}: {
  lesson: AlphabetLesson;
}) {
  const progress = useProgressStore(
    (state) => state.alphabetProgress[lesson.id]
  );

  const isCompleted = progress?.completedAt !== null && progress?.completedAt !== undefined;
  const hasProgress =
    progress?.learnCompleted ||
    progress?.writeCompleted ||
    progress?.quizBestScore !== null;

  const handlePress = () => {
    router.push({
      pathname: '/alphabet/[lessonId]',
      params: { lessonId: lesson.id },
    });
  };

  // Show first 3 characters as preview
  const preview = lesson.pairs
    .slice(0, 3)
    .map((p) => p.hiragana.character)
    .join(' ');

  return (
    <Pressable
      onPress={handlePress}
      className={`bg-white dark:bg-gray-800 border rounded-2xl p-4 ${
        isCompleted
          ? 'border-green-300 dark:border-green-700'
          : hasProgress
          ? 'border-sakura-300 dark:border-sakura-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <View className="flex-row items-center">
        {/* Lesson number */}
        <View
          className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
            isCompleted
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-sakura-100 dark:bg-sakura-900/30'
          }`}
        >
          {isCompleted ? (
            <FontAwesome name="check" size={20} color="#22c55e" />
          ) : (
            <Text className="text-lg font-bold text-sakura-600">
              {lesson.lessonNumber}
            </Text>
          )}
        </View>

        {/* Lesson info */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {lesson.title}
          </Text>
          <Text className="text-sm text-sakura-600 font-japanese">
            {lesson.titleJapanese}
          </Text>
          <Text className="text-lg text-gray-400 font-japanese mt-1">
            {preview}...
          </Text>
        </View>

        {/* Progress indicators */}
        <View className="items-end">
          {progress?.quizBestScore !== null && progress?.quizBestScore !== undefined && (
            <Text className="text-xs text-green-600">
              {progress.quizBestScore}/{progress.quizTotalQuestions}
            </Text>
          )}
          <FontAwesome name="chevron-right" size={14} color="#9ca3af" />
        </View>
      </View>
    </Pressable>
  );
});
