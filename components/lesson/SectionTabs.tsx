import { View, Text, Pressable, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LessonSection, LessonSectionType } from '@/types/genki';

interface SectionTabsProps {
  sections: LessonSection[];
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

// Properly typed icon names for FontAwesome
type IconName = React.ComponentProps<typeof FontAwesome>['name'];

const SECTION_ICONS: Record<LessonSectionType, IconName> = {
  dialogue: 'comments',
  vocabulary: 'book',
  grammar: 'puzzle-piece',
  expressions: 'comment',
  culture: 'globe',
  reading: 'file-text-o',
  writing: 'pencil',
  practice: 'check-square-o',
};

export function SectionTabs({
  sections,
  activeSection,
  onSelectSection,
}: SectionTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      className="border-b border-gray-200 dark:border-gray-800"
    >
      <View className="flex-row gap-2">
        {sections.map((section) => {
          const isActive = section.id === activeSection;
          const iconName: IconName = SECTION_ICONS[section.type] || 'circle';

          return (
            <Pressable
              key={section.id}
              onPress={() => onSelectSection(section.id)}
              className={`flex-row items-center px-4 py-3 rounded-full ${
                isActive
                  ? 'bg-sakura-500'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <FontAwesome
                name={iconName}
                size={14}
                color={isActive ? '#fff' : '#9ca3af'}
              />
              <Text
                className={`ml-2 font-medium ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {section.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
