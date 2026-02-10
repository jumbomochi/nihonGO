import { useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSettingsStore } from '@/stores/settingsStore';
import { Button } from '@/components/common/Button';
import { isGenkiLessonId } from '@/data/genki';
import { GenkiLessonScreen } from '@/components/lesson/GenkiLessonScreen';
import { AILessonScreen } from '@/components/lesson/AILessonScreen';

const selectIsOnline = (state: ReturnType<typeof useSettingsStore.getState>) => state.isOnline;

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
