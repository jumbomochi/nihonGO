import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { JLPTLevel } from '@/data/jlpt/types';
import { triggerSelection } from '@/lib/haptics';

interface LevelCardProps {
  level: JLPTLevel;
  title: string;
  subtitle: string;
  unitsCompleted: number;
  totalUnits: number;
  isUnlocked: boolean;
  unlockRequirement?: string;
  onPress: () => void;
}

const LEVEL_COLORS: Record<JLPTLevel, { bg: string; border: string; text: string }> = {
  N5: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-600' },
  N4: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600' },
  N3: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-600' },
  N2: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600' },
  N1: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-600' },
};

export function LevelCard({
  level,
  title,
  subtitle,
  unitsCompleted,
  totalUnits,
  isUnlocked,
  unlockRequirement,
  onPress,
}: LevelCardProps) {
  const colors = LEVEL_COLORS[level];
  const progress = totalUnits > 0 ? (unitsCompleted / totalUnits) * 100 : 0;

  const handlePress = () => {
    if (isUnlocked) {
      triggerSelection();
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!isUnlocked}
      className={`rounded-2xl border p-4 ${colors.bg} ${colors.border} ${!isUnlocked ? 'opacity-60' : ''}`}
    >
      <View className="flex-row items-center">
        {/* Level Badge */}
        <View className={`w-14 h-14 rounded-xl items-center justify-center ${isUnlocked ? 'bg-white dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'}`}>
          {isUnlocked ? (
            <Text className={`text-2xl font-bold ${colors.text}`}>{level}</Text>
          ) : (
            <FontAwesome name="lock" size={24} color="#9ca3af" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </Text>

          {isUnlocked ? (
            <View className="mt-2">
              {/* Progress Bar */}
              <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <View
                  className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-sakura-500'}`}
                  style={{ width: `${progress}%` }}
                />
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {unitsCompleted}/{totalUnits} units completed
              </Text>
            </View>
          ) : (
            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {unlockRequirement}
            </Text>
          )}
        </View>

        {/* Arrow */}
        {isUnlocked && (
          <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
        )}
      </View>
    </Pressable>
  );
}
