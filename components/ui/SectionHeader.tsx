import { View, Text } from 'react-native';
import { typography } from '@/constants/tokens';

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text className={`${typography.label} text-gray-500 dark:text-gray-400`}>{title}</Text>
      {action}
    </View>
  );
}
