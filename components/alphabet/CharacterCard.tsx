// components/alphabet/CharacterCard.tsx

import { View, Text, Pressable, Pressable as RNPressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { KanaPair } from '@/types/alphabet';
import { useKanaAudio } from '@/hooks/useKanaAudio';

interface CharacterCardProps {
  pair: KanaPair;
  showReading?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

function AudioButton({ romaji }: { romaji: string }) {
  const { playKana, isPlaying } = useKanaAudio();

  return (
    <RNPressable
      onPress={() => playKana(romaji)}
      className="mt-3 w-10 h-10 bg-sakura-100 dark:bg-sakura-900/30 rounded-full items-center justify-center self-center"
      disabled={isPlaying}
    >
      <FontAwesome
        name={isPlaying ? 'volume-up' : 'volume-off'}
        size={16}
        color="#ec4899"
      />
    </RNPressable>
  );
}

export function CharacterCard({
  pair,
  showReading = true,
  onPress,
  size = 'large',
}: CharacterCardProps) {
  const sizeClasses = {
    small: { container: 'p-2', char: 'text-3xl', reading: 'text-xs', divider: 'h-10' },
    medium: { container: 'p-4', char: 'text-5xl', reading: 'text-sm', divider: 'h-14' },
    large: { container: 'p-6', char: 'text-7xl', reading: 'text-base', divider: 'h-24' },
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
        <View className={`w-px ${styles.divider} bg-gray-200 dark:bg-gray-700`} />

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

      {/* Audio Button */}
      <AudioButton romaji={pair.romaji} />
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
