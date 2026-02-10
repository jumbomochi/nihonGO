# nihonGO Design System & Decoupling Refactor

## Overview

This document describes the plan to establish a design system foundation so that design, content, and logic workstreams can proceed in parallel without blocking each other.

### Current Problems

| Problem | Evidence |
|---------|----------|
| Monolithic screens | `app/lesson/[topic].tsx` is 671 lines mixing data loading, business logic, and UI |
| Content types are source-specific | JLPT unit screen converts data inline with 4 `as any` casts (`[unitId].tsx:79,86,107`) |
| Ad-hoc design patterns | Colors, spacing, typography applied as raw strings across 42+ files |
| No formal UI primitives | Only a thin `Card`, `Button`, and `Input` exist in `/components/common/` |
| Duplicated header pattern | The `flex-row items-center px-4 py-3 border-b` header is copy-pasted across 7+ screens |
| Duplicated progress bar | Hand-built `h-2 bg-gray-200 rounded-full` pattern in XPDisplay, LevelCard, VocabQuiz, mock-exam, JLPTLevelScreen |
| Inconsistent icon badges | `w-N h-N bg-X-100 rounded-full items-center justify-center` pattern with sizes ranging from w-5 to w-20 |

### Goal

Establish a design system foundation with:
1. **Design tokens** - single source of truth for colors, typography, spacing
2. **UI primitives** - pure presentational components that depend only on tokens
3. **Unified content types** - source-agnostic interfaces so Genki and JLPT feed the same components
4. **Decomposed screens** - thin route handlers delegating to focused components and hooks
5. **Layer contracts** - enforced dependency direction for parallel workstreams

### Component Taxonomy

| Directory | Role | May import from |
|-----------|------|-----------------|
| `components/ui/` | Stateless primitives, tokens-only | `@/constants/tokens` only |
| `components/common/` | Reusable composites that may touch stores/hooks | tokens, stores, hooks, lib |
| `components/lesson/`, `components/jlpt/`, etc. | Domain-specific feature components | anything except other feature folders |

---

## Phase 1: Design Tokens

> Formalize the ad-hoc patterns into a single source of truth.

**Authority:** `constants/tokens.ts` is the single source of truth for all design values. `tailwind.config.js` defines the Tailwind theme (color palette, font families) but does not define semantic mappings. When adding or changing colors/aliases, update `tokens.ts` first, then sync `tailwind.config.js` only if a new Tailwind utility class is needed.

### 1.1 Create `/constants/tokens.ts`

Centralize all design values currently scattered as raw strings/hex codes across the codebase.

**Why className strings:** NativeWind requires static class names (no `text-${color}` interpolation). Pre-built strings work within this constraint and are the only way to have a centralized token that works with NativeWind's static extraction.

#### Naming Convention

All token names use **semantic** names (what they represent, not what color they are):
- `text.primary`, `text.accent`, `bg.card` - semantic roles
- `status.success`, `status.warning` - semantic status
- `rawColors.sakura500` - palette-level escape hatch for RN props that require hex strings

The `rawColors` object is the only place palette names appear. All other tokens use semantic names. This prevents confusion between the semantic layer (`colors.text.accent`) and the status layer (`status.success`).

#### Semantic Colors

Each color has both a className string (for NativeWind) and a raw hex value (for props like `color` on FontAwesome, `ActivityIndicator`, etc.).

```typescript
export const colors = {
  text: {
    primary:   { className: "text-gray-900 dark:text-white",     light: "#111827", dark: "#ffffff" },
    secondary: { className: "text-gray-600 dark:text-gray-400",  light: "#4b5563", dark: "#9ca3af" },
    muted:     { className: "text-gray-500 dark:text-gray-400",  light: "#6b7280", dark: "#9ca3af" },
    accent:    { className: "text-sakura-600 dark:text-sakura-400", light: "#db2777", dark: "#f472b6" },
  },
  bg: {
    primary: { className: "bg-white dark:bg-gray-900" },
    card:    { className: "bg-white dark:bg-gray-800" },
    muted:   { className: "bg-gray-50 dark:bg-gray-800" },
    accent:  { className: "bg-sakura-500" },
  },
  border: {
    default: { className: "border-gray-200 dark:border-gray-700" },
    divider: { className: "border-gray-200 dark:border-gray-800" },
  },
} as const;
```

#### Status Colors

Used for badges, alerts, and status indicators.

```typescript
export const status = {
  success: { base: "#22c55e", bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400" },
  warning: { base: "#d97706", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400" },
  error:   { base: "#ef4444", bg: "bg-red-100 dark:bg-red-900/30",     text: "text-red-700 dark:text-red-400" },
  info:    { base: "#3b82f6", bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-700 dark:text-blue-400" },
} as const;
```

#### Typography Scale

```typescript
export const typography = {
  heading1: "text-2xl font-bold",
  heading2: "text-lg font-semibold",
  heading3: "text-base font-semibold",
  body:     "text-base",
  caption:  "text-sm",
  label:    "text-xs font-medium uppercase tracking-wide",
  japanese: "font-japanese",
} as const;
```

#### Spacing, Radii, Icon Sizes

```typescript
export const spacing = {
  cardPadding:   "p-4",
  sectionGap:    "gap-4",
  screenPadding: "px-4",
} as const;

export const radii = {
  card:   "rounded-2xl",
  button: "rounded-xl",
  input:  "rounded-xl",
  badge:  "rounded-full",
  chip:   "rounded-full",
} as const;

export const iconSize = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;
```

#### Raw Colors

For use with components that require raw color values (FontAwesome `color` prop, `ActivityIndicator`, `style` objects):

```typescript
export const rawColors = {
  sakura500: "#ec4899",
  sakura600: "#db2777",
  gray400:   "#9ca3af",
  gray500:   "#6b7280",
  green500:  "#22c55e",
  amber600:  "#d97706",
  red500:    "#ef4444",
  blue500:   "#3b82f6",
  white:     "#ffffff",
  orange500: "#f97316",
  yellow500: "#eab308",
} as const;
```

### 1.2 Extend `tailwind.config.js`

Add any missing semantic aliases to the theme. No breaking changes - all existing classes remain valid. This is minimal since the existing config already covers our primary colors.

### Token Usage Guidance

- **All new UI code** must use tokens from `@/constants/tokens` instead of inline className strings.
- **Existing code** will be migrated incrementally as files are touched in Phases 2-4.
- **Escape hatch:** Raw className strings are allowed only when a token doesn't exist yet. Add a `// TODO: add token` comment so it gets picked up in future passes.

### Files Created/Modified

| File | Action |
|------|--------|
| `/constants/tokens.ts` | **Create** |
| `/tailwind.config.js` | **Modify** (add semantic aliases if needed) |

### Definition of Done

- [ ] `constants/tokens.ts` exports all token objects (`colors`, `status`, `typography`, `spacing`, `radii`, `iconSize`, `rawColors`)
- [ ] `npx tsc --noEmit` passes with no type errors
- [ ] `npx expo start` - app renders identically (no visual changes)
- [ ] All existing className strings still work (no breaking Tailwind changes)

---

## Phase 2: UI Primitives

> Create a new `/components/ui/` directory of pure presentational components that depend only on tokens.

### Key Rules for `/components/ui/`

- **No store imports** - primitives are pure presentation, data flows in via props
- Every component accepts optional `className` prop for escape-hatch overrides
- Every interactive component includes accessibility attributes by default
- `japanese` prop on Text ensures `font-japanese` is always applied correctly

### Migration Strategy

Replace existing inline patterns in this order to minimize churn (each step builds on the last):

1. **ScreenHeader** - replace 7+ duplicated headers first (highest duplication, zero risk)
2. **Text** - apply to the extracted screen components as they're touched
3. **ProgressBar** - replace 6+ hand-built bars
4. **IconBadge** - replace 7+ icon circle patterns
5. **Chip** - replace duplicated tab patterns in SectionTabs and JLPT unit screen
6. **Badge, InfoCard, SectionHeader** - apply opportunistically as components are touched

### 2.1 `Text.tsx` - Semantic Typography

**Replaces:** 100+ instances of `text-gray-900 dark:text-white` / `text-lg font-semibold` scattered across files.

```typescript
interface TextProps {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'label';
  japanese?: boolean;
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'error';
  className?: string;
  children: React.ReactNode;
}
```

**Accessibility defaults:**
- `allowFontScaling={true}` by default (respects system font size)
- `maxFontSizeMultiplier={1.5}` for headings to prevent layout breakage
- `accessibilityRole="header"` auto-applied when variant is `heading1`-`heading3`

**Current patterns this replaces:**
- `<Text className="text-lg font-semibold text-gray-900 dark:text-white">` -> `<Text variant="heading2">`
- `<Text className="text-sm text-gray-500 dark:text-gray-400">` -> `<Text variant="caption" color="muted">`
- `<Text className="text-xl font-bold text-gray-900 dark:text-white font-japanese">` -> `<Text variant="heading1" japanese>`

### 2.2 `Badge.tsx` - Status Pill

**Replaces:** Done/Coming Soon/streak badges in LessonCard, SectionTabs, AchievementsList.

```typescript
interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'info' | 'default' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}
```

**Current patterns this replaces:**
- Quiz score badges in `SectionTabs.tsx:47-54`
- Unlock/lock status indicators in `AchievementsList.tsx`
- "Coming Soon" labels

### 2.3 `IconBadge.tsx` - Circle with Icon

**Replaces:** The `w-N h-N bg-X-100 rounded-full items-center justify-center` pattern repeated with inconsistent sizes across:
- `StreakDisplay.tsx:40-49` (w-12 h-12)
- `XPDisplay.tsx:37` (w-10 h-10)
- `AchievementsList.tsx:34` (w-12 h-12)
- `LevelCard.tsx:56` (w-14 h-14)
- `CultureNote.tsx:14` (w-10 h-10)
- `mock-exam.tsx:424` (w-20 h-20)
- `mock-exam.tsx:450` (w-10 h-10)

```typescript
interface IconBadgeProps {
  icon: string;    // FontAwesome icon name
  color: string;   // raw hex color for the icon
  bgClassName: string; // NativeWind bg class (e.g. "bg-orange-100 dark:bg-orange-900/30")
  size?: 'sm' | 'md' | 'lg' | 'xl';  // sm=w-8 h-8, md=w-10 h-10, lg=w-12 h-12, xl=w-14 h-14
  className?: string;
}
```

### 2.4 `ProgressBar.tsx` - Linear Progress

**Replaces:** Hand-built progress bars in 6+ locations:
- `XPDisplay.tsx:56-60` (h-2, yellow-500)
- `LevelCard.tsx:76-81` (h-2, sakura-500/green-500)
- `VocabQuiz.tsx:126-131` (h-1, sakura-500)
- `mock-exam.tsx:556-563` (h-2, green-500/red-500)
- `mock-exam.tsx:642-649` (h-1, sakura-500)
- `jlpt/[level]/index.tsx:87-92` (h-3, purple-500)

```typescript
interface ProgressBarProps {
  progress: number;   // 0-100
  color?: 'sakura' | 'green' | 'yellow' | 'blue' | 'purple' | 'red';
  size?: 'sm' | 'md';  // sm=h-1, md=h-2
  className?: string;
}
```

### 2.5 `InfoCard.tsx` - Callout/Notice Card

**Replaces:** Various callout patterns:
- `CultureNote.tsx` (culture variant)
- Grammar cultural insight boxes in `GrammarSection.tsx:112-123`
- Info panels in `jlpt/index.tsx:114-124`
- Warning/important panels in `mock-exam.tsx:464-477`

```typescript
interface InfoCardProps {
  variant: 'info' | 'warning' | 'success' | 'culture' | 'tip';
  title?: string;
  icon?: string;    // FontAwesome icon name override
  children: React.ReactNode;
  className?: string;
}
```

### 2.6 `ScreenHeader.tsx` - Standard Screen Header

**Replaces:** The identical header pattern duplicated across 7+ screens:
- `app/lesson/[topic].tsx:232-244` (GenkiLessonScreen)
- `app/lesson/[topic].tsx:478-490` (AILessonScreen)
- `app/jlpt/[level]/[unitId].tsx:195-207`
- `app/jlpt/index.tsx:66-78`
- `app/jlpt/[level]/index.tsx:64-74`
- `app/jlpt/[level]/mock-exam.tsx:413-419`
- `components/practice/VocabQuiz.tsx:115-123`

All follow this pattern:
```jsx
<View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
  <Pressable onPress={handleBack} className="p-2 -ml-2">
    <FontAwesome name="chevron-left" size={20} color="#ec4899" />
  </Pressable>
  <View className="flex-1 ml-2">
    <Text className="text-lg font-semibold text-gray-900 dark:text-white">{title}</Text>
    <Text className="text-sm text-sakura-600">{subtitle}</Text>
  </View>
</View>
```

```typescript
interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}
```

**Accessibility defaults:**
- Back button: `accessibilityRole="button"`, `accessibilityLabel="Go back"`
- Title: `accessibilityRole="header"`
- When `onBack` is undefined, the back button is not rendered

### 2.7 `SectionHeader.tsx` - Content Section Title

**Replaces:** The `text-sm font-semibold text-gray-500 uppercase` label pattern used in:
- `VocabularyList.tsx:37-39`
- `GrammarSection.tsx:127-129`
- `jlpt/[level]/[unitId].tsx:122` ("Questions")

```typescript
interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;  // e.g. "See All" button
  className?: string;
}
```

### 2.8 `Chip.tsx` - Selectable Pill/Tab

**Replaces:** The duplicated tab/chip selection pattern between:
- `SectionTabs.tsx:57-92` (Genki lesson section tabs)
- `jlpt/[level]/[unitId].tsx:216-242` (JLPT unit section tabs)

Both follow the same visual pattern of horizontally-scrollable pills with an icon + label.

```typescript
interface ChipItem {
  id: string;
  label: string;
  icon?: string;  // FontAwesome icon name
}

interface ChipProps {
  items: ChipItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}
```

### 2.9 `index.ts` - Barrel Export

```typescript
export { Text } from './Text';
export { Badge } from './Badge';
export { IconBadge } from './IconBadge';
export { ProgressBar } from './ProgressBar';
export { InfoCard } from './InfoCard';
export { ScreenHeader } from './ScreenHeader';
export { SectionHeader } from './SectionHeader';
export { Chip } from './Chip';
```

### Files Created

| File | Lines (est.) |
|------|-------------|
| `/components/ui/Text.tsx` | ~40 |
| `/components/ui/Badge.tsx` | ~35 |
| `/components/ui/IconBadge.tsx` | ~30 |
| `/components/ui/ProgressBar.tsx` | ~25 |
| `/components/ui/InfoCard.tsx` | ~50 |
| `/components/ui/ScreenHeader.tsx` | ~40 |
| `/components/ui/SectionHeader.tsx` | ~20 |
| `/components/ui/Chip.tsx` | ~55 |
| `/components/ui/index.ts` | ~10 |

### Files to Reference (existing patterns to preserve)

- `/components/common/Button.tsx` - variant pattern, haptic feedback, accessibility
- `/components/common/Input.tsx` - focus/error states, accessibility
- `/components/common/Card.tsx` - className passthrough pattern
- `/components/lesson/SectionTabs.tsx` - tab/chip selection pattern

### Definition of Done

- [ ] All 9 files created in `/components/ui/`
- [ ] Each primitive renders correctly on iOS simulator + web
- [ ] Dark mode works for all primitives
- [ ] Japanese text renders with correct font in `<Text japanese>`
- [ ] Accessibility inspector shows correct roles/labels (header role on headings, button role on back)
- [ ] No store imports in any `/components/ui/` file
- [ ] Every new primitive is used in at least one screen (verified via grep)
- [ ] Before/after screenshots captured for Genki lesson screen, JLPT unit screen, and JLPT hub screen to verify no visual regressions

---

## Phase 3: Content Normalization

> Create unified content interfaces so any data source (Genki, JLPT, AI) feeds the same UI components.

### Current Problem

The JLPT unit screen (`app/jlpt/[level]/[unitId].tsx`) converts JLPT data to Genki format inline with `as any` casts:

```typescript
// Line 74-86: Vocabulary conversion with 2 `as any` casts
const vocabItems = unit.sections.vocabulary.map((v) => ({
  id: v.id,
  japanese: v.word,        // JLPT: word -> Genki: japanese
  reading: v.reading,
  english: v.meaning,      // JLPT: meaning -> Genki: english
  partOfSpeech: v.partOfSpeech as any,  // <-- as any
  example: { ... },
}));
return <VocabularyList vocabulary={vocabItems as any} />;  // <-- as any

// Line 99-107: Grammar conversion with 1 `as any` cast
const grammarPoints = unit.sections.grammar.map((g) => ({
  id: g.id,
  pattern: g.pattern,
  meaning: g.meaning,       // JLPT has meaning, Genki doesn't
  formation: g.formation,   // JLPT has formation, Genki doesn't
  examples: g.examples,
  notes: g.notes,
}));
return <GrammarSection grammarPoints={grammarPoints as any} />;  // <-- as any
```

### 3.1 Create `/types/content.ts` - Unified Types

Source-agnostic interfaces that cover the superset of fields from both Genki and JLPT:

#### Fallback Conventions

- **Unknown part of speech:** Map to `'other'`
- **Missing optional strings** (`romaji`, `category`, `notes`, `culturalNote`, `formation`): Use `undefined` (not empty string)
- **Missing `example`:** Use `undefined` (not an empty object)
- **Source traceability:** The `id` field preserves the original source ID. The `source` field identifies which system it came from. Together they allow tracing back to the original Genki/JLPT/AI record.

```typescript
// Union of part-of-speech values from both sources
type ContentPartOfSpeech =
  | 'noun' | 'verb' | 'i-adjective' | 'na-adjective'
  | 'adverb' | 'particle' | 'expression' | 'counter'
  | 'prefix' | 'suffix' | 'conjunction' | 'other';

// Source-agnostic vocabulary
interface ContentVocabulary {
  id: string;
  japanese: string;        // Genki.japanese | JLPT.word
  reading: string;
  english: string;         // Genki.english | JLPT.meaning
  partOfSpeech: ContentPartOfSpeech;
  romaji?: string;         // Genki has this, JLPT doesn't
  category?: string;
  notes?: string;
  example?: { japanese: string; reading: string; english: string };
  audioFile?: string;
  source: 'genki' | 'jlpt' | 'ai';
}

// Source-agnostic grammar example
interface ContentGrammarExample {
  japanese: string;
  reading: string;
  english: string;
  breakdown?: string;     // Genki has this
}

// Source-agnostic grammar
interface ContentGrammar {
  id: string;
  title?: string;          // Genki has this
  pattern: string;
  meaning?: string;        // JLPT has this
  explanation: string;
  formation?: string;      // JLPT has this
  culturalNote?: string;   // Genki has this
  examples: ContentGrammarExample[];
  notes?: string;
  relatedGrammar?: string[];
  source: 'genki' | 'jlpt' | 'ai';
}
```

**Runtime validation (future):** AI-generated content is unpredictable. When the AI content source is implemented, add zod schemas for `ContentVocabulary` and `ContentGrammar` to validate at the adapter boundary. Not needed for Genki/JLPT since those are statically typed at build time.

### 3.2 Create `/lib/adapters/genkiAdapter.ts`

Pure functions that convert Genki types to unified content types:

```typescript
import { VocabularyItem, GrammarPoint } from '@/types/genki';
import { ContentVocabulary, ContentGrammar } from '@/types/content';

export function toContentVocabulary(item: VocabularyItem): ContentVocabulary { ... }
export function toContentGrammar(point: GrammarPoint): ContentGrammar { ... }

// Batch helpers
export function toContentVocabularyList(items: VocabularyItem[]): ContentVocabulary[] { ... }
export function toContentGrammarList(points: GrammarPoint[]): ContentGrammar[] { ... }
```

### 3.3 Create `/lib/adapters/jlptAdapter.ts`

Pure functions that convert JLPT types to unified content types:

```typescript
import { JLPTVocabulary, JLPTGrammar } from '@/data/jlpt/types';
import { ContentVocabulary, ContentGrammar } from '@/types/content';

export function toContentVocabulary(item: JLPTVocabulary): ContentVocabulary { ... }
export function toContentGrammar(point: JLPTGrammar): ContentGrammar { ... }

// Batch helpers
export function toContentVocabularyList(items: JLPTVocabulary[]): ContentVocabulary[] { ... }
export function toContentGrammarList(points: JLPTGrammar[]): ContentGrammar[] { ... }
```

### 3.4 Migrate Component Props to Unified Types

| Component | Current Props | New Props |
|-----------|--------------|-----------|
| `VocabularyList.tsx` | `VocabularyItem[]` (from `@/types/genki`) | `ContentVocabulary[]` |
| `GrammarSection.tsx` | `GrammarPoint[]` (from `@/types/genki`) | `ContentGrammar[]` |
| `VocabQuiz.tsx` | `VocabularyItem[]` (from `@/types/genki`) | `ContentVocabulary[]` |
| `lib/quizUtils.ts` | `VocabularyItem` (from `@/types/genki`) | `ContentVocabulary` |

**Key consideration:** `VocabularyList` currently accesses `item.romaji` which exists on `VocabularyItem` but not on `JLPTVocabulary`. With `ContentVocabulary`, `romaji` becomes optional (`romaji?: string`), so `VocabularyList` needs a null check.

### 3.5 Update Screen Consumers

#### `app/jlpt/[level]/[unitId].tsx`

**Before (lines 74-86):**
```typescript
const vocabItems = unit.sections.vocabulary.map((v) => ({
  id: v.id,
  japanese: v.word,
  reading: v.reading,
  english: v.meaning,
  partOfSpeech: v.partOfSpeech as any,
  example: { ... },
}));
return <VocabularyList vocabulary={vocabItems as any} />;
```

**After:**
```typescript
import { toContentVocabularyList } from '@/lib/adapters/jlptAdapter';

const vocabItems = toContentVocabularyList(unit.sections.vocabulary);
return <VocabularyList vocabulary={vocabItems} />;
```

#### `app/lesson/[topic].tsx` (SectionRenderer)

Use adapters at the SectionRenderer boundary:

```typescript
import { toContentVocabularyList, toContentGrammarList } from '@/lib/adapters/genkiAdapter';

// In vocabulary case:
return <VocabularyList vocabulary={toContentVocabularyList(section.content.vocabulary)} />;

// In grammar case:
return <GrammarSection grammarPoints={toContentGrammarList(section.content.grammar)} />;
```

### Files Created/Modified

| File | Action |
|------|--------|
| `/types/content.ts` | **Create** |
| `/lib/adapters/genkiAdapter.ts` | **Create** |
| `/lib/adapters/jlptAdapter.ts` | **Create** |
| `/components/lesson/VocabularyList.tsx` | **Modify** - change prop type |
| `/components/lesson/GrammarSection.tsx` | **Modify** - change prop type |
| `/components/practice/VocabQuiz.tsx` | **Modify** - change prop type |
| `/lib/quizUtils.ts` | **Modify** - change param type |
| `/app/jlpt/[level]/[unitId].tsx` | **Modify** - use adapter |
| `/app/lesson/[topic].tsx` | **Modify** - use adapter in SectionRenderer |

### Definition of Done

- [ ] `npx tsc --noEmit` passes with zero `as any` casts for content types
- [ ] Zero inline conversion code remaining in `app/jlpt/[level]/[unitId].tsx`
- [ ] All vocabulary/grammar mapping goes through adapter functions
- [ ] Genki lesson vocabulary/grammar renders correctly
- [ ] JLPT unit vocabulary/grammar renders correctly
- [ ] Quiz works for both Genki and JLPT content sources
- [ ] `VocabularyList` gracefully handles missing `romaji` (no crash, conditionally hidden)

---

## Phase 4: Screen Decomposition

> Break monolithic screens into thin composition layers.

### Migration Strategy

Extract in this order to reduce risk (each step is independently verifiable):

1. **Extract hooks** (`useLessonCompletion`, `useDialogueAudio`, `useQuizSession`) - pure logic moves, no UI changes
2. **Extract `SectionRenderer`** into its own file - already a standalone function, just move it
3. **Extract `LessonContent`** (markdown renderer) - already a standalone function, just move it
4. **Split `GenkiLessonScreen` and `AILessonScreen`** into separate files - wire up hooks + extracted components
5. **Slim route handler** - delete the moved code from `[topic].tsx`
6. **Repeat for JLPT** - extract `ReadingSection`, `ListeningSection`, `JLPTUnitScreen`
7. **Replace inline headers** with `<ScreenHeader>` across all screens

### 4.1 Extract Hooks from `/app/lesson/[topic].tsx`

#### `useLessonCompletion.ts` (~30 lines)

Extracted from both `GenkiLessonScreen` and `AILessonScreen` which share identical completion logic:

**Current code (duplicated in both):**
```typescript
const { completeLesson, isLessonCompleted } = useProgressStore();
const [isMarkedComplete, setIsMarkedComplete] = useState(false);
const startTimeRef = useRef<number>(Date.now());

const handleMarkComplete = () => {
  const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
  completeLesson(lessonId, timeSpent);
  setIsMarkedComplete(true);
};
```

**New hook:**
```typescript
export function useLessonCompletion(lessonId: string) {
  // Returns: { isMarkedComplete, wasAlreadyCompleted, handleMarkComplete }
}
```

#### `useDialogueAudio.ts` (~40 lines)

Extracted from `GenkiLessonScreen` lines 179-216:

```typescript
export function useDialogueAudio(lesson: GenkiLesson | undefined) {
  // Returns: { currentAudioUri, currentAudioTitle, handlePlayFullDialogue, getLineAudioPath, clearAudio }
}
```

#### `useQuizSession.ts` (~50 lines)

Extracted from `GenkiLessonScreen` quiz state management (lines 156-158, 188-192) and VocabQuiz question generation logic:

```typescript
export function useQuizSession() {
  // Returns: { showQuiz, quizVocabulary, quizSectionId, handleStartQuiz, handleCloseQuiz }
}
```

### 4.2 Decompose Lesson Screen

**Before:** `/app/lesson/[topic].tsx` (671 lines, 1 file)

**After:**

| File | Lines (est.) | Responsibility |
|------|-------------|----------------|
| `/app/lesson/[topic].tsx` | ~50 | Route handler: decides Genki vs AI vs error |
| `/components/lesson/GenkiLessonScreen.tsx` | ~100 | Orchestrates Genki lesson with hooks + SectionRenderer |
| `/components/lesson/AILessonScreen.tsx` | ~80 | Orchestrates AI lesson with hooks + LessonContent |
| `/components/lesson/SectionRenderer.tsx` | ~50 | Switch on section type, delegates to section components |
| `/components/lesson/LessonContent.tsx` | ~90 | Markdown-like content renderer (extract from current inline) |

#### Route handler (`/app/lesson/[topic].tsx`) after decomposition:

```typescript
export default function LessonScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  // ... load settings, check config ...

  if (!isAIConfigured) return <ConfigRequiredScreen />;
  if (isGenki) return <GenkiLessonScreen lessonId={topic!} />;
  if (!isOnline) return <OfflineScreen />;
  return <AILessonScreen topic={topic!} />;
}
```

### 4.3 Decompose JLPT Unit Screen

**Before:** `/app/jlpt/[level]/[unitId].tsx` (251 lines)

**After:**

| File | Lines (est.) | Responsibility |
|------|-------------|----------------|
| `/app/jlpt/[level]/[unitId].tsx` | ~40 | Route handler: loads unit data, delegates |
| `/components/jlpt/JLPTUnitScreen.tsx` | ~60 | Orchestrates unit with tabs + content switching |
| `/components/jlpt/ReadingSection.tsx` | ~50 | Reading practice (currently inline lines 110-143) |
| `/components/jlpt/ListeningSection.tsx` | ~50 | Listening practice (currently inline lines 145-185) |

### 4.4 Replace Inline Headers with `<ScreenHeader>`

Screens to update:

| Screen | Current header lines | Notes |
|--------|---------------------|-------|
| `app/lesson/[topic].tsx` (Genki) | 232-244 | Back + title + Japanese subtitle |
| `app/lesson/[topic].tsx` (AI) | 478-490 | Back + title + description |
| `app/jlpt/[level]/[unitId].tsx` | 195-207 | Back + unit title + Japanese theme |
| `app/jlpt/index.tsx` | 66-78 | Back + "JLPT Courses" + subtitle |
| `app/jlpt/[level]/index.tsx` | 64-74 | Back + level name + subtitle |
| `app/jlpt/[level]/mock-exam.tsx` | 413-419 | Back + exam title |
| `components/practice/VocabQuiz.tsx` | 115-123 | Close + question counter |

### Memoization Guidance

When decomposing, apply memoization where parent re-renders would cause unnecessary child re-renders:

- **`SectionRenderer`**: Wrap with `React.memo` since it receives the same section object unless the user switches tabs
- **`LessonContent`**: Wrap with `React.memo` since markdown content doesn't change after generation
- **`getLineAudioPath`**: Already wrapped in `useCallback` - preserve this when moving to `useDialogueAudio`
- **Adapter calls** (`toContentVocabularyList`, etc.): Wrap in `useMemo` at the screen level since the source data is static per render

### Files Created/Modified

| File | Action |
|------|--------|
| `/hooks/useLessonCompletion.ts` | **Create** |
| `/hooks/useDialogueAudio.ts` | **Create** |
| `/hooks/useQuizSession.ts` | **Create** |
| `/app/lesson/[topic].tsx` | **Modify** - slim to ~50 line route handler |
| `/components/lesson/GenkiLessonScreen.tsx` | **Create** |
| `/components/lesson/AILessonScreen.tsx` | **Create** |
| `/components/lesson/SectionRenderer.tsx` | **Create** (extract from [topic].tsx) |
| `/components/lesson/LessonContent.tsx` | **Create** (extract from [topic].tsx) |
| `/app/jlpt/[level]/[unitId].tsx` | **Modify** - slim to ~40 line route handler |
| `/components/jlpt/JLPTUnitScreen.tsx` | **Create** |
| `/components/jlpt/ReadingSection.tsx` | **Create** |
| `/components/jlpt/ListeningSection.tsx` | **Create** |
| `app/jlpt/index.tsx` | **Modify** - use ScreenHeader |
| `app/jlpt/[level]/index.tsx` | **Modify** - use ScreenHeader |
| `app/jlpt/[level]/mock-exam.tsx` | **Modify** - use ScreenHeader |

### Definition of Done

- [ ] All screens render identically to before decomposition
- [ ] Navigation (back buttons, tabs) works correctly
- [ ] Audio playback works in Genki lesson dialogues
- [ ] Quiz flow works end-to-end (open quiz -> answer -> results -> close)
- [ ] No file exceeds ~150 lines
- [ ] `app/lesson/[topic].tsx` is under 60 lines
- [ ] `app/jlpt/[level]/[unitId].tsx` is under 50 lines
- [ ] Before/after screenshots match for Genki lesson, AI lesson, JLPT unit screens

---

## Phase 5: Layer Contracts & Enforcement

> Formalize boundaries so parallel workstreams don't break each other.

### 5.1 Dependency Direction

```
Layer                         Can Import From
─────────────────────────────────────────────────────────
Screens (app/)             -> Hooks, UI Components, Adapters, Stores
Hooks (hooks/)             -> Stores, Lib utilities
UI Primitives (components/ui/) -> Tokens ONLY (no store imports!)
Adapters (lib/adapters/)   -> Types only
Content (data/)            -> Types only
Stores (stores/)           -> AsyncStorage, no UI imports
```

**Note:** Existing `XPDisplay` and `StreakDisplay` in `/components/common/` import from `progressStore` - they stay in `/components/common/` (not `/components/ui/`) since they're stateful composites, not pure primitives.

### 5.2 Enforce via ESLint

Create `/components/ui/.eslintrc.json` for the strictest layer:

```json
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [
        { "group": ["@/stores/*"], "message": "UI primitives must not import from stores. Pass data via props." },
        { "group": ["@/data/*"], "message": "UI primitives must not import from data. Pass data via props." }
      ]
    }]
  }
}
```

**Future enforcement:** Consider adding `eslint-plugin-boundaries` or `import/no-restricted-paths` at the repo root to enforce the full dependency direction table above (not just `components/ui/`). This is not required for Phase 5 but is the recommended next step once the team is comfortable with the layer structure.

### 5.3 Create `/types/contracts.ts`

Export formal interfaces so layer boundaries are typed:

```typescript
// Content provider interface - any data source must implement this
interface ContentProvider {
  getVocabulary(id: string): ContentVocabulary[];
  getGrammar(id: string): ContentGrammar[];
}

// Store selector types for typed store access
type ProgressSelector<T> = (state: ProgressState) => T;
type SettingsSelector<T> = (state: SettingsState) => T;
```

### Files Created

| File | Action |
|------|--------|
| `/components/ui/.eslintrc.json` | **Create** |
| `/types/contracts.ts` | **Create** |

### Definition of Done

- [ ] ESLint reports error if someone adds a store import to `/components/ui/`
- [ ] `npx tsc --noEmit` passes with contract types
- [ ] All existing code still compiles
- [ ] Dependency direction table matches actual import graph (spot-check 3-4 files per layer)

---

## Execution Order & Parallelism

```
Phase 1 (Tokens)     ████████░░░░░░░░  Foundation - must go first
Phase 2 (Primitives) ░░░░████████░░░░  Can start once tokens exist
Phase 3 (Content)    ░░░░████████░░░░  Independent of Phase 2
Phase 4 (Screens)    ░░░░░░░░████████  Depends on Phase 2+3
Phase 5 (Contracts)  ░░░░░░░░░░░░████  Final formalization
```

### Dependencies

```
Phase 1 -> Phase 2 (primitives import tokens)
Phase 1 -> Phase 3 (independent, just needs types)
Phase 2 + Phase 3 -> Phase 4 (screens use primitives + unified types)
Phase 4 -> Phase 5 (contracts formalize what Phase 4 established)
```

### After Phase 1+2 Complete, Three Parallel Workstreams Unlock

1. **Design** - refine tokens, add primitives, polish dark mode (no feature code touched)
2. **Content** - add lessons/units targeting `ContentVocabulary`/`ContentGrammar` interfaces
3. **Logic** - build hooks, improve stores, add API features (UI components just compose)

---

## Complete File Inventory

### New Files (25 total)

| File | Phase | Est. Lines |
|------|-------|-----------|
| `constants/tokens.ts` | 1 | ~100 |
| `components/ui/Text.tsx` | 2 | ~40 |
| `components/ui/Badge.tsx` | 2 | ~35 |
| `components/ui/IconBadge.tsx` | 2 | ~30 |
| `components/ui/ProgressBar.tsx` | 2 | ~25 |
| `components/ui/InfoCard.tsx` | 2 | ~50 |
| `components/ui/ScreenHeader.tsx` | 2 | ~40 |
| `components/ui/SectionHeader.tsx` | 2 | ~20 |
| `components/ui/Chip.tsx` | 2 | ~55 |
| `components/ui/index.ts` | 2 | ~10 |
| `types/content.ts` | 3 | ~60 |
| `lib/adapters/genkiAdapter.ts` | 3 | ~40 |
| `lib/adapters/jlptAdapter.ts` | 3 | ~40 |
| `hooks/useLessonCompletion.ts` | 4 | ~30 |
| `hooks/useDialogueAudio.ts` | 4 | ~40 |
| `hooks/useQuizSession.ts` | 4 | ~50 |
| `components/lesson/GenkiLessonScreen.tsx` | 4 | ~100 |
| `components/lesson/AILessonScreen.tsx` | 4 | ~80 |
| `components/lesson/SectionRenderer.tsx` | 4 | ~50 |
| `components/lesson/LessonContent.tsx` | 4 | ~90 |
| `components/jlpt/JLPTUnitScreen.tsx` | 4 | ~60 |
| `components/jlpt/ReadingSection.tsx` | 4 | ~50 |
| `components/jlpt/ListeningSection.tsx` | 4 | ~50 |
| `components/ui/.eslintrc.json` | 5 | ~12 |
| `types/contracts.ts` | 5 | ~30 |

### Modified Files (10 total)

| File | Phase | Change |
|------|-------|--------|
| `tailwind.config.js` | 1 | Add semantic aliases |
| `components/lesson/VocabularyList.tsx` | 3 | Change prop type to `ContentVocabulary[]` |
| `components/lesson/GrammarSection.tsx` | 3 | Change prop type to `ContentGrammar[]` |
| `components/practice/VocabQuiz.tsx` | 3 | Change prop type to `ContentVocabulary[]` |
| `lib/quizUtils.ts` | 3 | Change param type to `ContentVocabulary` |
| `app/lesson/[topic].tsx` | 4 | Slim to ~50 line route handler |
| `app/jlpt/[level]/[unitId].tsx` | 4 | Slim to ~40 line route handler |
| `app/jlpt/index.tsx` | 4 | Use ScreenHeader |
| `app/jlpt/[level]/index.tsx` | 4 | Use ScreenHeader |
| `app/jlpt/[level]/mock-exam.tsx` | 4 | Use ScreenHeader |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Breaking existing UI during refactor | Each phase has its own verification step; run `npx tsc --noEmit` + visual check after each |
| NativeWind className strings not working | Tokens use pre-built static strings, no interpolation |
| Content adapter missing fields | TypeScript strict mode catches missing required fields at compile time |
| Screen decomposition breaking navigation | Expo Router routing stays in `app/` files; only the body is extracted |
| Store imports sneaking into UI primitives | ESLint rule in Phase 5 catches this at lint time |
| Performance regression from decomposition | Memoization guidance in Phase 4 covers key components |
| Token/Tailwind drift | tokens.ts documented as authoritative source; sync checklist in Phase 1 |
