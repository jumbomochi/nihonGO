import { View, Text } from 'react-native';
import { status } from '@/constants/tokens';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'default' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, { bg: string; text: string }> = {
  success: { bg: status.success.bg, text: status.success.text },
  warning: { bg: status.warning.bg, text: status.warning.text },
  info:    { bg: status.info.bg,    text: status.info.text },
  default: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400' },
  accent:  { bg: 'bg-sakura-500',                 text: 'text-white' },
};

const sizeStyles: Record<NonNullable<BadgeProps['size']>, { container: string; text: string }> = {
  sm: { container: 'px-2 py-0.5', text: 'text-xs' },
  md: { container: 'px-3 py-1',   text: 'text-sm' },
};

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <View className={`rounded-full ${v.bg} ${s.container} ${className}`}>
      <Text className={`${s.text} font-medium ${v.text}`}>{label}</Text>
    </View>
  );
}
