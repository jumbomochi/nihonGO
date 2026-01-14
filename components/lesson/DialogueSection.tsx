import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Dialogue, AudioTrack } from '@/types/genki';

interface DialogueSectionProps {
  dialogue: Dialogue;
  audioTracks?: AudioTrack[];
  onPlayAudio?: (track: AudioTrack) => void;
}

export function DialogueSection({
  dialogue,
  audioTracks,
  onPlayAudio,
}: DialogueSectionProps) {
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
          <Text className="text-sakura-500 font-japanese"> ({dialogue.titleJapanese})</Text>
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
          return (
            <View
              key={index}
              className={`flex-row ${isEven ? '' : 'flex-row-reverse'}`}
            >
              {/* Speaker avatar */}
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  isEven ? 'mr-3' : 'ml-3'
                } ${getAvatarColor(line.speaker)}`}
              >
                <Text className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {line.speaker.charAt(0)}
                </Text>
              </View>

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
                <Text className="text-base text-sakura-500 mt-1 font-japanese">
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
