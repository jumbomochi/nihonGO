import React, { memo, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { triggerSelection } from '@/lib/haptics';
import { useUserStore } from '@/stores/userStore';
import { useProgressStore } from '@/stores/progressStore';
import { GenkiBook, GenkiLesson } from '@/types/genki';
import {
  GENKI_BOOKS,
  getAllLessonIds,
  getLessonOrPlaceholder,
} from '@/data/genki';

export default function LearnScreen() {
  const { profile } = useUserStore();
  const [selectedBook, setSelectedBook] = useState<GenkiBook>('genki1');

  const greeting =
    profile.learningStyle === 'conversational'
      ? 'Ready to practice?'
      : 'Ready to study?';

  // Get lessons for selected book
  const lessonIds = getAllLessonIds(selectedBook);
  const lessons = lessonIds
    .map((id) => getLessonOrPlaceholder(id))
    .filter((l): l is GenkiLesson => l !== undefined);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6 max-w-tablet self-center w-full">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-sm text-sakura-600 font-medium mb-1">
            Welcome back
          </Text>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting}
          </Text>
        </View>

        {/* Book Selector */}
        <BookSelector
          selectedBook={selectedBook}
          onSelectBook={setSelectedBook}
        />

        {/* Book Progress */}
        <BookProgress book={selectedBook} />

        {/* Lesson List */}
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-6">
          {GENKI_BOOKS[selectedBook].title} Lessons
        </Text>

        <View className="gap-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </View>

        {/* JLPT Section */}
        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            JLPT Courses
          </Text>
          <Pressable
            onPress={() => router.push('/jlpt' as any)}
            className="bg-gradient-to-r from-purple-50 to-sakura-50 dark:from-purple-900/20 dark:to-sakura-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl items-center justify-center">
                <Text className="text-2xl font-bold text-purple-600">N</Text>
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  JLPT N5 to N1
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Complete Japanese proficiency courses
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
            </View>
          </Pressable>
        </View>

        {/* Learning Style Info */}
        <View className="mt-8 bg-sakura-50 dark:bg-sakura-900/20 rounded-2xl p-5">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your Learning Style
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            {profile.learningStyle === 'detailed'
              ? 'Study Mode: Detailed explanations with cultural context'
              : 'Conversation Mode: Quick, practical learning through dialogue'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BookSelector = memo(function BookSelector({
  selectedBook,
  onSelectBook,
}: {
  selectedBook: GenkiBook;
  onSelectBook: (book: GenkiBook) => void;
}) {
  const handleSelect = (book: GenkiBook) => {
    triggerSelection();
    onSelectBook(book);
  };

  return (
    <View className="flex-row gap-3" accessibilityRole="tablist">
      <Pressable
        onPress={() => handleSelect('genki1')}
        className={`flex-1 p-4 rounded-xl border-2 ${
          selectedBook === 'genki1'
            ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }`}
        accessibilityRole="tab"
        accessibilityLabel="Genki I, Lessons 1 through 12"
        accessibilityState={{ selected: selectedBook === 'genki1' }}
      >
        <Text
          className={`text-center font-semibold ${
            selectedBook === 'genki1'
              ? 'text-sakura-600 dark:text-sakura-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Genki I
        </Text>
        <Text className="text-xs text-center text-gray-500 mt-1">
          Lessons 1-12
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleSelect('genki2')}
        className={`flex-1 p-4 rounded-xl border-2 ${
          selectedBook === 'genki2'
            ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }`}
        accessibilityRole="tab"
        accessibilityLabel="Genki II, Lessons 13 through 23"
        accessibilityState={{ selected: selectedBook === 'genki2' }}
      >
        <Text
          className={`text-center font-semibold ${
            selectedBook === 'genki2'
              ? 'text-sakura-600 dark:text-sakura-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Genki II
        </Text>
        <Text className="text-xs text-center text-gray-500 mt-1">
          Lessons 13-23
        </Text>
      </Pressable>
    </View>
  );
});

function BookProgress({ book }: { book: GenkiBook }) {
  // Use store's getBookProgress method to avoid duplicating logic and get O(n) performance
  const getBookProgress = useProgressStore((state) => state.getBookProgress);
  const currentStreak = useProgressStore((state) => state.currentStreak);
  const { completedLessons: completedCount, totalLessons, percentComplete: percentage } = getBookProgress(book);

  if (completedCount === 0) return null;

  return (
    <View className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
      <View className="flex-row items-center">
        <View className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
          <Text className="text-lg font-bold text-green-600 dark:text-green-400">
            {percentage}%
          </Text>
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {completedCount}/{totalLessons} lessons completed
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {currentStreak > 0
              ? `${currentStreak} day streak`
              : 'Start your streak today'}
          </Text>
        </View>
      </View>
      {/* Progress bar */}
      <View className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View
          className="h-full bg-green-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </View>
    </View>
  );
}

const LessonCard = memo(function LessonCard({ lesson }: { lesson: GenkiLesson }) {
  // Use selector to only re-render when THIS lesson's completion status changes
  const completed = useProgressStore((state) =>
    state.completedLessons.some((l) => l.topicId === lesson.id)
  );
  const hasContent = lesson.sections.length > 0;

  const handlePress = () => {
    router.push({
      pathname: '/lesson/[topic]',
      params: { topic: lesson.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`bg-white dark:bg-gray-800 border rounded-2xl p-4 ${
        completed
          ? 'border-green-300 dark:border-green-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title} lesson${completed ? ', completed' : ''}`}
    >
      <View className="flex-row items-start">
        {/* Lesson number badge */}
        <View
          className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
            completed
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-sakura-100 dark:bg-sakura-900/30'
          }`}
        >
          {completed ? (
            <FontAwesome name="check" size={20} color="#22c55e" />
          ) : (
            <Text className="text-lg font-bold text-sakura-600 dark:text-sakura-400">
              {lesson.lessonNumber}
            </Text>
          )}
        </View>

        {/* Lesson info */}
        <View className="flex-1">
          <View className="flex-row items-center flex-wrap">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {lesson.title}
            </Text>
            {completed && (
              <View className="ml-2 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded">
                <Text className="text-xs text-green-700 dark:text-green-400">
                  Done
                </Text>
              </View>
            )}
            {!hasContent && (
              <View className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Coming Soon
                </Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-sakura-600 font-japanese mb-1">
            {lesson.titleJapanese}
          </Text>
          <Text
            className="text-sm text-gray-500 dark:text-gray-400"
            numberOfLines={2}
          >
            {lesson.description}
          </Text>

          {/* Lesson metadata */}
          <View className="flex-row items-center mt-2 gap-4">
            <View className="flex-row items-center">
              <FontAwesome name="clock-o" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400 ml-1">
                ~{lesson.estimatedMinutes} min
              </Text>
            </View>
            {lesson.audioTracks.length > 0 && (
              <View className="flex-row items-center">
                <FontAwesome name="headphones" size={12} color="#9ca3af" />
                <Text className="text-xs text-gray-400 ml-1">
                  {lesson.audioTracks.length} audio
                </Text>
              </View>
            )}
            {lesson.sections.length > 0 && (
              <View className="flex-row items-center">
                <FontAwesome name="list" size={12} color="#9ca3af" />
                <Text className="text-xs text-gray-400 ml-1">
                  {lesson.sections.length} sections
                </Text>
              </View>
            )}
          </View>
        </View>

        <FontAwesome name="chevron-right" size={14} color="#9ca3af" />
      </View>
    </Pressable>
  );
});
