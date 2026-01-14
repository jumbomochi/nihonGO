import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionButton } from '@/components/onboarding/OptionButton';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/stores/userStore';

const GOAL_OPTIONS = [
  {
    id: 'travel',
    title: 'Travel',
    description: 'Navigate Japan with confidence',
    icon: 'plane' as const,
  },
  {
    id: 'work',
    title: 'Work',
    description: 'Use Japanese professionally',
    icon: 'briefcase' as const,
  },
  {
    id: 'media',
    title: 'Media & Entertainment',
    description: 'Understand anime, manga, games',
    icon: 'film' as const,
  },
  {
    id: 'reading',
    title: 'Reading',
    description: 'Read books, articles, and news',
    icon: 'book' as const,
  },
  {
    id: 'conversation',
    title: 'Conversation',
    description: 'Talk with native speakers',
    icon: 'comments' as const,
  },
  {
    id: 'jlpt',
    title: 'JLPT',
    description: 'Pass the Japanese proficiency test',
    icon: 'certificate' as const,
  },
];

export default function GoalsScreen() {
  const { profile, setProfile } = useUserStore();
  const [selected, setSelected] = useState<string[]>(profile.learningGoals || []);

  const toggleSelection = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleContinue = () => {
    setProfile({ learningGoals: selected });
    router.push('/style');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = selected.length > 0;

  return (
    <OnboardingLayout
      title="Learning Goals"
      subtitle="What do you want to achieve? (Select all that apply)"
      currentStep={4}
    >
      <View className="flex-1">
        {GOAL_OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={selected.includes(option.id)}
            onPress={() => toggleSelection(option.id)}
          />
        ))}
      </View>

      <View className="mt-6 pb-4 gap-3">
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
        />
        <Button title="Back" variant="outline" onPress={handleBack} />
      </View>
    </OnboardingLayout>
  );
}
