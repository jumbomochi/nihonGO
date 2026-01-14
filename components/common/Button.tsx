import { Pressable, Text, ActivityIndicator } from 'react-native';

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

  const variantStyles = {
    primary: isDisabled
      ? 'bg-gray-300 dark:bg-gray-600'
      : 'bg-sakura-500 active:bg-sakura-600',
    secondary: isDisabled
      ? 'bg-gray-100 dark:bg-gray-800'
      : 'bg-gray-200 dark:bg-gray-700 active:bg-gray-300',
    outline: isDisabled
      ? 'border-2 border-gray-300 dark:border-gray-600 bg-transparent'
      : 'border-2 border-sakura-500 bg-transparent active:bg-sakura-50',
    destructive: isDisabled
      ? 'bg-gray-300 dark:bg-gray-600'
      : 'bg-red-500 active:bg-red-600',
  };

  const textStyles = {
    primary: isDisabled
      ? 'text-gray-500 dark:text-gray-400 font-semibold text-lg'
      : 'text-white font-semibold text-lg',
    secondary: isDisabled
      ? 'text-gray-400 dark:text-gray-500 font-semibold text-lg'
      : 'text-gray-800 dark:text-gray-100 font-semibold text-lg',
    outline: isDisabled
      ? 'text-gray-400 dark:text-gray-500 font-semibold text-lg'
      : 'text-sakura-500 font-semibold text-lg',
    destructive: isDisabled
      ? 'text-gray-500 dark:text-gray-400 font-semibold text-lg'
      : 'text-white font-semibold text-lg',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'destructive' ? '#fff' : '#ec4899'} />
      ) : (
        <Text className={textStyles[variant]}>{title}</Text>
      )}
    </Pressable>
  );
}
