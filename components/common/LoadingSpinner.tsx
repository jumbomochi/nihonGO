import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export function LoadingSpinner({ message, size = 'large' }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color="#ec4899" />
      {message && (
        <Text className="text-gray-600 dark:text-gray-400 mt-4 text-base">
          {message}
        </Text>
      )}
    </View>
  );
}
