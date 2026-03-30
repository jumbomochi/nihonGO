import { useState, useCallback } from 'react';
import { AVPlaybackSource } from 'expo-av';
import { GenkiLesson } from '@/types/genki';
import { getFullDialogueAudioPath, getGeneratedDialogueAudioPath } from '@/data/genki/audio/audioManifest';
import { resolveAudioSource } from '@/lib/audioUri';

export function useDialogueAudio(lesson: GenkiLesson | null | undefined) {
  const [currentAudioSource, setCurrentAudioSource] = useState<AVPlaybackSource | null>(null);
  const [currentAudioTitle, setCurrentAudioTitle] = useState<string>('');

  const handlePlayFullDialogue = () => {
    if (!lesson) return;
    const path = getFullDialogueAudioPath(lesson.book, lesson.lessonNumber);
    setCurrentAudioSource(resolveAudioSource(path));
    setCurrentAudioTitle('Full Dialogue');
  };

  const clearAudio = () => setCurrentAudioSource(null);

  const getLineAudioPath = useCallback((dialogueIndex: number, lineIndex: number, speaker: string) => {
    if (!lesson) return '';
    const dialogueSection = lesson.sections.find(s => s.type === 'dialogue');
    const hasMultipleDialogues = dialogueSection?.content.dialogues && dialogueSection.content.dialogues.length > 1;

    const speakerName = speaker.toLowerCase();

    let filename: string;
    if (hasMultipleDialogues) {
      filename = `d${(dialogueIndex + 1).toString().padStart(2, '0')}_${(lineIndex + 1).toString().padStart(3, '0')}_${speakerName}.mp3`;
    } else {
      filename = `${(lineIndex + 1).toString().padStart(3, '0')}_${speakerName}.mp3`;
    }
    const path = getGeneratedDialogueAudioPath(lesson.book, lesson.lessonNumber, filename);
    return encodeURI(path);
  }, [lesson]);

  return {
    currentAudioSource,
    currentAudioTitle,
    handlePlayFullDialogue,
    clearAudio,
    getLineAudioPath,
  };
}
