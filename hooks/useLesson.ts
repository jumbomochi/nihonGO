import { useState, useCallback, useRef } from 'react';
import { sendMessage, createLessonPrompt, AIProviderConfig } from '@/lib/aiProvider';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';

interface LessonContent {
  topic: string;
  content: string;
  generatedAt: Date;
}

export function useLesson() {
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profile = useUserStore((state) => state.profile);

  // Get AI settings from store
  const aiProvider = useSettingsStore((state) => state.aiProvider);
  const apiKey = useSettingsStore((state) => state.apiKey);
  const ollamaUrl = useSettingsStore((state) => state.ollamaUrl);
  const ollamaModel = useSettingsStore((state) => state.ollamaModel);

  // Track current request for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateLesson = useCallback(
    async (topic: string, topicTitle: string) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);
      setLesson(null);

      try {
        const prompt = createLessonPrompt(topicTitle, profile);

        // Build AI provider config
        const config: AIProviderConfig = {
          provider: aiProvider,
          claudeApiKey: apiKey || undefined,
          ollamaUrl,
          ollamaModel,
        };

        const response = await sendMessage(
          [{ role: 'user', content: prompt }],
          profile,
          config,
          abortControllerRef.current.signal
        );

        setLesson({
          topic,
          content: response,
          generatedAt: new Date(),
        });
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to generate lesson');
      } finally {
        setIsLoading(false);
      }
    },
    [profile, aiProvider, apiKey, ollamaUrl, ollamaModel]
  );

  const askFollowUp = useCallback(
    async (question: string): Promise<string> => {
      if (!lesson) {
        throw new Error('No lesson loaded');
      }

      const abortController = new AbortController();

      const messages = [
        { role: 'user' as const, content: createLessonPrompt(lesson.topic, profile) },
        { role: 'assistant' as const, content: lesson.content },
        { role: 'user' as const, content: question },
      ];

      // Build AI provider config
      const config: AIProviderConfig = {
        provider: aiProvider,
        claudeApiKey: apiKey || undefined,
        ollamaUrl,
        ollamaModel,
      };

      return sendMessage(messages, profile, config, abortController.signal);
    },
    [lesson, profile, aiProvider, apiKey, ollamaUrl, ollamaModel]
  );

  const clearLesson = useCallback(() => {
    setLesson(null);
    setError(null);
  }, []);

  return {
    lesson,
    isLoading,
    error,
    generateLesson,
    askFollowUp,
    clearLesson,
  };
}
