// app/alphabet/[lessonId].tsx

import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import { getKanaLesson } from '@/data/alphabet';
import { AlphabetLessonScreen } from '@/components/alphabet/AlphabetLessonScreen';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';
import { router } from 'expo-router';

export default function AlphabetLessonRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = lessonId ? getKanaLesson(lessonId) : undefined;

  const alphabetProgress = useProgressStore((state) => state.alphabetProgress);
  const completeAlphabetSection = useProgressStore(
    (state) => state.completeAlphabetSection
  );

  const progress = lessonId ? alphabetProgress[lessonId] : undefined;

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Lesson not found
        </Text>
        <View className="mt-4">
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleSectionComplete = (
    section: 'learn' | 'write' | 'practice' | 'quiz',
    score?: number,
    total?: number
  ) => {
    completeAlphabetSection(lessonId!, section, score, total);
  };

  return (
    <AlphabetLessonScreen
      lesson={lesson}
      onSectionComplete={handleSectionComplete}
      progress={progress ? {
        learnCompleted: progress.learnCompleted,
        writeCompleted: progress.writeCompleted,
        quizBestScore: progress.quizBestScore,
      } : undefined}
    />
  );
}
