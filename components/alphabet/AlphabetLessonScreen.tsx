// components/alphabet/AlphabetLessonScreen.tsx

import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AlphabetLesson } from '@/types/alphabet';
import { CharacterCard } from './CharacterCard';
import { DrawingCanvas } from './DrawingCanvas';
import { CharacterQuiz } from './CharacterQuiz';
import { Button } from '@/components/common/Button';

type Section = 'learn' | 'write' | 'quiz';

interface AlphabetLessonScreenProps {
  lesson: AlphabetLesson;
  onSectionComplete: (section: Section, score?: number, total?: number) => void;
  progress?: {
    learnCompleted: boolean;
    writeCompleted: boolean;
    quizBestScore: number | null;
  };
}

export function AlphabetLessonScreen({
  lesson,
  onSectionComplete,
  progress,
}: AlphabetLessonScreenProps) {
  const [activeSection, setActiveSection] = useState<Section>('learn');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [writtenChars, setWrittenChars] = useState<Set<string>>(new Set());

  const currentPair = lesson.pairs[currentCharIndex];

  const handleBack = () => {
    router.back();
  };

  const handleNextChar = () => {
    if (currentCharIndex < lesson.pairs.length - 1) {
      setCurrentCharIndex(currentCharIndex + 1);
    } else if (activeSection === 'learn') {
      onSectionComplete('learn');
    }
  };

  const handlePrevChar = () => {
    if (currentCharIndex > 0) {
      setCurrentCharIndex(currentCharIndex - 1);
    }
  };

  const handleWriteComplete = () => {
    const charId = `${currentPair.romaji}`;
    const newWritten = new Set(writtenChars);
    newWritten.add(charId);
    setWrittenChars(newWritten);

    if (newWritten.size >= lesson.pairs.length) {
      onSectionComplete('write');
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    onSectionComplete('quiz', score, total);
  };

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'learn', label: 'Learn', icon: 'eye' },
    { id: 'write', label: 'Write', icon: 'pencil' },
    { id: 'quiz', label: 'Quiz', icon: 'question-circle' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <FontAwesome name="chevron-left" size={20} color="#ec4899" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Lesson {lesson.lessonNumber}: {lesson.title}
          </Text>
          <Text className="text-sm text-sakura-600 font-japanese">
            {lesson.titleJapanese}
          </Text>
        </View>
      </View>

      {/* Section Tabs */}
      <View className="flex-row border-b border-gray-200 dark:border-gray-800">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isComplete =
            (section.id === 'learn' && progress?.learnCompleted) ||
            (section.id === 'write' && progress?.writeCompleted) ||
            (section.id === 'quiz' && progress?.quizBestScore !== null);

          return (
            <Pressable
              key={section.id}
              onPress={() => {
                setActiveSection(section.id);
                setCurrentCharIndex(0);
              }}
              className={`flex-1 py-3 items-center border-b-2 ${
                isActive
                  ? 'border-sakura-500'
                  : 'border-transparent'
              }`}
            >
              <View className="flex-row items-center">
                {isComplete && (
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="#22c55e"
                    style={{ marginRight: 4 }}
                  />
                )}
                <FontAwesome
                  name={section.icon as any}
                  size={16}
                  color={isActive ? '#ec4899' : '#9ca3af'}
                />
                <Text
                  className={`ml-2 font-medium ${
                    isActive
                      ? 'text-sakura-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {section.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {activeSection === 'learn' && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-8 items-center"
        >
          {/* Character Card */}
          <CharacterCard pair={currentPair} size="large" />

          {/* Stroke count info */}
          <View className="flex-row mt-4 gap-4">
            <Text className="text-sm text-gray-500">
              Hiragana: {currentPair.hiragana.strokeCount} strokes
            </Text>
            <Text className="text-sm text-gray-500">
              Katakana: {currentPair.katakana.strokeCount} strokes
            </Text>
          </View>

          {/* Navigation */}
          <View className="flex-row items-center justify-between w-full mt-8">
            <Pressable
              onPress={handlePrevChar}
              disabled={currentCharIndex === 0}
              className={`p-4 ${currentCharIndex === 0 ? 'opacity-30' : ''}`}
            >
              <FontAwesome name="chevron-left" size={24} color="#ec4899" />
            </Pressable>

            <Text className="text-gray-500">
              {currentCharIndex + 1} / {lesson.pairs.length}
            </Text>

            <Pressable onPress={handleNextChar} className="p-4">
              <FontAwesome name="chevron-right" size={24} color="#ec4899" />
            </Pressable>
          </View>
        </ScrollView>
      )}

      {activeSection === 'write' && (
        <View className="flex-1 px-6 py-4">
          {/* Character selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerClassName="gap-2"
          >
            {lesson.pairs.map((pair, index) => {
              const isWritten = writtenChars.has(pair.romaji);
              const isSelected = index === currentCharIndex;

              return (
                <Pressable
                  key={pair.romaji}
                  onPress={() => setCurrentCharIndex(index)}
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    isSelected
                      ? 'bg-sakura-500'
                      : isWritten
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Text
                    className={`text-lg font-japanese ${
                      isSelected
                        ? 'text-white'
                        : isWritten
                        ? 'text-green-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {pair.hiragana.character}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Drawing canvas */}
          <DrawingCanvas
            targetCharacter={currentPair.hiragana.character}
            strokeCount={currentPair.hiragana.strokeCount}
            onComplete={handleWriteComplete}
          />
        </View>
      )}

      {activeSection === 'quiz' && (
        <View className="flex-1 px-6 py-8 items-center justify-center">
          <FontAwesome name="question-circle" size={64} color="#ec4899" />
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            Ready for a quiz?
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xs">
            Test your knowledge of the {lesson.title} characters with a 10-question quiz.
          </Text>
          {progress?.quizBestScore != null && (
            <Text className="text-green-600 mt-2">
              Best score: {progress?.quizBestScore}/10
            </Text>
          )}
          <View className="mt-6">
            <Button title="Start Quiz" onPress={() => setShowQuiz(true)} />
          </View>
        </View>
      )}

      {/* Quiz Modal */}
      <Modal
        visible={showQuiz}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CharacterQuiz
          pairs={lesson.pairs}
          lessonId={lesson.id}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      </Modal>
    </SafeAreaView>
  );
}
