// components/games/MatchingCard.tsx

import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MatchingCard as MatchingCardType } from '@/types/games';

interface MatchingCardProps {
  card: MatchingCardType;
  onPress: (card: MatchingCardType) => void;
  disabled?: boolean;
}

export function MatchingCard({ card, onPress, disabled }: MatchingCardProps) {
  const isJapanese = card.type === 'hiragana' || card.type === 'katakana';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(card.isSelected ? 1.05 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      opacity: withTiming(card.isMatched ? 0.5 : 1, { duration: 200 }),
    };
  });

  const getBackgroundColor = () => {
    if (card.isMatched) return 'bg-green-100 dark:bg-green-900/30';
    if (card.isSelected) return 'bg-sakura-100 dark:bg-sakura-900/30';
    return 'bg-white dark:bg-gray-800';
  };

  const getBorderColor = () => {
    if (card.isMatched) return 'border-green-400 dark:border-green-600';
    if (card.isSelected) return 'border-sakura-500';
    return 'border-gray-200 dark:border-gray-700';
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => !disabled && !card.isMatched && onPress(card)}
        disabled={disabled || card.isMatched}
        className={`w-20 h-24 rounded-xl border-2 items-center justify-center ${getBackgroundColor()} ${getBorderColor()}`}
      >
        <Text
          className={`${
            isJapanese ? 'text-3xl font-japanese' : 'text-lg font-semibold'
          } ${
            card.isMatched
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {card.content}
        </Text>
        {!isJapanese && (
          <Text className="text-xs text-gray-400 mt-1">romaji</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
