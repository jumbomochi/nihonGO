import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLesson } from '@/hooks/useLesson';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProgressStore } from '@/stores/progressStore';

const selectIsOnline = (state: ReturnType<typeof useSettingsStore.getState>) => state.isOnline;
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { GenkiLesson, LessonSection as LessonSectionType, AudioTrack } from '@/types/genki';
import { isGenkiLessonId, getLessonOrPlaceholder } from '@/data/genki';
import { getLessonAudioPath, getDialogueAudioPath, getFullDialogueAudioPath } from '@/data/genki/audio/audioManifest';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { SectionTabs } from '@/components/lesson/SectionTabs';
import { VocabularyList } from '@/components/lesson/VocabularyList';
import { GrammarSection } from '@/components/lesson/GrammarSection';
import { DialogueSection } from '@/components/lesson/DialogueSection';
import { CultureNote } from '@/components/lesson/CultureNote';
import { VocabQuiz } from '@/components/practice/VocabQuiz';
import { VocabularyItem } from '@/types/genki';
import { QuizScore } from '@/stores/progressStore';

// Helper to build quiz scores record for section tabs
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

const TOPIC_INFO: Record<string, { title: string; description: string }> = {
  greetings: {
    title: 'Greetings',
    description: 'Basic hello & goodbye expressions',
  },
  'self-intro': {
    title: 'Self Introduction',
    description: 'Introduce yourself in Japanese',
  },
  numbers: { title: 'Numbers', description: 'Learn to count in Japanese' },
  time: { title: 'Telling Time', description: 'Express hours and minutes' },
  food: {
    title: 'Ordering Food',
    description: 'Restaurant and food vocabulary',
  },
  directions: {
    title: 'Directions',
    description: 'Ask and give directions',
  },
};

export default function LessonScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const { apiKey, aiProvider, loadApiKey, loadAISettings } = useSettingsStore();
  const isOnline = useSettingsStore(selectIsOnline);
  const isGenki = topic ? isGenkiLessonId(topic) : false;

  useEffect(() => {
    loadApiKey();
    loadAISettings();
  }, []);

  // Check if AI provider is properly configured
  const isAIConfigured = aiProvider === 'ollama' || (aiProvider === 'claude' && apiKey);

  if (!isAIConfigured) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="key" size={48} color="#d1d5db" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 text-center">
          {aiProvider === 'claude' ? 'API Key Required' : 'AI Provider Not Configured'}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
          {aiProvider === 'claude'
            ? 'Please add your Claude API key in Settings'
            : 'Please configure your AI provider in Settings'}
        </Text>
        <View className="mt-6">
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (isGenki) {
    return <GenkiLessonScreen lessonId={topic!} />;
  }

  // Show offline message for AI lessons when not connected
  if (!isOnline) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="wifi" size={48} color="#d97706" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 text-center">
          Internet Required
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
          AI-generated lessons require an internet connection
        </Text>
        <View className="mt-6 gap-3">
          <Button
            title="Browse Genki Lessons"
            onPress={() => router.replace('/(tabs)')}
          />
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return <AILessonScreen topic={topic!} />;
}

// Genki structured lesson screen
function GenkiLessonScreen({
  lessonId,
}: {
  lessonId: string;
}) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [currentAudioUri, setCurrentAudioUri] = useState<string | null>(null);
  const [currentAudioTitle, setCurrentAudioTitle] = useState<string>('');
  const { completeLesson, isLessonCompleted, getBestScore } = useProgressStore();
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizVocabulary, setQuizVocabulary] = useState<VocabularyItem[]>([]);
  const [quizSectionId, setQuizSectionId] = useState<string>('');

  const lesson = getLessonOrPlaceholder(lessonId);
  const wasAlreadyCompleted = isLessonCompleted(lessonId);

  useEffect(() => {
    if (lesson && lesson.sections.length > 0) {
      setActiveSection(lesson.sections[0].id);
    }
  }, [lesson]);

  const handleMarkComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    completeLesson(lessonId, timeSpent);
    setIsMarkedComplete(true);
  };

  const handleBack = () => {
    router.back();
  };

  // Play full dialogue audio
  const handlePlayFullDialogue = () => {
    if (!lesson) return;
    const uri = getFullDialogueAudioPath(lesson.book, lesson.lessonNumber);
    setCurrentAudioUri(uri);
    setCurrentAudioTitle('Full Dialogue');
  };

  // Start vocabulary quiz
  const handleStartQuiz = (vocabulary: VocabularyItem[], sectionId: string) => {
    setQuizVocabulary(vocabulary);
    setQuizSectionId(sectionId);
    setShowQuiz(true);
  };

  // Play individual line audio
  const handlePlayLineAudio = (lineIndex: number, speaker: string) => {
    if (!lesson) return;
    const uri = getDialogueAudioPath(lesson.book, lesson.lessonNumber, lineIndex, speaker);
    setCurrentAudioUri(uri);
    setCurrentAudioTitle(`Line ${lineIndex}: ${speaker}`);
  };

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-500">Lesson not found</Text>
        <Button title="Go Back" variant="outline" onPress={handleBack} />
      </SafeAreaView>
    );
  }

  const activeContent = lesson.sections.find((s) => s.id === activeSection);

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
          <Text className="text-sm text-sakura-600">
            {lesson.titleJapanese}
          </Text>
        </View>
      </View>

      {/* Audio Player (when playing) */}
      {currentAudioUri && (
        <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <AudioPlayer
            uri={currentAudioUri}
            title={currentAudioTitle}
            onPlaybackComplete={() => setCurrentAudioUri(null)}
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
              <Button title="Go Back" variant="outline" onPress={handleBack} />
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
                onPlayLineAudio={handlePlayLineAudio}
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
          onClose={() => setShowQuiz(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

// Render section based on type
function SectionRenderer({
  section,
  lessonId,
  lessonAudioTracks,
  onPlayAudio,
  onPlayLineAudio,
  onStartQuiz,
}: {
  section: LessonSectionType;
  lessonId: string;
  lessonAudioTracks?: AudioTrack[];
  onPlayAudio: () => void;
  onPlayLineAudio?: (lineIndex: number, speaker: string) => void;
  onStartQuiz?: (vocabulary: VocabularyItem[], sectionId: string) => void;
}) {
  switch (section.type) {
    case 'dialogue':
      // Use section-level audio tracks if available, otherwise use lesson-level tracks
      const dialogueAudio = section.audioTracks || lessonAudioTracks;
      return section.content.dialogue ? (
        <DialogueSection
          dialogue={section.content.dialogue}
          audioTracks={dialogueAudio}
          onPlayAudio={onPlayAudio}
          onPlayLineAudio={onPlayLineAudio}
        />
      ) : null;

    case 'vocabulary':
      return section.content.vocabulary ? (
        <VocabularyList
          vocabulary={section.content.vocabulary}
          showPracticeButton={section.content.vocabulary.length >= 4}
          onPracticePress={() =>
            onStartQuiz?.(section.content.vocabulary!, section.id)
          }
        />
      ) : null;

    case 'grammar':
      return section.content.grammar ? (
        <GrammarSection grammarPoints={section.content.grammar} />
      ) : null;

    case 'culture':
      return section.content.culturalNote ? (
        <CultureNote note={section.content.culturalNote} />
      ) : null;

    default:
      return (
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
          <Text className="text-gray-500">
            Content for {section.type} coming soon...
          </Text>
        </View>
      );
  }
}

// Original AI-generated lesson screen
function AILessonScreen({ topic }: { topic: string }) {
  const { lesson, isLoading, error, generateLesson } = useLesson();
  const { completeLesson, isLessonCompleted } = useProgressStore();
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const topicInfo = TOPIC_INFO[topic] || { title: topic, description: '' };
  const wasAlreadyCompleted = isLessonCompleted(topic);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (topic && !lesson && !isLoading) {
      generateLesson(topic, topicInfo.title);
    }
  }, [topic]);

  const handleMarkComplete = () => {
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    completeLesson(topic, timeSpent);
    setIsMarkedComplete(true);
  };

  const handleAskFollowUp = async () => {
    if (!followUpQuestion.trim() || !lesson) return;

    setIsAskingFollowUp(true);
    try {
      const aiProvider = await import('@/lib/aiProvider');
      const { useUserStore } = await import('@/stores/userStore');
      const profile = useUserStore.getState().profile;
      const settings = useSettingsStore.getState();

      const messages = [
        {
          role: 'user' as const,
          content: `Previous lesson was about: ${topicInfo.title}\n\nLesson content:\n${lesson.content}\n\nMy follow-up question: ${followUpQuestion}`,
        },
      ];

      const config = {
        provider: settings.aiProvider,
        claudeApiKey: settings.apiKey || undefined,
        ollamaUrl: settings.ollamaUrl,
        ollamaModel: settings.ollamaModel,
      };

      const response = await aiProvider.sendMessage(messages, profile, config);
      setFollowUpAnswer(response);
      setFollowUpQuestion('');
    } catch (err) {
      console.error('Follow-up error:', err);
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <FontAwesome name="chevron-left" size={20} color="#ec4899" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {topicInfo.title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {topicInfo.description}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        {isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color="#ec4899" />
            <Text className="text-gray-500 dark:text-gray-400 mt-4">
              Generating your personalized lesson...
            </Text>
          </View>
        ) : error ? (
          <View className="items-center py-12">
            <FontAwesome name="exclamation-circle" size={48} color="#ef4444" />
            <Text className="text-red-500 mt-4 text-center">{error}</Text>
            <View className="mt-6">
              <Button
                title="Try Again"
                onPress={() => generateLesson(topic, topicInfo.title)}
              />
            </View>
          </View>
        ) : lesson ? (
          <View>
            {/* Lesson Content */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
              <LessonContent content={lesson.content} />
            </View>

            {/* Follow-up Answer */}
            {followUpAnswer && (
              <View className="bg-sakura-50 dark:bg-sakura-900/20 rounded-2xl p-5 mb-6">
                <Text className="text-sm font-medium text-sakura-600 dark:text-sakura-400 mb-2">
                  Follow-up Answer
                </Text>
                <LessonContent content={followUpAnswer} />
              </View>
            )}

            {/* Mark Complete */}
            {!wasAlreadyCompleted && !isMarkedComplete ? (
              <View className="bg-sakura-500 rounded-2xl p-5 mb-6">
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
              <View className="bg-green-100 dark:bg-green-900/30 rounded-2xl p-4 mb-6 flex-row items-center justify-center">
                <FontAwesome name="check-circle" size={20} color="#22c55e" />
                <Text className="text-green-700 dark:text-green-400 font-medium ml-2">
                  Lesson completed!
                </Text>
              </View>
            )}

            {/* Follow-up Question */}
            <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
              <Text className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Have a question?
              </Text>
              <Input
                value={followUpQuestion}
                onChangeText={setFollowUpQuestion}
                placeholder="Ask a follow-up question..."
                multiline
              />
              <View className="mt-4">
                <Button
                  title="Ask"
                  onPress={handleAskFollowUp}
                  loading={isAskingFollowUp}
                  disabled={!followUpQuestion.trim()}
                />
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <View className="gap-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <View key={index} className="h-2" />;
        }

        if (trimmed.startsWith('## ')) {
          return (
            <Text
              key={index}
              className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2"
            >
              {trimmed.replace('## ', '')}
            </Text>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <Text
              key={index}
              className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2"
            >
              {trimmed.replace('# ', '')}
            </Text>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <View key={index} className="flex-row pl-2">
              <Text className="text-gray-600 dark:text-gray-400 mr-2">•</Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1 leading-6">
                {trimmed.substring(2)}
              </Text>
            </View>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          return (
            <View key={index} className="flex-row pl-2">
              <Text className="text-sakura-600 font-medium mr-2 w-6">
                {numberedMatch[1]}.
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1 leading-6">
                {trimmed.replace(numberedMatch[0], '')}
              </Text>
            </View>
          );
        }

        if (trimmed.includes('**')) {
          return (
            <Text
              key={index}
              className="text-gray-700 dark:text-gray-300 leading-6"
            >
              {renderBoldText(trimmed)}
            </Text>
          );
        }

        return (
          <Text
            key={index}
            className="text-gray-700 dark:text-gray-300 leading-6"
          >
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
}

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} className="font-bold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
}
