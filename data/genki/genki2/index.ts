import { GenkiLesson } from '@/types/genki';
import { lesson13 } from './lesson13';
import { lesson14 } from './lesson14';
import { lesson15 } from './lesson15';
import { lesson16 } from './lesson16';
import { lesson17 } from './lesson17';
import { lesson18 } from './lesson18';
import { lesson19 } from './lesson19';
import { lesson20 } from './lesson20';
import { lesson21 } from './lesson21';
import { lesson22 } from './lesson22';
import { lesson23 } from './lesson23';

// Export all Genki II lessons (complete)
export const genki2Lessons: GenkiLesson[] = [
  lesson13,
  lesson14,
  lesson15,
  lesson16,
  lesson17,
  lesson18,
  lesson19,
  lesson20,
  lesson21,
  lesson22,
  lesson23,
];

// Export individual lessons
export {
  lesson13,
  lesson14,
  lesson15,
  lesson16,
  lesson17,
  lesson18,
  lesson19,
  lesson20,
  lesson21,
  lesson22,
  lesson23,
};

// Get a specific lesson by number
export function getGenki2Lesson(lessonNumber: number): GenkiLesson | undefined {
  return genki2Lessons.find((l) => l.lessonNumber === lessonNumber);
}
