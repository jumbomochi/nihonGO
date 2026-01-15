import { useState, useMemo } from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'url';
  error?: string;
}

// Generate a simple unique ID for accessibility
let idCounter = 0;
function generateId() {
  return `input-label-${++idCounter}`;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  multiline = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  error,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const labelId = useMemo(() => generateId(), []);

  const borderStyle = error
    ? 'border-2 border-red-500'
    : isFocused
      ? 'border-2 border-sakura-600'
      : 'border-2 border-transparent';

  return (
    <View className="w-full">
      {label && (
        <Text
          nativeID={labelId}
          className="text-gray-700 dark:text-gray-300 font-medium mb-2"
        >
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl text-base ${borderStyle}`}
        accessibilityLabel={label || placeholder}
        accessibilityLabelledBy={label ? labelId : undefined}
        accessibilityState={{ disabled: false }}
        accessibilityHint={error ? `Error: ${error}` : undefined}
      />
      {error && (
        <Text
          className="text-red-500 text-sm mt-1"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
