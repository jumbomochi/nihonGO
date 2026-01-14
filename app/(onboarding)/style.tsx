import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionButton } from '@/components/onboarding/OptionButton';
import { Button } from '@/components/common/Button';
import { useUserStore, LearningStyle } from '@/stores/userStore';

const STYLE_OPTIONS: {
  id: LearningStyle;
  title: string;
  description: string;
  icon: 'book' | 'comments';
}[] = [
  {
    id: 'detailed',
    title: 'Study Mode',
    description: 'In-depth explanations with cultural context, grammar breakdowns, and multiple examples',
    icon: 'book',
  },
  {
    id: 'conversational',
    title: 'Conversation Mode',
    description: 'Quick, practical explanations through natural dialogue and immediate application',
    icon: 'comments',
  },
];

export default function StyleScreen() {
  const { profile, setProfile } = useUserStore();
  const [selected, setSelected] = useState<LearningStyle>(
    profile.learningStyle || 'detailed'
  );

  const handleContinue = () => {
    setProfile({ learningStyle: selected });
    router.push('/complete');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OnboardingLayout
      title="How do you learn best?"
      subtitle="Choose your preferred teaching approach"
      currentStep={5}
    >
      <View className="flex-1">
        {STYLE_OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </View>

      <View className="mt-6 pb-4 gap-3">
        <Button title="Continue" onPress={handleContinue} />
        <Button title="Back" variant="outline" onPress={handleBack} />
      </View>
    </OnboardingLayout>
  );
}
