import { Pressable, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface OptionButtonProps {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  icon?: keyof typeof FontAwesome.glyphMap;
}

export function OptionButton({
  title,
  description,
  selected,
  onPress,
  icon,
}: OptionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-4 rounded-xl border-2 mb-3 ${
        selected
          ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
    >
      <View className="flex-row items-center">
        {icon && (
          <View
            className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
              selected ? 'bg-sakura-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <FontAwesome
              name={icon}
              size={18}
              color={selected ? '#fff' : '#6b7280'}
            />
          </View>
        )}
        <View className="flex-1">
          <Text
            className={`text-lg font-semibold ${
              selected
                ? 'text-sakura-700 dark:text-sakura-300'
                : 'text-gray-900 dark:text-white'
            }`}
          >
            {title}
          </Text>
          {description && (
            <Text className="text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </Text>
          )}
        </View>
        {selected && (
          <FontAwesome name="check-circle" size={24} color="#ec4899" />
        )}
      </View>
    </Pressable>
  );
}
