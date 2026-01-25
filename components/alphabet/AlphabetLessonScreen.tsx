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
import { MatchingGame } from '@/components/games';
import { MatchingPairType } from '@/types/games';

type Section = 'learn' | 'write' | 'practice' | 'quiz';

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
  const [showGrid, setShowGrid] = useState(false); // Toggle between card and grid view
  const [showMatchingGame, setShowMatchingGame] = useState(false);
  const [matchingPairType, setMatchingPairType] = useState<MatchingPairType>('hiragana-romaji');

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
    { id: 'practice', label: 'Practice', icon: 'gamepad' },
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
          contentContainerClassName="px-6 py-6"
        >
          {/* View Toggle */}
          <View className="flex-row justify-center mb-4">
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <Pressable
                onPress={() => setShowGrid(false)}
                className={`px-4 py-2 rounded-lg ${
                  !showGrid ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    !showGrid ? 'text-sakura-600' : 'text-gray-500'
                  }`}
                >
                  Card
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowGrid(true)}
                className={`px-4 py-2 rounded-lg ${
                  showGrid ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    showGrid ? 'text-sakura-600' : 'text-gray-500'
                  }`}
                >
                  Summary
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Card View - Single character */}
          {!showGrid && (
            <View className="items-center">
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
            </View>
          )}

          {/* Grid View - All characters summary */}
          {showGrid && (
            <View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                {lesson.title}
              </Text>

              {/* Character Grid */}
              <View className="flex-row flex-wrap justify-center gap-3">
                {lesson.pairs.map((pair) => (
                  <Pressable
                    key={pair.romaji}
                    onPress={() => {
                      setCurrentCharIndex(lesson.pairs.indexOf(pair));
                      setShowGrid(false);
                    }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 items-center w-[85px]"
                  >
                    {/* Hiragana */}
                    <Text className="text-3xl font-japanese text-gray-900 dark:text-white">
                      {pair.hiragana.character}
                    </Text>
                    {/* Katakana */}
                    <Text className="text-2xl font-japanese text-gray-400 mt-1">
                      {pair.katakana.character}
                    </Text>
                    {/* Romaji */}
                    <Text className="text-xs text-sakura-600 font-semibold mt-2">
                      {pair.romaji}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Mark as reviewed button */}
              {!progress?.learnCompleted && (
                <View className="mt-6 items-center">
                  <Button
                    title="Mark as Reviewed"
                    onPress={() => onSectionComplete('learn')}
                  />
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {activeSection === 'write' && (
        <View className="flex-1 px-6 py-4 justify-center">
          {/* Character selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4 flex-grow-0"
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

          {/* Drawing canvas - fixed aspect ratio for square canvas */}
          <View className="w-full aspect-square max-h-[400px]">
            <DrawingCanvas
              targetCharacter={currentPair.hiragana.character}
              strokeCount={currentPair.hiragana.strokeCount}
              onComplete={handleWriteComplete}
            />
          </View>
        </View>
      )}

      {activeSection === 'practice' && (
        <View className="flex-1 px-6 py-8">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
            Matching Game
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Match pairs to reinforce your memory
          </Text>

          {/* Pair Type Selection */}
          <View className="gap-3 mb-6">
            {[
              { type: 'hiragana-romaji' as const, label: 'Hiragana ↔ Romaji' },
              { type: 'katakana-romaji' as const, label: 'Katakana ↔ Romaji' },
              { type: 'hiragana-katakana' as const, label: 'Hiragana ↔ Katakana' },
            ].map((option) => (
              <Pressable
                key={option.type}
                onPress={() => setMatchingPairType(option.type)}
                className={`p-4 rounded-xl border-2 ${
                  matchingPairType === option.type
                    ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    matchingPairType === option.type
                      ? 'text-sakura-600'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button
            title="Start Matching Game"
            onPress={() => setShowMatchingGame(true)}
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

      {/* Matching Game Modal */}
      <Modal
        visible={showMatchingGame}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <MatchingGame
          pairs={lesson.pairs}
          pairType={matchingPairType}
          pairCount={Math.min(5, lesson.pairs.length)}
          onClose={() => setShowMatchingGame(false)}
          onComplete={(score) => {
            // Score is handled by the game component
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}
