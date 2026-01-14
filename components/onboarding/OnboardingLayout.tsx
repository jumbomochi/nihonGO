import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ReactNode } from 'react';
import { StepIndicator } from './StepIndicator';

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingLayout({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps = 6,
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 pt-4">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <ScrollView
          className="flex-1"
          contentContainerClassName="py-6"
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {subtitle}
            </Text>
          )}

          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
