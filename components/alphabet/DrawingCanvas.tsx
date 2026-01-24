// components/alphabet/DrawingCanvas.tsx

import { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
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

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      setCurrentPath(`M ${e.x} ${e.y}`);
    })
    .onUpdate((e) => {
      setCurrentPath((prev) => `${prev} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      if (currentPath && isValidStroke(currentPath)) {
        const newPath: PathData = {
          id: `path-${pathIdRef.current++}`,
          d: currentPath,
        };
        setPaths((prev) => {
          const updated = [...prev, newPath];
          pathsRef.current = updated;
          return updated;
        });
        setCurrentPath('');

        // Check if user has drawn enough strokes using ref to avoid stale closure
        if (pathsRef.current.length >= strokeCount) {
          onComplete();
        }
      } else {
        // Invalid stroke (too short), just clear it
        setCurrentPath('');
      }
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
          </View>
        </GestureDetector>
      </View>

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
