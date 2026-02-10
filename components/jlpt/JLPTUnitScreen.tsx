import { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { JLPTLevel, JLPTUnit } from '@/data/jlpt/types';
import { getN5Unit } from '@/data/jlpt/n5';
import { getN4Unit } from '@/data/jlpt/n4';
import { getN3Unit } from '@/data/jlpt/n3';
import { getN2Unit } from '@/data/jlpt/n2';
import { getN1Unit } from '@/data/jlpt/n1';
import { KanjiCard } from '@/components/jlpt';
import { VocabularyList } from '@/components/lesson/VocabularyList';
import { GrammarSection } from '@/components/lesson/GrammarSection';
import { toContentVocabularyList, toContentGrammarList } from '@/lib/adapters/jlptAdapter';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Chip } from '@/components/ui/Chip';
import { ReadingSection } from './ReadingSection';
import { ListeningSection } from './ListeningSection';

type SectionType = 'vocabulary' | 'kanji' | 'grammar' | 'reading' | 'listening';

const SECTIONS: { id: string; label: string; icon: string }[] = [
  { id: 'vocabulary', label: 'Vocabulary', icon: 'book' },
  { id: 'kanji', label: 'Kanji', icon: 'font' },
  { id: 'grammar', label: 'Grammar', icon: 'list' },
  { id: 'reading', label: 'Reading', icon: 'file-text-o' },
  { id: 'listening', label: 'Listening', icon: 'headphones' },
];

interface JLPTUnitScreenProps {
  jlptLevel: JLPTLevel;
  unitId: string;
}

export function JLPTUnitScreen({ jlptLevel, unitId }: JLPTUnitScreenProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('vocabulary');
  const [unit, setUnit] = useState<JLPTUnit | null>(null);

  useEffect(() => {
    if (!unitId) return;

    let loadedUnit: JLPTUnit | undefined;
    switch (jlptLevel) {
      case 'N5': loadedUnit = getN5Unit(unitId); break;
      case 'N4': loadedUnit = getN4Unit(unitId); break;
      case 'N3': loadedUnit = getN3Unit(unitId); break;
      case 'N2': loadedUnit = getN2Unit(unitId); break;
      case 'N1': loadedUnit = getN1Unit(unitId); break;
    }
    setUnit(loadedUnit || null);
  }, [jlptLevel, unitId]);

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
        return <VocabularyList vocabulary={toContentVocabularyList(unit.sections.vocabulary)} />;

      case 'kanji':
        return (
          <View className="gap-3">
            {unit.sections.kanji.map((kanji) => (
              <KanjiCard key={kanji.id} kanji={kanji} />
            ))}
          </View>
        );

      case 'grammar':
        return <GrammarSection grammarPoints={toContentGrammarList(unit.sections.grammar)} />;

      case 'reading':
        return <ReadingSection readings={unit.sections.reading} />;

      case 'listening':
        return <ListeningSection listenings={unit.sections.listening} />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScreenHeader
        title={`Unit ${unit.unitNumber}: ${unit.theme}`}
        subtitle={unit.themeJapanese}
        onBack={() => router.back()}
      />

      {/* Section Tabs */}
      <View className="border-b border-gray-200 dark:border-gray-800 py-2">
        <Chip
          items={SECTIONS}
          activeId={activeSection}
          onSelect={(id) => setActiveSection(id as SectionType)}
        />
      </View>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
