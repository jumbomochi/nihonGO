import { GenkiLesson } from '@/types/genki';
import { lesson01 } from './lesson01';
import { lesson02 } from './lesson02';
import { lesson03 } from './lesson03';
import { lesson04 } from './lesson04';
import { lesson05 } from './lesson05';
import { lesson06 } from './lesson06';
import { lesson07 } from './lesson07';
import { lesson08 } from './lesson08';
import { lesson09 } from './lesson09';
import { lesson10 } from './lesson10';
import { lesson11 } from './lesson11';
import { lesson12 } from './lesson12';

// Export all Genki I lessons (complete)
export const genki1Lessons: GenkiLesson[] = [
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
];

// Export individual lessons
export {
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
  lesson06,
  lesson07,
  lesson08,
  lesson09,
  lesson10,
  lesson11,
  lesson12,
};

// Get a specific lesson by number
export function getGenki1Lesson(lessonNumber: number): GenkiLesson | undefined {
  return genki1Lessons.find((l) => l.lessonNumber === lessonNumber);
}
