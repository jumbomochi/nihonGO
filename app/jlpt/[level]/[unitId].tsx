import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { JLPTLevel, JLPTUnit } from '@/data/jlpt/types';
import { getN3Unit } from '@/data/jlpt/n3';
import { KanjiCard } from '@/components/jlpt';
import { VocabularyList } from '@/components/lesson/VocabularyList';
import { GrammarSection } from '@/components/lesson/GrammarSection';

type SectionType = 'vocabulary' | 'kanji' | 'grammar' | 'reading' | 'listening';

const SECTIONS: { id: SectionType; title: string; icon: string }[] = [
  { id: 'vocabulary', title: 'Vocabulary', icon: 'book' },
  { id: 'kanji', title: 'Kanji', icon: 'font' },
  { id: 'grammar', title: 'Grammar', icon: 'list' },
  { id: 'reading', title: 'Reading', icon: 'file-text-o' },
  { id: 'listening', title: 'Listening', icon: 'headphones' },
];

export default function JLPTUnitScreen() {
  const { level, unitId } = useLocalSearchParams<{ level: string; unitId: string }>();
  const jlptLevel = level?.toUpperCase() as JLPTLevel;
  const [activeSection, setActiveSection] = useState<SectionType>('vocabulary');
  const [unit, setUnit] = useState<JLPTUnit | null>(null);

  useEffect(() => {
    // Load unit data
    if (jlptLevel === 'N3' && unitId) {
      const loadedUnit = getN3Unit(unitId);
      setUnit(loadedUnit || null);
    }
  }, [jlptLevel, unitId]);

  const handleBack = () => {
    router.back();
  };

  if (!unit) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <FontAwesome name="spinner" size={32} color="#ec4899" />
        <Text className="text-gray-500 mt-4">Loading...</Text>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'vocabulary':
        // Convert JLPT vocabulary to Genki format for reuse
        const vocabItems = unit.sections.vocabulary.map((v) => ({
          id: v.id,
          japanese: v.word,
          reading: v.reading,
          english: v.meaning,
          partOfSpeech: v.partOfSpeech as any,
          example: {
            japanese: v.exampleSentence,
            reading: v.exampleReading,
            english: v.exampleMeaning,
          },
        }));
        return <VocabularyList vocabulary={vocabItems as any} />;

      case 'kanji':
        return (
          <View className="gap-3">
            {unit.sections.kanji.map((kanji) => (
              <KanjiCard key={kanji.id} kanji={kanji} />
            ))}
          </View>
        );

      case 'grammar':
        // Convert JLPT grammar to Genki format
        const grammarPoints = unit.sections.grammar.map((g) => ({
          id: g.id,
          pattern: g.pattern,
          meaning: g.meaning,
          formation: g.formation,
          examples: g.examples,
          notes: g.notes,
        }));
        return <GrammarSection grammarPoints={grammarPoints as any} />;

      case 'reading':
        return (
          <View className="gap-4">
            {unit.sections.reading.map((reading) => (
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

      case 'listening':
        return (
          <View className="gap-4">
            {unit.sections.listening.map((listening) => (
              <View key={listening.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {listening.title}
                </Text>
                <Pressable className="flex-row items-center bg-sakura-100 dark:bg-sakura-900/30 rounded-xl p-4 mb-4">
                  <FontAwesome name="play-circle" size={32} color="#ec4899" />
                  <View className="ml-3">
                    <Text className="text-sm font-medium text-sakura-700 dark:text-sakura-300">
                      Play Audio
                    </Text>
                    <Text className="text-xs text-sakura-600">
                      {listening.duration} seconds
                    </Text>
                  </View>
                </Pressable>
                <Text className="text-sm font-medium text-gray-500 mb-2">Questions</Text>
                {listening.questions.map((q, idx) => (
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

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <FontAwesome name="arrow-left" size={20} color="#6b7280" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Unit {unit.unitNumber}: {unit.theme}
          </Text>
          <Text className="text-sm text-sakura-600 font-japanese">
            {unit.themeJapanese}
          </Text>
        </View>
      </View>

      {/* Section Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200 dark:border-gray-800"
        contentContainerClassName="px-4 py-2"
      >
        {SECTIONS.map((section) => (
          <Pressable
            key={section.id}
            onPress={() => setActiveSection(section.id)}
            className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
              activeSection === section.id
                ? 'bg-sakura-500'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            <FontAwesome
              name={section.icon as any}
              size={14}
              color={activeSection === section.id ? '#fff' : '#6b7280'}
            />
            <Text
              className={`ml-2 text-sm font-medium ${
                activeSection === section.id
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {section.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
