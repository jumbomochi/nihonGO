import { View, Text } from 'react-native';
import { LessonSection as LessonSectionType, AudioTrack } from '@/types/genki';
import { ContentVocabulary } from '@/types/content';
import { toContentVocabularyList, toContentGrammarList } from '@/lib/adapters/genkiAdapter';
import { VocabularyList } from './VocabularyList';
import { GrammarSection } from './GrammarSection';
import { DialogueSection } from './DialogueSection';
import { CultureNote } from './CultureNote';

interface SectionRendererProps {
  section: LessonSectionType;
  lessonId: string;
  lessonAudioTracks?: AudioTrack[];
  onPlayAudio: () => void;
  getLineAudioPath?: (dialogueIndex: number, lineIndex: number, speaker: string) => string;
  onStartQuiz?: (vocabulary: ContentVocabulary[], sectionId: string) => void;
}

export function SectionRenderer({
  section,
  lessonId,
  lessonAudioTracks,
  onPlayAudio,
  getLineAudioPath,
  onStartQuiz,
}: SectionRendererProps) {
  switch (section.type) {
    case 'dialogue': {
      // Use section-level audio tracks if available, otherwise use lesson-level tracks
      const dialogueAudio = section.audioTracks || lessonAudioTracks;
      // Support both single dialogue and multiple dialogues
      const hasDialogues = section.content.dialogues && section.content.dialogues.length > 0;
      const hasDialogue = section.content.dialogue;
      if (!hasDialogues && !hasDialogue) return null;

      return (
        <DialogueSection
          dialogue={section.content.dialogue}
          dialogues={section.content.dialogues}
          audioTracks={dialogueAudio}
          onPlayAudio={onPlayAudio}
          getLineAudioPath={getLineAudioPath}
        />
      );
    }

    case 'vocabulary':
      return section.content.vocabulary ? (
        <VocabularyList
          vocabulary={toContentVocabularyList(section.content.vocabulary)}
          showPracticeButton={section.content.vocabulary.length >= 4}
          onPracticePress={() =>
            onStartQuiz?.(toContentVocabularyList(section.content.vocabulary!), section.id)
          }
        />
      ) : null;

    case 'grammar':
      return section.content.grammar ? (
        <GrammarSection grammarPoints={toContentGrammarList(section.content.grammar)} />
      ) : null;

    case 'culture':
      return section.content.culturalNote ? (
        <CultureNote note={section.content.culturalNote} />
      ) : null;

    default:
      return (
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
          <Text className="text-gray-500">
            Content for {section.type} coming soon...
          </Text>
        </View>
      );
  }
}
