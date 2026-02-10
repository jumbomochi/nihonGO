import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useProgressStore, QuizScore } from '@/stores/progressStore';
import { getLessonOrPlaceholder } from '@/data/genki';
import { LessonSection as LessonSectionType } from '@/types/genki';
import { Button } from '@/components/common/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { SectionTabs } from '@/components/lesson/SectionTabs';
import { VocabQuiz } from '@/components/practice/VocabQuiz';
import { SectionRenderer } from './SectionRenderer';
import { useLessonCompletion } from '@/hooks/useLessonCompletion';
import { useDialogueAudio } from '@/hooks/useDialogueAudio';
import { useQuizSession } from '@/hooks/useQuizSession';

function getQuizScoresForLesson(
  lessonId: string,
  sections: LessonSectionType[],
  getBestScore: (lessonId: string, sectionId: string) => QuizScore | null
): Record<string, QuizScore> {
  const scores: Record<string, QuizScore> = {};
  for (const section of sections) {
    if (section.type === 'vocabulary') {
      const score = getBestScore(lessonId, section.id);
      if (score) {
        scores[section.id] = score;
      }
    }
  }
  return scores;
}

export function GenkiLessonScreen({ lessonId }: { lessonId: string }) {
  const [activeSection, setActiveSection] = useState<string>('');
  const { getBestScore } = useProgressStore();
  const lesson = getLessonOrPlaceholder(lessonId);

  const { isMarkedComplete, wasAlreadyCompleted, handleMarkComplete } = useLessonCompletion(lessonId);
  const { currentAudioUri, currentAudioTitle, handlePlayFullDialogue, clearAudio, getLineAudioPath } = useDialogueAudio(lesson);
  const { showQuiz, quizVocabulary, quizSectionId, handleStartQuiz, handleCloseQuiz } = useQuizSession();

  useEffect(() => {
    if (lesson && lesson.sections.length > 0) {
      setActiveSection(lesson.sections[0].id);
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500">Lesson not found</Text>
        <Button title="Go Back" variant="outline" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const activeContent = lesson.sections.find((s) => s.id === activeSection);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScreenHeader
        title={`Lesson ${lesson.lessonNumber}: ${lesson.title}`}
        subtitle={lesson.titleJapanese}
        onBack={() => router.back()}
      />

      {/* Audio Player (when playing) */}
      {currentAudioUri && (
        <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <AudioPlayer
            uri={currentAudioUri}
            title={currentAudioTitle}
            onPlaybackComplete={clearAudio}
            compact
          />
        </View>
      )}

      {/* Section Tabs */}
      {lesson.sections.length > 0 && (
        <SectionTabs
          sections={lesson.sections}
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          quizScores={getQuizScoresForLesson(lessonId, lesson.sections, getBestScore)}
        />
      )}

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Empty state for lessons without content */}
        {lesson.sections.length === 0 ? (
          <View className="items-center py-12">
            <FontAwesome name="book" size={48} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 text-center">
              Coming Soon
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs">
              This lesson is being prepared. Check back soon for vocabulary,
              grammar, and dialogue content!
            </Text>
            <View className="mt-6">
              <Button title="Go Back" variant="outline" onPress={() => router.back()} />
            </View>
          </View>
        ) : (
          <>
            {/* Section Content */}
            {activeContent && (
              <SectionRenderer
                section={activeContent}
                lessonId={lessonId}
                lessonAudioTracks={lesson.audioTracks}
                onPlayAudio={handlePlayFullDialogue}
                getLineAudioPath={getLineAudioPath}
                onStartQuiz={handleStartQuiz}
              />
            )}

            {/* Mark Complete */}
            <View className="mt-8">
              {!wasAlreadyCompleted && !isMarkedComplete ? (
                <View className="bg-sakura-500 rounded-2xl p-5">
                  <Text className="text-white font-semibold text-center mb-3">
                    Finished studying this lesson?
                  </Text>
                  <Button
                    title="Mark as Complete"
                    variant="secondary"
                    onPress={handleMarkComplete}
                  />
                </View>
              ) : (
                <View className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 flex-row items-center justify-center">
                  <FontAwesome name="check-circle" size={20} color="#22c55e" />
                  <Text className="text-green-700 dark:text-green-400 font-medium ml-2">
                    Lesson completed!
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Quiz Modal */}
      <Modal
        visible={showQuiz}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <VocabQuiz
          vocabulary={quizVocabulary}
          lessonId={lessonId}
          sectionId={quizSectionId}
          onClose={handleCloseQuiz}
        />
      </Modal>
    </SafeAreaView>
  );
}
