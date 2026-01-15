import { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';

const PROFICIENCY_LABELS: Record<string, string> = {
  complete_beginner: 'Complete Beginner',
  beginner: 'Beginner',
  elementary: 'Elementary',
  intermediate: 'Intermediate',
};

const STYLE_LABELS: Record<string, string> = {
  detailed: 'Study Mode',
  conversational: 'Conversation Mode',
};

const GOAL_LABELS: Record<string, string> = {
  travel: 'Travel',
  work: 'Work & Business',
  media: 'Media & Entertainment',
  reading: 'Reading',
  conversation: 'Conversation',
  jlpt: 'JLPT Preparation',
};

export default function ProfileScreen() {
  const { profile, resetProfile } = useUserStore();
  const { apiKey, isEnvKey, clearApiKey } = useSettingsStore();
  const { completedLessons, currentStreak, totalWordsLearned, resetProgress } = useProgressStore();

  const handleResetProfile = async () => {
    await clearApiKey();
    resetProfile();
    resetProgress();
    router.replace('/(onboarding)/welcome');
  };

  const confirmReset = () => {
    Alert.alert(
      'Reset Profile',
      'This will clear all your data and restart the onboarding process. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: handleResetProfile },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 bg-sakura-100 dark:bg-sakura-900/30 rounded-full items-center justify-center mb-4">
            <FontAwesome name="user" size={36} color="#ec4899" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Your Profile
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 mt-1">
            {profile.learningStyle === 'detailed' ? 'Study Mode Learner' : 'Conversation Learner'}
          </Text>
        </View>

        {/* Profile Details */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Profile
          </Text>

          <ProfileRow
            icon="globe"
            label="Native Language"
            value={profile.nativeLanguage || 'English'}
          />
          <ProfileRow
            icon="signal"
            label="Japanese Level"
            value={PROFICIENCY_LABELS[profile.proficiencyLevel] || 'Beginner'}
          />
          <ProfileRow
            icon="book"
            label="Learning Style"
            value={STYLE_LABELS[profile.learningStyle] || 'Study Mode'}
          />
          <ProfileRow
            icon="bullseye"
            label="Goals"
            value={
              profile.learningGoals.length > 0
                ? profile.learningGoals.map((g) => GOAL_LABELS[g] || g).join(', ')
                : 'General Learning'
            }
            isLast
          />
        </View>

        {/* Prior Languages */}
        {profile.priorLanguages.length > 0 && (
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Language Background
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              Prior languages: {profile.priorLanguages.join(', ')}
            </Text>
            {profile.knowsChinese && (
              <Text className="text-sakura-600 mt-2">
                Chinese knowledge detected - kanji lessons will reference character origins
              </Text>
            )}
          </View>
        )}

        {/* API Status */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            AI Tutor
          </Text>
          <View className="flex-row items-center">
            <FontAwesome
              name={apiKey ? 'check-circle' : 'times-circle'}
              size={20}
              color={apiKey ? '#22c55e' : '#ef4444'}
            />
            <Text className="text-gray-600 dark:text-gray-400 ml-3">
              {apiKey
                ? isEnvKey
                  ? 'Claude API connected (from .env)'
                  : 'Claude API connected'
                : 'API key not configured'}
            </Text>
          </View>
        </View>

        {/* Learning Stats */}
        <View className="bg-sakura-50 dark:bg-sakura-900/20 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Stats
          </Text>
          <View className="flex-row justify-around">
            <StatItem value={completedLessons.length.toString()} label="Lessons" />
            <StatItem value={currentStreak.toString()} label="Day Streak" />
            <StatItem value={totalWordsLearned.toString()} label="Words" />
          </View>
          {completedLessons.length === 0 && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              Complete lessons to track your progress!
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className="gap-3 mt-4">
          <Button
            title="Reset Profile & Start Over"
            variant="outline"
            onPress={confirmReset}
          />
        </View>

        <Text className="text-xs text-gray-400 text-center mt-8">
          nihonGO v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center py-3 ${
        !isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''
      }`}
    >
      <View className="w-8">
        <FontAwesome name={icon} size={16} color="#9ca3af" />
      </View>
      <View className="flex-1">
        <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
        <Text className="text-base text-gray-900 dark:text-white mt-0.5">
          {value}
        </Text>
      </View>
    </View>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View className="items-center">
      <Text className="text-2xl font-bold text-sakura-600">{value}</Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
    </View>
  );
}
