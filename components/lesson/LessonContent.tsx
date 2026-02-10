import { View, Text } from 'react-native';

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} className="font-bold text-gray-900 dark:text-white">
          {part.slice(2, -2)}
        </Text>
      );
    }
    return part;
  });
}

export function LessonContent({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <View className="gap-2">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <View key={index} className="h-2" />;
        }

        if (trimmed.startsWith('## ')) {
          return (
            <Text
              key={index}
              className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2"
            >
              {trimmed.replace('## ', '')}
            </Text>
          );
        }

        if (trimmed.startsWith('# ')) {
          return (
            <Text
              key={index}
              className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2"
            >
              {trimmed.replace('# ', '')}
            </Text>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <View key={index} className="flex-row pl-2">
              <Text className="text-gray-600 dark:text-gray-400 mr-2">•</Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1 leading-6">
                {trimmed.substring(2)}
              </Text>
            </View>
          );
        }

        const numberedMatch = trimmed.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          return (
            <View key={index} className="flex-row pl-2">
              <Text className="text-sakura-600 font-medium mr-2 w-6">
                {numberedMatch[1]}.
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1 leading-6">
                {trimmed.replace(numberedMatch[0], '')}
              </Text>
            </View>
          );
        }

        if (trimmed.includes('**')) {
          return (
            <Text
              key={index}
              className="text-gray-700 dark:text-gray-300 leading-6"
            >
              {renderBoldText(trimmed)}
            </Text>
          );
        }

        return (
          <Text
            key={index}
            className="text-gray-700 dark:text-gray-300 leading-6"
          >
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
}
