import { View } from 'react-native';

interface ProgressBarProps {
  progress: number;
  color?: 'sakura' | 'green' | 'yellow' | 'blue' | 'purple' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap: Record<NonNullable<ProgressBarProps['color']>, string> = {
  sakura: 'bg-sakura-500',
  green:  'bg-green-500',
  yellow: 'bg-yellow-500',
  blue:   'bg-blue-500',
  purple: 'bg-purple-500',
  red:    'bg-red-500',
};

const sizeMap: Record<NonNullable<ProgressBarProps['size']>, string> = {
  sm: 'h-1',
  md: 'h-2',
};

export function ProgressBar({
  progress,
  color = 'sakura',
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View className={`bg-gray-200 dark:bg-gray-700 rounded-full ${sizeMap[size]} ${className}`}>
      <View
        className={`${colorMap[color]} rounded-full h-full`}
        style={{ width: `${clampedProgress}%` }}
      />
    </View>
  );
}
