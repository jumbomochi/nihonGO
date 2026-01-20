# Practice Exercises and Quiz System

**GitHub Issue:** #3
**Date:** 2026-01-21
**Status:** Approved

## Overview

Add vocabulary quizzes that appear after completing lesson vocabulary sections. MVP focuses on multiple-choice matching (JP→EN, EN→JP) with 10 questions per session.

## Quiz Flow

### Trigger
After viewing a vocabulary section in a Genki lesson, a "Ready to Practice?" prompt slides up. User can start quiz or skip.

### Session
1. System selects 10 vocabulary items from current section
2. Each question is multiple choice with 4 options
3. Question types alternate: 5 JP→EN, 5 EN→JP
4. User taps answer, immediate feedback (green/red flash)
5. Auto-advance after 1 second
6. Results screen after 10 questions

### Results
- Large score display: "8/10"
- Message based on score (≥8: "Great job!", ≥5: "Good effort!", <5: "Keep practicing!")
- Buttons: "Try Again" and "Continue"
- Best score saved to progressStore

## Architecture

### New Files

| File | Purpose |
|------|---------|
| `components/practice/VocabQuiz.tsx` | Main quiz component |
| `components/practice/QuizPrompt.tsx` | Bottom sheet prompt |
| `components/practice/QuizResults.tsx` | Score display screen |
| `components/practice/QuizOption.tsx` | Answer button with feedback |
| `lib/quizUtils.ts` | Question generation utilities |

### Data Flow

```
VocabularyList (user finishes viewing)
         ↓
QuizPrompt appears
         ↓
VocabQuiz receives vocabulary[]
         ↓
User answers 10 questions
         ↓
QuizResults shows score
         ↓
progressStore.saveQuizScore()
```

## Types

### Quiz Question

```typescript
// lib/quizUtils.ts
interface QuizQuestion {
  id: string;
  type: 'jp-to-en' | 'en-to-jp';
  prompt: string;
  correctAnswer: string;
  options: string[];  // 4 shuffled options
}

function generateVocabQuiz(vocab: VocabularyItem[], count: number): QuizQuestion[];
```

### Progress Tracking

```typescript
// stores/progressStore.ts additions
interface QuizScore {
  lessonId: string;
  sectionId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

// New state and actions:
quizScores: QuizScore[];
saveQuizScore: (score: QuizScore) => void;
getBestScore: (lessonId: string, sectionId: string) => QuizScore | null;
```

## Integration

### VocabularyList.tsx
Add `onViewComplete` callback prop that fires when user scrolls to bottom.

### GenkiLessonScreen
- Track `showQuizPrompt` and `quizVocabulary` state
- Show QuizPrompt when vocabulary section's onViewComplete fires
- Render VocabQuiz as modal/overlay when quiz starts

### Section Tab Badges
After quiz completion, show badge on vocabulary tab:
- ≥8/10: Green checkmark
- 5-7/10: Yellow dot
- <5/10: No badge

## Out of Scope (Future)

- Grammar exercises (fill-in-blank)
- Audio recognition quizzes
- Spaced repetition system
- Detailed wrong answer explanations

## Implementation Order

1. Create `lib/quizUtils.ts` with question generation
2. Add QuizScore types and actions to progressStore
3. Create QuizOption component
4. Create QuizResults component
5. Create VocabQuiz component
6. Create QuizPrompt component
7. Add onViewComplete to VocabularyList
8. Integrate quiz flow in GenkiLessonScreen
9. Add section tab badges
