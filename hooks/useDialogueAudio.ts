import { useState, useCallback } from 'react';
import { GenkiLesson } from '@/types/genki';
import { getFullDialogueAudioPath, getGeneratedDialogueAudioPath } from '@/data/genki/audio/audioManifest';

export function useDialogueAudio(lesson: GenkiLesson | null | undefined) {
  const [currentAudioUri, setCurrentAudioUri] = useState<string | null>(null);
  const [currentAudioTitle, setCurrentAudioTitle] = useState<string>('');

  const handlePlayFullDialogue = () => {
    if (!lesson) return;
    const uri = getFullDialogueAudioPath(lesson.book, lesson.lessonNumber);
    setCurrentAudioUri(uri);
    setCurrentAudioTitle('Full Dialogue');
  };

  const clearAudio = () => setCurrentAudioUri(null);

  const getLineAudioPath = useCallback((dialogueIndex: number, lineIndex: number, speaker: string) => {
    if (!lesson) return '';
    // Check if there are multiple dialogues to determine filename format
    const dialogueSection = lesson.sections.find(s => s.type === 'dialogue');
    const hasMultipleDialogues = dialogueSection?.content.dialogues && dialogueSection.content.dialogues.length > 1;

    const speakerName = speaker.toLowerCase();

    let filename: string;
    if (hasMultipleDialogues) {
      // Multiple dialogues: d01_001_mary.mp3
      filename = `d${(dialogueIndex + 1).toString().padStart(2, '0')}_${(lineIndex + 1).toString().padStart(3, '0')}_${speakerName}.mp3`;
    } else {
      // Single dialogue (backward compat): 001_mary.mp3
      filename = `${(lineIndex + 1).toString().padStart(3, '0')}_${speakerName}.mp3`;
    }
    const path = getGeneratedDialogueAudioPath(lesson.book, lesson.lessonNumber, filename);
    return encodeURI(path);
  }, [lesson]);

  return {
    currentAudioUri,
    currentAudioTitle,
    handlePlayFullDialogue,
    clearAudio,
    getLineAudioPath,
  };
}
