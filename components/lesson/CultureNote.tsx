import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CulturalNote } from '@/types/genki';

interface CultureNoteProps {
  note: CulturalNote;
}

export function CultureNote({ note }: CultureNoteProps) {
  return (
    <View className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-red-100 dark:border-red-800">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-full items-center justify-center mr-3">
          <Text className="text-xl">🏯</Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-red-600 dark:text-red-400 uppercase font-semibold">
            Culture Note
          </Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {note.title}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text className="text-base text-gray-700 dark:text-gray-300 leading-7">
        {note.content}
      </Text>
    </View>
  );
}
