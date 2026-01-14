import { View, Text } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <View className="items-center py-4">
      {/* Step text label */}
      <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Step {currentStep + 1} of {totalSteps}
      </Text>

      {/* Visual dots */}
      <View className="flex-row justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index < currentStep
                ? 'w-8 bg-sakura-500'
                : index === currentStep
                ? 'w-8 bg-sakura-300'
                : 'w-2 bg-gray-300 dark:bg-gray-600'
            }`}
            accessibilityLabel={`Step ${index + 1} ${index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming'}`}
          />
        ))}
      </View>
    </View>
  );
}
