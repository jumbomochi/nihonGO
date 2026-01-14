import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';
import { formatTime } from '@/lib/time';
import {
  PLAYBACK_SPEEDS,
  DEFAULT_PLAYBACK_SPEED,
  PlaybackSpeed,
} from '@/constants/audio';

interface AudioPlayerProps {
  uri: string;
  title: string;
  titleJapanese?: string;
  onPlaybackComplete?: () => void;
  compact?: boolean;
}

export function AudioPlayer({
  uri,
  title,
  titleJapanese,
  onPlaybackComplete,
  compact = false,
}: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackSpeed>(DEFAULT_PLAYBACK_SPEED);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 0);
        setIsPlaying(status.isPlaying);

        if (status.didJustFinish) {
          onPlaybackComplete?.();
        }
      }
    },
    [onPlaybackComplete]
  );

  const loadSound = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (err) {
      console.error('Error loading audio:', err);
      setError('Unable to load audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [uri, onPlaybackStatusUpdate]);

  const handlePlayPause = async () => {
    if (!sound) {
      await loadSound();
      return;
    }

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const handleRewind = async () => {
    if (sound) {
      const newPosition = Math.max(0, position - 5000);
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleForward = async () => {
    if (sound) {
      const newPosition = Math.min(duration, position + 5000);
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleSpeedChange = async () => {
    const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
    const newRate = PLAYBACK_SPEEDS[nextIndex];

    if (sound) {
      await sound.setRateAsync(newRate, true);
    }
    setPlaybackRate(newRate);
  };

  const handleRetry = () => {
    setError(null);
    loadSound();
  };

  if (compact) {
    return (
      <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
        <Pressable onPress={error ? handleRetry : handlePlayPause} className="mr-3">
          {isLoading ? (
            <ActivityIndicator size="small" color="#ec4899" />
          ) : error ? (
            <FontAwesome name="refresh" size={20} color="#ef4444" />
          ) : (
            <FontAwesome
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color="#ec4899"
            />
          )}
        </Pressable>
        <Text
          className={`flex-1 ${error ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
          numberOfLines={1}
        >
          {error || title}
        </Text>
        {!error && (
          <Text className="text-xs text-gray-500">
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
      {/* Title */}
      <View className="mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </Text>
        {titleJapanese && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 font-japanese">
            {titleJapanese}
          </Text>
        )}
      </View>

      {/* Error state */}
      {error && (
        <View className="mb-4 bg-red-100 dark:bg-red-900/30 rounded-xl p-3">
          <Text className="text-red-600 dark:text-red-400 text-center mb-2">
            {error}
          </Text>
          <Pressable
            onPress={handleRetry}
            className="self-center bg-red-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-medium">Try Again</Text>
          </Pressable>
        </View>
      )}

      {/* Progress bar */}
      {!error && (
        <>
          <View className="mb-2">
            <Slider
              value={position}
              minimumValue={0}
              maximumValue={duration || 1}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#ec4899"
              maximumTrackTintColor="#d1d5db"
              thumbTintColor="#ec4899"
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500">{formatTime(position)}</Text>
              <Text className="text-xs text-gray-500">{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center gap-6">
            {/* Rewind 5s */}
            <Pressable
              onPress={handleRewind}
              className="p-2"
              accessibilityLabel="Rewind 5 seconds"
            >
              <FontAwesome name="backward" size={20} color="#6b7280" />
            </Pressable>

            {/* Play/Pause */}
            <Pressable
              onPress={handlePlayPause}
              className="w-14 h-14 bg-sakura-500 rounded-full items-center justify-center"
              accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <FontAwesome
                  name={isPlaying ? 'pause' : 'play'}
                  size={24}
                  color="#fff"
                />
              )}
            </Pressable>

            {/* Forward 5s */}
            <Pressable
              onPress={handleForward}
              className="p-2"
              accessibilityLabel="Forward 5 seconds"
            >
              <FontAwesome name="forward" size={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Speed control */}
          <Pressable
            onPress={handleSpeedChange}
            className="mt-4 self-center bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full"
            accessibilityLabel={`Playback speed ${playbackRate}x. Tap to change.`}
          >
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {playbackRate}x
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
