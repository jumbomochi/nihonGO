// data/achievements.ts

import { Achievement } from '@/types/games';

export const ACHIEVEMENTS: Achievement[] = [
  // Streak achievements
  {
    id: 'streak-3',
    title: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: 'fire',
    unlockedAt: null,
    requirement: { type: 'streak', days: 3 },
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'fire',
    unlockedAt: null,
    requirement: { type: 'streak', days: 7 },
  },
  {
    id: 'streak-30',
    title: 'Dedicated Learner',
    description: 'Maintain a 30-day streak',
    icon: 'fire',
    unlockedAt: null,
    requirement: { type: 'streak', days: 30 },
  },

  // XP achievements
  {
    id: 'xp-100',
    title: 'First Steps',
    description: 'Earn 100 XP',
    icon: 'star',
    unlockedAt: null,
    requirement: { type: 'xp', amount: 100 },
  },
  {
    id: 'xp-500',
    title: 'Rising Star',
    description: 'Earn 500 XP',
    icon: 'star',
    unlockedAt: null,
    requirement: { type: 'xp', amount: 500 },
  },
  {
    id: 'xp-1000',
    title: 'XP Champion',
    description: 'Earn 1000 XP',
    icon: 'trophy',
    unlockedAt: null,
    requirement: { type: 'xp', amount: 1000 },
  },

  // Lesson achievements
  {
    id: 'lessons-1',
    title: 'First Lesson',
    description: 'Complete your first lesson',
    icon: 'book',
    unlockedAt: null,
    requirement: { type: 'lessons_completed', count: 1 },
  },
  {
    id: 'lessons-5',
    title: 'Halfway There',
    description: 'Complete 5 lessons',
    icon: 'book',
    unlockedAt: null,
    requirement: { type: 'lessons_completed', count: 5 },
  },
  {
    id: 'lessons-10',
    title: 'Kana Master',
    description: 'Complete all 10 kana lessons',
    icon: 'graduation-cap',
    unlockedAt: null,
    requirement: { type: 'lessons_completed', count: 10 },
  },

  // Quiz achievements
  {
    id: 'perfect-1',
    title: 'Perfect Score',
    description: 'Get a perfect score on a quiz',
    icon: 'check-circle',
    unlockedAt: null,
    requirement: { type: 'perfect_quiz', count: 1 },
  },
  {
    id: 'perfect-5',
    title: 'Perfectionist',
    description: 'Get 5 perfect quiz scores',
    icon: 'check-circle',
    unlockedAt: null,
    requirement: { type: 'perfect_quiz', count: 5 },
  },

  // Game achievements
  {
    id: 'matching-5',
    title: 'Match Maker',
    description: 'Win 5 matching games',
    icon: 'th',
    unlockedAt: null,
    requirement: { type: 'matching_game', wins: 5 },
  },
  {
    id: 'speed-100',
    title: 'Speed Demon',
    description: 'Score 100+ in Speed Challenge',
    icon: 'bolt',
    unlockedAt: null,
    requirement: { type: 'speed_challenge', score: 100 },
  },

  // Mastery achievements
  {
    id: 'mastery-10',
    title: 'Building Foundation',
    description: 'Master 10 characters',
    icon: 'diamond',
    unlockedAt: null,
    requirement: { type: 'characters_mastered', count: 10 },
  },
  {
    id: 'mastery-46',
    title: 'Hiragana Hero',
    description: 'Master all 46 basic characters',
    icon: 'diamond',
    unlockedAt: null,
    requirement: { type: 'characters_mastered', count: 46 },
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
