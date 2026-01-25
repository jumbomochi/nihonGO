import { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, Platform, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import { Dialogue, AudioTrack } from '@/types/genki';

interface DialogueSectionProps {
  dialogue: Dialogue;
  audioTracks?: AudioTrack[];
  onPlayAudio?: (track: AudioTrack) => void;
  getLineAudioPath?: (lineIndex: number, speaker: string) => string;
}

export function DialogueSection({
  dialogue,
  audioTracks,
  onPlayAudio,
  getLineAudioPath,
}: DialogueSectionProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrentAudio = useCallback(async () => {
    if (Platform.OS === 'web' && webAudioRef.current) {
      webAudioRef.current.pause();
      webAudioRef.current = null;
    }
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlayingIndex(null);
  }, []);

  const playLineAudio = useCallback(async (lineIndex: number, speaker: string) => {
    if (!getLineAudioPath) return;

    // If same line is playing, stop it
    if (playingIndex === lineIndex) {
      await stopCurrentAudio();
      return;
    }

    // Stop any current audio first
    await stopCurrentAudio();

    const audioPath = getLineAudioPath(lineIndex, speaker);
    const fullUrl = Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}${audioPath}`
      : audioPath;

    setLoadingIndex(lineIndex);

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const audio = new window.Audio(fullUrl);
        webAudioRef.current = audio;
        audio.onended = () => {
          setPlayingIndex(null);
          webAudioRef.current = null;
        };
        audio.onerror = () => {
          console.error('Web audio error for:', fullUrl);
          setPlayingIndex(null);
          setLoadingIndex(null);
        };
        await audio.play();
        setPlayingIndex(lineIndex);
      } else {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });
        const { sound } = await Audio.Sound.createAsync(
          { uri: fullUrl },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        setPlayingIndex(lineIndex);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingIndex(null);
            sound.unloadAsync();
            soundRef.current = null;
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingIndex(null);
    } finally {
      setLoadingIndex(null);
    }
  }, [getLineAudioPath, playingIndex, stopCurrentAudio]);
  // Generate avatar colors based on character name
  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-blue-200 dark:bg-blue-800',
      'bg-green-200 dark:bg-green-800',
      'bg-purple-200 dark:bg-purple-800',
      'bg-orange-200 dark:bg-orange-800',
      'bg-pink-200 dark:bg-pink-800',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <View>
      {/* Title */}
      {dialogue.titleJapanese && (
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {dialogue.title}
          <Text className="text-sakura-600 font-japanese"> ({dialogue.titleJapanese})</Text>
        </Text>
      )}

      {/* Context */}
      <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
        <Text className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
          Situation
        </Text>
        <Text className="text-base text-blue-800 dark:text-blue-300">
          {dialogue.context}
        </Text>
      </View>

      {/* Play audio button */}
      {audioTracks && audioTracks.length > 0 && onPlayAudio && (
        <Pressable
          onPress={() => onPlayAudio(audioTracks[0])}
          className="flex-row items-center bg-sakura-500 rounded-xl p-4 mb-4"
        >
          <FontAwesome name="play-circle" size={24} color="#fff" />
          <Text className="text-white font-semibold ml-3">
            Play Dialogue Audio
          </Text>
        </Pressable>
      )}

      {/* Dialogue lines */}
      <View className="gap-4">
        {dialogue.lines.map((line, index) => {
          const isEven = index % 2 === 0;
          const isPlaying = playingIndex === index;
          const isLoading = loadingIndex === index;
          return (
            <View
              key={index}
              className={`flex-row ${isEven ? '' : 'flex-row-reverse'}`}
            >
              {/* Speaker avatar with play button */}
              <Pressable
                onPress={() => playLineAudio(index, line.speaker)}
                disabled={!getLineAudioPath || isLoading}
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isEven ? 'mr-3' : 'ml-3'
                } ${isPlaying ? 'bg-sakura-500' : getAvatarColor(line.speaker)}`}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#374151" />
                ) : getLineAudioPath ? (
                  <FontAwesome
                    name={isPlaying ? 'pause' : 'play'}
                    size={14}
                    color={isPlaying ? '#fff' : '#374151'}
                  />
                ) : (
                  <Text className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {line.speaker.charAt(0)}
                  </Text>
                )}
              </Pressable>

              {/* Speech bubble */}
              <View
                className={`flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 ${
                  isEven
                    ? 'rounded-tl-none'
                    : 'rounded-tr-none'
                }`}
              >
                <Text className="text-xs text-gray-400 mb-1">{line.speaker}</Text>
                <Text className="text-lg text-gray-900 dark:text-white font-japanese leading-8">
                  {line.japanese}
                </Text>
                <Text className="text-base text-sakura-600 mt-1 font-japanese">
                  {line.reading}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                  {line.english}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
