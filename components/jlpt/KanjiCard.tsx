import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { JLPTKanji } from '@/data/jlpt/types';
import { triggerSelection } from '@/lib/haptics';

interface KanjiCardProps {
  kanji: JLPTKanji;
  showDetails?: boolean;
  onPress?: () => void;
}

export function KanjiCard({ kanji, showDetails = false, onPress }: KanjiCardProps) {
  const [expanded, setExpanded] = useState(showDetails);

  const handlePress = () => {
    triggerSelection();
    if (onPress) {
      onPress();
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-3"
    >
      <View className="flex-row items-start">
        {/* Kanji Character */}
        <View className="w-20 h-20 bg-sakura-50 dark:bg-sakura-900/20 rounded-xl items-center justify-center">
          <Text className="text-5xl font-japanese text-gray-900 dark:text-white">
            {kanji.character}
          </Text>
        </View>

        {/* Basic Info */}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {kanji.meaning}
          </Text>

          <View className="mt-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-400 w-12">ON:</Text>
              <Text className="text-sm text-sakura-600 font-japanese">
                {kanji.onYomi.join('、') || '—'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-400 w-12">KUN:</Text>
              <Text className="text-sm text-sakura-600 font-japanese">
                {kanji.kunYomi.join('、') || '—'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-2">
            <FontAwesome name="pencil" size={10} color="#9ca3af" />
            <Text className="text-xs text-gray-400 ml-1">
              {kanji.strokeCount} strokes
            </Text>
            <View className="ml-3 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 rounded">
              <Text className="text-xs text-purple-600">{kanji.jlptLevel}</Text>
            </View>
          </View>
        </View>

        {/* Expand Icon */}
        <FontAwesome
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#9ca3af"
        />
      </View>

      {/* Expanded Content */}
      {expanded && (
        <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Mnemonic */}
          {kanji.mnemonics && (
            <View className="mb-3">
              <Text className="text-xs font-medium text-gray-400 mb-1">MEMORY TIP</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {kanji.mnemonics}
              </Text>
            </View>
          )}

          {/* Chinese Note */}
          {kanji.chineseNote && (
            <View className="mb-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              <Text className="text-xs font-medium text-amber-600 mb-1">
                FOR CHINESE SPEAKERS
              </Text>
              <Text className="text-sm text-amber-700 dark:text-amber-300">
                {kanji.chineseNote}
              </Text>
            </View>
          )}

          {/* Common Words */}
          <View>
            <Text className="text-xs font-medium text-gray-400 mb-2">COMMON WORDS</Text>
            {kanji.commonWords.map((word, index) => (
              <View
                key={index}
                className="flex-row items-center py-2 border-b border-gray-50 dark:border-gray-700 last:border-b-0"
              >
                <Text className="text-base font-japanese text-gray-900 dark:text-white w-20">
                  {word.word}
                </Text>
                <Text className="text-sm text-sakura-600 font-japanese flex-1">
                  {word.reading}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {word.meaning}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
}
