import { useState, useCallback, useRef } from 'react';
import { sendMessage, AIProviderConfig } from '@/lib/aiProvider';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Generate unique IDs that won't collide even with rapid message sending
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profile = useUserStore((state) => state.profile);

  // Get AI settings from store
  const aiProvider = useSettingsStore((state) => state.aiProvider);
  const apiKey = useSettingsStore((state) => state.apiKey);
  const ollamaUrl = useSettingsStore((state) => state.ollamaUrl);
  const ollamaModel = useSettingsStore((state) => state.ollamaModel);

  // Use ref to track messages for building chat history without causing re-renders
  const messagesRef = useRef<Message[]>([]);
  // Track current request for cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendUserMessage = useCallback(
    async (content: string) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Update both ref and state
      const newMessages = [...messagesRef.current, userMessage];
      messagesRef.current = newMessages;
      setMessages(newMessages);
      setIsLoading(true);
      setError(null);

      try {
        const chatHistory = newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        // Build AI provider config
        const config: AIProviderConfig = {
          provider: aiProvider,
          claudeApiKey: apiKey || undefined,
          ollamaUrl,
          ollamaModel,
        };

        const response = await sendMessage(
          chatHistory,
          profile,
          config,
          abortControllerRef.current.signal
        );

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        const updatedMessages = [...messagesRef.current, assistantMessage];
        messagesRef.current = updatedMessages;
        setMessages(updatedMessages);
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsLoading(false);
      }
    },
    [profile, aiProvider, apiKey, ollamaUrl, ollamaModel]
  );

  const clearChat = useCallback(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    messagesRef.current = [];
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendUserMessage,
    clearChat,
  };
}
