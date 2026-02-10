import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useLesson } from '@/hooks/useLesson';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { LessonContent } from './LessonContent';
import { useLessonCompletion } from '@/hooks/useLessonCompletion';

export const TOPIC_INFO: Record<string, { title: string; description: string }> = {
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

export function AILessonScreen({ topic }: { topic: string }) {
  const { lesson, isLoading, error, generateLesson } = useLesson();
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);

  const topicInfo = TOPIC_INFO[topic] || { title: topic, description: '' };
  const { isMarkedComplete, wasAlreadyCompleted, handleMarkComplete } = useLessonCompletion(topic);

  useEffect(() => {
    if (topic && !lesson && !isLoading) {
      generateLesson(topic, topicInfo.title);
    }
  }, [topic]);

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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScreenHeader
        title={topicInfo.title}
        subtitle={topicInfo.description}
        onBack={() => router.back()}
      />

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
