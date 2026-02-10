import { View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { iconSize } from '@/constants/tokens';

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

interface IconBadgeProps {
  icon: string;
  color: string;
  bgClassName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles: Record<NonNullable<IconBadgeProps['size']>, { container: string; icon: number }> = {
  sm: { container: 'w-8 h-8',   icon: iconSize.sm },
  md: { container: 'w-10 h-10', icon: iconSize.md },
  lg: { container: 'w-12 h-12', icon: iconSize.lg },
  xl: { container: 'w-14 h-14', icon: iconSize.xl },
};

export function IconBadge({
  icon,
  color,
  bgClassName,
  size = 'md',
  className = '',
}: IconBadgeProps) {
  const s = sizeStyles[size];

  return (
    <View className={`rounded-full items-center justify-center ${bgClassName} ${s.container} ${className}`}>
      <FontAwesome name={icon as IconName} size={s.icon} color={color} />
    </View>
  );
}
