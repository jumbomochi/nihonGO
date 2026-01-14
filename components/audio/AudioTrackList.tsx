import { View, Text, Pressable, FlatList } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AudioTrack } from '@/types/genki';

interface AudioTrackListProps {
  tracks: AudioTrack[];
  currentTrackId?: string;
  onTrackSelect: (track: AudioTrack) => void;
}

export function AudioTrackList({
  tracks,
  currentTrackId,
  onTrackSelect,
}: AudioTrackListProps) {
  const renderTrack = ({ item }: { item: AudioTrack }) => {
    const isActive = item.id === currentTrackId;

    return (
      <Pressable
        onPress={() => onTrackSelect(item)}
        className={`flex-row items-center p-3 rounded-xl mb-2 ${
          isActive
            ? 'bg-sakura-100 dark:bg-sakura-900/30'
            : 'bg-gray-50 dark:bg-gray-800'
        }`}
      >
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
            isActive ? 'bg-sakura-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {isActive ? (
            <FontAwesome name="play" size={12} color="#fff" />
          ) : (
            <Text
              className={`text-sm font-medium ${
                isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.trackNumber}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Text
            className={`font-medium ${
              isActive
                ? 'text-sakura-600 dark:text-sakura-400'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {item.title}
          </Text>
          {item.titleJapanese && (
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {item.titleJapanese}
            </Text>
          )}
        </View>
        {item.durationSeconds && (
          <Text className="text-xs text-gray-400">
            {Math.floor(item.durationSeconds / 60)}:
            {(item.durationSeconds % 60).toString().padStart(2, '0')}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      data={tracks}
      renderItem={renderTrack}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
    />
  );
}
