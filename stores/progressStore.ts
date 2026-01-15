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
    }),
    {
      name: 'nihongo-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
