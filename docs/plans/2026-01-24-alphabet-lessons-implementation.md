# Alphabet Lessons Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add hiragana and katakana lessons organized by sound rows, with character display, writing practice, and recognition quizzes.

**Architecture:** Data-driven lessons stored in `/data/alphabet/`, displayed via reusable components. Each lesson shows characters side-by-side (あ/ア), supports drawing practice with a canvas, and includes multiple-choice quizzes. Progress tracked in existing Zustand store.

**Tech Stack:** React Native, Expo Router, TypeScript, NativeWind, Zustand, react-native-svg

---

## Task 1: Type Definitions

**Files:**
- Create: `types/alphabet.ts`

**Step 1: Create type definitions file**

```typescript
// types/alphabet.ts

export type KanaType = 'hiragana' | 'katakana';
export type KanaRow = 'a' | 'ka' | 'sa' | 'ta' | 'na' | 'ha' | 'ma' | 'ya' | 'ra' | 'wa';

export interface KanaCharacter {
  id: string;
  character: string;
  type: KanaType;
  romaji: string;
  row: KanaRow;
  strokeCount: number;
  strokeOrder: string[]; // SVG path data for each stroke
}

export interface KanaPair {
  romaji: string;
  hiragana: KanaCharacter;
  katakana: KanaCharacter;
}

export interface AlphabetLesson {
  id: string;
  type: 'kana' | 'kanji';
  lessonNumber: number;
  title: string;
  titleJapanese: string;
  row: KanaRow;
  pairs: KanaPair[];
}

export interface AlphabetProgress {
  lessonId: string;
  learnCompleted: boolean;
  writeCompleted: boolean;
  quizBestScore: number | null;
  quizTotalQuestions: number | null;
  completedAt: string | null;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add types/alphabet.ts
git commit -m "feat(alphabet): add type definitions for kana characters and lessons"
```

---

## Task 2: Kana Character Data (あ-row)

**Files:**
- Create: `data/alphabet/kana/characters.ts`

**Step 1: Create character data for あ-row**

```typescript
// data/alphabet/kana/characters.ts

import { KanaCharacter, KanaRow } from '@/types/alphabet';

// Helper to create character with consistent structure
function createKana(
  char: string,
  type: 'hiragana' | 'katakana',
  romaji: string,
  row: KanaRow,
  strokeCount: number
): KanaCharacter {
  return {
    id: `${type}-${romaji}`,
    character: char,
    type,
    romaji,
    row,
    strokeCount,
    strokeOrder: [], // SVG paths to be added later
  };
}

// あ-row (a, i, u, e, o)
export const HIRAGANA_A_ROW: KanaCharacter[] = [
  createKana('あ', 'hiragana', 'a', 'a', 3),
  createKana('い', 'hiragana', 'i', 'a', 2),
  createKana('う', 'hiragana', 'u', 'a', 2),
  createKana('え', 'hiragana', 'e', 'a', 2),
  createKana('お', 'hiragana', 'o', 'a', 3),
];

export const KATAKANA_A_ROW: KanaCharacter[] = [
  createKana('ア', 'katakana', 'a', 'a', 2),
  createKana('イ', 'katakana', 'i', 'a', 2),
  createKana('ウ', 'katakana', 'u', 'a', 3),
  createKana('エ', 'katakana', 'e', 'a', 3),
  createKana('オ', 'katakana', 'o', 'a', 3),
];

// か-row (ka, ki, ku, ke, ko)
export const HIRAGANA_KA_ROW: KanaCharacter[] = [
  createKana('か', 'hiragana', 'ka', 'ka', 3),
  createKana('き', 'hiragana', 'ki', 'ka', 4),
  createKana('く', 'hiragana', 'ku', 'ka', 1),
  createKana('け', 'hiragana', 'ke', 'ka', 3),
  createKana('こ', 'hiragana', 'ko', 'ka', 2),
];

export const KATAKANA_KA_ROW: KanaCharacter[] = [
  createKana('カ', 'katakana', 'ka', 'ka', 2),
  createKana('キ', 'katakana', 'ki', 'ka', 3),
  createKana('ク', 'katakana', 'ku', 'ka', 2),
  createKana('ケ', 'katakana', 'ke', 'ka', 3),
  createKana('コ', 'katakana', 'ko', 'ka', 2),
];

// さ-row (sa, shi, su, se, so)
export const HIRAGANA_SA_ROW: KanaCharacter[] = [
  createKana('さ', 'hiragana', 'sa', 'sa', 3),
  createKana('し', 'hiragana', 'shi', 'sa', 1),
  createKana('す', 'hiragana', 'su', 'sa', 2),
  createKana('せ', 'hiragana', 'se', 'sa', 3),
  createKana('そ', 'hiragana', 'so', 'sa', 1),
];

export const KATAKANA_SA_ROW: KanaCharacter[] = [
  createKana('サ', 'katakana', 'sa', 'sa', 3),
  createKana('シ', 'katakana', 'shi', 'sa', 3),
  createKana('ス', 'katakana', 'su', 'sa', 2),
  createKana('セ', 'katakana', 'se', 'sa', 2),
  createKana('ソ', 'katakana', 'so', 'sa', 2),
];

// た-row (ta, chi, tsu, te, to)
export const HIRAGANA_TA_ROW: KanaCharacter[] = [
  createKana('た', 'hiragana', 'ta', 'ta', 4),
  createKana('ち', 'hiragana', 'chi', 'ta', 2),
  createKana('つ', 'hiragana', 'tsu', 'ta', 1),
  createKana('て', 'hiragana', 'te', 'ta', 1),
  createKana('と', 'hiragana', 'to', 'ta', 2),
];

export const KATAKANA_TA_ROW: KanaCharacter[] = [
  createKana('タ', 'katakana', 'ta', 'ta', 3),
  createKana('チ', 'katakana', 'chi', 'ta', 3),
  createKana('ツ', 'katakana', 'tsu', 'ta', 3),
  createKana('テ', 'katakana', 'te', 'ta', 3),
  createKana('ト', 'katakana', 'to', 'ta', 2),
];

// な-row (na, ni, nu, ne, no)
export const HIRAGANA_NA_ROW: KanaCharacter[] = [
  createKana('な', 'hiragana', 'na', 'na', 4),
  createKana('に', 'hiragana', 'ni', 'na', 3),
  createKana('ぬ', 'hiragana', 'nu', 'na', 2),
  createKana('ね', 'hiragana', 'ne', 'na', 2),
  createKana('の', 'hiragana', 'no', 'na', 1),
];

export const KATAKANA_NA_ROW: KanaCharacter[] = [
  createKana('ナ', 'katakana', 'na', 'na', 2),
  createKana('ニ', 'katakana', 'ni', 'na', 2),
  createKana('ヌ', 'katakana', 'nu', 'na', 2),
  createKana('ネ', 'katakana', 'ne', 'na', 4),
  createKana('ノ', 'katakana', 'no', 'na', 1),
];

// は-row (ha, hi, fu, he, ho)
export const HIRAGANA_HA_ROW: KanaCharacter[] = [
  createKana('は', 'hiragana', 'ha', 'ha', 3),
  createKana('ひ', 'hiragana', 'hi', 'ha', 1),
  createKana('ふ', 'hiragana', 'fu', 'ha', 4),
  createKana('へ', 'hiragana', 'he', 'ha', 1),
  createKana('ほ', 'hiragana', 'ho', 'ha', 4),
];

export const KATAKANA_HA_ROW: KanaCharacter[] = [
  createKana('ハ', 'katakana', 'ha', 'ha', 2),
  createKana('ヒ', 'katakana', 'hi', 'ha', 2),
  createKana('フ', 'katakana', 'fu', 'ha', 1),
  createKana('ヘ', 'katakana', 'he', 'ha', 1),
  createKana('ホ', 'katakana', 'ho', 'ha', 4),
];

// ま-row (ma, mi, mu, me, mo)
export const HIRAGANA_MA_ROW: KanaCharacter[] = [
  createKana('ま', 'hiragana', 'ma', 'ma', 3),
  createKana('み', 'hiragana', 'mi', 'ma', 2),
  createKana('む', 'hiragana', 'mu', 'ma', 3),
  createKana('め', 'hiragana', 'me', 'ma', 2),
  createKana('も', 'hiragana', 'mo', 'ma', 3),
];

export const KATAKANA_MA_ROW: KanaCharacter[] = [
  createKana('マ', 'katakana', 'ma', 'ma', 2),
  createKana('ミ', 'katakana', 'mi', 'ma', 3),
  createKana('ム', 'katakana', 'mu', 'ma', 2),
  createKana('メ', 'katakana', 'me', 'ma', 2),
  createKana('モ', 'katakana', 'mo', 'ma', 3),
];

// や-row (ya, yu, yo)
export const HIRAGANA_YA_ROW: KanaCharacter[] = [
  createKana('や', 'hiragana', 'ya', 'ya', 3),
  createKana('ゆ', 'hiragana', 'yu', 'ya', 2),
  createKana('よ', 'hiragana', 'yo', 'ya', 2),
];

export const KATAKANA_YA_ROW: KanaCharacter[] = [
  createKana('ヤ', 'katakana', 'ya', 'ya', 2),
  createKana('ユ', 'katakana', 'yu', 'ya', 2),
  createKana('ヨ', 'katakana', 'yo', 'ya', 3),
];

// ら-row (ra, ri, ru, re, ro)
export const HIRAGANA_RA_ROW: KanaCharacter[] = [
  createKana('ら', 'hiragana', 'ra', 'ra', 2),
  createKana('り', 'hiragana', 'ri', 'ra', 2),
  createKana('る', 'hiragana', 'ru', 'ra', 1),
  createKana('れ', 'hiragana', 're', 'ra', 2),
  createKana('ろ', 'hiragana', 'ro', 'ra', 1),
];

export const KATAKANA_RA_ROW: KanaCharacter[] = [
  createKana('ラ', 'katakana', 'ra', 'ra', 2),
  createKana('リ', 'katakana', 'ri', 'ra', 2),
  createKana('ル', 'katakana', 'ru', 'ra', 2),
  createKana('レ', 'katakana', 're', 'ra', 1),
  createKana('ロ', 'katakana', 'ro', 'ra', 3),
];

// わ-row (wa, wo, n)
export const HIRAGANA_WA_ROW: KanaCharacter[] = [
  createKana('わ', 'hiragana', 'wa', 'wa', 2),
  createKana('を', 'hiragana', 'wo', 'wa', 3),
  createKana('ん', 'hiragana', 'n', 'wa', 1),
];

export const KATAKANA_WA_ROW: KanaCharacter[] = [
  createKana('ワ', 'katakana', 'wa', 'wa', 2),
  createKana('ヲ', 'katakana', 'wo', 'wa', 3),
  createKana('ン', 'katakana', 'n', 'wa', 2),
];

// All hiragana and katakana by row
export const ALL_HIRAGANA = [
  ...HIRAGANA_A_ROW,
  ...HIRAGANA_KA_ROW,
  ...HIRAGANA_SA_ROW,
  ...HIRAGANA_TA_ROW,
  ...HIRAGANA_NA_ROW,
  ...HIRAGANA_HA_ROW,
  ...HIRAGANA_MA_ROW,
  ...HIRAGANA_YA_ROW,
  ...HIRAGANA_RA_ROW,
  ...HIRAGANA_WA_ROW,
];

export const ALL_KATAKANA = [
  ...KATAKANA_A_ROW,
  ...KATAKANA_KA_ROW,
  ...KATAKANA_SA_ROW,
  ...KATAKANA_TA_ROW,
  ...KATAKANA_NA_ROW,
  ...KATAKANA_HA_ROW,
  ...KATAKANA_MA_ROW,
  ...KATAKANA_YA_ROW,
  ...KATAKANA_RA_ROW,
  ...KATAKANA_WA_ROW,
];

// Helper to get character by romaji
export function getKanaByRomaji(
  romaji: string,
  type: 'hiragana' | 'katakana'
): KanaCharacter | undefined {
  const list = type === 'hiragana' ? ALL_HIRAGANA : ALL_KATAKANA;
  return list.find((k) => k.romaji === romaji);
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add data/alphabet/kana/characters.ts
git commit -m "feat(alphabet): add all kana character data"
```

---

## Task 3: Kana Lesson Definitions

**Files:**
- Create: `data/alphabet/kana/lessons.ts`
- Create: `data/alphabet/index.ts`

**Step 1: Create lesson definitions**

```typescript
// data/alphabet/kana/lessons.ts

import { AlphabetLesson, KanaPair, KanaRow } from '@/types/alphabet';
import {
  HIRAGANA_A_ROW, KATAKANA_A_ROW,
  HIRAGANA_KA_ROW, KATAKANA_KA_ROW,
  HIRAGANA_SA_ROW, KATAKANA_SA_ROW,
  HIRAGANA_TA_ROW, KATAKANA_TA_ROW,
  HIRAGANA_NA_ROW, KATAKANA_NA_ROW,
  HIRAGANA_HA_ROW, KATAKANA_HA_ROW,
  HIRAGANA_MA_ROW, KATAKANA_MA_ROW,
  HIRAGANA_YA_ROW, KATAKANA_YA_ROW,
  HIRAGANA_RA_ROW, KATAKANA_RA_ROW,
  HIRAGANA_WA_ROW, KATAKANA_WA_ROW,
  KanaCharacter,
} from './characters';

// Helper to create pairs from hiragana and katakana arrays
function createPairs(
  hiragana: KanaCharacter[],
  katakana: KanaCharacter[]
): KanaPair[] {
  return hiragana.map((h, i) => ({
    romaji: h.romaji,
    hiragana: h,
    katakana: katakana[i],
  }));
}

// Helper to create a lesson
function createLesson(
  lessonNumber: number,
  row: KanaRow,
  title: string,
  titleJapanese: string,
  hiragana: KanaCharacter[],
  katakana: KanaCharacter[]
): AlphabetLesson {
  return {
    id: `kana-lesson-${lessonNumber.toString().padStart(2, '0')}`,
    type: 'kana',
    lessonNumber,
    title,
    titleJapanese,
    row,
    pairs: createPairs(hiragana, katakana),
  };
}

export const KANA_LESSONS: AlphabetLesson[] = [
  createLesson(1, 'a', 'A-row (あ行)', 'あ行', HIRAGANA_A_ROW, KATAKANA_A_ROW),
  createLesson(2, 'ka', 'Ka-row (か行)', 'か行', HIRAGANA_KA_ROW, KATAKANA_KA_ROW),
  createLesson(3, 'sa', 'Sa-row (さ行)', 'さ行', HIRAGANA_SA_ROW, KATAKANA_SA_ROW),
  createLesson(4, 'ta', 'Ta-row (た行)', 'た行', HIRAGANA_TA_ROW, KATAKANA_TA_ROW),
  createLesson(5, 'na', 'Na-row (な行)', 'な行', HIRAGANA_NA_ROW, KATAKANA_NA_ROW),
  createLesson(6, 'ha', 'Ha-row (は行)', 'は行', HIRAGANA_HA_ROW, KATAKANA_HA_ROW),
  createLesson(7, 'ma', 'Ma-row (ま行)', 'ま行', HIRAGANA_MA_ROW, KATAKANA_MA_ROW),
  createLesson(8, 'ya', 'Ya-row (や行)', 'や行', HIRAGANA_YA_ROW, KATAKANA_YA_ROW),
  createLesson(9, 'ra', 'Ra-row (ら行)', 'ら行', HIRAGANA_RA_ROW, KATAKANA_RA_ROW),
  createLesson(10, 'wa', 'Wa-row + N (わ行・ん)', 'わ行・ん', HIRAGANA_WA_ROW, KATAKANA_WA_ROW),
];

export function getKanaLesson(lessonId: string): AlphabetLesson | undefined {
  return KANA_LESSONS.find((l) => l.id === lessonId);
}

export function getAllKanaLessonIds(): string[] {
  return KANA_LESSONS.map((l) => l.id);
}
```

**Step 2: Create index file**

```typescript
// data/alphabet/index.ts

export * from './kana/characters';
export * from './kana/lessons';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add data/alphabet/kana/lessons.ts data/alphabet/index.ts
git commit -m "feat(alphabet): add kana lesson definitions"
```

---

## Task 4: CharacterCard Component

**Files:**
- Create: `components/alphabet/CharacterCard.tsx`

**Step 1: Create CharacterCard component**

```typescript
// components/alphabet/CharacterCard.tsx

import { View, Text, Pressable } from 'react-native';
import { KanaPair } from '@/types/alphabet';

interface CharacterCardProps {
  pair: KanaPair;
  showReading?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function CharacterCard({
  pair,
  showReading = true,
  onPress,
  size = 'large',
}: CharacterCardProps) {
  const sizeClasses = {
    small: { container: 'p-2', char: 'text-3xl', reading: 'text-xs' },
    medium: { container: 'p-4', char: 'text-5xl', reading: 'text-sm' },
    large: { container: 'p-6', char: 'text-7xl', reading: 'text-base' },
  };

  const styles = sizeClasses[size];

  const content = (
    <View
      className={`bg-white dark:bg-gray-800 rounded-2xl ${styles.container} border border-gray-200 dark:border-gray-700`}
    >
      {/* Characters side by side */}
      <View className="flex-row items-center justify-center gap-4">
        {/* Hiragana */}
        <View className="items-center">
          <Text className="text-xs text-gray-400 mb-1">Hiragana</Text>
          <Text
            className={`${styles.char} font-japanese text-gray-900 dark:text-white`}
          >
            {pair.hiragana.character}
          </Text>
        </View>

        {/* Divider */}
        <View className="w-px h-16 bg-gray-200 dark:bg-gray-700" />

        {/* Katakana */}
        <View className="items-center">
          <Text className="text-xs text-gray-400 mb-1">Katakana</Text>
          <Text
            className={`${styles.char} font-japanese text-gray-900 dark:text-white`}
          >
            {pair.katakana.character}
          </Text>
        </View>
      </View>

      {/* Reading */}
      {showReading && (
        <Text
          className={`${styles.reading} text-sakura-600 text-center mt-4 font-semibold`}
        >
          {pair.romaji}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={`${pair.romaji} - ${pair.hiragana.character} and ${pair.katakana.character}`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/alphabet/CharacterCard.tsx
git commit -m "feat(alphabet): add CharacterCard component"
```

---

## Task 5: DrawingCanvas Component

**Files:**
- Create: `components/alphabet/DrawingCanvas.tsx`

**Step 1: Create DrawingCanvas component**

```typescript
// components/alphabet/DrawingCanvas.tsx

import { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface DrawingCanvasProps {
  targetCharacter: string;
  strokeCount: number;
  onComplete: () => void;
}

interface PathData {
  id: string;
  d: string;
}

export function DrawingCanvas({
  targetCharacter,
  strokeCount,
  onComplete,
}: DrawingCanvasProps) {
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const pathIdRef = useRef(0);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      setCurrentPath(`M ${e.x} ${e.y}`);
    })
    .onUpdate((e) => {
      setCurrentPath((prev) => `${prev} L ${e.x} ${e.y}`);
    })
    .onEnd(() => {
      if (currentPath) {
        const newPath: PathData = {
          id: `path-${pathIdRef.current++}`,
          d: currentPath,
        };
        setPaths((prev) => [...prev, newPath]);
        setCurrentPath('');

        // Check if user has drawn enough strokes
        if (paths.length + 1 >= strokeCount) {
          onComplete();
        }
      }
    });

  const handleClear = () => {
    setPaths([]);
    setCurrentPath('');
    pathIdRef.current = 0;
  };

  const strokesRemaining = Math.max(0, strokeCount - paths.length);

  return (
    <View className="flex-1">
      {/* Target character display */}
      <View className="items-center mb-4">
        <Text className="text-8xl font-japanese text-gray-200 dark:text-gray-700">
          {targetCharacter}
        </Text>
        <Text className="text-sm text-gray-500 mt-2">
          {strokesRemaining > 0
            ? `${strokesRemaining} stroke${strokesRemaining > 1 ? 's' : ''} remaining`
            : 'Complete!'}
        </Text>
      </View>

      {/* Drawing area */}
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
          <GestureDetector gesture={panGesture}>
            <View className="flex-1">
              <Svg width="100%" height="100%">
                <G>
                  {/* Completed strokes */}
                  {paths.map((path) => (
                    <Path
                      key={path.id}
                      d={path.d}
                      stroke="#ec4899"
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  ))}
                  {/* Current stroke being drawn */}
                  {currentPath && (
                    <Path
                      d={currentPath}
                      stroke="#ec4899"
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity={0.5}
                    />
                  )}
                </G>
              </Svg>
            </View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>

      {/* Clear button */}
      <Pressable
        onPress={handleClear}
        className="flex-row items-center justify-center mt-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl"
        accessibilityLabel="Clear drawing"
        accessibilityRole="button"
      >
        <FontAwesome name="eraser" size={16} color="#6b7280" />
        <Text className="text-gray-600 dark:text-gray-400 ml-2 font-medium">
          Clear
        </Text>
      </Pressable>
    </View>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/alphabet/DrawingCanvas.tsx
git commit -m "feat(alphabet): add DrawingCanvas component for writing practice"
```

---

## Task 6: CharacterQuiz Component

**Files:**
- Create: `lib/alphabetQuizUtils.ts`
- Create: `components/alphabet/CharacterQuiz.tsx`

**Step 1: Create quiz utilities**

```typescript
// lib/alphabetQuizUtils.ts

import { KanaPair } from '@/types/alphabet';

export interface AlphabetQuizQuestion {
  id: string;
  type: 'reading' | 'character';
  prompt: string;
  correctAnswer: string;
  options: string[];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateAlphabetQuiz(
  pairs: KanaPair[],
  questionCount: number = 10
): AlphabetQuizQuestion[] {
  const questions: AlphabetQuizQuestion[] = [];
  const allRomaji = pairs.map((p) => p.romaji);
  const allHiragana = pairs.map((p) => p.hiragana.character);
  const allKatakana = pairs.map((p) => p.katakana.character);

  // Generate alternating question types
  for (let i = 0; i < questionCount; i++) {
    const pair = pairs[i % pairs.length];
    const isReadingQuestion = i % 2 === 0;
    const useHiragana = Math.random() > 0.5;

    if (isReadingQuestion) {
      // "What sound is this?" - show character, answer is romaji
      const character = useHiragana
        ? pair.hiragana.character
        : pair.katakana.character;
      const wrongOptions = shuffleArray(
        allRomaji.filter((r) => r !== pair.romaji)
      ).slice(0, 3);

      questions.push({
        id: `q-${i}`,
        type: 'reading',
        prompt: character,
        correctAnswer: pair.romaji,
        options: shuffleArray([pair.romaji, ...wrongOptions]),
      });
    } else {
      // "Which character is X?" - show romaji, answer is character
      const correctChar = useHiragana
        ? pair.hiragana.character
        : pair.katakana.character;
      const charPool = useHiragana ? allHiragana : allKatakana;
      const wrongOptions = shuffleArray(
        charPool.filter((c) => c !== correctChar)
      ).slice(0, 3);

      questions.push({
        id: `q-${i}`,
        type: 'character',
        prompt: pair.romaji,
        correctAnswer: correctChar,
        options: shuffleArray([correctChar, ...wrongOptions]),
      });
    }
  }

  return shuffleArray(questions);
}
```

**Step 2: Create CharacterQuiz component**

```typescript
// components/alphabet/CharacterQuiz.tsx

import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { KanaPair } from '@/types/alphabet';
import {
  AlphabetQuizQuestion,
  generateAlphabetQuiz,
} from '@/lib/alphabetQuizUtils';
import { QuizOption } from '@/components/practice/QuizOption';
import { QuizResults } from '@/components/practice/QuizResults';

interface CharacterQuizProps {
  pairs: KanaPair[];
  lessonId: string;
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

const QUESTION_COUNT = 10;
const FEEDBACK_DELAY_MS = 1000;

export function CharacterQuiz({
  pairs,
  lessonId,
  onClose,
  onComplete,
}: CharacterQuizProps) {
  const [questions, setQuestions] = useState<AlphabetQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const generated = generateAlphabetQuiz(pairs, QUESTION_COUNT);
    setQuestions(generated);
  }, [pairs]);

  const currentQuestion = questions[currentIndex];
  const score = answers.filter(Boolean).length;

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (showFeedback || !currentQuestion) return;

      const isCorrect = answer === currentQuestion.correctAnswer;
      setSelectedAnswer(answer);
      setShowFeedback(true);
      setAnswers((prev) => [...prev, isCorrect]);

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          const finalScore = isCorrect ? score + 1 : score;
          onComplete(finalScore, questions.length);
          setShowResults(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }
      }, FEEDBACK_DELAY_MS);
    },
    [currentQuestion, currentIndex, questions.length, score, showFeedback, onComplete]
  );

  const handleRetry = useCallback(() => {
    const generated = generateAlphabetQuiz(pairs, QUESTION_COUNT);
    setQuestions(generated);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowResults(false);
  }, [pairs]);

  const getOptionState = (option: string) => {
    if (!showFeedback) return 'default';
    if (option === currentQuestion?.correctAnswer) return 'correct';
    if (option === selectedAnswer && option !== currentQuestion?.correctAnswer) {
      return 'incorrect';
    }
    return 'default';
  };

  if (showResults) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <QuizResults
          score={score}
          totalQuestions={questions.length}
          onRetry={handleRetry}
          onContinue={onClose}
        />
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-gray-600 dark:text-gray-400 font-medium">
          {currentIndex + 1} / {questions.length}
        </Text>
        <View className="w-8" />
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-gray-200 dark:bg-gray-700">
        <View
          className="h-full bg-sakura-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </View>

      {/* Question */}
      <View className="flex-1 px-6 py-8">
        <View className="items-center mb-8">
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {currentQuestion.type === 'reading'
              ? 'What sound is this?'
              : 'Which character is this?'}
          </Text>
          <Text
            className={`font-bold text-gray-900 dark:text-white text-center ${
              currentQuestion.type === 'reading'
                ? 'text-7xl font-japanese'
                : 'text-4xl'
            }`}
          >
            {currentQuestion.prompt}
          </Text>
        </View>

        {/* Options */}
        <View className="gap-3">
          {currentQuestion.options.map((option, index) => (
            <QuizOption
              key={`${currentQuestion.id}-${index}`}
              text={option}
              onPress={() => handleSelectAnswer(option)}
              disabled={showFeedback}
              state={getOptionState(option)}
              large={currentQuestion.type === 'character'}
            />
          ))}
        </View>
      </View>

      {/* Score indicator */}
      <View className="px-6 pb-4">
        <View className="flex-row items-center justify-center gap-2">
          <FontAwesome name="check-circle" size={16} color="#22c55e" />
          <Text className="text-gray-600 dark:text-gray-400">
            {score} correct
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
```

**Step 3: Update QuizOption to support large text**

Modify: `components/practice/QuizOption.tsx` - add `large` prop

```typescript
// Add to QuizOption props interface:
large?: boolean;

// Update the Text component className:
className={`font-medium text-center ${
  large ? 'text-2xl font-japanese' : 'text-base'
} ${textColorClass}`}
```

**Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 5: Commit**

```bash
git add lib/alphabetQuizUtils.ts components/alphabet/CharacterQuiz.tsx components/practice/QuizOption.tsx
git commit -m "feat(alphabet): add CharacterQuiz component with quiz utilities"
```

---

## Task 7: AlphabetLessonScreen Component

**Files:**
- Create: `components/alphabet/AlphabetLessonScreen.tsx`

**Step 1: Create main lesson screen**

```typescript
// components/alphabet/AlphabetLessonScreen.tsx

import { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AlphabetLesson } from '@/types/alphabet';
import { CharacterCard } from './CharacterCard';
import { DrawingCanvas } from './DrawingCanvas';
import { CharacterQuiz } from './CharacterQuiz';
import { Button } from '@/components/common/Button';

type Section = 'learn' | 'write' | 'quiz';

interface AlphabetLessonScreenProps {
  lesson: AlphabetLesson;
  onSectionComplete: (section: Section, score?: number, total?: number) => void;
  progress?: {
    learnCompleted: boolean;
    writeCompleted: boolean;
    quizBestScore: number | null;
  };
}

export function AlphabetLessonScreen({
  lesson,
  onSectionComplete,
  progress,
}: AlphabetLessonScreenProps) {
  const [activeSection, setActiveSection] = useState<Section>('learn');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [writtenChars, setWrittenChars] = useState<Set<string>>(new Set());

  const currentPair = lesson.pairs[currentCharIndex];

  const handleBack = () => {
    router.back();
  };

  const handleNextChar = () => {
    if (currentCharIndex < lesson.pairs.length - 1) {
      setCurrentCharIndex(currentCharIndex + 1);
    } else if (activeSection === 'learn') {
      onSectionComplete('learn');
    }
  };

  const handlePrevChar = () => {
    if (currentCharIndex > 0) {
      setCurrentCharIndex(currentCharIndex - 1);
    }
  };

  const handleWriteComplete = () => {
    const charId = `${currentPair.romaji}`;
    const newWritten = new Set(writtenChars);
    newWritten.add(charId);
    setWrittenChars(newWritten);

    if (newWritten.size >= lesson.pairs.length) {
      onSectionComplete('write');
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    onSectionComplete('quiz', score, total);
  };

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: 'learn', label: 'Learn', icon: 'eye' },
    { id: 'write', label: 'Write', icon: 'pencil' },
    { id: 'quiz', label: 'Quiz', icon: 'question-circle' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <FontAwesome name="chevron-left" size={20} color="#ec4899" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Lesson {lesson.lessonNumber}: {lesson.title}
          </Text>
          <Text className="text-sm text-sakura-600 font-japanese">
            {lesson.titleJapanese}
          </Text>
        </View>
      </View>

      {/* Section Tabs */}
      <View className="flex-row border-b border-gray-200 dark:border-gray-800">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          const isComplete =
            (section.id === 'learn' && progress?.learnCompleted) ||
            (section.id === 'write' && progress?.writeCompleted) ||
            (section.id === 'quiz' && progress?.quizBestScore !== null);

          return (
            <Pressable
              key={section.id}
              onPress={() => {
                setActiveSection(section.id);
                setCurrentCharIndex(0);
              }}
              className={`flex-1 py-3 items-center border-b-2 ${
                isActive
                  ? 'border-sakura-500'
                  : 'border-transparent'
              }`}
            >
              <View className="flex-row items-center">
                {isComplete && (
                  <FontAwesome
                    name="check-circle"
                    size={14}
                    color="#22c55e"
                    style={{ marginRight: 4 }}
                  />
                )}
                <FontAwesome
                  name={section.icon as any}
                  size={16}
                  color={isActive ? '#ec4899' : '#9ca3af'}
                />
                <Text
                  className={`ml-2 font-medium ${
                    isActive
                      ? 'text-sakura-600'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {section.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Content */}
      {activeSection === 'learn' && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-8 items-center"
        >
          {/* Character Card */}
          <CharacterCard pair={currentPair} size="large" />

          {/* Stroke count info */}
          <View className="flex-row mt-4 gap-4">
            <Text className="text-sm text-gray-500">
              Hiragana: {currentPair.hiragana.strokeCount} strokes
            </Text>
            <Text className="text-sm text-gray-500">
              Katakana: {currentPair.katakana.strokeCount} strokes
            </Text>
          </View>

          {/* Navigation */}
          <View className="flex-row items-center justify-between w-full mt-8">
            <Pressable
              onPress={handlePrevChar}
              disabled={currentCharIndex === 0}
              className={`p-4 ${currentCharIndex === 0 ? 'opacity-30' : ''}`}
            >
              <FontAwesome name="chevron-left" size={24} color="#ec4899" />
            </Pressable>

            <Text className="text-gray-500">
              {currentCharIndex + 1} / {lesson.pairs.length}
            </Text>

            <Pressable onPress={handleNextChar} className="p-4">
              <FontAwesome name="chevron-right" size={24} color="#ec4899" />
            </Pressable>
          </View>
        </ScrollView>
      )}

      {activeSection === 'write' && (
        <View className="flex-1 px-6 py-4">
          {/* Character selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
            contentContainerClassName="gap-2"
          >
            {lesson.pairs.map((pair, index) => {
              const isWritten = writtenChars.has(pair.romaji);
              const isSelected = index === currentCharIndex;

              return (
                <Pressable
                  key={pair.romaji}
                  onPress={() => setCurrentCharIndex(index)}
                  className={`w-12 h-12 rounded-xl items-center justify-center ${
                    isSelected
                      ? 'bg-sakura-500'
                      : isWritten
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Text
                    className={`text-lg font-japanese ${
                      isSelected
                        ? 'text-white'
                        : isWritten
                        ? 'text-green-600'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {pair.hiragana.character}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Drawing canvas */}
          <DrawingCanvas
            targetCharacter={currentPair.hiragana.character}
            strokeCount={currentPair.hiragana.strokeCount}
            onComplete={handleWriteComplete}
          />
        </View>
      )}

      {activeSection === 'quiz' && (
        <View className="flex-1 px-6 py-8 items-center justify-center">
          <FontAwesome name="question-circle" size={64} color="#ec4899" />
          <Text className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
            Ready for a quiz?
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xs">
            Test your knowledge of the {lesson.title} characters with a 10-question quiz.
          </Text>
          {progress?.quizBestScore !== null && (
            <Text className="text-green-600 mt-2">
              Best score: {progress.quizBestScore}/10
            </Text>
          )}
          <View className="mt-6">
            <Button title="Start Quiz" onPress={() => setShowQuiz(true)} />
          </View>
        </View>
      )}

      {/* Quiz Modal */}
      <Modal
        visible={showQuiz}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CharacterQuiz
          pairs={lesson.pairs}
          lessonId={lesson.id}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      </Modal>
    </SafeAreaView>
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add components/alphabet/AlphabetLessonScreen.tsx
git commit -m "feat(alphabet): add AlphabetLessonScreen with learn/write/quiz sections"
```

---

## Task 8: Alphabet Route

**Files:**
- Create: `app/alphabet/[lessonId].tsx`

**Step 1: Create route file**

```typescript
// app/alphabet/[lessonId].tsx

import { useLocalSearchParams } from 'expo-router';
import { View, Text, SafeAreaView } from 'react-native';
import { getKanaLesson } from '@/data/alphabet';
import { AlphabetLessonScreen } from '@/components/alphabet/AlphabetLessonScreen';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';
import { router } from 'expo-router';

export default function AlphabetLessonRoute() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = lessonId ? getKanaLesson(lessonId) : undefined;

  const alphabetProgress = useProgressStore((state) => state.alphabetProgress);
  const completeAlphabetSection = useProgressStore(
    (state) => state.completeAlphabetSection
  );

  const progress = lessonId ? alphabetProgress[lessonId] : undefined;

  if (!lesson) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Lesson not found
        </Text>
        <View className="mt-4">
          <Button
            title="Go Back"
            variant="outline"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleSectionComplete = (
    section: 'learn' | 'write' | 'quiz',
    score?: number,
    total?: number
  ) => {
    completeAlphabetSection(lessonId!, section, score, total);
  };

  return (
    <AlphabetLessonScreen
      lesson={lesson}
      onSectionComplete={handleSectionComplete}
      progress={progress ? {
        learnCompleted: progress.learnCompleted,
        writeCompleted: progress.writeCompleted,
        quizBestScore: progress.quizBestScore,
      } : undefined}
    />
  );
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: May have errors about missing progressStore methods (fixed in next task)

**Step 3: Commit (after Task 9)**

---

## Task 9: Progress Store Extension

**Files:**
- Modify: `stores/progressStore.ts`

**Step 1: Add alphabet progress tracking to store**

Add to the store interface and implementation:

```typescript
// Add to imports
import { AlphabetProgress } from '@/types/alphabet';

// Add to ProgressState interface:
alphabetProgress: Record<string, AlphabetProgress>;

// Add to actions in interface:
completeAlphabetSection: (
  lessonId: string,
  section: 'learn' | 'write' | 'quiz',
  score?: number,
  total?: number
) => void;
getAlphabetProgress: (lessonId: string) => AlphabetProgress | undefined;

// Add to defaultState:
alphabetProgress: {} as Record<string, AlphabetProgress>,

// Add implementation in create():
completeAlphabetSection: (
  lessonId: string,
  section: 'learn' | 'write' | 'quiz',
  score?: number,
  total?: number
) => {
  const now = new Date().toISOString();
  set((state) => {
    const existing = state.alphabetProgress[lessonId] || {
      lessonId,
      learnCompleted: false,
      writeCompleted: false,
      quizBestScore: null,
      quizTotalQuestions: null,
      completedAt: null,
    };

    const updated = { ...existing };

    if (section === 'learn') {
      updated.learnCompleted = true;
    } else if (section === 'write') {
      updated.writeCompleted = true;
    } else if (section === 'quiz' && score !== undefined) {
      if (updated.quizBestScore === null || score > updated.quizBestScore) {
        updated.quizBestScore = score;
        updated.quizTotalQuestions = total ?? 10;
      }
    }

    // Mark as completed if all sections done
    if (updated.learnCompleted && updated.writeCompleted && updated.quizBestScore !== null) {
      updated.completedAt = now;
    }

    return {
      alphabetProgress: {
        ...state.alphabetProgress,
        [lessonId]: updated,
      },
    };
  });
},

getAlphabetProgress: (lessonId: string) => {
  return get().alphabetProgress[lessonId];
},
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add stores/progressStore.ts app/alphabet/[lessonId].tsx
git commit -m "feat(alphabet): add alphabet progress tracking and lesson route"
```

---

## Task 10: Alphabets Tab

**Files:**
- Create: `app/(tabs)/alphabets.tsx`
- Modify: `app/(tabs)/_layout.tsx`

**Step 1: Create alphabets tab screen**

```typescript
// app/(tabs)/alphabets.tsx

import { memo } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import { KANA_LESSONS, AlphabetLesson } from '@/data/alphabet';

export default function AlphabetsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6"
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-sm text-sakura-600 font-medium mb-1">
            Japanese Writing
          </Text>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Alphabets
          </Text>
        </View>

        {/* Kana Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hiragana & Katakana
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 mb-4">
            Learn both scripts together, organized by sound rows.
          </Text>

          <View className="gap-3">
            {KANA_LESSONS.map((lesson) => (
              <KanaLessonCard key={lesson.id} lesson={lesson} />
            ))}
          </View>
        </View>

        {/* Kanji Section (Coming Soon) */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5">
          <View className="flex-row items-center mb-2">
            <FontAwesome name="lock" size={16} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-400 ml-2">
              Kanji
            </Text>
          </View>
          <Text className="text-gray-400">
            Complete kana lessons to unlock kanji learning.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const KanaLessonCard = memo(function KanaLessonCard({
  lesson,
}: {
  lesson: AlphabetLesson;
}) {
  const progress = useProgressStore(
    (state) => state.alphabetProgress[lesson.id]
  );

  const isCompleted = progress?.completedAt !== null;
  const hasProgress =
    progress?.learnCompleted ||
    progress?.writeCompleted ||
    progress?.quizBestScore !== null;

  const handlePress = () => {
    router.push({
      pathname: '/alphabet/[lessonId]',
      params: { lessonId: lesson.id },
    });
  };

  // Show first 3 characters as preview
  const preview = lesson.pairs
    .slice(0, 3)
    .map((p) => p.hiragana.character)
    .join(' ');

  return (
    <Pressable
      onPress={handlePress}
      className={`bg-white dark:bg-gray-800 border rounded-2xl p-4 ${
        isCompleted
          ? 'border-green-300 dark:border-green-700'
          : hasProgress
          ? 'border-sakura-300 dark:border-sakura-700'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      <View className="flex-row items-center">
        {/* Lesson number */}
        <View
          className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
            isCompleted
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-sakura-100 dark:bg-sakura-900/30'
          }`}
        >
          {isCompleted ? (
            <FontAwesome name="check" size={20} color="#22c55e" />
          ) : (
            <Text className="text-lg font-bold text-sakura-600">
              {lesson.lessonNumber}
            </Text>
          )}
        </View>

        {/* Lesson info */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {lesson.title}
          </Text>
          <Text className="text-sm text-sakura-600 font-japanese">
            {lesson.titleJapanese}
          </Text>
          <Text className="text-lg text-gray-400 font-japanese mt-1">
            {preview}...
          </Text>
        </View>

        {/* Progress indicators */}
        <View className="items-end">
          {progress?.quizBestScore !== null && (
            <Text className="text-xs text-green-600">
              {progress.quizBestScore}/{progress.quizTotalQuestions}
            </Text>
          )}
          <FontAwesome name="chevron-right" size={14} color="#9ca3af" />
        </View>
      </View>
    </Pressable>
  );
});
```

**Step 2: Update tab layout**

Modify `app/(tabs)/_layout.tsx` to add the Alphabets tab:

```typescript
// Add between Learn and Chat tabs:
<Tabs.Screen
  name="alphabets"
  options={{
    title: 'Alphabets',
    tabBarIcon: ({ color }) => <TabBarIcon name="font" color={color} />,
  }}
/>
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add app/(tabs)/alphabets.tsx app/(tabs)/_layout.tsx
git commit -m "feat(alphabet): add Alphabets tab to navigation"
```

---

## Task 11: Component Index Files

**Files:**
- Create: `components/alphabet/index.ts`

**Step 1: Create index file**

```typescript
// components/alphabet/index.ts

export { CharacterCard } from './CharacterCard';
export { DrawingCanvas } from './DrawingCanvas';
export { CharacterQuiz } from './CharacterQuiz';
export { AlphabetLessonScreen } from './AlphabetLessonScreen';
```

**Step 2: Commit**

```bash
git add components/alphabet/index.ts
git commit -m "feat(alphabet): add component index file"
```

---

## Task 12: Final Integration Test

**Step 1: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Start the app**

Run: `npx expo start`
Expected: App launches without errors

**Step 3: Manual testing checklist**

- [ ] Alphabets tab appears in bottom navigation
- [ ] Kana lessons list displays all 10 lessons
- [ ] Tapping a lesson opens the lesson screen
- [ ] Learn section shows character cards with navigation
- [ ] Write section shows drawing canvas
- [ ] Quiz section launches quiz modal
- [ ] Quiz completes and shows results
- [ ] Progress is saved and displayed on lesson cards

**Step 4: Final commit**

```bash
git add .
git commit -m "feat(alphabet): complete kana lessons implementation"
```

---

## Summary

This plan implements the alphabet lessons feature in 12 tasks:

1. **Type definitions** - Core data structures
2. **Character data** - All kana characters with metadata
3. **Lesson definitions** - 10 kana lessons organized by row
4. **CharacterCard** - Display component for character pairs
5. **DrawingCanvas** - Touch-based writing practice
6. **CharacterQuiz** - Multiple choice quiz component
7. **AlphabetLessonScreen** - Main lesson container
8. **Alphabet route** - Expo Router integration
9. **Progress store** - Zustand state for tracking progress
10. **Alphabets tab** - Home screen tab with lesson list
11. **Index files** - Clean exports
12. **Integration test** - Verify everything works

Each task follows TDD principles with small, focused commits.
