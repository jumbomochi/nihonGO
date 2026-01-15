import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GrammarPoint } from '@/types/genki';

interface GrammarSectionProps {
  grammarPoints: GrammarPoint[];
}

export function GrammarSection({ grammarPoints }: GrammarSectionProps) {
  return (
    <View className="gap-6">
      {grammarPoints.map((point) => (
        <GrammarCard key={point.id} point={point} />
      ))}
    </View>
  );
}

function GrammarCard({ point }: { point: GrammarPoint }) {
  return (
    <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      {/* Pattern header */}
      <View className="bg-sakura-50 dark:bg-sakura-900/30 px-4 py-3">
        <Text className="text-lg font-bold text-sakura-700 dark:text-sakura-400 font-japanese">
          {point.title}
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 mt-1 font-mono font-japanese">
          {point.pattern}
        </Text>
      </View>

      {/* Explanation */}
      <View className="px-4 py-4">
        <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
          {point.explanation}
        </Text>

        {/* Cultural note */}
        {point.culturalNote && (
          <View className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
            <View className="flex-row items-center mb-2">
              <FontAwesome name="lightbulb-o" size={14} color="#d97706" />
              <Text className="text-sm font-medium text-amber-700 dark:text-amber-400 ml-2">
                Cultural Insight
              </Text>
            </View>
            <Text className="text-sm text-amber-800 dark:text-amber-300">
              {point.culturalNote}
            </Text>
          </View>
        )}

        {/* Examples */}
        <View className="mt-4 gap-3">
          <Text className="text-sm font-semibold text-gray-500 uppercase">
            Examples
          </Text>
          {point.examples.map((example, index) => (
            <View
              key={index}
              className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3"
            >
              <Text className="text-lg text-gray-900 dark:text-white font-japanese leading-8">
                {example.japanese}
              </Text>
              <Text className="text-base text-sakura-600 mt-1 font-japanese">
                {example.reading}
              </Text>
              <Text className="text-base text-gray-600 dark:text-gray-400 mt-1">
                {example.english}
              </Text>
              {example.breakdown && (
                <Text className="text-sm text-gray-500 mt-2 italic">
                  {example.breakdown}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
