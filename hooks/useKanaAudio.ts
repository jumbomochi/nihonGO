// hooks/useKanaAudio.ts

import { useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { getKanaAudioPath } from '@/data/alphabet/audio';

// Get the base URL for audio files
function getAudioUrl(path: string): string {
  if (Platform.OS === 'web') {
    // For web, use the current origin
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
  }
  // For native, the path should work as-is from public folder
  return path;
}

// Web audio player using HTML5 Audio API
async function playWebAudio(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new window.Audio(url);
    audio.onended = () => resolve();
    audio.onerror = (e) => reject(e);
    audio.play().catch(reject);
  });
}

interface UseKanaAudioReturn {
  playKana: (romaji: string) => Promise<void>;
  isPlaying: boolean;
  stop: () => void;
}

export function useKanaAudio(): UseKanaAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (Platform.OS === 'web' && webAudioRef.current) {
      webAudioRef.current.pause();
      webAudioRef.current = null;
    }
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
          const fullUrl = getAudioUrl(audioPath);
          console.log('Playing audio from:', fullUrl);

          // Use HTML5 Audio API on web for better compatibility
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            try {
              const audio = new window.Audio(fullUrl);
              webAudioRef.current = audio;
              audio.onended = () => {
                setIsPlaying(false);
                webAudioRef.current = null;
              };
              audio.onerror = (e) => {
                console.log('Web audio error, falling back to TTS:', e);
                fallbackToTTS(romaji);
              };
              await audio.play();
              return;
            } catch (webAudioError) {
              console.log('Web audio failed:', webAudioError);
            }
          } else {
            // Use expo-av for native
            try {
              const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: fullUrl },
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
            } catch (audioError) {
              console.log('Native audio failed, falling back to TTS:', audioError);
            }
          }
        }

        // Fallback to text-to-speech
        await fallbackToTTS(romaji);
      } catch (error) {
        console.error('Error playing kana audio:', error);
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
