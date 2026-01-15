import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useChat } from '@/hooks/useChat';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatScreen() {
  const { messages, isLoading, error, sendUserMessage, clearChat } = useChat();
  const { apiKey, loadApiKey, isLoading: isLoadingApiKey } = useSettingsStore();
  const [inputValue, setInputValue] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadApiKey();
  }, []);

  const handleSend = async () => {
    if (inputValue.trim() && apiKey) {
      const message = inputValue.trim();
      setInputValue('');
      await sendUserMessage(message, apiKey);
    }
  };

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

            <View className="mt-8 gap-2">
              <SuggestionChip
                text="How do I say 'hello'?"
                onPress={() => setInputValue("How do I say 'hello' in Japanese?")}
              />
              <SuggestionChip
                text="Teach me to count"
                onPress={() => setInputValue("Can you teach me to count in Japanese?")}
              />
              <SuggestionChip
                text="What's the difference between は and が?"
                onPress={() => setInputValue("What's the difference between は and が?")}
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

        {error && (
          <View className="bg-red-100 dark:bg-red-900/30 px-4 py-2">
            <Text className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </Text>
          </View>
        )}

        <ChatInput
          value={inputValue}
          onChangeText={setInputValue}
          onSend={handleSend}
          isLoading={isLoading}
          placeholder="Ask me anything about Japanese..."
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
    <Text
      onPress={onPress}
      className="bg-sakura-100 dark:bg-sakura-900/30 text-sakura-700 dark:text-sakura-300 px-4 py-2 rounded-full text-center"
    >
      {text}
    </Text>
  );
}
