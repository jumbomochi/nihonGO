import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="languages" />
      <Stack.Screen name="proficiency" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="style" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
