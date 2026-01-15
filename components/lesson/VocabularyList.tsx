import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { VocabularyItem } from '@/types/genki';

interface VocabularyListProps {
  vocabulary: VocabularyItem[];
  showRomaji?: boolean;
}

export function VocabularyList({
  vocabulary,
  showRomaji = true,
}: VocabularyListProps) {
  // Group vocabulary by category
  const grouped = vocabulary.reduce(
    (acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, VocabularyItem[]>
  );

  return (
    <View className="gap-6">
      {Object.entries(grouped).map(([category, items]) => (
        <View key={category}>
          <Text className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
            {category}
          </Text>
          <View className="gap-2">
            {items.map((item) => (
              <VocabularyCard
                key={item.id}
                item={item}
                showRomaji={showRomaji}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function VocabularyCard({
  item,
  showRomaji,
}: {
  item: VocabularyItem;
  showRomaji: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-white font-japanese">
            {item.japanese}
          </Text>
          <Text className="text-base text-sakura-600 font-japanese">{item.reading}</Text>
          {showRomaji && (
            <Text className="text-sm text-gray-500 italic">{item.romaji}</Text>
          )}
        </View>
        <View className="items-end">
          <Text className="text-base text-gray-700 dark:text-gray-300">
            {item.english}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">{item.partOfSpeech}</Text>
        </View>
      </View>
      {expanded && item.notes && (
        <View className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <View className="flex-row items-start">
            <FontAwesome
              name="lightbulb-o"
              size={14}
              color="#9ca3af"
              style={{ marginTop: 2, marginRight: 8 }}
            />
            <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
              {item.notes}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
