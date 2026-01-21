import { View, Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GrammarComparison as GrammarComparisonType, GrammarPoint } from '@/types/genki';

interface GrammarComparisonProps {
  comparison: GrammarComparisonType;
  grammarA: GrammarPoint;
  grammarB: GrammarPoint;
  onClose: () => void;
}

export function GrammarComparisonModal({
  comparison,
  grammarA,
  grammarB,
  onClose,
}: GrammarComparisonProps) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Grammar Comparison
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {grammarA.title} vs {grammarB.title}
          </Text>
        </View>
        <Pressable onPress={onClose} className="p-2 -mr-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Grammar A Card */}
        <CompactGrammarCard grammar={grammarA} label="A" color="sakura" />

        {/* Key Differences */}
        <View className="my-4">
          <View className="flex-row items-center mb-3">
            <FontAwesome name="exchange" size={16} color="#6366f1" />
            <Text className="text-base font-semibold text-gray-900 dark:text-white ml-2">
              Key Differences
            </Text>
          </View>
          <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {comparison.keyDifferences.map((diff, index) => (
              <View
                key={index}
                className={`p-4 ${index > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
              >
                <Text className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {diff.aspect}
                </Text>
                <View className="gap-2">
                  <View className="flex-row">
                    <View className="w-6 h-6 rounded bg-sakura-100 dark:bg-sakura-900/30 items-center justify-center mr-2">
                      <Text className="text-xs font-bold text-sakura-600">A</Text>
                    </View>
                    <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {diff.grammarA}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <View className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-2">
                      <Text className="text-xs font-bold text-blue-600">B</Text>
                    </View>
                    <Text className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                      {diff.grammarB}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Grammar B Card */}
        <CompactGrammarCard grammar={grammarB} label="B" color="blue" />

        {/* Usage Tip */}
        <View className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="lightbulb-o" size={16} color="#22c55e" />
            <Text className="text-sm font-semibold text-green-700 dark:text-green-400 ml-2">
              Usage Tip
            </Text>
          </View>
          <Text className="text-sm text-green-800 dark:text-green-300 leading-5">
            {comparison.usageTip}
          </Text>
        </View>

        {/* Common Mistakes */}
        <View className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="exclamation-triangle" size={14} color="#d97706" />
            <Text className="text-sm font-semibold text-amber-700 dark:text-amber-400 ml-2">
              Common Mistakes
            </Text>
          </View>
          <View className="gap-2">
            {comparison.commonMistakes.map((mistake, index) => (
              <View key={index} className="flex-row">
                <Text className="text-amber-600 mr-2">•</Text>
                <Text className="flex-1 text-sm text-amber-800 dark:text-amber-300">
                  {mistake}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contrast Examples */}
        <View className="mt-6">
          <View className="flex-row items-center mb-3">
            <FontAwesome name="list-alt" size={16} color="#8b5cf6" />
            <Text className="text-base font-semibold text-gray-900 dark:text-white ml-2">
              Contrast Examples
            </Text>
          </View>
          <View className="gap-4">
            {comparison.contrastExamples.map((example, index) => (
              <View
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <View className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2">
                  <Text className="text-sm font-medium text-purple-700 dark:text-purple-400">
                    {example.situation}
                  </Text>
                </View>
                <View className="p-4 gap-3">
                  {/* Grammar A example */}
                  <View>
                    <View className="flex-row items-center mb-1">
                      <View className="w-5 h-5 rounded bg-sakura-100 dark:bg-sakura-900/30 items-center justify-center mr-2">
                        <Text className="text-xs font-bold text-sakura-600">A</Text>
                      </View>
                      <Text className="text-base font-medium text-gray-900 dark:text-white font-japanese">
                        {example.grammarA.japanese}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-7">
                      {example.grammarA.english}
                    </Text>
                  </View>
                  {/* Grammar B example */}
                  <View>
                    <View className="flex-row items-center mb-1">
                      <View className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-2">
                        <Text className="text-xs font-bold text-blue-600">B</Text>
                      </View>
                      <Text className="text-base font-medium text-gray-900 dark:text-white font-japanese">
                        {example.grammarB.japanese}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-7">
                      {example.grammarB.english}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CompactGrammarCard({
  grammar,
  label,
  color,
}: {
  grammar: GrammarPoint;
  label: string;
  color: 'sakura' | 'blue';
}) {
  const bgColor = color === 'sakura'
    ? 'bg-sakura-50 dark:bg-sakura-900/20'
    : 'bg-blue-50 dark:bg-blue-900/20';
  const borderColor = color === 'sakura'
    ? 'border-sakura-200 dark:border-sakura-800'
    : 'border-blue-200 dark:border-blue-800';
  const labelBg = color === 'sakura'
    ? 'bg-sakura-500'
    : 'bg-blue-500';
  const titleColor = color === 'sakura'
    ? 'text-sakura-700 dark:text-sakura-400'
    : 'text-blue-700 dark:text-blue-400';

  return (
    <View className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
      <View className="flex-row items-center px-4 py-3">
        <View className={`w-7 h-7 rounded-full ${labelBg} items-center justify-center mr-3`}>
          <Text className="text-sm font-bold text-white">{label}</Text>
        </View>
        <View className="flex-1">
          <Text className={`text-lg font-bold ${titleColor} font-japanese`}>
            {grammar.title}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {grammar.pattern}
          </Text>
        </View>
      </View>
      <View className="px-4 pb-4">
        <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5" numberOfLines={3}>
          {grammar.explanation}
        </Text>
      </View>
    </View>
  );
}
