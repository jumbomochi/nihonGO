import { GenkiLesson } from '@/types/genki';

// Genki II lessons will be added here
export const genki2Lessons: GenkiLesson[] = [];

// Get a specific lesson by number
export function getGenki2Lesson(lessonNumber: number): GenkiLesson | undefined {
  return genki2Lessons.find((l) => l.lessonNumber === lessonNumber);
}
