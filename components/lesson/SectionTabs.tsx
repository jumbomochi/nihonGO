import { View, Text, Pressable, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LessonSection, LessonSectionType } from '@/types/genki';
import { QuizScore } from '@/stores/progressStore';

interface SectionTabsProps {
  sections: LessonSection[];
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  quizScores?: Record<string, QuizScore>;
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
  quizScores = {},
}: SectionTabsProps) {
  return (
    <View className="border-b border-gray-200 dark:border-gray-800">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        <View className="flex-row items-center gap-2">
          {sections.map((section) => {
            const isActive = section.id === activeSection;
            const iconName: IconName = SECTION_ICONS[section.type] || 'circle';
            const quizScore = quizScores[section.id];

            // Show badge for vocabulary sections with quiz scores
            const showBadge = section.type === 'vocabulary' && quizScore;
            const badgeColor = quizScore
              ? quizScore.score >= 8
                ? '#22c55e' // green for >= 80%
                : quizScore.score >= 5
                  ? '#d97706' // amber for >= 50%
                  : undefined // no badge for < 50%
              : undefined;

            return (
              <Pressable
                key={section.id}
                onPress={() => onSelectSection(section.id)}
                style={{ height: 40 }}
                className={`flex-row items-center justify-center px-4 rounded-full ${
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
                {showBadge && badgeColor && (
                  <View className="ml-1.5">
                    <FontAwesome
                      name={quizScore.score >= 8 ? 'check-circle' : 'circle'}
                      size={10}
                      color={badgeColor}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
