// hooks/useKanaAudio.ts

import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { getKanaAudioPath } from '@/data/alphabet/audio';

interface UseKanaAudioReturn {
  playKana: (romaji: string) => Promise<void>;
  isPlaying: boolean;
  stop: () => void;
}

export function useKanaAudio(): UseKanaAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const stop = useCallback(() => {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
    Speech.stop();
    setIsPlaying(false);
  }, [sound]);

  const playKana = useCallback(
    async (romaji: string) => {
      // Stop any current playback
      stop();

      setIsPlaying(true);

      try {
        // Try to load audio file first
        const audioPath = getKanaAudioPath(romaji);
        if (audioPath) {
          try {
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: audioPath },
              { shouldPlay: true }
            );
            setSound(newSound);
            newSound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false);
                newSound.unloadAsync();
              }
            });
            return;
          } catch {
            // Audio file not available, fall back to TTS
          }
        }

        // Fallback to text-to-speech
        // Map romaji to better pronunciation for Japanese TTS
        const textToSpeak = romaji;

        await Speech.speak(textToSpeak, {
          language: 'ja-JP',
          rate: 0.8,
          onDone: () => setIsPlaying(false),
          onError: () => setIsPlaying(false),
        });
      } catch (error) {
        console.error('Error playing kana audio:', error);
        setIsPlaying(false);
      }
    },
    [stop]
  );

  return { playKana, isPlaying, stop };
}
