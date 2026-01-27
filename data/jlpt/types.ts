// JLPT Course Types

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface JLPTUnit {
  id: string;                    // "n3-unit-01"
  level: JLPTLevel;
  unitNumber: number;
  theme: string;                 // "Daily Life"
  themeJapanese: string;         // "日常生活"
  description: string;
  sections: {
    vocabulary: JLPTVocabulary[];
    kanji: JLPTKanji[];
    grammar: JLPTGrammar[];
    reading: JLPTReading[];
    listening: JLPTListening[];
  };
}

export interface JLPTVocabulary {
  id: string;
  word: string;                  // 出発 (kanji form)
  reading: string;               // しゅっぱつ
  meaning: string;               // departure
  partOfSpeech: 'noun' | 'verb' | 'i-adjective' | 'na-adjective' | 'adverb' | 'expression' | 'counter' | 'particle';
  exampleSentence: string;       // 明日の朝、出発します。
  exampleReading: string;        // あしたのあさ、しゅっぱつします。
  exampleMeaning: string;        // I will depart tomorrow morning.
  jlptLevel: JLPTLevel;
  tags?: string[];               // ['travel', 'transport']
}

export interface JLPTKanji {
  id: string;
  character: string;             // 発
  onYomi: string[];              // ['ハツ', 'ホツ']
  kunYomi: string[];             // ['た.つ', 'あば.く']
  meaning: string;               // departure, emit, emit
  strokeCount: number;
  jlptLevel: JLPTLevel;
  commonWords: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  mnemonics?: string;            // Memory aid
  chineseNote?: string;          // For learners with Chinese background
}

export interface JLPTGrammar {
  id: string;
  pattern: string;               // 〜ために
  patternReading: string;        // 〜ために
  meaning: string;               // in order to; for the purpose of
  formation: string;             // Verb dictionary form + ために / Noun + の + ために
  explanation: string;           // Detailed explanation of usage
  examples: {
    japanese: string;
    reading: string;
    english: string;
  }[];
  notes?: string;                // Additional usage notes
  similarPatterns?: string[];    // Related grammar IDs
  jlptLevel: JLPTLevel;
}

export interface JLPTReading {
  id: string;
  title: string;
  titleJapanese?: string;
  passage: string;               // Main text
  passageWithFurigana: string;   // Text with furigana markup: 漢字[かんじ]
  wordCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: ReadingQuestion[];
  vocabulary?: string[];         // IDs of vocabulary used
  source?: string;               // Attribution
}

export interface ReadingQuestion {
  id: string;
  question: string;
  questionReading?: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface JLPTListening {
  id: string;
  title: string;
  titleJapanese?: string;
  audioUri?: string;             // Path to audio file
  transcript: string;            // Full transcript
  transcriptWithFurigana: string;
  duration: number;              // Seconds
  difficulty: 'easy' | 'medium' | 'hard';
  questions: ListeningQuestion[];
  speakers?: string[];           // Speaker names for dialogue
}

export interface ListeningQuestion {
  id: string;
  question: string;
  questionReading?: string;
  type: 'multiple-choice' | 'true-false';
  options: string[];
  correctIndex: number;
  timestamp?: number;            // When in audio this question relates to
  explanation?: string;
}

// Mock Exam Types

export interface MockExam {
  id: string;
  level: JLPTLevel;
  sections: {
    vocabulary: ExamSection;
    grammar: ExamSection;
    reading: ExamSection;
    listening: ExamSection;
  };
  totalQuestions: number;
  totalTimeMinutes: number;
  passingScore: number;          // Percentage (e.g., 60)
}

export interface ExamSection {
  id: string;
  name: string;
  nameJapanese: string;
  timeMinutes: number;
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'listening';
  subtype?: string;              // 'kanji-reading', 'word-meaning', 'sentence-completion', etc.
  question: string;
  questionReading?: string;
  context?: string;              // For reading/listening - the passage or audio reference
  options: string[];
  correctIndex: number;
  explanation?: string;
  points: number;
}

export interface MockExamAttempt {
  id: string;
  level: JLPTLevel;
  date: string;                  // ISO date
  totalScore: number;            // Percentage
  sectionScores: {
    vocabulary: number;
    grammar: number;
    reading: number;
    listening: number;
  };
  passed: boolean;
  timeSpent: number;             // Seconds
  answers: {
    questionId: string;
    selectedIndex: number;
    correct: boolean;
  }[];
}

// Progress Types

export interface JLPTProgress {
  level: JLPTLevel;
  unitsCompleted: string[];      // Unit IDs
  unitProgress: {
    [unitId: string]: {
      vocabularyReviewed: string[];
      kanjiReviewed: string[];
      grammarReviewed: string[];
      readingCompleted: string[];
      listeningCompleted: string[];
      quizScores: { [sectionId: string]: number };
    };
  };
  mockExamAttempts: MockExamAttempt[];
  unlocked: boolean;
  unlockedAt?: string;
}

// Unit metadata for listing
export interface JLPTUnitMeta {
  id: string;
  level: JLPTLevel;
  unitNumber: number;
  theme: string;
  themeJapanese: string;
  description: string;
  vocabularyCount: number;
  kanjiCount: number;
  grammarCount: number;
}
