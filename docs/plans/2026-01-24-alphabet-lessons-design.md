# Alphabet Lessons: Hiragana, Katakana, and Kanji

**Date:** 2026-01-24
**Status:** Draft

## Overview

Add lessons for learning the Japanese writing systems: hiragana, katakana, and kanji. Lessons support both reading recognition and writing practice. Kana lessons are organized by sound rows, teaching hiragana and katakana together (あ/ア). Kanji is a separate module assuming familiarity with Chinese characters.

## Lesson Structure

### Kana Lessons (10 core lessons)

Each lesson covers one sound row with both hiragana and katakana:

| Lesson | Row | Characters |
|--------|-----|------------|
| 1 | あ-row | あ/ア, い/イ, う/ウ, え/エ, お/オ |
| 2 | か-row | か/カ, き/キ, く/ク, け/ケ, こ/コ |
| 3 | さ-row | さ/サ, し/シ, す/ス, せ/セ, そ/ソ |
| 4 | た-row | た/タ, ち/チ, つ/ツ, て/テ, と/ト |
| 5 | な-row | な/ナ, に/ニ, ぬ/ヌ, ね/ネ, の/ノ |
| 6 | は-row | は/ハ, ひ/ヒ, ふ/フ, へ/ヘ, ほ/ホ |
| 7 | ま-row | ま/マ, み/ミ, む/ム, め/メ, も/モ |
| 8 | や-row | や/ヤ, ゆ/ユ, よ/ヨ |
| 9 | ら-row | ら/ラ, り/リ, る/ル, れ/レ, ろ/ロ |
| 10 | わ-row + ん | わ/ワ, を/ヲ, ん/ン |

### Bonus Kana Lessons

| Lesson | Content |
|--------|---------|
| 11 | Dakuten: が/ガ, ざ/ザ, だ/ダ, ば/バ rows |
| 12 | Handakuten: ぱ/パ row |
| 13 | Combinations: きゃ/キャ, しゅ/シュ, ちょ/チョ, etc. |

### Kanji Module

Separate section unlocked after kana or accessible anytime. Organized by JLPT N5 / frequency. Content assumes Chinese character familiarity:
- Focus on on'yomi and kun'yomi readings
- Highlight differences from simplified/traditional Chinese
- Japanese-specific meanings and usage patterns

## Data Model

### Types

```typescript
// types/alphabet.ts

interface KanaCharacter {
  id: string;                    // "hiragana-a", "katakana-ka"
  character: string;             // あ, ア
  type: 'hiragana' | 'katakana';
  romaji: string;                // "a", "ka"
  row: string;                   // "a-row", "ka-row"
  strokeCount: number;
  strokeOrder: string[];         // SVG paths for each stroke
}

interface KanjiCharacter {
  id: string;
  character: string;             // 日
  meaning: string;               // "day, sun"
  onYomi: string[];              // ["ニチ", "ジツ"]
  kunYomi: string[];             // ["ひ", "か"]
  strokeCount: number;
  strokeOrder: string[];
  jlptLevel: 'N5' | 'N4' | 'N3';
  chineseNote?: string;          // Differences from Chinese usage
}

interface AlphabetLesson {
  id: string;                    // "kana-lesson-01"
  type: 'kana' | 'kanji';
  title: string;                 // "あ-row (A sounds)"
  titleJapanese: string;         // "あ行"
  row?: string;                  // For kana: "a-row"
  characters: KanaCharacter[] | KanjiCharacter[];
}
```

### File Structure

```
/data/alphabet/
  types.ts             # Type definitions
  kana/
    characters.ts      # All hiragana + katakana character data
    lessons.ts         # 13 kana lessons
  kanji/
    characters.ts      # Kanji data (N5 initially)
    lessons.ts         # Kanji lessons grouped by theme/frequency
  index.ts             # Exports
```

## UI Components

### New Files

| File | Purpose |
|------|---------|
| `components/alphabet/CharacterCard.tsx` | Displays character with stroke animation |
| `components/alphabet/StrokeAnimation.tsx` | Animates SVG stroke paths |
| `components/alphabet/DrawingCanvas.tsx` | Touch-based drawing surface |
| `components/alphabet/CharacterQuiz.tsx` | Recognition quiz (reading + character identification) |
| `components/alphabet/AlphabetLessonScreen.tsx` | Main lesson screen with sections |
| `app/alphabet/[lessonId].tsx` | Route for alphabet lessons |
| `app/(tabs)/alphabets.tsx` | Alphabets tab on home screen |

### Lesson Screen Sections

Each alphabet lesson has three sections:

**1. Learn**
- Character cards showing hiragana/katakana side by side
- Large character display with romaji reading
- Tap to play stroke order animation
- Swipe to navigate between characters

**2. Practice Writing**
- Target character displayed at top
- Stroke order guide (numbered, tap to animate)
- Drawing canvas for tracing/freehand
- Clear button to reset canvas
- Completion-based feedback (checkmark when done)
- Next button to proceed

**3. Quiz**
Two quiz types mixed together:

*Reading Quiz* - "What sound is this?"
- Shows character (e.g., あ)
- 4 multiple choice options (a, ka, sa, ta)

*Character Quiz* - "Which character is 'ka'?"
- Shows romaji (e.g., ka)
- 4 character options (あ, か, さ, た)

Quiz mixes hiragana and katakana from the lesson. 10 questions per session.

## Stroke Order Data

Use KanjiVG (open source, CC BY-SA license) for stroke order SVG paths. Extract and convert paths for each character into the `strokeOrder` array format.

Alternative: Manual SVG creation for custom control.

## Drawing Canvas Implementation

Use `react-native-svg` with gesture handling:

```typescript
// components/alphabet/DrawingCanvas.tsx
interface DrawingCanvasProps {
  character: string;           // Target character for reference
  onComplete: () => void;      // Called when user finishes drawing
}
```

Features:
- Touch-based path capture
- Clear button to reset
- No stroke validation in MVP (completion-based only)

## Integration

### Navigation

Add "Alphabets" tab to home screen alongside Genki lessons:

```typescript
// app/(tabs)/alphabets.tsx
// Shows:
// - Kana section (lessons 1-13)
// - Kanji section (organized by level)
// - Progress indicators per lesson
```

### Progress Tracking

Extend `progressStore` to track alphabet progress:

```typescript
// stores/progressStore.ts additions

interface AlphabetProgress {
  lessonId: string;
  learnCompleted: boolean;
  writeCompleted: boolean;
  quizBestScore: number | null;
  completedAt: string | null;
}

// New actions:
completeAlphabetSection: (lessonId: string, section: 'learn' | 'write' | 'quiz', score?: number) => void;
getAlphabetProgress: (lessonId: string) => AlphabetProgress | null;
```

### Routing

Add alphabet lesson route:

```typescript
// app/alphabet/[lessonId].tsx
// Handles: /alphabet/kana-lesson-01, /alphabet/kanji-lesson-01, etc.
```

## Out of Scope (Future Features)

- SRS flashcard system for long-term retention
- Stroke accuracy validation (AI or path matching)
- Audio pronunciation for each character
- Handwriting recognition
- Kanji radical decomposition view

## Implementation Order

1. Create type definitions (`types/alphabet.ts`)
2. Create kana character data (`data/alphabet/kana/characters.ts`)
3. Create kana lesson definitions (`data/alphabet/kana/lessons.ts`)
4. Create CharacterCard component with basic display
5. Create StrokeAnimation component
6. Create DrawingCanvas component
7. Create CharacterQuiz component
8. Create AlphabetLessonScreen with section tabs
9. Add alphabet route (`app/alphabet/[lessonId].tsx`)
10. Add Alphabets tab to home screen
11. Extend progressStore for alphabet tracking
12. Create kanji character data (N5 set)
13. Create kanji lessons
