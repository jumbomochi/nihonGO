// Web stub for @react-native-community/slider
// The native slider uses import.meta which doesn't work in non-module scripts

import { View } from 'react-native';

interface SliderProps {
  value?: number;
  minimumValue?: number;
  maximumValue?: number;
  onSlidingComplete?: (value: number) => void;
  onValueChange?: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  step?: number;
  disabled?: boolean;
}

export default function Slider({
  value = 0,
  minimumValue = 0,
  maximumValue = 1,
  onSlidingComplete,
  onValueChange,
  minimumTrackTintColor = '#ec4899',
  maximumTrackTintColor = '#d1d5db',
}: SliderProps) {
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={{ width: '100%', height: 40, justifyContent: 'center' }}>
      <input
        type="range"
        min={minimumValue}
        max={maximumValue}
        value={value}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        onMouseUp={(e) => onSlidingComplete?.(Number((e.target as HTMLInputElement).value))}
        onTouchEnd={(e) => onSlidingComplete?.(Number((e.target as HTMLInputElement).value))}
        style={{
          width: '100%',
          height: 4,
          appearance: 'none',
          background: `linear-gradient(to right, ${minimumTrackTintColor} 0%, ${minimumTrackTintColor} ${percentage}%, ${maximumTrackTintColor} ${percentage}%, ${maximumTrackTintColor} 100%)`,
          borderRadius: 2,
          cursor: 'pointer',
        }}
      />
    </View>
  );
}
