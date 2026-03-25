// components/alphabet/DrawingCanvas.tsx

import { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Constants
const STROKE_COLOR = '#ec4899';
const MIN_STROKE_SEGMENTS = 3;

interface DrawingCanvasProps {
  targetCharacter: string;
  strokeCount: number;
  onComplete: () => void;
}

interface PathData {
  id: string;
  d: string;
}

// Validate that a stroke has sufficient length (not just a tap)
const isValidStroke = (pathData: string): boolean => {
  const segments = pathData.split(' ').filter((s) => s === 'L').length;
  return segments > MIN_STROKE_SEGMENTS;
};

export function DrawingCanvas({
  targetCharacter,
  strokeCount,
  onComplete,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const pathIdRef = useRef(0);
  const pathsRef = useRef<PathData[]>([]);
  const currentPathRef = useRef<string>('');

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart((e) => {
      const newPath = `M ${e.x} ${e.y}`;
      currentPathRef.current = newPath;
      setCurrentPath(newPath);
    })
    .onUpdate((e) => {
      currentPathRef.current += ` L ${e.x} ${e.y}`;
      setCurrentPath(currentPathRef.current);
    })
    .onEnd(() => {
      const pathData = currentPathRef.current;
      if (pathData && isValidStroke(pathData)) {
        const newPath: PathData = {
          id: `path-${pathIdRef.current++}`,
          d: pathData,
        };
        setPaths((prev) => {
          const updated = [...prev, newPath];
          pathsRef.current = updated;
          return updated;
        });

        // Check if user has drawn enough strokes
        if (pathsRef.current.length >= strokeCount) {
          onComplete();
        }
      }
      // Reset current path
      currentPathRef.current = '';
      setCurrentPath('');
    });

  const handleClear = () => {
    setPaths([]);
    pathsRef.current = [];
    setCurrentPath('');
    pathIdRef.current = 0;
  };

  const strokesRemaining = Math.max(0, strokeCount - paths.length);

  return (
    <View className="flex-1">
      {/* Drawing area with integrated guide character */}
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
          {/* Guide character as background overlay */}
          <View className="absolute inset-0 items-center justify-center pointer-events-none">
            <Text className="text-[180px] font-japanese text-gray-200 dark:text-gray-700 opacity-50">
              {targetCharacter}
            </Text>
          </View>

          <GestureDetector gesture={panGesture}>
            <Animated.View style={{ flex: 1 }}>
              <Svg width="100%" height="100%">
                <G>
                  {/* Completed strokes */}
                  {paths.map((path) => (
                    <Path
                      key={path.id}
                      d={path.d}
                      stroke={STROKE_COLOR}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  ))}
                  {/* Current stroke being drawn */}
                  {currentPath && (
                    <Path
                      d={currentPath}
                      stroke={STROKE_COLOR}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={0.5}
                    />
                  )}
                </G>
              </Svg>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      {/* Stroke counter and clear button */}
      <View className="flex-row items-center justify-between mt-3">
        <Text className="text-sm text-gray-500">
          {strokesRemaining > 0
            ? `${strokesRemaining} stroke${strokesRemaining > 1 ? 's' : ''} remaining`
            : 'Complete!'}
        </Text>

        <Pressable
          onPress={handleClear}
          className="flex-row items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
          accessibilityLabel="Clear drawing"
          accessibilityRole="button"
        >
          <FontAwesome name="eraser" size={14} color="#6b7280" />
          <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm font-medium">
            Clear
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
