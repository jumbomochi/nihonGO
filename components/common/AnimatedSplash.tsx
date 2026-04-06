import { useEffect, useState } from 'react';
import { View, Text, Image, Animated } from 'react-native';

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="absolute inset-0 z-50 bg-white dark:bg-gray-900 items-center justify-center"
    >
      <Image
        source={require('@/assets/images/mascot/02_splash_screen.png')}
        className="w-40 h-40 mb-4"
        resizeMode="contain"
      />
      <Text className="text-3xl font-bold text-gray-900 dark:text-white">
        nihon<Text className="text-sakura-500">GO</Text>
      </Text>
      <Text className="text-sm text-gray-400 mt-2">
        Your Japanese tutor
      </Text>
    </Animated.View>
  );
}
