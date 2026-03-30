import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { JLPTListening, JLPTLevel } from '@/data/jlpt/types';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { getListeningAudioSource } from '@/lib/jlptAudio';

interface ListeningSectionProps {
  listenings: JLPTListening[];
  level: JLPTLevel;
  unitNumber: number;
}

export function ListeningSection({ listenings, level, unitNumber }: ListeningSectionProps) {
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState<{ [key: number]: boolean }>({});

  const toggleAudio = (index: number) => {
    setActiveAudioIndex(activeAudioIndex === index ? null : index);
  };

  const toggleTranscript = (index: number) => {
    setShowTranscript((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View className="gap-4">
      {listenings.map((listening, index) => {
        const audioSource = getListeningAudioSource(level, unitNumber, index + 1);
        const isAudioActive = activeAudioIndex === index;

        return (
          <View
            key={listening.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {listening.title}
            </Text>

            {/* Audio Player or Play Button */}
            {isAudioActive ? (
              <View className="mb-4">
                <AudioPlayer
                  source={audioSource}
                  title={listening.title}
                  titleJapanese={listening.titleJapanese}
                  compact
                />
              </View>
            ) : (
              <Pressable
                onPress={() => toggleAudio(index)}
                className="flex-row items-center bg-sakura-100 dark:bg-sakura-900/30 rounded-xl p-4 mb-4"
              >
                <FontAwesome name="play-circle" size={32} color="#ec4899" />
                <View className="ml-3">
                  <Text className="text-sm font-medium text-sakura-700 dark:text-sakura-300">
                    Play Audio
                  </Text>
                  <Text className="text-xs text-sakura-600">
                    {listening.duration} seconds
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Transcript Toggle */}
            <Pressable
              onPress={() => toggleTranscript(index)}
              className="flex-row items-center mb-3"
            >
              <FontAwesome
                name={showTranscript[index] ? 'eye-slash' : 'eye'}
                size={14}
                color="#6b7280"
              />
              <Text className="text-xs text-gray-500 ml-2">
                {showTranscript[index] ? 'Hide Transcript' : 'Show Transcript'}
              </Text>
            </Pressable>

            {showTranscript[index] && (
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
                <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {listening.transcript}
                </Text>
              </View>
            )}

            {/* Questions */}
            <Text className="text-sm font-medium text-gray-500 mb-2">Questions</Text>
            {listening.questions.map((q, idx) => (
              <View key={q.id} className="mb-3">
                <Text className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {idx + 1}. {q.question}
                </Text>
                {q.options.map((opt, optIdx) => (
                  <Pressable
                    key={optIdx}
                    className="flex-row items-center py-2 px-3 rounded-lg mb-1 bg-gray-100 dark:bg-gray-700"
                  >
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
