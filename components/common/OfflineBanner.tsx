import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <View className="bg-amber-100 dark:bg-amber-900/50 px-4 py-2 flex-row items-center justify-center">
      <FontAwesome name="wifi" size={14} color="#d97706" />
      <Text className="text-amber-700 dark:text-amber-300 text-sm ml-2">
        You're offline - some features unavailable
      </Text>
    </View>
  );
}
