import { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle, DimensionValue } from 'react-native';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as DimensionValue,
          height,
          borderRadius,
          backgroundColor: '#d1d5db',
          opacity,
        },
        style,
      ]}
    />
  );
}

export function LessonCardSkeleton() {
  return (
    <View className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <View className="flex-row">
        <Skeleton width={48} height={48} borderRadius={12} />
        <View className="flex-1 ml-4">
          <Skeleton width="70%" height={18} />
          <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
          <Skeleton width="90%" height={14} style={{ marginTop: 8 }} />
          <View className="flex-row mt-3 gap-4">
            <Skeleton width={60} height={12} />
            <Skeleton width={60} height={12} />
          </View>
        </View>
      </View>
    </View>
  );
}

export function ChatBubbleSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <View className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
      <View
        className={`rounded-2xl px-4 py-3 max-w-[85%] ${
          isUser ? 'bg-sakura-100' : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        <Skeleton width={200} height={14} />
        <Skeleton width={150} height={14} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}
