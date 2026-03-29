import { resolveAudioUri } from './audioUri';

const JLPT_AUDIO_BASE_PATH = '/audio/generated/jlpt';

/**
 * Get the audio URI for a JLPT listening transcript.
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

  return resolveAudioUri(path);
}
