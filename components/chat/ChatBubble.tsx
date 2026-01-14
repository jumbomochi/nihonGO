import { View, Text } from 'react-native';

interface ChatBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
}

export function ChatBubble({ content, role }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <View
      className={`max-w-[85%] mb-3 ${isUser ? 'self-end' : 'self-start'}`}
    >
      <View
        className={`px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-sakura-500 rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            isUser ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}
        >
          {content}
        </Text>
      </View>
    </View>
  );
}
