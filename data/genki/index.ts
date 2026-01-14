import { GenkiLesson, GenkiBook } from '@/types/genki';
import { genki1Lessons, getGenki1Lesson } from './genki1';
import { genki2Lessons, getGenki2Lesson } from './genki2';
import { GENKI_BOOKS, LESSON_TITLES } from './books';

export { GENKI_BOOKS, LESSON_TITLES };

// Get all lessons for a book
export function getBookLessons(book: GenkiBook): GenkiLesson[] {
  return book === 'genki1' ? genki1Lessons : genki2Lessons;
}

// Get a specific lesson by ID (e.g., "genki1-lesson01")
export function getLesson(lessonId: string): GenkiLesson | undefined {
  const [book, lessonPart] = lessonId.split('-');
  const lessonNumber = parseInt(lessonPart.replace('lesson', ''), 10);

  if (book === 'genki1') {
    return getGenki1Lesson(lessonNumber);
  } else if (book === 'genki2') {
    return getGenki2Lesson(lessonNumber);
  }

  return undefined;
}

// Get lesson title info
export function getLessonTitle(lessonId: string): { title: string; titleJapanese: string } | undefined {
  return LESSON_TITLES[lessonId];
}

// Get total lesson count for a book
export function getBookLessonCount(book: GenkiBook): number {
  return GENKI_BOOKS[book].totalLessons;
}

// Check if a lesson ID is valid Genki format
export function isGenkiLessonId(id: string): boolean {
  return /^genki[12]-lesson\d{2}$/.test(id);
}

// Generate placeholder lessons for lessons not yet created
export function getPlaceholderLesson(lessonId: string): GenkiLesson | undefined {
  const titleInfo = LESSON_TITLES[lessonId];
  if (!titleInfo) return undefined;

  const [book, lessonPart] = lessonId.split('-');
  const lessonNumber = parseInt(lessonPart.replace('lesson', ''), 10);

  return {
    id: lessonId,
    book: book as GenkiBook,
    lessonNumber,
    title: titleInfo.title,
    titleJapanese: titleInfo.titleJapanese,
    description: `Lesson ${lessonNumber}: ${titleInfo.title}`,
    objectives: ['Coming soon...'],
    sections: [],
    audioTracks: [],
    estimatedMinutes: 45,
  };
}

// Get lesson or placeholder
export function getLessonOrPlaceholder(lessonId: string): GenkiLesson | undefined {
  return getLesson(lessonId) || getPlaceholderLesson(lessonId);
}

// Get all available lesson IDs for a book
export function getAllLessonIds(book: GenkiBook): string[] {
  const { lessonRange } = GENKI_BOOKS[book];
  const ids: string[] = [];

  for (let i = lessonRange[0]; i <= lessonRange[1]; i++) {
    ids.push(`${book}-lesson${i.toString().padStart(2, '0')}`);
  }

  return ids;
}
