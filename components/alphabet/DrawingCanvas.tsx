// components/alphabet/DrawingCanvas.tsx

import { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DrawingCanvasProps {
  targetCharacter: string;
  strokeCount: number;
  onComplete: () => void;
}

interface PathData {
  id: string;
  d: string;
}

export function DrawingCanvas({
  targetCharacter,
  strokeCount,
  onComplete,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const pathIdRef = useRef(0);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      setCurrentPath(`M ${e.x} ${e.y}`);
    })
    .onUpdate((e) => {
      setCurrentPath((prev) => `${prev} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      if (currentPath) {
        const newPath: PathData = {
          id: `path-${pathIdRef.current++}`,
          d: currentPath,
        };
        setPaths((prev) => [...prev, newPath]);
        setCurrentPath('');

        // Check if user has drawn enough strokes
        if (paths.length + 1 >= strokeCount) {
          onComplete();
        }
      }
    });

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
    pathIdRef.current = 0;
  };

  const strokesRemaining = Math.max(0, strokeCount - paths.length);

  return (
    <View className="flex-1">
      {/* Target character display */}
      <View className="items-center mb-4">
        <Text className="text-8xl font-japanese text-gray-200 dark:text-gray-700">
          {targetCharacter}
        </Text>
        <Text className="text-sm text-gray-500 mt-2">
          {strokesRemaining > 0
            ? `${strokesRemaining} stroke${strokesRemaining > 1 ? 's' : ''} remaining`
            : 'Complete!'}
        </Text>
      </View>

      {/* Drawing area */}
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
          <GestureDetector gesture={panGesture}>
            <View className="flex-1">
              <Svg width="100%" height="100%">
                <G>
                  {/* Completed strokes */}
                  {paths.map((path) => (
                    <Path
                      key={path.id}
                      d={path.d}
                      stroke="#ec4899"
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
                      stroke="#ec4899"
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={0.5}
                    />
                  )}
                </G>
              </Svg>
            </View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      {/* Clear button */}
      <Pressable
        onPress={handleClear}
        className="flex-row items-center justify-center mt-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl"
        accessibilityLabel="Clear drawing"
        accessibilityRole="button"
      >
        <FontAwesome name="eraser" size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 ml-2 font-medium">
          Clear
        </Text>
      </Pressable>
    </View>
  );
}
