import { ProficiencyLevel, LearningStyle } from '@/stores/userStore';

/**
 * Human-readable labels for proficiency levels
 */
export const PROFICIENCY_LABELS: Record<ProficiencyLevel, string> = {
  complete_beginner: 'Complete Beginner',
  beginner: 'Beginner',
  elementary: 'Elementary',
  intermediate: 'Intermediate',
};

/**
 * Human-readable labels for learning styles
 */
export const STYLE_LABELS: Record<LearningStyle, string> = {
  detailed: 'Detailed Study',
  conversational: 'Conversational',
};

/**
 * Descriptions for learning styles
 */
export const STYLE_DESCRIPTIONS: Record<LearningStyle, string> = {
  detailed: 'In-depth explanations with cultural context',
  conversational: 'Quick, practical learning through dialogue',
};

/**
 * Common learning goals
 */
export const LEARNING_GOALS = [
  { id: 'travel', label: 'Travel', icon: 'plane' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'anime', label: 'Anime & Manga', icon: 'tv' },
  { id: 'culture', label: 'Culture', icon: 'globe' },
  { id: 'jlpt', label: 'JLPT', icon: 'certificate' },
  { id: 'conversation', label: 'Conversation', icon: 'comments' },
] as const;
