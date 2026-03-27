import { Platform } from 'react-native';

const JLPT_AUDIO_BASE_PATH = '/audio/generated/jlpt';

/**
 * Get the audio URI for a JLPT listening transcript.
 * Follows the same pattern as Genki audio paths in data/genki/audio/audioManifest.ts.
 */
export function getListeningAudioUri(
  level: string,
  unitNumber: number,
  transcriptIndex: number,
): string {
  const levelLower = level.toLowerCase();
  const unitPadded = String(unitNumber).padStart(2, '0');
  const indexPadded = String(transcriptIndex).padStart(2, '0');
  const path = `${JLPT_AUDIO_BASE_PATH}/${levelLower}/unit${unitPadded}/listening/transcript_${indexPadded}.mp3`;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
}
