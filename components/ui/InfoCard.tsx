import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

interface InfoCardProps {
  variant: 'info' | 'warning' | 'success' | 'culture' | 'tip';
  title?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig: Record<
  InfoCardProps['variant'],
  { bg: string; border: string; icon: IconName; iconColor: string; titleColor: string }
> = {
  info:    { bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-200',   icon: 'info-circle',          iconColor: '#3b82f6', titleColor: 'text-blue-800 dark:text-blue-300' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200',  icon: 'exclamation-triangle', iconColor: '#d97706', titleColor: 'text-amber-800 dark:text-amber-300' },
  success: { bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-200',  icon: 'check-circle',         iconColor: '#22c55e', titleColor: 'text-green-800 dark:text-green-300' },
  culture: { bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200',    icon: 'globe',                iconColor: '#ef4444', titleColor: 'text-red-800 dark:text-red-300' },
  tip:     { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200', icon: 'lightbulb-o',          iconColor: '#8b5cf6', titleColor: 'text-purple-800 dark:text-purple-300' },
};

export function InfoCard({
  variant,
  title,
  icon,
  children,
  className = '',
}: InfoCardProps) {
  const config = variantConfig[variant];
  const iconName = (icon as IconName) || config.icon;

  return (
    <View className={`rounded-2xl p-4 border ${config.bg} ${config.border} ${className}`}>
      {title && (
        <View className="flex-row items-center mb-2">
          <FontAwesome name={iconName} size={16} color={config.iconColor} />
          <Text className={`ml-2 font-semibold ${config.titleColor}`}>{title}</Text>
        </View>
      )}
      {children}
    </View>
  );
}
