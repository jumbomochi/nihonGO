# N3 JLPT Course Implementation Plan

**Date:** 2026-01-27
**Status:** Approved

## Overview

Build the complete N3 JLPT course with 10 themed units, mock exam, and integration into the existing nihonGO app.

## Scope

- 10 themed units with vocabulary, kanji, grammar, reading, listening
- N3 mock exam (80 questions, 100 minutes)
- JLPT section in Learn tab
- Progress tracking and level unlock system

## Data Structure

```
/data/jlpt/
  types.ts
  n3/
    index.ts
    units/
      unit01-daily-life.ts
      unit02-work-office.ts
      unit03-health.ts
      unit04-travel.ts
      unit05-shopping.ts
      unit06-education.ts
      unit07-media.ts
      unit08-relationships.ts
      unit09-nature.ts
      unit10-review-exam.ts
    mockExam.ts
```

## UI Components

**New Screens:**
- `/app/jlpt/index.tsx` - JLPT hub
- `/app/jlpt/[level]/index.tsx` - Level overview
- `/app/jlpt/[level]/[unitId].tsx` - Unit lesson
- `/app/jlpt/[level]/mock-exam.tsx` - Timed exam

**New Components:**
- `LevelCard.tsx` - Level with progress/lock state
- `UnitCard.tsx` - Unit preview
- `KanjiCard.tsx` - Kanji display
- `ReadingPassage.tsx` - Passage with furigana
- `ListeningPlayer.tsx` - Audio with transcript
- `ExamTimer.tsx` - Countdown timer
- `ExamResults.tsx` - Score breakdown

## Content Per Unit

| Content | Count |
|---------|-------|
| Vocabulary | 35 words |
| Kanji | 12 characters |
| Grammar | 5 patterns |
| Reading | 1-2 passages |
| Listening | 2-3 exercises |

## N3 Unit Themes

1. Daily Life (日常生活)
2. Work & Office (仕事)
3. Health & Body (健康)
4. Travel & Transport (旅行・交通)
5. Shopping & Services (買い物・サービス)
6. Education (教育)
7. Media & Entertainment (メディア)
8. Relationships (人間関係)
9. Nature & Environment (自然・環境)
10. Review + Mock Exam (復習・模試)

## Mock Exam Structure

| Section | Questions | Time |
|---------|-----------|------|
| Vocabulary | 25 | 15 min |
| Grammar | 20 | 20 min |
| Reading | 15 | 40 min |
| Listening | 20 | 25 min |
| **Total** | **80** | **100 min** |

Pass threshold: 60%

## Unlock Logic

- N3: Unlocks after completing Genki 2 (Lesson 23)
- N2: Unlocks after passing N3 mock exam (≥60%)
- N1: Unlocks after passing N2 mock exam (≥60%)

## Implementation Tasks

### Phase 1: Foundation
1. Create JLPT type definitions (`types.ts`)
2. Add JLPT progress tracking to `progressStore.ts`
3. Create JLPT hub screen and add to Learn tab

### Phase 2: Components
4. Create LevelCard component
5. Create UnitCard component
6. Create KanjiCard component
7. Create ReadingPassage component
8. Create ListeningPlayer component

### Phase 3: N3 Content (Units 1-5)
9. Generate Unit 1: Daily Life
10. Generate Unit 2: Work & Office
11. Generate Unit 3: Health & Body
12. Generate Unit 4: Travel & Transport
13. Generate Unit 5: Shopping & Services

### Phase 4: N3 Content (Units 6-10)
14. Generate Unit 6: Education
15. Generate Unit 7: Media & Entertainment
16. Generate Unit 8: Relationships
17. Generate Unit 9: Nature & Environment
18. Create Unit 10: Review structure

### Phase 5: Mock Exam
19. Create ExamTimer component
20. Create ExamResults component
21. Create mock exam screen
22. Generate N3 mock exam question pool

### Phase 6: Audio & Polish
23. Generate TTS audio for vocabulary
24. Generate TTS audio for listening exercises
25. Final integration testing
