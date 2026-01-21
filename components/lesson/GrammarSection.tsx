import { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GrammarPoint, GrammarComparison as GrammarComparisonType } from '@/types/genki';
import { getComparisonsForGrammar, getComparison } from '@/data/genki/comparisons';
import { GrammarComparisonModal } from './GrammarComparison';

interface GrammarSectionProps {
  grammarPoints: GrammarPoint[];
}

export function GrammarSection({ grammarPoints }: GrammarSectionProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState<GrammarComparisonType | null>(null);
  const [comparisonGrammarA, setComparisonGrammarA] = useState<GrammarPoint | null>(null);
  const [comparisonGrammarB, setComparisonGrammarB] = useState<GrammarPoint | null>(null);

  // Build a map of grammar points by ID for quick lookup
  const grammarMap = grammarPoints.reduce(
    (acc, point) => {
      acc[point.id] = point;
      return acc;
    },
    {} as Record<string, GrammarPoint>
  );

  const handleCompare = (grammarId: string, comparisonId: string) => {
    const comparison = getComparison(comparisonId);
    if (!comparison) return;

    const grammarA = grammarMap[comparison.grammarA];
    const grammarB = grammarMap[comparison.grammarB];

    if (!grammarA || !grammarB) return;

    setSelectedComparison(comparison);
    setComparisonGrammarA(grammarA);
    setComparisonGrammarB(grammarB);
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedComparison(null);
    setComparisonGrammarA(null);
    setComparisonGrammarB(null);
  };

  return (
    <View className="gap-6">
      {grammarPoints.map((point) => (
        <GrammarCard
          key={point.id}
          point={point}
          grammarMap={grammarMap}
          onCompare={(comparisonId) => handleCompare(point.id, comparisonId)}
        />
      ))}

      {/* Comparison Modal */}
      <Modal
        visible={showComparison}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedComparison && comparisonGrammarA && comparisonGrammarB && (
          <GrammarComparisonModal
            comparison={selectedComparison}
            grammarA={comparisonGrammarA}
            grammarB={comparisonGrammarB}
            onClose={handleCloseComparison}
          />
        )}
      </Modal>
    </View>
  );
}

function GrammarCard({
  point,
  grammarMap,
  onCompare,
}: {
  point: GrammarPoint;
  grammarMap: Record<string, GrammarPoint>;
  onCompare: (comparisonId: string) => void;
}) {
  // Get comparisons available for this grammar point
  const comparisons = getComparisonsForGrammar(point.id);
  const hasComparisons = comparisons.length > 0;

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

        {/* Compare button */}
        {hasComparisons && (
          <View className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            {comparisons.map((comparison) => {
              // Determine which is the "other" grammar point
              const otherId = comparison.grammarA === point.id
                ? comparison.grammarB
                : comparison.grammarA;
              const otherGrammar = grammarMap[otherId];
              const otherTitle = otherGrammar?.title || otherId;

              return (
                <Pressable
                  key={comparison.id}
                  onPress={() => onCompare(comparison.id)}
                  className="flex-row items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 active:bg-indigo-100 dark:active:bg-indigo-900/30"
                >
                  <View className="flex-row items-center flex-1">
                    <FontAwesome name="exchange" size={14} color="#6366f1" />
                    <Text className="text-sm font-medium text-indigo-700 dark:text-indigo-400 ml-2">
                      Compare with {otherTitle}
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={12} color="#6366f1" />
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
