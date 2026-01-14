import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionButton } from '@/components/onboarding/OptionButton';
import { Button } from '@/components/common/Button';
import { useUserStore, ProficiencyLevel } from '@/stores/userStore';

const PROFICIENCY_OPTIONS: {
  id: ProficiencyLevel;
  title: string;
  description: string;
  icon: 'star-o' | 'star-half-full' | 'star';
}[] = [
  {
    id: 'complete_beginner',
    title: 'Complete Beginner',
    description: "I don't know any Japanese yet",
    icon: 'star-o',
  },
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'I know hiragana/katakana and basic phrases',
    icon: 'star-half-full',
  },
  {
    id: 'elementary',
    title: 'Elementary',
    description: 'I can have simple conversations',
    icon: 'star-half-full',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'I can discuss various topics comfortably',
    icon: 'star',
  },
];

export default function ProficiencyScreen() {
  const { profile, setProfile } = useUserStore();
  const [selected, setSelected] = useState<ProficiencyLevel>(
    profile.proficiencyLevel || 'complete_beginner'
  );

  const handleContinue = () => {
    setProfile({ proficiencyLevel: selected });
    router.push('/goals');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OnboardingLayout
      title="Japanese Level"
      subtitle="How much Japanese do you know?"
      currentStep={3}
    >
      <View className="flex-1">
        {PROFICIENCY_OPTIONS.map((option) => (
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
