import { GenkiLesson } from '@/types/genki';
import { lesson01 } from './lesson01';
import { lesson02 } from './lesson02';

// Export all Genki I lessons
export const genki1Lessons: GenkiLesson[] = [
  lesson01,
  lesson02,
  // More lessons will be added here
];

// Export individual lessons
export { lesson01, lesson02 };

// Get a specific lesson by number
export function getGenki1Lesson(lessonNumber: number): GenkiLesson | undefined {
  return genki1Lessons.find((l) => l.lessonNumber === lessonNumber);
}
