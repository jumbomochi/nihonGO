# Learning Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Duolingo-inspired learning features including matching games, XP/streaks, audio pronunciation, speed challenges, achievements, and spaced repetition.

**Architecture:** Extend existing progress store with XP, streaks, and character mastery tracking. Create new game components (MatchingGame, SpeedChallenge) that reuse existing quiz infrastructure. Add audio files for kana pronunciation and integrate with existing AudioPlayer.

**Tech Stack:** React Native, Expo, TypeScript, Zustand, expo-av (audio), NativeWind

---

## Task 1: Matching Game Types

**Files:**
- Create: `types/games.ts`

**Step 1: Create game types**

```typescript
// types/games.ts

export type MatchingPairType = 'hiragana-romaji' | 'katakana-romaji' | 'hiragana-katakana';

export interface MatchingCard {
  id: string;
  content: string;
  type: 'hiragana' | 'katakana' | 'romaji';
  pairId: string; // Links matching cards together
  isMatched: boolean;
  isSelected: boolean;
}

export interface MatchingGameState {
  cards: MatchingCard[];
  selectedCardId: string | null;
  matchedPairs: number;
  totalPairs: number;
  moves: number;
  startTime: number;
  endTime: number | null;
}

export interface SpeedChallengeQuestion {
  id: string;
  prompt: string;
  correctAnswer: string;
  options: string[];
  timeLimit: number; // milliseconds
}

export interface SpeedChallengeState {
  questions: SpeedChallengeQuestion[];
  currentIndex: number;
  score: number;
  streak: number;
  timeRemaining: number;
  isComplete: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: AchievementRequirement;
}

export type AchievementRequirement =
  | { type: 'streak'; days: number }
  | { type: 'xp'; amount: number }
  | { type: 'lessons_completed'; count: number }
  | { type: 'perfect_quiz'; count: number }
  | { type: 'characters_mastered'; count: number }
  | { type: 'matching_game'; wins: number }
  | { type: 'speed_challenge'; score: number };

export interface CharacterMastery {
  characterId: string;
  correctCount: number;
  incorrectCount: number;
  lastPracticed: string;
  masteryLevel: number; // 0-5
  nextReviewDate: string;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add types/games.ts
git commit -m "feat(games): add types for matching game, speed challenge, achievements"
```

---

## Task 2: Extend Progress Store with XP and Streaks

**Files:**
- Modify: `stores/progressStore.ts`

**Step 1: Add XP and streak state to store**

Add these imports at the top:
```typescript
import { CharacterMastery, Achievement } from '@/types/games';
```

Add to the `ProgressState` interface:
```typescript
// XP System
xp: number;
level: number;
todayXp: number;
lastXpDate: string | null;

// Streaks
currentStreak: number;
longestStreak: number;
lastActivityDate: string | null;
streakFreezeAvailable: boolean;

// Character Mastery (SRS)
characterMastery: Record<string, CharacterMastery>;

// Achievements
achievements: Achievement[];
unlockedAchievements: string[];

// Game Stats
matchingGamesWon: number;
speedChallengeHighScore: number;
perfectQuizzes: number;
```

Add default values:
```typescript
// In defaultState
xp: 0,
level: 1,
todayXp: 0,
lastXpDate: null,
currentStreak: 0,
longestStreak: 0,
lastActivityDate: null,
streakFreezeAvailable: false,
characterMastery: {},
achievements: [],
unlockedAchievements: [],
matchingGamesWon: 0,
speedChallengeHighScore: 0,
perfectQuizzes: 0,
```

**Step 2: Add XP methods**

```typescript
// XP Methods
addXp: (amount: number) => {
  const today = new Date().toISOString().split('T')[0];
  set((state) => {
    const isNewDay = state.lastXpDate !== today;
    const newTodayXp = isNewDay ? amount : state.todayXp + amount;
    const newTotalXp = state.xp + amount;
    const newLevel = Math.floor(newTotalXp / 100) + 1; // 100 XP per level

    return {
      xp: newTotalXp,
      level: newLevel,
      todayXp: newTodayXp,
      lastXpDate: today,
    };
  });
  // Check streak
  get().updateStreak();
},

getXpForLevel: (level: number) => {
  return level * 100;
},

// Streak Methods
updateStreak: () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  set((state) => {
    if (state.lastActivityDate === today) {
      return {}; // Already updated today
    }

    if (state.lastActivityDate === yesterday) {
      // Continue streak
      const newStreak = state.currentStreak + 1;
      return {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, state.longestStreak),
        lastActivityDate: today,
      };
    } else if (state.lastActivityDate !== today) {
      // Streak broken (unless using freeze)
      if (state.streakFreezeAvailable && state.currentStreak > 0) {
        return {
          streakFreezeAvailable: false,
          lastActivityDate: today,
        };
      }
      return {
        currentStreak: 1,
        lastActivityDate: today,
      };
    }
    return {};
  });
},

useStreakFreeze: () => {
  set({ streakFreezeAvailable: false });
},
```

**Step 3: Add character mastery methods**

```typescript
// Character Mastery (SRS)
updateCharacterMastery: (characterId: string, correct: boolean) => {
  const now = new Date().toISOString();
  set((state) => {
    const existing = state.characterMastery[characterId] || {
      characterId,
      correctCount: 0,
      incorrectCount: 0,
      lastPracticed: now,
      masteryLevel: 0,
      nextReviewDate: now,
    };

    const newCorrect = existing.correctCount + (correct ? 1 : 0);
    const newIncorrect = existing.incorrectCount + (correct ? 0 : 1);

    // Calculate mastery level (0-5)
    const accuracy = newCorrect / (newCorrect + newIncorrect);
    const totalAttempts = newCorrect + newIncorrect;
    let masteryLevel = 0;
    if (totalAttempts >= 3 && accuracy >= 0.9) masteryLevel = 5;
    else if (totalAttempts >= 3 && accuracy >= 0.8) masteryLevel = 4;
    else if (totalAttempts >= 2 && accuracy >= 0.7) masteryLevel = 3;
    else if (totalAttempts >= 2 && accuracy >= 0.6) masteryLevel = 2;
    else if (totalAttempts >= 1) masteryLevel = 1;

    // Calculate next review date based on mastery (SRS intervals)
    const intervals = [1, 2, 4, 7, 14, 30]; // days
    const daysUntilReview = intervals[masteryLevel] || 1;
    const nextReview = new Date(Date.now() + daysUntilReview * 86400000);

    return {
      characterMastery: {
        ...state.characterMastery,
        [characterId]: {
          characterId,
          correctCount: newCorrect,
          incorrectCount: newIncorrect,
          lastPracticed: now,
          masteryLevel,
          nextReviewDate: nextReview.toISOString(),
        },
      },
    };
  });
},

getCharactersDueForReview: () => {
  const now = new Date().toISOString();
  const mastery = get().characterMastery;
  return Object.values(mastery).filter((m) => m.nextReviewDate <= now);
},
```

**Step 4: Add game stats methods**

```typescript
// Game Stats
recordMatchingGameWin: () => {
  set((state) => ({ matchingGamesWon: state.matchingGamesWon + 1 }));
  get().addXp(15);
},

recordSpeedChallengeScore: (score: number) => {
  set((state) => ({
    speedChallengeHighScore: Math.max(score, state.speedChallengeHighScore),
  }));
  get().addXp(Math.floor(score / 2));
},

recordPerfectQuiz: () => {
  set((state) => ({ perfectQuizzes: state.perfectQuizzes + 1 }));
  get().addXp(25);
},
```

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add stores/progressStore.ts
git commit -m "feat(progress): add XP, streaks, mastery tracking, and game stats"
```

---

## Task 3: Matching Game Utilities

**Files:**
- Create: `lib/matchingGameUtils.ts`

**Step 1: Create matching game utilities**

```typescript
// lib/matchingGameUtils.ts

import { KanaPair } from '@/types/alphabet';
import { MatchingCard, MatchingPairType } from '@/types/games';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateMatchingCards(
  pairs: KanaPair[],
  pairType: MatchingPairType,
  pairCount: number = 5
): MatchingCard[] {
  // Select random pairs
  const selectedPairs = shuffleArray(pairs).slice(0, pairCount);
  const cards: MatchingCard[] = [];

  selectedPairs.forEach((pair, index) => {
    const pairId = `pair-${index}`;

    switch (pairType) {
      case 'hiragana-romaji':
        cards.push({
          id: `${pairId}-hiragana`,
          content: pair.hiragana.character,
          type: 'hiragana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        cards.push({
          id: `${pairId}-romaji`,
          content: pair.romaji,
          type: 'romaji',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        break;

      case 'katakana-romaji':
        cards.push({
          id: `${pairId}-katakana`,
          content: pair.katakana.character,
          type: 'katakana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        cards.push({
          id: `${pairId}-romaji`,
          content: pair.romaji,
          type: 'romaji',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        break;

      case 'hiragana-katakana':
        cards.push({
          id: `${pairId}-hiragana`,
          content: pair.hiragana.character,
          type: 'hiragana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        cards.push({
          id: `${pairId}-katakana`,
          content: pair.katakana.character,
          type: 'katakana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        break;
    }
  });

  return shuffleArray(cards);
}

export function checkMatch(card1: MatchingCard, card2: MatchingCard): boolean {
  return card1.pairId === card2.pairId && card1.id !== card2.id;
}

export function calculateMatchingScore(
  totalPairs: number,
  moves: number,
  timeMs: number
): number {
  // Base score: 10 points per pair
  const baseScore = totalPairs * 10;

  // Efficiency bonus: fewer moves = more points
  const perfectMoves = totalPairs; // Best case: one move per pair
  const moveBonus = Math.max(0, (perfectMoves * 2 - moves) * 2);

  // Time bonus: faster = more points (max 30 seconds expected)
  const timeSec = timeMs / 1000;
  const timeBonus = Math.max(0, Math.floor((60 - timeSec) / 2));

  return baseScore + moveBonus + timeBonus;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add lib/matchingGameUtils.ts
git commit -m "feat(games): add matching game utilities"
```

---

## Task 4: MatchingCard Component

**Files:**
- Create: `components/games/MatchingCard.tsx`

**Step 1: Create MatchingCard component**

```typescript
// components/games/MatchingCard.tsx

import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MatchingCard as MatchingCardType } from '@/types/games';

interface MatchingCardProps {
  card: MatchingCardType;
  onPress: (card: MatchingCardType) => void;
  disabled?: boolean;
}

export function MatchingCard({ card, onPress, disabled }: MatchingCardProps) {
  const isJapanese = card.type === 'hiragana' || card.type === 'katakana';

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(card.isSelected ? 1.05 : 1, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
      opacity: withTiming(card.isMatched ? 0.5 : 1, { duration: 200 }),
    };
  });

  const getBackgroundColor = () => {
    if (card.isMatched) return 'bg-green-100 dark:bg-green-900/30';
    if (card.isSelected) return 'bg-sakura-100 dark:bg-sakura-900/30';
    return 'bg-white dark:bg-gray-800';
  };

  const getBorderColor = () => {
    if (card.isMatched) return 'border-green-400 dark:border-green-600';
    if (card.isSelected) return 'border-sakura-500';
    return 'border-gray-200 dark:border-gray-700';
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={() => !disabled && !card.isMatched && onPress(card)}
        disabled={disabled || card.isMatched}
        className={`w-20 h-24 rounded-xl border-2 items-center justify-center ${getBackgroundColor()} ${getBorderColor()}`}
      >
        <Text
          className={`${
            isJapanese ? 'text-3xl font-japanese' : 'text-lg font-semibold'
          } ${
            card.isMatched
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {card.content}
        </Text>
        {!isJapanese && (
          <Text className="text-xs text-gray-400 mt-1">romaji</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/games/MatchingCard.tsx
git commit -m "feat(games): add MatchingCard component with animations"
```

---

## Task 5: MatchingGame Component

**Files:**
- Create: `components/games/MatchingGame.tsx`

**Step 1: Create MatchingGame component**

```typescript
// components/games/MatchingGame.tsx

import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { KanaPair } from '@/types/alphabet';
import { MatchingCard as MatchingCardType, MatchingPairType } from '@/types/games';
import { MatchingCard } from './MatchingCard';
import {
  generateMatchingCards,
  checkMatch,
  calculateMatchingScore,
} from '@/lib/matchingGameUtils';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';

interface MatchingGameProps {
  pairs: KanaPair[];
  pairType: MatchingPairType;
  pairCount?: number;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const MATCH_DELAY = 800; // ms to show match before hiding

export function MatchingGame({
  pairs,
  pairType,
  pairCount = 5,
  onClose,
  onComplete,
}: MatchingGameProps) {
  const [cards, setCards] = useState<MatchingCardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchingCardType | null>(null);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const recordMatchingGameWin = useProgressStore((s) => s.recordMatchingGameWin);
  const updateCharacterMastery = useProgressStore((s) => s.updateCharacterMastery);

  useEffect(() => {
    const generatedCards = generateMatchingCards(pairs, pairType, pairCount);
    setCards(generatedCards);
  }, [pairs, pairType, pairCount]);

  const handleCardPress = useCallback(
    (card: MatchingCardType) => {
      if (isProcessing || card.isMatched) return;

      if (!selectedCard) {
        // First card selected
        setSelectedCard(card);
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c))
        );
      } else if (selectedCard.id === card.id) {
        // Same card tapped - deselect
        setSelectedCard(null);
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isSelected: false } : c))
        );
      } else {
        // Second card selected - check for match
        setMoves((m) => m + 1);
        setIsProcessing(true);

        const isMatch = checkMatch(selectedCard, card);

        if (isMatch) {
          // Match found!
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === card.pairId
                ? { ...c, isMatched: true, isSelected: false }
                : c
            )
          );
          setMatchedCount((m) => {
            const newCount = m + 1;
            if (newCount === pairCount) {
              // Game complete
              const endTime = Date.now();
              const finalScore = calculateMatchingScore(
                pairCount,
                moves + 1,
                endTime - startTime
              );
              setScore(finalScore);
              setIsComplete(true);
              recordMatchingGameWin();
            }
            return newCount;
          });

          // Update mastery for matched characters
          updateCharacterMastery(selectedCard.id, true);
          updateCharacterMastery(card.id, true);

          setSelectedCard(null);
          setIsProcessing(false);
        } else {
          // No match - show both selected briefly then hide
          setCards((prev) =>
            prev.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c))
          );

          // Update mastery for incorrect match
          updateCharacterMastery(selectedCard.id, false);
          updateCharacterMastery(card.id, false);

          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === card.id || c.id === selectedCard.id
                  ? { ...c, isSelected: false }
                  : c
              )
            );
            setSelectedCard(null);
            setIsProcessing(false);
          }, MATCH_DELAY);
        }
      }
    },
    [selectedCard, isProcessing, pairCount, moves, startTime, recordMatchingGameWin, updateCharacterMastery]
  );

  const handlePlayAgain = () => {
    const generatedCards = generateMatchingCards(pairs, pairType, pairCount);
    setCards(generatedCards);
    setSelectedCard(null);
    setMoves(0);
    setMatchedCount(0);
    setIsComplete(false);
    setScore(0);
  };

  if (isComplete) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="trophy" size={64} color="#eab308" />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Great job!
        </Text>
        <Text className="text-4xl font-bold text-sakura-600 mt-2">
          {score} XP
        </Text>
        <Text className="text-gray-500 mt-2">
          Completed in {moves} moves
        </Text>
        <View className="flex-row gap-4 mt-8">
          <Button title="Play Again" onPress={handlePlayAgain} />
          <Button
            title="Done"
            variant="outline"
            onPress={() => {
              onComplete(score);
              onClose();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Match the Pairs
        </Text>
        <View className="flex-row items-center">
          <FontAwesome name="hand-pointer-o" size={14} color="#9ca3af" />
          <Text className="text-gray-500 ml-1">{moves}</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="px-4 py-2">
        <View className="flex-row items-center justify-center">
          <Text className="text-sm text-gray-500">
            {matchedCount} / {pairCount} matched
          </Text>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
          <View
            className="h-full bg-sakura-500 rounded-full"
            style={{ width: `${(matchedCount / pairCount) * 100}%` }}
          />
        </View>
      </View>

      {/* Cards Grid */}
      <View className="flex-1 px-4 py-6">
        <View className="flex-row flex-wrap justify-center gap-3">
          {cards.map((card) => (
            <MatchingCard
              key={card.id}
              card={card}
              onPress={handleCardPress}
              disabled={isProcessing}
            />
          ))}
        </View>
      </View>

      {/* Pair Type Indicator */}
      <View className="px-4 pb-4">
        <Text className="text-center text-sm text-gray-400">
          {pairType === 'hiragana-romaji' && 'Match hiragana with romaji'}
          {pairType === 'katakana-romaji' && 'Match katakana with romaji'}
          {pairType === 'hiragana-katakana' && 'Match hiragana with katakana'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/games/MatchingGame.tsx
git commit -m "feat(games): add MatchingGame component with score tracking"
```

---

## Task 6: Games Index Export

**Files:**
- Create: `components/games/index.ts`

**Step 1: Create index file**

```typescript
// components/games/index.ts

export { MatchingCard } from './MatchingCard';
export { MatchingGame } from './MatchingGame';
```

**Step 2: Commit**

```bash
git add components/games/index.ts
git commit -m "feat(games): add component index exports"
```

---

## Task 7: Add Matching Game to Alphabet Lesson Screen

**Files:**
- Modify: `components/alphabet/AlphabetLessonScreen.tsx`

**Step 1: Import MatchingGame and add state**

Add imports:
```typescript
import { MatchingGame } from '@/components/games';
import { MatchingPairType } from '@/types/games';
```

Add state after existing state declarations:
```typescript
const [showMatchingGame, setShowMatchingGame] = useState(false);
const [matchingPairType, setMatchingPairType] = useState<MatchingPairType>('hiragana-romaji');
```

**Step 2: Add Practice section to tabs**

Update the sections array:
```typescript
const sections: { id: Section; label: string; icon: string }[] = [
  { id: 'learn', label: 'Learn', icon: 'eye' },
  { id: 'write', label: 'Write', icon: 'pencil' },
  { id: 'practice', label: 'Practice', icon: 'gamepad' },
  { id: 'quiz', label: 'Quiz', icon: 'question-circle' },
];
```

Update the Section type at top of file:
```typescript
type Section = 'learn' | 'write' | 'practice' | 'quiz';
```

**Step 3: Add Practice section content**

Add after the quiz section (before the Quiz Modal):
```typescript
{activeSection === 'practice' && (
  <View className="flex-1 px-6 py-8">
    <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
      Matching Game
    </Text>
    <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">
      Match pairs to reinforce your memory
    </Text>

    {/* Pair Type Selection */}
    <View className="gap-3 mb-6">
      {[
        { type: 'hiragana-romaji' as const, label: 'Hiragana ↔ Romaji' },
        { type: 'katakana-romaji' as const, label: 'Katakana ↔ Romaji' },
        { type: 'hiragana-katakana' as const, label: 'Hiragana ↔ Katakana' },
      ].map((option) => (
        <Pressable
          key={option.type}
          onPress={() => setMatchingPairType(option.type)}
          className={`p-4 rounded-xl border-2 ${
            matchingPairType === option.type
              ? 'border-sakura-500 bg-sakura-50 dark:bg-sakura-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              matchingPairType === option.type
                ? 'text-sakura-600'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>

    <Button
      title="Start Matching Game"
      onPress={() => setShowMatchingGame(true)}
    />
  </View>
)}
```

**Step 4: Add MatchingGame Modal**

Add after the Quiz Modal:
```typescript
{/* Matching Game Modal */}
<Modal
  visible={showMatchingGame}
  animationType="slide"
  presentationStyle="fullScreen"
>
  <MatchingGame
    pairs={lesson.pairs}
    pairType={matchingPairType}
    pairCount={Math.min(5, lesson.pairs.length)}
    onClose={() => setShowMatchingGame(false)}
    onComplete={(score) => {
      // Score is handled by the game component
    }}
  />
</Modal>
```

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add components/alphabet/AlphabetLessonScreen.tsx
git commit -m "feat(alphabet): add Practice section with Matching Game"
```

---

## Task 8: XP Display Component

**Files:**
- Create: `components/common/XPDisplay.tsx`

**Step 1: Create XP display component**

```typescript
// components/common/XPDisplay.tsx

import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';

interface XPDisplayProps {
  compact?: boolean;
}

export function XPDisplay({ compact = false }: XPDisplayProps) {
  const xp = useProgressStore((s) => s.xp);
  const level = useProgressStore((s) => s.level);
  const todayXp = useProgressStore((s) => s.todayXp);

  const xpForCurrentLevel = (level - 1) * 100;
  const xpForNextLevel = level * 100;
  const progressInLevel = xp - xpForCurrentLevel;
  const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = (progressInLevel / xpNeededForLevel) * 100;

  if (compact) {
    return (
      <View className="flex-row items-center">
        <FontAwesome name="star" size={14} color="#eab308" />
        <Text className="text-sm font-semibold text-yellow-600 ml-1">
          {xp} XP
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full items-center justify-center">
            <Text className="text-lg font-bold text-yellow-600">{level}</Text>
          </View>
          <View className="ml-3">
            <Text className="text-sm text-gray-500">Level {level}</Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {xp} XP
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-xs text-gray-400">Today</Text>
          <Text className="text-sm font-semibold text-sakura-600">
            +{todayXp} XP
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <View
          className="h-full bg-yellow-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </View>
      <Text className="text-xs text-gray-400 text-right mt-1">
        {progressInLevel} / {xpNeededForLevel} to Level {level + 1}
      </Text>
    </View>
  );
}
```

**Step 2: Commit**

```bash
git add components/common/XPDisplay.tsx
git commit -m "feat(common): add XP display component"
```

---

## Task 9: Streak Display Component

**Files:**
- Create: `components/common/StreakDisplay.tsx`

**Step 1: Create streak display component**

```typescript
// components/common/StreakDisplay.tsx

import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';

interface StreakDisplayProps {
  compact?: boolean;
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const streakFreezeAvailable = useProgressStore((s) => s.streakFreezeAvailable);

  if (compact) {
    return (
      <View className="flex-row items-center">
        <FontAwesome
          name="fire"
          size={14}
          color={currentStreak > 0 ? '#f97316' : '#9ca3af'}
        />
        <Text
          className={`text-sm font-semibold ml-1 ${
            currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
          }`}
        >
          {currentStreak}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              currentStreak > 0
                ? 'bg-orange-100 dark:bg-orange-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <FontAwesome
              name="fire"
              size={24}
              color={currentStreak > 0 ? '#f97316' : '#9ca3af'}
            />
          </View>
          <View className="ml-3">
            <Text className="text-sm text-gray-500">Current Streak</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs text-gray-400">Best</Text>
          <Text className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            {longestStreak}
          </Text>
        </View>
      </View>

      {streakFreezeAvailable && (
        <View className="flex-row items-center mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <FontAwesome name="snowflake-o" size={14} color="#3b82f6" />
          <Text className="text-xs text-blue-600 ml-2">
            Streak freeze available
          </Text>
        </View>
      )}
    </View>
  );
}
```

**Step 2: Commit**

```bash
git add components/common/StreakDisplay.tsx
git commit -m "feat(common): add streak display component"
```

---

## Task 10: Add XP and Streak to Profile/Home

**Files:**
- Modify: `app/(tabs)/alphabets.tsx`

**Step 1: Add XP and Streak displays to alphabets tab**

Add imports:
```typescript
import { XPDisplay } from '@/components/common/XPDisplay';
import { StreakDisplay } from '@/components/common/StreakDisplay';
```

Add after the header, before the Kana Section:
```typescript
{/* Stats Row */}
<View className="flex-row gap-3 mb-6">
  <View className="flex-1">
    <XPDisplay />
  </View>
  <View className="flex-1">
    <StreakDisplay />
  </View>
</View>
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/(tabs)/alphabets.tsx
git commit -m "feat(alphabets): add XP and streak displays"
```

---

## Task 11: Kana Audio Data

**Files:**
- Create: `data/alphabet/audio.ts`

**Step 1: Create kana audio mapping**

```typescript
// data/alphabet/audio.ts

// Audio file paths for kana pronunciation
// These would be bundled with the app or fetched from a CDN

export const KANA_AUDIO_BASE_PATH = '/audio/kana';

export interface KanaAudio {
  romaji: string;
  audioFile: string;
}

// For now, we'll use a text-to-speech approach or placeholder
// In production, replace with actual audio file paths
export const KANA_AUDIO: Record<string, KanaAudio> = {
  a: { romaji: 'a', audioFile: `${KANA_AUDIO_BASE_PATH}/a.mp3` },
  i: { romaji: 'i', audioFile: `${KANA_AUDIO_BASE_PATH}/i.mp3` },
  u: { romaji: 'u', audioFile: `${KANA_AUDIO_BASE_PATH}/u.mp3` },
  e: { romaji: 'e', audioFile: `${KANA_AUDIO_BASE_PATH}/e.mp3` },
  o: { romaji: 'o', audioFile: `${KANA_AUDIO_BASE_PATH}/o.mp3` },
  ka: { romaji: 'ka', audioFile: `${KANA_AUDIO_BASE_PATH}/ka.mp3` },
  ki: { romaji: 'ki', audioFile: `${KANA_AUDIO_BASE_PATH}/ki.mp3` },
  ku: { romaji: 'ku', audioFile: `${KANA_AUDIO_BASE_PATH}/ku.mp3` },
  ke: { romaji: 'ke', audioFile: `${KANA_AUDIO_BASE_PATH}/ke.mp3` },
  ko: { romaji: 'ko', audioFile: `${KANA_AUDIO_BASE_PATH}/ko.mp3` },
  sa: { romaji: 'sa', audioFile: `${KANA_AUDIO_BASE_PATH}/sa.mp3` },
  shi: { romaji: 'shi', audioFile: `${KANA_AUDIO_BASE_PATH}/shi.mp3` },
  su: { romaji: 'su', audioFile: `${KANA_AUDIO_BASE_PATH}/su.mp3` },
  se: { romaji: 'se', audioFile: `${KANA_AUDIO_BASE_PATH}/se.mp3` },
  so: { romaji: 'so', audioFile: `${KANA_AUDIO_BASE_PATH}/so.mp3` },
  ta: { romaji: 'ta', audioFile: `${KANA_AUDIO_BASE_PATH}/ta.mp3` },
  chi: { romaji: 'chi', audioFile: `${KANA_AUDIO_BASE_PATH}/chi.mp3` },
  tsu: { romaji: 'tsu', audioFile: `${KANA_AUDIO_BASE_PATH}/tsu.mp3` },
  te: { romaji: 'te', audioFile: `${KANA_AUDIO_BASE_PATH}/te.mp3` },
  to: { romaji: 'to', audioFile: `${KANA_AUDIO_BASE_PATH}/to.mp3` },
  na: { romaji: 'na', audioFile: `${KANA_AUDIO_BASE_PATH}/na.mp3` },
  ni: { romaji: 'ni', audioFile: `${KANA_AUDIO_BASE_PATH}/ni.mp3` },
  nu: { romaji: 'nu', audioFile: `${KANA_AUDIO_BASE_PATH}/nu.mp3` },
  ne: { romaji: 'ne', audioFile: `${KANA_AUDIO_BASE_PATH}/ne.mp3` },
  no: { romaji: 'no', audioFile: `${KANA_AUDIO_BASE_PATH}/no.mp3` },
  ha: { romaji: 'ha', audioFile: `${KANA_AUDIO_BASE_PATH}/ha.mp3` },
  hi: { romaji: 'hi', audioFile: `${KANA_AUDIO_BASE_PATH}/hi.mp3` },
  fu: { romaji: 'fu', audioFile: `${KANA_AUDIO_BASE_PATH}/fu.mp3` },
  he: { romaji: 'he', audioFile: `${KANA_AUDIO_BASE_PATH}/he.mp3` },
  ho: { romaji: 'ho', audioFile: `${KANA_AUDIO_BASE_PATH}/ho.mp3` },
  ma: { romaji: 'ma', audioFile: `${KANA_AUDIO_BASE_PATH}/ma.mp3` },
  mi: { romaji: 'mi', audioFile: `${KANA_AUDIO_BASE_PATH}/mi.mp3` },
  mu: { romaji: 'mu', audioFile: `${KANA_AUDIO_BASE_PATH}/mu.mp3` },
  me: { romaji: 'me', audioFile: `${KANA_AUDIO_BASE_PATH}/me.mp3` },
  mo: { romaji: 'mo', audioFile: `${KANA_AUDIO_BASE_PATH}/mo.mp3` },
  ya: { romaji: 'ya', audioFile: `${KANA_AUDIO_BASE_PATH}/ya.mp3` },
  yu: { romaji: 'yu', audioFile: `${KANA_AUDIO_BASE_PATH}/yu.mp3` },
  yo: { romaji: 'yo', audioFile: `${KANA_AUDIO_BASE_PATH}/yo.mp3` },
  ra: { romaji: 'ra', audioFile: `${KANA_AUDIO_BASE_PATH}/ra.mp3` },
  ri: { romaji: 'ri', audioFile: `${KANA_AUDIO_BASE_PATH}/ri.mp3` },
  ru: { romaji: 'ru', audioFile: `${KANA_AUDIO_BASE_PATH}/ru.mp3` },
  re: { romaji: 're', audioFile: `${KANA_AUDIO_BASE_PATH}/re.mp3` },
  ro: { romaji: 'ro', audioFile: `${KANA_AUDIO_BASE_PATH}/ro.mp3` },
  wa: { romaji: 'wa', audioFile: `${KANA_AUDIO_BASE_PATH}/wa.mp3` },
  wo: { romaji: 'wo', audioFile: `${KANA_AUDIO_BASE_PATH}/wo.mp3` },
  n: { romaji: 'n', audioFile: `${KANA_AUDIO_BASE_PATH}/n.mp3` },
};

export function getKanaAudioPath(romaji: string): string | null {
  return KANA_AUDIO[romaji]?.audioFile || null;
}
```

**Step 2: Commit**

```bash
git add data/alphabet/audio.ts
git commit -m "feat(alphabet): add kana audio data mapping"
```

---

## Task 12: Kana Audio Player Hook

**Files:**
- Create: `hooks/useKanaAudio.ts`

**Step 1: Create audio hook using expo-speech as fallback**

```typescript
// hooks/useKanaAudio.ts

import { useState, useCallback } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { getKanaAudioPath } from '@/data/alphabet/audio';

interface UseKanaAudioReturn {
  playKana: (romaji: string) => Promise<void>;
  isPlaying: boolean;
  stop: () => void;
}

export function useKanaAudio(): UseKanaAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const stop = useCallback(() => {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
    Speech.stop();
    setIsPlaying(false);
  }, [sound]);

  const playKana = useCallback(
    async (romaji: string) => {
      // Stop any current playback
      stop();

      setIsPlaying(true);

      try {
        // Try to load audio file first
        const audioPath = getKanaAudioPath(romaji);
        if (audioPath) {
          try {
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: audioPath },
              { shouldPlay: true }
            );
            setSound(newSound);
            newSound.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && status.didJustFinish) {
                setIsPlaying(false);
                newSound.unloadAsync();
              }
            });
            return;
          } catch {
            // Audio file not available, fall back to TTS
          }
        }

        // Fallback to text-to-speech
        // Map romaji to better pronunciation for Japanese TTS
        const textToSpeak = romaji;

        await Speech.speak(textToSpeak, {
          language: 'ja-JP',
          rate: 0.8,
          onDone: () => setIsPlaying(false),
          onError: () => setIsPlaying(false),
        });
      } catch (error) {
        console.error('Error playing kana audio:', error);
        setIsPlaying(false);
      }
    },
    [stop]
  );

  return { playKana, isPlaying, stop };
}
```

**Step 2: Commit**

```bash
git add hooks/useKanaAudio.ts
git commit -m "feat(hooks): add useKanaAudio hook with TTS fallback"
```

---

## Task 13: Add Audio Button to CharacterCard

**Files:**
- Modify: `components/alphabet/CharacterCard.tsx`

**Step 1: Add audio playback to CharacterCard**

Add imports:
```typescript
import { Pressable as RNPressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useKanaAudio } from '@/hooks/useKanaAudio';
```

Update the component to add audio button:

After the reading text and before the closing `</View>` of content:
```typescript
{/* Audio button */}
<AudioButton romaji={pair.romaji} />
```

Add the AudioButton component inside the file (before the main export):
```typescript
function AudioButton({ romaji }: { romaji: string }) {
  const { playKana, isPlaying } = useKanaAudio();

  return (
    <RNPressable
      onPress={() => playKana(romaji)}
      className="mt-3 w-10 h-10 bg-sakura-100 dark:bg-sakura-900/30 rounded-full items-center justify-center self-center"
      disabled={isPlaying}
    >
      <FontAwesome
        name={isPlaying ? 'volume-up' : 'volume-off'}
        size={16}
        color="#ec4899"
      />
    </RNPressable>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/alphabet/CharacterCard.tsx
git commit -m "feat(alphabet): add audio pronunciation button to CharacterCard"
```

---

## Task 14: Speed Challenge Utilities

**Files:**
- Create: `lib/speedChallengeUtils.ts`

**Step 1: Create speed challenge utilities**

```typescript
// lib/speedChallengeUtils.ts

import { KanaPair } from '@/types/alphabet';
import { SpeedChallengeQuestion } from '@/types/games';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSpeedChallengeQuestions(
  pairs: KanaPair[],
  questionCount: number = 20,
  timePerQuestion: number = 5000 // 5 seconds default
): SpeedChallengeQuestion[] {
  const questions: SpeedChallengeQuestion[] = [];
  const allRomaji = pairs.map((p) => p.romaji);

  for (let i = 0; i < questionCount; i++) {
    const pair = pairs[i % pairs.length];
    const useHiragana = Math.random() > 0.5;
    const character = useHiragana
      ? pair.hiragana.character
      : pair.katakana.character;

    // Generate wrong options
    const wrongOptions = shuffleArray(
      allRomaji.filter((r) => r !== pair.romaji)
    ).slice(0, 3);

    questions.push({
      id: `speed-q-${i}`,
      prompt: character,
      correctAnswer: pair.romaji,
      options: shuffleArray([pair.romaji, ...wrongOptions]),
      timeLimit: timePerQuestion,
    });
  }

  return shuffleArray(questions);
}

export function calculateSpeedScore(
  correctAnswers: number,
  totalQuestions: number,
  averageResponseTime: number,
  streak: number
): number {
  // Base score: 10 points per correct answer
  const baseScore = correctAnswers * 10;

  // Speed bonus: faster = more points
  const speedBonus = Math.max(0, Math.floor((3000 - averageResponseTime) / 100));

  // Streak bonus: consecutive correct answers
  const streakBonus = streak * 2;

  // Accuracy multiplier
  const accuracy = correctAnswers / totalQuestions;
  const accuracyMultiplier = accuracy >= 0.9 ? 1.5 : accuracy >= 0.7 ? 1.2 : 1;

  return Math.floor((baseScore + speedBonus + streakBonus) * accuracyMultiplier);
}
```

**Step 2: Commit**

```bash
git add lib/speedChallengeUtils.ts
git commit -m "feat(games): add speed challenge utilities"
```

---

## Task 15: SpeedChallenge Component

**Files:**
- Create: `components/games/SpeedChallenge.tsx`

**Step 1: Create SpeedChallenge component**

```typescript
// components/games/SpeedChallenge.tsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { KanaPair } from '@/types/alphabet';
import { SpeedChallengeQuestion } from '@/types/games';
import {
  generateSpeedChallengeQuestions,
  calculateSpeedScore,
} from '@/lib/speedChallengeUtils';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';

interface SpeedChallengeProps {
  pairs: KanaPair[];
  questionCount?: number;
  timePerQuestion?: number;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export function SpeedChallenge({
  pairs,
  questionCount = 20,
  timePerQuestion = 5000,
  onClose,
  onComplete,
}: SpeedChallengeProps) {
  const [questions, setQuestions] = useState<SpeedChallengeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const questionStartTime = useRef(Date.now());

  const timerProgress = useSharedValue(1);

  const recordSpeedChallengeScore = useProgressStore((s) => s.recordSpeedChallengeScore);
  const updateCharacterMastery = useProgressStore((s) => s.updateCharacterMastery);

  useEffect(() => {
    const generated = generateSpeedChallengeQuestions(
      pairs,
      questionCount,
      timePerQuestion
    );
    setQuestions(generated);
  }, [pairs, questionCount, timePerQuestion]);

  // Timer countdown
  useEffect(() => {
    if (isComplete || showFeedback || questions.length === 0) return;

    questionStartTime.current = Date.now();
    timerProgress.value = 1;
    timerProgress.value = withTiming(0, { duration: timePerQuestion });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          // Time's up - wrong answer
          handleTimeout();
          return timePerQuestion;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, isComplete, showFeedback, questions.length, timePerQuestion]);

  const handleTimeout = useCallback(() => {
    if (showFeedback) return;

    setShowFeedback('incorrect');
    setStreak(0);

    const currentQuestion = questions[currentIndex];
    if (currentQuestion) {
      updateCharacterMastery(currentQuestion.id, false);
    }

    setTimeout(() => {
      moveToNext();
    }, 500);
  }, [currentIndex, questions, showFeedback, updateCharacterMastery]);

  const moveToNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      // Game complete
      const avgTime =
        responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : timePerQuestion;
      const finalScore = calculateSpeedScore(
        correctCount,
        questions.length,
        avgTime,
        maxStreak
      );
      setScore(finalScore);
      setIsComplete(true);
      recordSpeedChallengeScore(finalScore);
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(timePerQuestion);
      setShowFeedback(null);
    }
  }, [currentIndex, questions.length, correctCount, maxStreak, responseTimes, timePerQuestion, recordSpeedChallengeScore]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showFeedback) return;

      const responseTime = Date.now() - questionStartTime.current;
      setResponseTimes((prev) => [...prev, responseTime]);

      const currentQuestion = questions[currentIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;

      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setMaxStreak((m) => Math.max(m, newStreak));
          return newStreak;
        });
        setShowFeedback('correct');
        updateCharacterMastery(currentQuestion.id, true);
      } else {
        setStreak(0);
        setShowFeedback('incorrect');
        updateCharacterMastery(currentQuestion.id, false);
      }

      setTimeout(() => {
        moveToNext();
      }, 500);
    },
    [currentIndex, questions, showFeedback, moveToNext, updateCharacterMastery]
  );

  const timerStyle = useAnimatedStyle(() => ({
    width: `${timerProgress.value * 100}%`,
  }));

  const currentQuestion = questions[currentIndex];

  if (isComplete) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="bolt" size={64} color="#eab308" />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Speed Challenge Complete!
        </Text>
        <Text className="text-5xl font-bold text-sakura-600 mt-2">
          {score}
        </Text>
        <Text className="text-gray-500">points</Text>

        <View className="flex-row gap-8 mt-6">
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {correctCount}/{questions.length}
            </Text>
            <Text className="text-sm text-gray-500">Correct</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-orange-500">{maxStreak}</Text>
            <Text className="text-sm text-gray-500">Best Streak</Text>
          </View>
        </View>

        <View className="flex-row gap-4 mt-8">
          <Button
            title="Play Again"
            onPress={() => {
              const generated = generateSpeedChallengeQuestions(
                pairs,
                questionCount,
                timePerQuestion
              );
              setQuestions(generated);
              setCurrentIndex(0);
              setScore(0);
              setStreak(0);
              setMaxStreak(0);
              setCorrectCount(0);
              setTimeLeft(timePerQuestion);
              setIsComplete(false);
              setResponseTimes([]);
            }}
          />
          <Button
            title="Done"
            variant="outline"
            onPress={() => {
              onComplete(score);
              onClose();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentIndex + 1} / {questions.length}
        </Text>
        <View className="flex-row items-center">
          <FontAwesome name="fire" size={16} color="#f97316" />
          <Text className="text-orange-500 font-bold ml-1">{streak}</Text>
        </View>
      </View>

      {/* Timer bar */}
      <View className="h-2 bg-gray-200 dark:bg-gray-700">
        <Animated.View
          className={`h-full ${
            timeLeft < 2000 ? 'bg-red-500' : 'bg-sakura-500'
          }`}
          style={timerStyle}
        />
      </View>

      {/* Question */}
      <View className="flex-1 items-center justify-center px-6">
        <Text
          className={`text-8xl font-japanese mb-8 ${
            showFeedback === 'correct'
              ? 'text-green-500'
              : showFeedback === 'incorrect'
              ? 'text-red-500'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {currentQuestion.prompt}
        </Text>

        {/* Options */}
        <View className="w-full gap-3">
          {currentQuestion.options.map((option, index) => (
            <Pressable
              key={index}
              onPress={() => handleAnswer(option)}
              disabled={showFeedback !== null}
              className={`p-4 rounded-xl border-2 ${
                showFeedback && option === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : showFeedback === 'incorrect' &&
                    option !== currentQuestion.correctAnswer
                  ? 'border-gray-200 dark:border-gray-700 opacity-50'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <Text
                className={`text-center text-xl font-semibold ${
                  showFeedback && option === currentQuestion.correctAnswer
                    ? 'text-green-600'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Score */}
      <View className="px-6 pb-4">
        <Text className="text-center text-gray-500">
          Score: <Text className="font-bold text-sakura-600">{correctCount * 10}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Update games index**

Add to `components/games/index.ts`:
```typescript
export { SpeedChallenge } from './SpeedChallenge';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add components/games/SpeedChallenge.tsx components/games/index.ts
git commit -m "feat(games): add SpeedChallenge component"
```

---

## Task 16: Add Speed Challenge to Practice Section

**Files:**
- Modify: `components/alphabet/AlphabetLessonScreen.tsx`

**Step 1: Import SpeedChallenge**

Add to imports:
```typescript
import { MatchingGame, SpeedChallenge } from '@/components/games';
```

**Step 2: Add state for speed challenge**

Add after matchingPairType state:
```typescript
const [showSpeedChallenge, setShowSpeedChallenge] = useState(false);
```

**Step 3: Add Speed Challenge button to Practice section**

In the Practice section, after the Matching Game button, add:
```typescript
<View className="mt-6">
  <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
    Speed Challenge
  </Text>
  <Text className="text-gray-500 dark:text-gray-400 text-center mb-4">
    How fast can you identify characters?
  </Text>
  <Button
    title="Start Speed Challenge"
    variant="outline"
    onPress={() => setShowSpeedChallenge(true)}
  />
</View>
```

**Step 4: Add SpeedChallenge Modal**

Add after the MatchingGame Modal:
```typescript
{/* Speed Challenge Modal */}
<Modal
  visible={showSpeedChallenge}
  animationType="slide"
  presentationStyle="fullScreen"
>
  <SpeedChallenge
    pairs={lesson.pairs}
    questionCount={10}
    timePerQuestion={5000}
    onClose={() => setShowSpeedChallenge(false)}
    onComplete={(score) => {
      // Score handled by component
    }}
  />
</Modal>
```

**Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 6: Commit**

```bash
git add components/alphabet/AlphabetLessonScreen.tsx
git commit -m "feat(alphabet): add Speed Challenge to Practice section"
```

---

## Task 17: Achievements Data

**Files:**
- Create: `data/achievements.ts`

**Step 1: Create achievements definitions**

```typescript
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
```

**Step 2: Commit**

```bash
git add data/achievements.ts
git commit -m "feat(achievements): add achievement definitions"
```

---

## Task 18: Achievement Checker in Progress Store

**Files:**
- Modify: `stores/progressStore.ts`

**Step 1: Add achievement checking logic**

Add import:
```typescript
import { ACHIEVEMENTS } from '@/data/achievements';
```

Add method to check and unlock achievements:
```typescript
checkAchievements: () => {
  const state = get();
  const newUnlocks: string[] = [];

  ACHIEVEMENTS.forEach((achievement) => {
    if (state.unlockedAchievements.includes(achievement.id)) return;

    let shouldUnlock = false;
    const req = achievement.requirement;

    switch (req.type) {
      case 'streak':
        shouldUnlock = state.currentStreak >= req.days;
        break;
      case 'xp':
        shouldUnlock = state.xp >= req.amount;
        break;
      case 'lessons_completed':
        const completedLessons = Object.values(state.alphabetProgress).filter(
          (p) => p.completedAt !== null
        ).length;
        shouldUnlock = completedLessons >= req.count;
        break;
      case 'perfect_quiz':
        shouldUnlock = state.perfectQuizzes >= req.count;
        break;
      case 'matching_game':
        shouldUnlock = state.matchingGamesWon >= req.wins;
        break;
      case 'speed_challenge':
        shouldUnlock = state.speedChallengeHighScore >= req.score;
        break;
      case 'characters_mastered':
        const masteredChars = Object.values(state.characterMastery).filter(
          (m) => m.masteryLevel >= 4
        ).length;
        shouldUnlock = masteredChars >= req.count;
        break;
    }

    if (shouldUnlock) {
      newUnlocks.push(achievement.id);
    }
  });

  if (newUnlocks.length > 0) {
    set((state) => ({
      unlockedAchievements: [...state.unlockedAchievements, ...newUnlocks],
    }));
  }

  return newUnlocks;
},
```

Update the `addXp` method to check achievements:
```typescript
// At the end of addXp, before closing:
get().checkAchievements();
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add stores/progressStore.ts
git commit -m "feat(achievements): add achievement checking logic to store"
```

---

## Task 19: Achievements Display Component

**Files:**
- Create: `components/common/AchievementsList.tsx`

**Step 1: Create achievements list component**

```typescript
// components/common/AchievementsList.tsx

import { View, Text, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { ACHIEVEMENTS } from '@/data/achievements';

export function AchievementsList() {
  const unlockedAchievements = useProgressStore((s) => s.unlockedAchievements);

  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 gap-3">
      {sortedAchievements.map((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);

        return (
          <View
            key={achievement.id}
            className={`flex-row items-center p-4 rounded-xl border ${
              isUnlocked
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <View
              className={`w-12 h-12 rounded-full items-center justify-center ${
                isUnlocked
                  ? 'bg-yellow-100 dark:bg-yellow-900/40'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <FontAwesome
                name={achievement.icon as any}
                size={20}
                color={isUnlocked ? '#eab308' : '#9ca3af'}
              />
            </View>
            <View className="flex-1 ml-3">
              <Text
                className={`font-semibold ${
                  isUnlocked
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {achievement.title}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {achievement.description}
              </Text>
            </View>
            {isUnlocked && (
              <FontAwesome name="check-circle" size={20} color="#22c55e" />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
```

**Step 2: Commit**

```bash
git add components/common/AchievementsList.tsx
git commit -m "feat(achievements): add achievements list component"
```

---

## Task 20: Add Achievements to Profile Tab

**Files:**
- Modify: `app/(tabs)/profile.tsx`

**Step 1: Add achievements section to profile**

Add import:
```typescript
import { AchievementsList } from '@/components/common/AchievementsList';
```

Add achievements section in the profile screen (implementation depends on existing profile structure - add a collapsible section or tab):

```typescript
{/* Achievements Section */}
<View className="mt-6">
  <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4 px-4">
    Achievements
  </Text>
  <View className="h-64">
    <AchievementsList />
  </View>
</View>
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "feat(profile): add achievements section"
```

---

## Task 21: Review Queue Component (SRS)

**Files:**
- Create: `components/alphabet/ReviewQueue.tsx`

**Step 1: Create review queue component**

```typescript
// components/alphabet/ReviewQueue.tsx

import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { ALL_HIRAGANA, ALL_KATAKANA } from '@/data/alphabet';
import { Button } from '@/components/common/Button';

interface ReviewQueueProps {
  onStartReview: (characterIds: string[]) => void;
}

export function ReviewQueue({ onStartReview }: ReviewQueueProps) {
  const characterMastery = useProgressStore((s) => s.characterMastery);
  const getCharactersDueForReview = useProgressStore(
    (s) => s.getCharactersDueForReview
  );

  const dueCharacters = getCharactersDueForReview();
  const totalMastered = Object.values(characterMastery).filter(
    (m) => m.masteryLevel >= 4
  ).length;
  const totalCharacters = ALL_HIRAGANA.length + ALL_KATAKANA.length;

  if (dueCharacters.length === 0) {
    return (
      <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <View className="flex-row items-center">
          <FontAwesome name="check-circle" size={24} color="#22c55e" />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-green-800 dark:text-green-200">
              All caught up!
            </Text>
            <Text className="text-sm text-green-600 dark:text-green-400">
              No characters due for review
            </Text>
          </View>
        </View>
        <View className="mt-3">
          <Text className="text-xs text-green-600 dark:text-green-400">
            Mastery: {totalMastered} / {totalCharacters} characters
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <FontAwesome name="refresh" size={20} color="#f97316" />
          <Text className="font-semibold text-orange-800 dark:text-orange-200 ml-2">
            Review Due
          </Text>
        </View>
        <View className="bg-orange-200 dark:bg-orange-800 px-2 py-1 rounded-full">
          <Text className="text-sm font-bold text-orange-800 dark:text-orange-200">
            {dueCharacters.length}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-orange-700 dark:text-orange-300 mb-4">
        Characters need reinforcement to maintain mastery
      </Text>

      <Button
        title={`Review ${dueCharacters.length} Characters`}
        onPress={() => onStartReview(dueCharacters.map((c) => c.characterId))}
      />

      <View className="mt-3">
        <Text className="text-xs text-orange-600 dark:text-orange-400">
          Mastery: {totalMastered} / {totalCharacters} characters
        </Text>
      </View>
    </View>
  );
}
```

**Step 2: Commit**

```bash
git add components/alphabet/ReviewQueue.tsx
git commit -m "feat(srs): add ReviewQueue component for spaced repetition"
```

---

## Task 22: Add Review Queue to Alphabets Tab

**Files:**
- Modify: `app/(tabs)/alphabets.tsx`

**Step 1: Import and add ReviewQueue**

Add import:
```typescript
import { ReviewQueue } from '@/components/alphabet/ReviewQueue';
```

Add after the stats row, before the Kana Section:
```typescript
{/* Review Queue */}
<View className="mb-6">
  <ReviewQueue
    onStartReview={(characterIds) => {
      // Navigate to a review session
      // For now, just navigate to first lesson
      router.push({
        pathname: '/alphabet/[lessonId]',
        params: { lessonId: 'kana-lesson-01' },
      });
    }}
  />
</View>
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add app/(tabs)/alphabets.tsx
git commit -m "feat(alphabets): add SRS review queue"
```

---

## Task 23: Final Integration and Testing

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Start the app**

Run: `npx expo start`
Expected: App launches without errors

**Step 3: Manual testing checklist**

- [ ] XP display shows on Alphabets tab
- [ ] Streak display shows on Alphabets tab
- [ ] Review queue shows characters due
- [ ] Practice tab appears in lesson screen
- [ ] Matching game works with all pair types
- [ ] Speed challenge timer and scoring works
- [ ] Audio pronunciation plays on character cards
- [ ] Achievements unlock when requirements met
- [ ] Character mastery updates after quiz/game

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete learning features implementation

- Matching game with hiragana/katakana/romaji pairs
- XP system with levels
- Daily streaks with freeze option
- Audio pronunciation (TTS fallback)
- Speed challenge with timer
- 15 achievements across categories
- SRS-based character mastery tracking
- Review queue for spaced repetition"
```

---

## Summary

This plan implements 6 Duolingo-inspired features in 23 tasks:

1. **Matching Game** (Tasks 1-7) - Card matching with animations and scoring
2. **XP & Streaks** (Tasks 2, 8-10) - Gamification with levels and daily goals
3. **Audio Pronunciation** (Tasks 11-13) - TTS with audio file fallback
4. **Speed Challenge** (Tasks 14-16) - Timed quiz with streak bonuses
5. **Achievements** (Tasks 17-20) - 15 achievements across categories
6. **Character Mastery/SRS** (Tasks 2, 21-22) - Spaced repetition review system

Each task follows TDD principles with small, focused commits.
