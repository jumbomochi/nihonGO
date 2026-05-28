// components/srs/DailyReviewCard.tsx
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { ReviewSession } from './ReviewSession';
import { Button } from '@/components/common/Button';

export function DailyReviewCard() {
  const getDueSrsItems = useProgressStore((s) => s.getDueSrsItems);
  const srsItems = useProgressStore((s) => s.srsItems);
  const [sessionVisible, setSessionVisible] = useState(false);

  const dueItems = getDueSrsItems();
  const dueKana = dueItems.filter((i) => i.type === 'kana').length;
  const dueVocab = dueItems.filter((i) => i.type === 'vocab').length;
  const totalEnrolled = Object.keys(srsItems).length;

  if (totalEnrolled === 0) {
    return (
      <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome name="refresh" size={18} color="#9ca3af" />
          <Text className="ml-2 font-semibold text-gray-700 dark:text-gray-300">Daily Review</Text>
        </View>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          Finish a kana lesson or vocab quiz to start building your review queue.
        </Text>
      </View>
    );
  }

  if (dueItems.length === 0) {
    const nextDate = Object.values(srsItems)
      .map((i) => new Date(i.nextReviewDate).getTime())
      .sort((a, b) => a - b)[0];
    const hoursUntil = Math.max(1, Math.round((nextDate - Date.now()) / 3600000));
    return (
      <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800 mb-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome name="check-circle" size={18} color="#22c55e" />
          <Text className="ml-2 font-semibold text-green-800 dark:text-green-200">All caught up!</Text>
        </View>
        <Text className="text-sm text-green-700 dark:text-green-400">
          Next review in ~{hoursUntil}h
        </Text>
      </View>
    );
  }

  return (
    <>
      <Pressable
        onPress={() => setSessionVisible(true)}
        className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 border border-orange-200 dark:border-orange-800 mb-4"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <FontAwesome name="refresh" size={18} color="#f97316" />
            <Text className="ml-2 font-semibold text-orange-800 dark:text-orange-200">Daily Review</Text>
          </View>
          <View className="bg-orange-200 dark:bg-orange-800 px-3 py-1 rounded-full">
            <Text className="text-sm font-bold text-orange-800 dark:text-orange-200">{dueItems.length}</Text>
          </View>
        </View>
        <Text className="text-sm text-orange-700 dark:text-orange-300 mb-4">
          {dueItems.length} item{dueItems.length === 1 ? '' : 's'} due
          {dueKana > 0 && dueVocab > 0 ? ` · ${dueKana} kana · ${dueVocab} vocab` : ''}
        </Text>
        <Button title="Start review" onPress={() => setSessionVisible(true)} />
      </Pressable>

      <ReviewSession visible={sessionVisible} onClose={() => setSessionVisible(false)} />
    </>
  );
}
