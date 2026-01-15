import { Pressable, Text, ActivityIndicator } from 'react-native';
import { triggerImpact } from '@/lib/haptics';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const baseStyles = 'py-4 px-6 rounded-xl items-center justify-center';
  const isDisabled = disabled || loading;

  const handlePress = async () => {
    await triggerImpact();
    onPress();
  };

  const variantStyles = {
    primary: isDisabled
      ? 'bg-gray-300 dark:bg-gray-600'
      : 'bg-sakura-500 active:bg-sakura-600',
    secondary: isDisabled
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-gray-200 dark:bg-gray-700 active:bg-gray-300',
    outline: isDisabled
      ? 'border-2 border-gray-300 dark:border-gray-600 bg-transparent'
      : 'border-2 border-sakura-600 bg-transparent active:bg-sakura-50',
    destructive: isDisabled
      ? 'bg-gray-300 dark:bg-gray-600'
      : 'bg-red-500 active:bg-red-600',
  };

  const textStyles = {
    primary: isDisabled
      ? 'text-gray-500 dark:text-gray-400 font-semibold text-base'
      : 'text-white font-semibold text-base',
    secondary: isDisabled
      ? 'text-gray-400 dark:text-gray-500 font-semibold text-base'
      : 'text-gray-800 dark:text-gray-100 font-semibold text-base',
    outline: isDisabled
      ? 'text-gray-400 dark:text-gray-500 font-semibold text-base'
      : 'text-sakura-600 font-semibold text-base',
    destructive: isDisabled
      ? 'text-gray-500 dark:text-gray-400 font-semibold text-base'
      : 'text-white font-semibold text-base',
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? '#fff' : '#db2777'} />
      ) : (
        <Text className={textStyles[variant]}>{title}</Text>
      )}
    </Pressable>
  );
}
