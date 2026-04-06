import { useEffect, useState } from 'react';
import { View, Text, Image, Modal, Animated } from 'react-native';
import { Button } from '@/components/common/Button';

interface CompletionCelebrationProps {
  visible: boolean;
  lessonTitle: string;
  onContinue: () => void;
}

export function CompletionCelebration({
  visible,
  lessonTitle,
  onContinue,
}: CompletionCelebrationProps) {
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.5);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center px-8">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 items-center w-full max-w-sm"
        >
          <Image
            source={require('@/assets/images/mascot/04_lesson_completion.png')}
            className="w-36 h-36 mb-2"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Lesson Complete!
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-2">
            {lessonTitle}
          </Text>
          <Text className="text-sakura-600 dark:text-sakura-400 text-center text-sm mb-6">
            Great work! Keep up the momentum.
          </Text>
          <Button title="Continue" onPress={onContinue} />
        </Animated.View>
      </View>
    </Modal>
  );
}
