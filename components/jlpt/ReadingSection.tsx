import { View, Text, Pressable } from 'react-native';
import { JLPTReading } from '@/data/jlpt/types';

interface ReadingSectionProps {
  readings: JLPTReading[];
}

export function ReadingSection({ readings }: ReadingSectionProps) {
  return (
    <View className="gap-4">
      {readings.map((reading) => (
        <View key={reading.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {reading.title}
          </Text>
          <View className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
            <Text className="text-base text-gray-900 dark:text-white font-japanese leading-8">
              {reading.passage}
            </Text>
          </View>
          <Text className="text-sm font-medium text-gray-500 mb-2">Questions</Text>
          {reading.questions.map((q, idx) => (
            <View key={q.id} className="mb-3">
              <Text className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {idx + 1}. {q.question}
              </Text>
              {q.options.map((opt, optIdx) => (
                <Pressable
                  key={optIdx}
                  className="flex-row items-center py-2 px-3 rounded-lg mb-1 bg-gray-100 dark:bg-gray-700"
                >
                  <Text className="text-sm text-gray-600 dark:text-gray-300">
                    {String.fromCharCode(65 + optIdx)}. {opt}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
