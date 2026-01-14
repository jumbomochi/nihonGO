import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionButton } from '@/components/onboarding/OptionButton';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/stores/userStore';

const LANGUAGE_OPTIONS = [
  { id: 'english', title: 'English', icon: 'globe' as const },
  { id: 'chinese_mandarin', title: 'Chinese (Mandarin)', icon: 'globe' as const },
  { id: 'chinese_cantonese', title: 'Chinese (Cantonese)', icon: 'globe' as const },
  { id: 'korean', title: 'Korean', icon: 'globe' as const },
  { id: 'spanish', title: 'Spanish', icon: 'globe' as const },
  { id: 'other', title: 'Other', icon: 'globe' as const },
];

export default function WelcomeScreen() {
  const { profile, setProfile } = useUserStore();
  const [selected, setSelected] = useState(profile.nativeLanguage || '');

  const handleContinue = () => {
    const isChinese = selected.startsWith('chinese');
    setProfile({
      nativeLanguage: selected,
      knowsChinese: isChinese || profile.knowsChinese,
    });
    router.push('/languages');
  };

  return (
    <OnboardingLayout
      title="Welcome to nihonGO!"
      subtitle="What's your native language?"
      currentStep={1}
    >
      <View className="flex-1">
        {LANGUAGE_OPTIONS.map((option) => (
          <OptionButton
            key={option.id}
            title={option.title}
            icon={option.icon}
            selected={selected === option.id}
            onPress={() => setSelected(option.id)}
          />
        ))}
      </View>

      <View className="mt-6 pb-4">
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selected}
        />
      </View>
    </OnboardingLayout>
  );
}
