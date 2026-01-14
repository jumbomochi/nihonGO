import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingLayout } from '@/components/onboarding/OnboardingLayout';
import { OptionButton } from '@/components/onboarding/OptionButton';
import { Button } from '@/components/common/Button';
import { useUserStore } from '@/stores/userStore';

const LANGUAGE_OPTIONS = [
  { id: 'chinese', title: 'Chinese', description: 'Mandarin or Cantonese', icon: 'language' as const },
  { id: 'korean', title: 'Korean', description: 'Hangul writing system', icon: 'language' as const },
  { id: 'spanish', title: 'Spanish', icon: 'language' as const },
  { id: 'french', title: 'French', icon: 'language' as const },
  { id: 'german', title: 'German', icon: 'language' as const },
  { id: 'none', title: 'None', description: "This is my first foreign language", icon: 'times-circle' as const },
];

export default function LanguagesScreen() {
  const { profile, setProfile } = useUserStore();
  const [selected, setSelected] = useState<string[]>(profile.priorLanguages || []);

  const toggleSelection = (id: string) => {
    if (id === 'none') {
      setSelected(['none']);
      return;
    }

    setSelected((prev) => {
      const filtered = prev.filter((item) => item !== 'none');
      if (filtered.includes(id)) {
        return filtered.filter((item) => item !== id);
      }
      return [...filtered, id];
    });
  };

  const handleContinue = () => {
    const languages = selected.filter((l) => l !== 'none');
    const knowsChinese = profile.knowsChinese || languages.includes('chinese');

    setProfile({
      priorLanguages: languages,
      knowsChinese,
    });
    router.push('/proficiency');
  };

  const handleBack = () => {
    router.back();
  };

  const isValid = selected.length > 0;

  return (
    <OnboardingLayout
      title="Language Background"
      subtitle="Which languages have you studied before? (Select all that apply)"
      currentStep={2}
    >
      <View className="flex-1">
        {LANGUAGE_OPTIONS.map((option) => (
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
        <Button
          title="Back"
          variant="outline"
          onPress={handleBack}
        />
      </View>
    </OnboardingLayout>
  );
}
