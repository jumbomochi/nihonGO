# Grammar Comparison Feature

**GitHub Issue:** #4
**Date:** 2026-01-21
**Status:** Approved

## Overview

Add side-by-side comparison view for similar grammar points to help learners understand subtle differences. Accessed via "Compare" button on grammar cards, opens a modal with curated comparison content.

## Data Model

### GrammarComparison Type

```typescript
// types/genki.ts addition
interface GrammarComparison {
  id: string;
  grammarA: string;  // ID of first grammar point
  grammarB: string;  // ID of second grammar point
  keyDifferences: {
    aspect: string;      // e.g., "Formality", "Usage"
    grammarA: string;    // How A handles this
    grammarB: string;    // How B handles this
  }[];
  commonMistakes: string[];
  usageTip: string;
  contrastExamples: {
    situation: string;
    grammarA: { japanese: string; english: string };
    grammarB: { japanese: string; english: string };
  }[];
}
```

### Comparison Pairs (Lesson 1-2)

- は vs が (topic vs subject marker)
- です vs だ (polite vs casual copula)
- か vs の (question particles)

## Component Architecture

### New Files

| File | Purpose |
|------|---------|
| `components/lesson/GrammarComparison.tsx` | Modal displaying comparison |
| `data/genki/comparisons.ts` | Pre-defined comparison data |

### Modal Layout

```
┌─────────────────────────────────┐
│ [X]  Grammar Comparison         │  Header with close
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Grammar A (compact card)    │ │
│ └─────────────────────────────┘ │
│                                 │
│ ═══ Key Differences ═══════════ │
│ • Aspect 1: A vs B              │
│ • Aspect 2: A vs B              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Grammar B (compact card)    │ │
│ └─────────────────────────────┘ │
│                                 │
│ 💡 Usage Tip                    │
│ ⚠️ Common Mistakes              │
│ 📝 Contrast Examples            │
└─────────────────────────────────┘
```

### GrammarCard Changes

- Add "Compare" button (only visible when `relatedGrammar` exists)
- Button triggers `onCompare` callback with comparison ID

## Data Flow

```
GrammarCard has relatedGrammar[]
        ↓
User taps "Compare" button
        ↓
Look up GrammarComparison by ID
        ↓
Open modal with comparison data
        ↓
Modal displays both grammar points + differences
```

## Lookup Functions

```typescript
// data/genki/comparisons.ts
export function getComparison(id: string): GrammarComparison | undefined;
export function getComparisonForPair(grammarA: string, grammarB: string): GrammarComparison | undefined;
export function hasComparison(grammarId: string): boolean;
```

## Implementation Order

1. Add `GrammarComparison` type to `types/genki.ts`
2. Create `data/genki/comparisons.ts` with comparison data
3. Create `GrammarComparison.tsx` modal component
4. Update `GrammarSection.tsx` with comparison state and modal
5. Update `GrammarCard` with "Compare" button
6. Update grammar points in lesson data with `relatedGrammar` references

## Out of Scope

- AI-generated comparisons
- User-submitted comparisons
- Comparison history/bookmarks
