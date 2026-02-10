import { View, Text, Pressable, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type IconName = React.ComponentProps<typeof FontAwesome>['name'];

interface ChipItem {
  id: string;
  label: string;
  icon?: string;
}

interface ChipProps {
  items: ChipItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function Chip({
  items,
  activeId,
  onSelect,
  className = '',
}: ChipProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={className}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={{ height: 40 }}
            className={`flex-row items-center px-4 rounded-full ${
              isActive
                ? 'bg-sakura-500'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            {item.icon && (
              <FontAwesome
                name={item.icon as IconName}
                size={14}
                color={isActive ? '#fff' : '#9ca3af'}
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              className={`font-medium ${
                isActive
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
