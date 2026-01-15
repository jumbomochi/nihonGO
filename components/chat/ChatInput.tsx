import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChangeText,
  onSend,
  isLoading = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <View className="flex-row items-end gap-2 px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <View className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 min-h-[44px] max-h-[120px]">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          multiline
          className="text-base text-gray-900 dark:text-white"
          editable={!isLoading}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message to the Japanese tutor"
        />
      </View>
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        className={`w-11 h-11 rounded-full items-center justify-center ${
          canSend ? 'bg-sakura-500 active:bg-sakura-600' : 'bg-gray-300 dark:bg-gray-700'
        }`}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        accessibilityState={{ disabled: !canSend }}
        accessibilityHint={canSend ? "Sends your message" : "Enter a message first"}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <FontAwesome name="send" size={18} color="#fff" />
        )}
      </Pressable>
    </View>
  );
}
