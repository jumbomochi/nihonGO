import { View, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text } from './Text';
import { rawColors } from '@/constants/tokens';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  className = '',
}: ScreenHeaderProps) {
  return (
    <View className={`flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      {onBack && (
        <Pressable
          onPress={onBack}
          className="mr-3 p-1"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <FontAwesome name="chevron-left" size={18} color={rawColors.sakura500} />
        </Pressable>
      )}
      <View className="flex-1">
        <Text variant="heading2">{title}</Text>
        {subtitle && (
          <Text variant="caption" color="accent">{subtitle}</Text>
        )}
      </View>
      {rightAction}
    </View>
  );
}
