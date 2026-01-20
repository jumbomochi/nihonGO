import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { triggerImpact } from '@/lib/haptics';
import { useChat } from '@/hooks/useChat';
import { useSettingsStore } from '@/stores/settingsStore';
const selectApiKey = (state: ReturnType<typeof useSettingsStore.getState>) => state.apiKey;
const selectLoadApiKey = (state: ReturnType<typeof useSettingsStore.getState>) => state.loadApiKey;
const selectIsLoading = (state: ReturnType<typeof useSettingsStore.getState>) => state.isLoading;
const selectIsOnline = (state: ReturnType<typeof useSettingsStore.getState>) => state.isOnline;
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { isNetworkError, getRetryMessage } from '@/lib/errors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatScreen() {
  const { messages, isLoading, error, sendUserMessage, clearChat } = useChat();
  const apiKey = useSettingsStore(selectApiKey);
  const loadApiKey = useSettingsStore(selectLoadApiKey);
  const isLoadingApiKey = useSettingsStore(selectIsLoading);
  const isOnline = useSettingsStore(selectIsOnline);
  const [inputValue, setInputValue] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const handleSend = useCallback(async () => {
    if (inputValue.trim() && apiKey && isOnline) {
      triggerImpact();
      const message = inputValue.trim();
      setInputValue('');
      await sendUserMessage(message, apiKey);
    }
  }, [inputValue, apiKey, isOnline, sendUserMessage]);

  const handleSuggestionPress = useCallback((text: string) => {
    triggerImpact();
    setInputValue(text);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      // Clean up timer on unmount or when messages change rapidly
      return () => clearTimeout(timer);
    }
  }, [messages]);

  if (!apiKey && !isLoadingApiKey) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="comments" size={48} color="#d1d5db" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-4 text-center">
          API Key Required
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
          Please add your Claude API key on the Learn tab to start chatting
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={90}
      >
        {messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 bg-sakura-100 dark:bg-sakura-900/30 rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🇯🇵</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Start a conversation
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-[280px]">
              Ask me anything about Japanese! Grammar, vocabulary, culture, or just practice chatting.
            </Text>

            <View className="mt-8 gap-3">
              <SuggestionChip
                text="How do I say 'hello'?"
                onPress={() => handleSuggestionPress("How do I say 'hello' in Japanese?")}
              />
              <SuggestionChip
                text="Teach me to count"
                onPress={() => handleSuggestionPress("Can you teach me to count in Japanese?")}
              />
              <SuggestionChip
                text="What's the difference between は and が?"
                onPress={() => handleSuggestionPress("What's the difference between は and が?")}
              />
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatBubble content={item.content} role={item.role} />
            )}
            contentContainerClassName="px-4 py-4"
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            initialNumToRender={15}
          />
        )}

        {/* Typing indicator */}
        {isLoading && messages.length > 0 && (
          <View className="px-4 py-2">
            <View className="self-start bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex-row items-center">
              <ActivityIndicator size="small" color="#ec4899" />
              <Text className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                nihonGO is typing...
              </Text>
            </View>
          </View>
        )}

        {error && (
          <View className="bg-red-100 dark:bg-red-900/30 px-4 py-3">
            <View className="flex-row items-start">
              <FontAwesome name="exclamation-circle" size={16} color="#ef4444" style={{ marginTop: 2 }} />
              <View className="flex-1 ml-2">
                <Text className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </Text>
                {getRetryMessage({ message: error } as Error) && (
                  <Text className="text-red-500 dark:text-red-300 text-xs mt-1">
                    {getRetryMessage({ message: error } as Error)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        <ChatInput
          value={inputValue}
          onChangeText={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
          disabled={!isOnline}
          placeholder={isOnline ? "Ask me anything about Japanese..." : "Chat requires internet connection"}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SuggestionChip({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      className="bg-sakura-100 dark:bg-sakura-900/30 px-4 py-3 rounded-full active:bg-sakura-200 dark:active:bg-sakura-900/50"
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityHint="Tap to use this as your message"
    >
      <Text className="text-sakura-700 dark:text-sakura-300 text-center">
        {text}
      </Text>
    </Pressable>
  );
}
