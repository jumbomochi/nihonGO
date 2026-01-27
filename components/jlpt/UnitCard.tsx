import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { triggerSelection } from '@/lib/haptics';

interface UnitCardProps {
  unitNumber: number;
  theme: string;
  themeJapanese: string;
  description: string;
  vocabularyCount: number;
  kanjiCount: number;
  grammarCount: number;
  isCompleted: boolean;
  onPress: () => void;
}

export function UnitCard({
  unitNumber,
  theme,
  themeJapanese,
  description,
  vocabularyCount,
  kanjiCount,
  grammarCount,
  isCompleted,
  onPress,
}: UnitCardProps) {
  const handlePress = () => {
    triggerSelection();
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`bg-white dark:bg-gray-800 rounded-2xl border ${
        isCompleted
          ? 'border-green-200 dark:border-green-800'
          : 'border-gray-200 dark:border-gray-700'
      } p-4 mb-3`}
    >
      <View className="flex-row items-start">
        {/* Unit Number Badge */}
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            isCompleted
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-sakura-100 dark:bg-sakura-900/30'
          }`}
        >
          {isCompleted ? (
            <FontAwesome name="check" size={18} color="#22c55e" />
          ) : (
            <Text className="text-lg font-bold text-sakura-600">{unitNumber}</Text>
          )}
        </View>

        {/* Content */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {theme}
            </Text>
            <Text className="text-sm text-sakura-600 ml-2 font-japanese">
              {themeJapanese}
            </Text>
          </View>

          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1" numberOfLines={2}>
            {description}
          </Text>

          {/* Stats */}
          <View className="flex-row mt-2 gap-3">
            <View className="flex-row items-center">
              <FontAwesome name="book" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400 ml-1">{vocabularyCount} vocab</Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="font" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400 ml-1">{kanjiCount} kanji</Text>
            </View>
            <View className="flex-row items-center">
              <FontAwesome name="list" size={12} color="#9ca3af" />
              <Text className="text-xs text-gray-400 ml-1">{grammarCount} grammar</Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <FontAwesome name="chevron-right" size={14} color="#d1d5db" />
      </View>
    </Pressable>
  );
}
