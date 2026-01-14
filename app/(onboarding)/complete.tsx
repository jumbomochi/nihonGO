import { View, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/stores/userStore';

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

export default function CompleteScreen() {
  const { profile, completeOnboarding } = useUserStore();

  const handleGetStarted = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 pt-8 justify-between">
        <View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You're all set!
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Here's your personalized learning profile
          </Text>

          <View className="bg-sakura-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
            <ProfileItem
              label="Native Language"
              value={profile.nativeLanguage || 'English'}
            />
            <ProfileItem
              label="Japanese Level"
              value={PROFICIENCY_LABELS[profile.proficiencyLevel] || 'Beginner'}
            />
            <ProfileItem
              label="Learning Style"
              value={STYLE_LABELS[profile.learningStyle] || 'Study Mode'}
            />
            <ProfileItem
              label="Goals"
              value={
                profile.learningGoals.length > 0
                  ? profile.learningGoals
                      .map((g) => GOAL_LABELS[g] || g)
                      .join(', ')
                  : 'General Learning'
              }
              isLast
            />
          </View>

          <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5">
            <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
              Your AI tutor will personalize lessons based on your profile,
              focusing on practical Japanese with cultural context.
              {profile.knowsChinese && (
                ' Since you know Chinese, kanji learning will highlight character meanings and differences from Mandarin.'
              )}
            </Text>
          </View>
        </View>

        <View className="pb-6 gap-3">
          <Button title="Start Learning" onPress={handleGetStarted} />
          <Button title="Back" variant="outline" onPress={handleBack} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ProfileItem({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      className={`py-3 ${!isLast ? 'border-b border-sakura-200 dark:border-gray-700' : ''}`}
    >
      <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </Text>
      <Text className="text-base font-medium text-gray-900 dark:text-white">
        {value}
      </Text>
    </View>
  );
}
