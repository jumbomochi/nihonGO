import { AudioTrack, AudioSection, GenkiBook } from '@/types/genki';

// Base path for audio files (served from public/audio symlink)
export const AUDIO_BASE_PATH = '/audio';

// Base path for generated TTS audio files
export const GENERATED_AUDIO_BASE_PATH = '/audio/lessons';

// Get generated vocabulary audio path
export function getGeneratedVocabAudioPath(
  book: GenkiBook,
  lessonNumber: number,
  filename: string
): string {
  const lessonFolder = `lesson${lessonNumber.toString().padStart(2, '0')}`;
  return `${GENERATED_AUDIO_BASE_PATH}/${book}/${lessonFolder}/vocabulary/${filename}`;
}

// Get generated dialogue audio path
export function getGeneratedDialogueAudioPath(
  book: GenkiBook,
  lessonNumber: number,
  filename: string
): string {
  const lessonFolder = `lesson${lessonNumber.toString().padStart(2, '0')}`;
  return `${GENERATED_AUDIO_BASE_PATH}/${book}/${lessonFolder}/dialogue/${filename}`;
}

// Get generated lesson manifest path
export function getGeneratedManifestPath(
  book: GenkiBook,
  lessonNumber: number
): string {
  const lessonFolder = `lesson${lessonNumber.toString().padStart(2, '0')}`;
  return `${GENERATED_AUDIO_BASE_PATH}/${book}/${lessonFolder}/manifest.json`;
}

// Helper to generate full audio path
export function getAudioPath(
  book: GenkiBook,
  section: AudioSection,
  filename: string
): string {
  const bookFolder = book === 'genki1' ? 'Genki I' : 'Genki II';
  const textbookFolder =
    book === 'genki1'
      ? 'Genki Textbook 1 - 3rd Edition Audio Files'
      : 'Genki Textook 2 - 3rd Edition Audio Files';

  const sectionFolders: Record<AudioSection, string> = {
    jws: 'JWS',
    kaiwa_bunpo:
      book === 'genki1'
        ? `Kaiwa_Bunpo_L${section === 'kaiwa_bunpo' ? '00' : ''}`
        : 'Kaiwa_Bunpo_L13',
    yomikaki: book === 'genki1' ? 'Yomikaki_L01_L12' : 'Yomikaki_L13_L23',
    workbook: 'W1',
  };

  return `${AUDIO_BASE_PATH}/${bookFolder}/${textbookFolder}/${filename}`;
}

// Get lesson-specific audio folder path
export function getLessonAudioPath(
  book: GenkiBook,
  lessonNumber: number
): string {
  const bookFolder = book === 'genki1' ? 'Genki I' : 'Genki II';
  const textbookFolder =
    book === 'genki1'
      ? 'Genki Textbook 1 - 3rd Edition Audio Files'
      : 'Genki Textook 2 - 3rd Edition Audio Files';
  const lessonFolder = `Kaiwa_Bunpo_L${lessonNumber.toString().padStart(2, '0')}`;

  return `${AUDIO_BASE_PATH}/${bookFolder}/${textbookFolder}/${lessonFolder}`;
}

// Get full dialogue audio path for a lesson
export function getFullDialogueAudioPath(
  book: GenkiBook,
  lessonNumber: number
): string {
  const lessonPath = getLessonAudioPath(book, lessonNumber);
  const prefix = `K${lessonNumber.toString().padStart(2, '0')}`;
  return `${lessonPath}/${prefix}_01.mp3`;
}

// Get individual dialogue line audio path
export function getDialogueAudioPath(
  book: GenkiBook,
  lessonNumber: number,
  lineIndex: number,
  _speaker: string
): string {
  const lessonPath = getLessonAudioPath(book, lessonNumber);
  const prefix = `K${lessonNumber.toString().padStart(2, '0')}`;
  // Dialogue lines typically start at track 2 (track 1 is full dialogue)
  const trackNumber = lineIndex + 2;
  return `${lessonPath}/${prefix}_${trackNumber.toString().padStart(2, '0')}.mp3`;
}

// Audio track generator for a lesson
export function generateLessonAudioTracks(
  book: GenkiBook,
  lessonNumber: number,
  trackCount: number
): AudioTrack[] {
  const tracks: AudioTrack[] = [];
  const lessonId = `${book}-lesson${lessonNumber.toString().padStart(2, '0')}`;
  const prefix = `K${lessonNumber.toString().padStart(2, '0')}`;

  for (let i = 1; i <= trackCount; i++) {
    tracks.push({
      id: `${lessonId}-audio-${i}`,
      filename: `${prefix}_${i.toString().padStart(2, '0')}.mp3`,
      section: 'kaiwa_bunpo',
      lessonId,
      title: `Track ${i}`,
      trackNumber: i,
    });
  }

  return tracks;
}

// Audio manifest - maps lesson IDs to their audio tracks
export const audioManifest: Record<string, AudioTrack[]> = {
  'genki1-lesson00': generateLessonAudioTracks('genki1', 0, 5), // Greetings
  'genki1-lesson01': generateLessonAudioTracks('genki1', 1, 24),
  'genki1-lesson02': generateLessonAudioTracks('genki1', 2, 15),
  'genki1-lesson03': generateLessonAudioTracks('genki1', 3, 15),
  'genki1-lesson04': generateLessonAudioTracks('genki1', 4, 19),
  'genki1-lesson05': generateLessonAudioTracks('genki1', 5, 16),
  'genki1-lesson06': generateLessonAudioTracks('genki1', 6, 15),
  'genki1-lesson07': generateLessonAudioTracks('genki1', 7, 14),
  'genki1-lesson08': generateLessonAudioTracks('genki1', 8, 18),
  'genki1-lesson09': generateLessonAudioTracks('genki1', 9, 17),
  'genki1-lesson10': generateLessonAudioTracks('genki1', 10, 15),
  'genki1-lesson11': generateLessonAudioTracks('genki1', 11, 14),
  'genki1-lesson12': generateLessonAudioTracks('genki1', 12, 14),
  // Genki II
  'genki2-lesson13': generateLessonAudioTracks('genki2', 13, 17),
  'genki2-lesson14': generateLessonAudioTracks('genki2', 14, 17),
  'genki2-lesson15': generateLessonAudioTracks('genki2', 15, 16),
  'genki2-lesson16': generateLessonAudioTracks('genki2', 16, 17),
  'genki2-lesson17': generateLessonAudioTracks('genki2', 17, 14),
  'genki2-lesson18': generateLessonAudioTracks('genki2', 18, 16),
  'genki2-lesson19': generateLessonAudioTracks('genki2', 19, 17),
  'genki2-lesson20': generateLessonAudioTracks('genki2', 20, 17),
  'genki2-lesson21': generateLessonAudioTracks('genki2', 21, 14),
  'genki2-lesson22': generateLessonAudioTracks('genki2', 22, 18),
  'genki2-lesson23': generateLessonAudioTracks('genki2', 23, 17),
};
