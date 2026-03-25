# JLPT Content Development Session - January 28, 2026

## Summary

This session completed the JLPT curriculum content for all levels (N5-N1) and fixed several UI/UX issues in the app.

## Completed Work

### 1. JLPT Content Creation

**All 5 JLPT levels now have complete content:**

| Level | Units | Focus | Status |
|-------|-------|-------|--------|
| N5 | 10 | Exam-focused supplement to Genki I | ✅ Complete |
| N4 | 10 | Exam-focused supplement to Genki II | ✅ Complete |
| N3 | 10 | Intermediate (standalone) | ✅ Complete |
| N2 | 10 | Upper Intermediate (standalone) | ✅ Complete |
| N1 | 10 | Advanced (standalone) | ✅ Complete |

### 2. N5/N4 Redesign

Originally, N5/N4 duplicated Genki content. Redesigned to be **exam-focused supplements**:

**N5 Units (Exam Prep for Genki I learners):**
1. Exam Overview & Test Strategies
2. Vocabulary: Numbers & Counters
3. Vocabulary: Supplementary
4. Grammar: Exam Patterns
5. Reading: Signs & Menus
6. Reading: Short Passages
7. Listening: Task-Based
8. Listening: Quick Response
9. Practice Test 1
10. Practice Test 2

**N4 Units (Exam Prep for Genki II learners):**
1. Exam Overview & N4 Strategies
2. Vocabulary: Intermediate
3. Vocabulary: Work & Social
4. Grammar: Intermediate Patterns
5. Grammar: Complex Sentences
6. Reading: Notices & Instructions
7. Reading: Essays & Letters
8. Listening: Conversations
9. Listening: Integrated Comprehension
10. Full Practice Test

### 3. UI/UX Fixes

- **Removed API key from home screen** - Now only appears in Profile settings
- **Default AI provider changed to Ollama** - No longer defaults to Claude
- **Chat screen fix** - Only shows "API Key Required" for Claude, not Ollama
- **Removed N5/N4 redirect** - Users can now access N5/N4 content directly
- **Fixed unit loading** - Unit detail page now loads all levels (was only N3)
- **Fixed section tabs** - Constrained height so tabs don't stretch vertically
- **Added accessibility attributes** - JLPT cards have proper a11y labels

### 4. Files Modified

**New/Regenerated:**
- `data/jlpt/n5/units/` - 10 exam-focused unit files
- `data/jlpt/n4/units/` - 10 exam-focused unit files
- `data/jlpt/n5/index.ts` - Updated imports
- `data/jlpt/n4/index.ts` - Updated imports

**Fixed:**
- `app/(tabs)/index.tsx` - Removed API key section
- `app/(tabs)/chat.tsx` - Added AI provider check
- `app/jlpt/index.tsx` - Removed N5/N4 redirect, updated subtitles
- `app/jlpt/[level]/index.tsx` - Already supported all levels
- `app/jlpt/[level]/[unitId].tsx` - Added all level imports, fixed tab height
- `stores/settingsStore.ts` - Default to Ollama
- `components/jlpt/UnitCard.tsx` - Accessibility attributes
- `components/jlpt/LevelCard.tsx` - Accessibility attributes

### 5. Commits (not yet pushed)

```
bc7fc75 fix: constrain section tabs height in JLPT unit page
3957564 fix: load unit data for all JLPT levels (N5-N1)
2cedc4d fix: add accessibility attributes to JLPT card components
61c9b8d fix: remove N5/N4 redirect to Genki, enable direct JLPT access
78a0966 refactor: redesign N5/N4 as exam-focused supplements to Genki
```

## Known Issues

1. **Git push failing** - SSH key permission denied; needs manual push
2. **aria-hidden warning** - React Native Web issue during navigation transitions (cosmetic)

## Content Statistics

| Level | Vocabulary | Kanji | Grammar | Reading | Listening |
|-------|------------|-------|---------|---------|-----------|
| N5 | ~30/unit | ~10/unit | ~4/unit | 2/unit | 2/unit |
| N4 | ~35/unit | ~12/unit | ~5/unit | 2/unit | 2/unit |
| N3 | ~40/unit | ~15/unit | ~6/unit | 2/unit | 2/unit |
| N2 | ~45/unit | ~18/unit | ~7/unit | 2/unit | 2/unit |
| N1 | ~50/unit | ~18/unit | ~8/unit | 2/unit | 2/unit |
