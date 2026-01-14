import { GenkiBook } from '@/types/genki';

export interface BookInfo {
  id: GenkiBook;
  title: string;
  titleJapanese: string;
  description: string;
  lessonRange: [number, number];
  totalLessons: number;
}

export const GENKI_BOOKS: Record<GenkiBook, BookInfo> = {
  genki1: {
    id: 'genki1',
    title: 'Genki I',
    titleJapanese: 'げんき I',
    description: 'Elementary Japanese for beginners. Covers basic greetings, self-introduction, daily activities, and foundational grammar.',
    lessonRange: [1, 12],
    totalLessons: 12,
  },
  genki2: {
    id: 'genki2',
    title: 'Genki II',
    titleJapanese: 'げんき II',
    description: 'Continuation of elementary Japanese. Covers more complex grammar, honorific expressions, and intermediate vocabulary.',
    lessonRange: [13, 23],
    totalLessons: 11,
  },
};

export const LESSON_TITLES: Record<string, { title: string; titleJapanese: string }> = {
  // Genki I
  'genki1-lesson01': { title: 'New Friends', titleJapanese: 'あたらしいともだち' },
  'genki1-lesson02': { title: 'Shopping', titleJapanese: 'かいもの' },
  'genki1-lesson03': { title: 'Making a Date', titleJapanese: 'デートのやくそく' },
  'genki1-lesson04': { title: 'The First Date', titleJapanese: 'はじめてのデート' },
  'genki1-lesson05': { title: 'A Trip to Okinawa', titleJapanese: 'おきなわりょこう' },
  'genki1-lesson06': { title: 'A Day in Robert\'s Life', titleJapanese: 'ロバートさんのいちにち' },
  'genki1-lesson07': { title: 'Family Picture', titleJapanese: 'かぞくのしゃしん' },
  'genki1-lesson08': { title: 'Barbecue', titleJapanese: 'バーベキュー' },
  'genki1-lesson09': { title: 'Kabuki', titleJapanese: 'かぶき' },
  'genki1-lesson10': { title: 'Winter Vacation Plans', titleJapanese: 'ふゆやすみのよてい' },
  'genki1-lesson11': { title: 'After the Vacation', titleJapanese: 'やすみのあと' },
  'genki1-lesson12': { title: 'Feeling Ill', titleJapanese: 'びょうき' },
  // Genki II
  'genki2-lesson13': { title: 'Looking for a Part-time Job', titleJapanese: 'アルバイトさがし' },
  'genki2-lesson14': { title: 'Valentine\'s Day', titleJapanese: 'バレンタインデー' },
  'genki2-lesson15': { title: 'A Trip to Nagano', titleJapanese: 'ながのりょこう' },
  'genki2-lesson16': { title: 'Lost and Found', titleJapanese: 'わすれもの' },
  'genki2-lesson17': { title: 'Grumble and Complaints', titleJapanese: 'ぐちとなやみ' },
  'genki2-lesson18': { title: 'John\'s Part-time Job', titleJapanese: 'ジョンさんのアルバイト' },
  'genki2-lesson19': { title: 'Meeting the Family', titleJapanese: 'ごりょうしんにあう' },
  'genki2-lesson20': { title: 'Mary\'s Purchase', titleJapanese: 'メアリーさんのかいもの' },
  'genki2-lesson21': { title: 'Burglarized', titleJapanese: 'どろぼう' },
  'genki2-lesson22': { title: 'Education in Japan', titleJapanese: 'にほんのきょういく' },
  'genki2-lesson23': { title: 'Good-bye', titleJapanese: 'さようなら' },
};
