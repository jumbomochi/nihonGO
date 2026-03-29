import { useLocalSearchParams } from 'expo-router';
import { isGenkiLessonId } from '@/data/genki';
import { GenkiLessonScreen } from '@/components/lesson/GenkiLessonScreen';
import { AILessonScreen } from '@/components/lesson/AILessonScreen';

export default function LessonScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const isGenki = topic ? isGenkiLessonId(topic) : false;

  if (isGenki) {
    return <GenkiLessonScreen lessonId={topic!} />;
  }

  return <AILessonScreen topic={topic!} />;
}
