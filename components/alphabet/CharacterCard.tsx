// components/alphabet/CharacterCard.tsx

import { View, Text, Pressable } from 'react-native';
import { KanaPair } from '@/types/alphabet';

interface CharacterCardProps {
  pair: KanaPair;
  showReading?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function CharacterCard({
  pair,
  showReading = true,
  onPress,
  size = 'large',
}: CharacterCardProps) {
  const sizeClasses = {
    small: { container: 'p-2', char: 'text-3xl', reading: 'text-xs' },
    medium: { container: 'p-4', char: 'text-5xl', reading: 'text-sm' },
    large: { container: 'p-6', char: 'text-7xl', reading: 'text-base' },
  };

  const styles = sizeClasses[size];

  const content = (
    <View
      className={`bg-white dark:bg-gray-800 rounded-2xl ${styles.container} border border-gray-200 dark:border-gray-700`}
    >
      {/* Characters side by side */}
      <View className="flex-row items-center justify-center gap-4">
        {/* Hiragana */}
        <View className="items-center">
          <Text className="text-xs text-gray-400 mb-1">Hiragana</Text>
          <Text
            className={`${styles.char} font-japanese text-gray-900 dark:text-white`}
          >
            {pair.hiragana.character}
          </Text>
        </View>

        {/* Divider */}
        <View className="w-px h-16 bg-gray-200 dark:bg-gray-700" />

        {/* Katakana */}
        <View className="items-center">
          <Text className="text-xs text-gray-400 mb-1">Katakana</Text>
          <Text
            className={`${styles.char} font-japanese text-gray-900 dark:text-white`}
          >
            {pair.katakana.character}
          </Text>
        </View>
      </View>

      {/* Reading */}
      {showReading && (
        <Text
          className={`${styles.reading} text-sakura-600 text-center mt-4 font-semibold`}
        >
          {pair.romaji}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={`${pair.romaji} - ${pair.hiragana.character} and ${pair.katakana.character}`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
