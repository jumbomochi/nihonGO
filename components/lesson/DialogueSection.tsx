import { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, Platform, ActivityIndicator } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Audio } from 'expo-av';
import { Dialogue, AudioTrack } from '@/types/genki';

interface DialogueSectionProps {
  dialogue?: Dialogue; // Single dialogue (backward compatible)
  dialogues?: Dialogue[]; // Multiple dialogues
  audioTracks?: AudioTrack[];
  onPlayAudio?: (track: AudioTrack) => void;
  getLineAudioPath?: (dialogueIndex: number, lineIndex: number, speaker: string) => string;
}

export function DialogueSection({
  dialogue,
  dialogues,
  audioTracks,
  onPlayAudio,
  getLineAudioPath,
}: DialogueSectionProps) {
  // Combine single dialogue into array for unified handling
  const allDialogues = dialogues || (dialogue ? [dialogue] : []);

  // Track playing state as "dialogueIndex-lineIndex"
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [playingFullDialogue, setPlayingFullDialogue] = useState<number | null>(null); // dialogueIndex being played
  const [isLoadingFull, setIsLoadingFull] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const webAudioRef = useRef<HTMLAudioElement | null>(null);
  const fullPlaybackAbortRef = useRef<boolean>(false);

  const stopCurrentAudio = useCallback(async () => {
    fullPlaybackAbortRef.current = true; // Stop any full dialogue playback
    if (Platform.OS === 'web' && webAudioRef.current) {
      webAudioRef.current.pause();
      webAudioRef.current = null;
    }
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setPlayingKey(null);
    setPlayingFullDialogue(null);
  }, []);

  // Play a single audio file and return a promise that resolves when finished
  const playAudioAsync = useCallback((audioPath: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const fullUrl = Platform.OS === 'web' && typeof window !== 'undefined'
        ? `${window.location.origin}${audioPath}`
        : audioPath;

      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const audio = new window.Audio(fullUrl);
          webAudioRef.current = audio;
          audio.onended = () => {
            webAudioRef.current = null;
            resolve();
          };
          audio.onerror = () => {
            webAudioRef.current = null;
            reject(new Error('Web audio error'));
          };
          await audio.play();
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
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
              soundRef.current = null;
              resolve();
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  // Play full dialogue with pauses between speakers
  const playFullDialogue = useCallback(async (dialogueIndex: number) => {
    if (!getLineAudioPath) return;

    const dialogue = allDialogues[dialogueIndex];
    if (!dialogue) return;

    // If already playing this dialogue, stop it
    if (playingFullDialogue === dialogueIndex) {
      await stopCurrentAudio();
      return;
    }

    // Stop any current audio first
    await stopCurrentAudio();
    fullPlaybackAbortRef.current = false;
    setIsLoadingFull(dialogueIndex);
    setPlayingFullDialogue(dialogueIndex);

    const PAUSE_BETWEEN_SPEAKERS = 600; // milliseconds pause between speakers

    try {
      for (let lineIndex = 0; lineIndex < dialogue.lines.length; lineIndex++) {
        // Check if playback was aborted
        if (fullPlaybackAbortRef.current) break;

        const line = dialogue.lines[lineIndex];
        const audioPath = getLineAudioPath(dialogueIndex, lineIndex, line.speaker);

        setPlayingKey(`${dialogueIndex}-${lineIndex}`);
        setIsLoadingFull(null);

        await playAudioAsync(audioPath);

        // Add pause between speakers (except after the last line)
        if (lineIndex < dialogue.lines.length - 1 && !fullPlaybackAbortRef.current) {
          await new Promise(resolve => setTimeout(resolve, PAUSE_BETWEEN_SPEAKERS));
        }
      }
    } catch (error) {
      console.error('Error playing full dialogue:', error);
    } finally {
      if (!fullPlaybackAbortRef.current) {
        setPlayingKey(null);
        setPlayingFullDialogue(null);
      }
    }
  }, [allDialogues, getLineAudioPath, playingFullDialogue, stopCurrentAudio, playAudioAsync]);

  const playLineAudio = useCallback(async (dialogueIndex: number, lineIndex: number, speaker: string) => {
    if (!getLineAudioPath) return;

    const key = `${dialogueIndex}-${lineIndex}`;

    // If same line is playing, stop it
    if (playingKey === key) {
      await stopCurrentAudio();
      return;
    }

    // Stop any current audio first
    await stopCurrentAudio();

    const audioPath = getLineAudioPath(dialogueIndex, lineIndex, speaker);
    const fullUrl = Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}${audioPath}`
      : audioPath;

    setLoadingKey(key);

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const audio = new window.Audio(fullUrl);
        webAudioRef.current = audio;
        audio.onended = () => {
          setPlayingKey(null);
          webAudioRef.current = null;
        };
        audio.onerror = () => {
          console.error('Web audio error for:', fullUrl);
          setPlayingKey(null);
          setLoadingKey(null);
        };
        await audio.play();
        setPlayingKey(key);
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
        setPlayingKey(key);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setPlayingKey(null);
            sound.unloadAsync();
            soundRef.current = null;
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingKey(null);
    } finally {
      setLoadingKey(null);
    }
  }, [getLineAudioPath, playingKey, stopCurrentAudio]);

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

  if (allDialogues.length === 0) {
    return null;
  }

  return (
    <View className="gap-8">
      {allDialogues.map((dlg, dialogueIndex) => {
        const isMultiple = allDialogues.length > 1;

        return (
          <View key={dlg.id || dialogueIndex}>
            {/* Dialogue Header */}
            <View className={isMultiple ? 'mb-4' : ''}>
              {isMultiple && (
                <View className="flex-row items-center mb-3">
                  <View className="w-8 h-8 rounded-full bg-sakura-100 dark:bg-sakura-900/30 items-center justify-center mr-3">
                    <Text className="text-sakura-600 font-bold">{dialogueIndex + 1}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      {dlg.title}
                    </Text>
                    {dlg.titleJapanese && (
                      <Text className="text-sm text-sakura-600 font-japanese">
                        {dlg.titleJapanese}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Single dialogue title (when not multiple) */}
              {!isMultiple && dlg.titleJapanese && (
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {dlg.title}
                  <Text className="text-sakura-600 font-japanese"> ({dlg.titleJapanese})</Text>
                </Text>
              )}

              {/* Context */}
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                <Text className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                  Situation
                </Text>
                <Text className="text-base text-blue-800 dark:text-blue-300">
                  {dlg.context}
                </Text>
              </View>
            </View>

            {/* Play full dialogue button with pauses between speakers */}
            {getLineAudioPath && (
              <Pressable
                onPress={() => playFullDialogue(dialogueIndex)}
                disabled={isLoadingFull === dialogueIndex}
                className={`flex-row items-center rounded-xl p-4 mb-4 ${
                  playingFullDialogue === dialogueIndex ? 'bg-sakura-600' : 'bg-sakura-500'
                }`}
              >
                {isLoadingFull === dialogueIndex ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <FontAwesome
                    name={playingFullDialogue === dialogueIndex ? 'pause-circle' : 'play-circle'}
                    size={24}
                    color="#fff"
                  />
                )}
                <Text className="text-white font-semibold ml-3">
                  {playingFullDialogue === dialogueIndex ? 'Stop Dialogue' : 'Play Full Dialogue'}
                </Text>
              </Pressable>
            )}

            {/* Dialogue lines */}
            <View className="gap-4">
              {dlg.lines.map((line, lineIndex) => {
                const isEven = lineIndex % 2 === 0;
                const key = `${dialogueIndex}-${lineIndex}`;
                const isPlaying = playingKey === key;
                const isLoading = loadingKey === key;

                return (
                  <View
                    key={lineIndex}
                    className={`flex-row ${isEven ? '' : 'flex-row-reverse'}`}
                  >
                    {/* Speaker avatar with play button */}
                    <Pressable
                      onPress={() => playLineAudio(dialogueIndex, lineIndex, line.speaker)}
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

            {/* Divider between dialogues */}
            {isMultiple && dialogueIndex < allDialogues.length - 1 && (
              <View className="h-px bg-gray-200 dark:bg-gray-700 mt-8" />
            )}
          </View>
        );
      })}
    </View>
  );
}
