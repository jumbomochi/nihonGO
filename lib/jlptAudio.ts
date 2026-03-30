import { AVPlaybackSource } from 'expo-av';
import { resolveAudioSource } from './audioUri';

const JLPT_AUDIO_BASE_PATH = '/audio/generated/jlpt';

/**
 * Get the audio source for a JLPT listening transcript.
 */
export function getListeningAudioSource(
  level: string,
  unitNumber: number,
  transcriptIndex: number,
): AVPlaybackSource {
  const levelLower = level.toLowerCase();
  const unitPadded = String(unitNumber).padStart(2, '0');
  const indexPadded = String(transcriptIndex).padStart(2, '0');
  const path = `${JLPT_AUDIO_BASE_PATH}/${levelLower}/unit${unitPadded}/listening/transcript_${indexPadded}.mp3`;

  return resolveAudioSource(path);
}
