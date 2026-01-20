import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GenkiBook } from '@/types/genki';
import { getAllLessonIds, GENKI_BOOKS } from '@/data/genki';

interface LessonProgress {
  topicId: string;
  completedAt: string;
  timeSpentSeconds: number;
}

interface DailyStreak {
  date: string;
  lessonsCompleted: number;
}

interface GenkiLessonProgress {
  lessonId: string;
  completedSections: string[];
  audioTracksListened: string[];
  vocabularyMastered: string[];
  lastAccessedAt: string;
  totalTimeSpentSeconds: number;
}

export interface QuizScore {
  lessonId: string;
  sectionId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

interface BookProgress {
  book: GenkiBook;
  completedLessons: number;
  totalLessons: number;
  percentComplete: number;
}

interface ProgressState {
  completedLessons: LessonProgress[];
  dailyStreaks: DailyStreak[];
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  genkiProgress: Record<string, GenkiLessonProgress>;
  quizScores: QuizScore[];

  // Actions
  completeLesson: (topicId: string, timeSpentSeconds: number) => void;
  addWordsLearned: (count: number) => void;
  getLessonProgress: (topicId: string) => LessonProgress | undefined;
  isLessonCompleted: (topicId: string) => boolean;
  getTodayStats: () => { lessonsCompleted: number; date: string };
  resetProgress: () => void;

  // Genki-specific actions
  markSectionComplete: (lessonId: string, sectionId: string) => void;
  markAudioListened: (lessonId: string, trackId: string) => void;
  markVocabularyMastered: (lessonId: string, vocabularyId: string) => void;
  getGenkiLessonProgress: (lessonId: string) => GenkiLessonProgress | undefined;
  getBookProgress: (book: GenkiBook) => BookProgress;
  isSectionCompleted: (lessonId: string, sectionId: string) => boolean;

  // Quiz actions
  saveQuizScore: (score: Omit<QuizScore, 'completedAt'>) => void;
  getBestScore: (lessonId: string, sectionId: string) => QuizScore | null;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to create default lesson progress - prevents code duplication
function createDefaultLessonProgress(
  lessonId: string,
  now: string
): GenkiLessonProgress {
  return {
    lessonId,
    completedSections: [],
    audioTracksListened: [],
    vocabularyMastered: [],
    lastAccessedAt: now,
    totalTimeSpentSeconds: 0,
  };
}

function calculateStreak(streaks: DailyStreak[]): number {
  if (streaks.length === 0) return 0;

  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Use Set for O(1) lookup instead of O(n log n) sorting
  const streakDates = new Set(streaks.map((s) => s.date));

  // Check if active streak exists (activity today or yesterday)
  if (!streakDates.has(today) && !streakDates.has(yesterday)) {
    return 0;
  }

  let streak = 0;
  let currentDate = streakDates.has(today) ? today : yesterday;

  // Count consecutive days backwards
  while (streakDates.has(currentDate)) {
    streak++;
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    currentDate = prevDate.toISOString().split('T')[0];
  }

  return streak;
}

const defaultState = {
  completedLessons: [],
  dailyStreaks: [],
  totalWordsLearned: 0,
  currentStreak: 0,
  longestStreak: 0,
  genkiProgress: {} as Record<string, GenkiLessonProgress>,
  quizScores: [] as QuizScore[],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      completeLesson: (topicId: string, timeSpentSeconds: number) => {
        const today = getToday();
        const now = new Date().toISOString();

        set((state) => {
          // Add lesson progress
          const existingIndex = state.completedLessons.findIndex(
            (l) => l.topicId === topicId
          );

          const newLessons = [...state.completedLessons];
          if (existingIndex >= 0) {
            newLessons[existingIndex] = {
              ...newLessons[existingIndex],
              completedAt: now,
              timeSpentSeconds:
                newLessons[existingIndex].timeSpentSeconds + timeSpentSeconds,
            };
          } else {
            newLessons.push({
              topicId,
              completedAt: now,
              timeSpentSeconds,
            });
          }

          // Update daily streaks
          const existingStreakIndex = state.dailyStreaks.findIndex(
            (s) => s.date === today
          );
          const newStreaks = [...state.dailyStreaks];

          if (existingStreakIndex >= 0) {
            newStreaks[existingStreakIndex] = {
              ...newStreaks[existingStreakIndex],
              lessonsCompleted: newStreaks[existingStreakIndex].lessonsCompleted + 1,
            };
          } else {
            newStreaks.push({
              date: today,
              lessonsCompleted: 1,
            });
          }

          const newCurrentStreak = calculateStreak(newStreaks);

          return {
            completedLessons: newLessons,
            dailyStreaks: newStreaks,
            currentStreak: newCurrentStreak,
            longestStreak: Math.max(state.longestStreak, newCurrentStreak),
          };
        });
      },

      addWordsLearned: (count: number) => {
        set((state) => ({
          totalWordsLearned: state.totalWordsLearned + count,
        }));
      },

      getLessonProgress: (topicId: string) => {
        return get().completedLessons.find((l) => l.topicId === topicId);
      },

      isLessonCompleted: (topicId: string) => {
        return get().completedLessons.some((l) => l.topicId === topicId);
      },

      getTodayStats: () => {
        const today = getToday();
        const streak = get().dailyStreaks.find((s) => s.date === today);
        return {
          date: today,
          lessonsCompleted: streak?.lessonsCompleted || 0,
        };
      },

      resetProgress: () => {
        set(defaultState);
      },

      // Genki-specific methods
      markSectionComplete: (lessonId: string, sectionId: string) => {
        const now = new Date().toISOString();
        set((state) => {
          const existing =
            state.genkiProgress[lessonId] ||
            createDefaultLessonProgress(lessonId, now);

          if (existing.completedSections.includes(sectionId)) {
            return state;
          }

          return {
            genkiProgress: {
              ...state.genkiProgress,
              [lessonId]: {
                ...existing,
                completedSections: [...existing.completedSections, sectionId],
                lastAccessedAt: now,
              },
            },
          };
        });
      },

      markAudioListened: (lessonId: string, trackId: string) => {
        const now = new Date().toISOString();
        set((state) => {
          const existing =
            state.genkiProgress[lessonId] ||
            createDefaultLessonProgress(lessonId, now);

          if (existing.audioTracksListened.includes(trackId)) {
            return state;
          }

          return {
            genkiProgress: {
              ...state.genkiProgress,
              [lessonId]: {
                ...existing,
                audioTracksListened: [...existing.audioTracksListened, trackId],
                lastAccessedAt: now,
              },
            },
          };
        });
      },

      markVocabularyMastered: (lessonId: string, vocabularyId: string) => {
        const now = new Date().toISOString();
        set((state) => {
          const existing =
            state.genkiProgress[lessonId] ||
            createDefaultLessonProgress(lessonId, now);

          if (existing.vocabularyMastered.includes(vocabularyId)) {
            return state;
          }

          return {
            genkiProgress: {
              ...state.genkiProgress,
              [lessonId]: {
                ...existing,
                vocabularyMastered: [...existing.vocabularyMastered, vocabularyId],
                lastAccessedAt: now,
              },
            },
          };
        });
      },

      getGenkiLessonProgress: (lessonId: string) => {
        return get().genkiProgress[lessonId];
      },

      getBookProgress: (book: GenkiBook): BookProgress => {
        const state = get();
        const lessonIds = getAllLessonIds(book);
        // Use Set for O(n) lookup instead of O(n*m) array.includes
        const lessonIdSet = new Set(lessonIds);
        const completedCount = state.completedLessons.filter((l) =>
          lessonIdSet.has(l.topicId)
        ).length;
        const totalLessons = GENKI_BOOKS[book].totalLessons;

        return {
          book,
          completedLessons: completedCount,
          totalLessons,
          percentComplete: Math.round((completedCount / totalLessons) * 100),
        };
      },

      isSectionCompleted: (lessonId: string, sectionId: string) => {
        const progress = get().genkiProgress[lessonId];
        return progress?.completedSections.includes(sectionId) || false;
      },

      // Quiz methods
      saveQuizScore: (score: Omit<QuizScore, 'completedAt'>) => {
        const now = new Date().toISOString();
        const fullScore: QuizScore = { ...score, completedAt: now };

        set((state) => {
          // Find existing score for this lesson/section
          const existingIndex = state.quizScores.findIndex(
            (s) => s.lessonId === score.lessonId && s.sectionId === score.sectionId
          );

          // Only save if it's a new high score or first attempt
          if (existingIndex >= 0) {
            const existing = state.quizScores[existingIndex];
            if (score.score <= existing.score) {
              // Not a high score, don't update
              return state;
            }
            // Replace with new high score
            const newScores = [...state.quizScores];
            newScores[existingIndex] = fullScore;
            return { quizScores: newScores };
          }

          // First attempt, add new score
          return { quizScores: [...state.quizScores, fullScore] };
        });
      },

      getBestScore: (lessonId: string, sectionId: string) => {
        const scores = get().quizScores;
        return scores.find(
          (s) => s.lessonId === lessonId && s.sectionId === sectionId
        ) || null;
      },
    }),
    {
      name: 'nihongo-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
