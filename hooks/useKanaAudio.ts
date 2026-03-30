// hooks/useKanaAudio.ts

import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { getKanaAudioPath } from '@/data/alphabet/audio';
import { resolveAudioUri, resolveAudioSource } from '@/lib/audioUri';

interface UseKanaAudioReturn {
  playKana: (romaji: string) => Promise<void>;
  isPlaying: boolean;
  stop: () => void;
}

export function useKanaAudio(): UseKanaAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (Platform.OS === 'web' && webAudioRef.current) {
      webAudioRef.current.pause();
      webAudioRef.current = null;
    }
    if (soundRef.current) {
      soundRef.current.stopAsync().catch(() => {});
      soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    Speech.stop();
    setIsPlaying(false);
  }, []);

  const playKana = useCallback(
    async (romaji: string) => {
      stop();
      setIsPlaying(true);

      try {
        const audioPath = getKanaAudioPath(romaji);
        if (audioPath) {
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const fullUrl = resolveAudioUri(audioPath);
            const audio = new window.Audio(fullUrl);
            webAudioRef.current = audio;
            audio.onended = () => {
              setIsPlaying(false);
              webAudioRef.current = null;
            };
            audio.onerror = () => fallbackToTTS(romaji);
            await audio.play();
            return;
          }

          // Native: use expo-av with bundled asset or dev server
          const source = resolveAudioSource(audioPath);
          const { sound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: true }
          );
          soundRef.current = sound;
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
              sound.unloadAsync().catch(() => {});
              if (soundRef.current === sound) {
                soundRef.current = null;
              }
            }
          });
          return;
        }

        await fallbackToTTS(romaji);
      } catch {
        setIsPlaying(false);
      }
    },
    [stop]
  );

  const fallbackToTTS = async (romaji: string) => {
    try {
      await Speech.speak(romaji, {
        language: 'ja-JP',
        rate: 0.8,
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    } catch {
      setIsPlaying(false);
    }
  };

  return { playKana, isPlaying, stop };
}
