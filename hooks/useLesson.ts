import { useState, useCallback, useRef } from 'react';
import { sendMessage, createLessonPrompt } from '@/lib/claude';
import { useUserStore } from '@/stores/userStore';

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

  // Track current request for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateLesson = useCallback(
    async (topic: string, topicTitle: string, apiKey: string) => {
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
        const response = await sendMessage(
          [{ role: 'user', content: prompt }],
          profile,
          apiKey,
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
    [profile]
  );

  const askFollowUp = useCallback(
    async (question: string, apiKey: string): Promise<string> => {
      if (!lesson) {
        throw new Error('No lesson loaded');
      }

      const abortController = new AbortController();

      const messages = [
        { role: 'user' as const, content: createLessonPrompt(lesson.topic, profile) },
        { role: 'assistant' as const, content: lesson.content },
        { role: 'user' as const, content: question },
      ];

      return sendMessage(messages, profile, apiKey, abortController.signal);
    },
    [lesson, profile]
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
