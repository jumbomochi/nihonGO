import "../global.css";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  useFonts as useGoogleFonts,
  NotoSansJP_400Regular,
  NotoSansJP_500Medium,
  NotoSansJP_700Bold,
} from '@expo-google-fonts/noto-sans-jp';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { useUserStore } from '@/stores/userStore';
import { ErrorBoundary as CustomErrorBoundary } from '@/components/common/ErrorBoundary';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(onboarding)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Japanese fonts are optional - don't block app loading if they fail
  const [japaneseFontsLoaded, japaneseFontsError] = useGoogleFonts({
    NotoSansJP_400Regular,
    NotoSansJP_500Medium,
    NotoSansJP_700Bold,
  });

  // Only require core fonts, Japanese fonts are optional enhancement
  const loaded = fontsLoaded;

  // Log Japanese font errors but don't throw
  useEffect(() => {
    if (japaneseFontsError) {
      console.warn('Japanese fonts failed to load:', japaneseFontsError);
    }
  }, [japaneseFontsError]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { profile } = useUserStore();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timer = setTimeout(() => setIsNavigationReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const inOnboarding = segments[0] === '(onboarding)';
    const onboardingComplete = profile.onboardingComplete;

    if (onboardingComplete && inOnboarding) {
      // User completed onboarding but is on onboarding screen, redirect to main app
      router.replace('/(tabs)');
    } else if (!onboardingComplete && !inOnboarding) {
      // User hasn't completed onboarding but is on main app, redirect to onboarding
      router.replace('/(onboarding)/welcome');
    }
  }, [isNavigationReady, segments, profile.onboardingComplete]);

  return (
    <CustomErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="lesson/[topic]" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </CustomErrorBoundary>
  );
}
