import { Pressable, Text } from 'react-native';

interface QuizOptionProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  state?: 'default' | 'correct' | 'incorrect' | 'missed';
}

export function QuizOption({
  text,
  onPress,
  disabled = false,
  state = 'default',
}: QuizOptionProps) {
  const getBackgroundClass = () => {
    switch (state) {
      case 'correct':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500';
      case 'incorrect':
        return 'bg-red-100 dark:bg-red-900/30 border-red-500';
      case 'missed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-300';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  const getTextClass = () => {
    switch (state) {
      case 'correct':
        return 'text-green-700 dark:text-green-300';
      case 'incorrect':
        return 'text-red-700 dark:text-red-300';
      case 'missed':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`p-4 rounded-xl border-2 ${getBackgroundClass()} ${
        !disabled ? 'active:bg-gray-100 dark:active:bg-gray-700' : ''
      }`}
      accessibilityRole="button"
      accessibilityLabel={text}
      accessibilityState={{ disabled }}
    >
      <Text className={`text-base text-center font-medium ${getTextClass()}`}>
        {text}
      </Text>
    </Pressable>
  );
}
