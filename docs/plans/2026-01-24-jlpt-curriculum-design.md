# JLPT Curriculum: N5 to N1 Complete Course

**Date:** 2026-01-24
**Status:** Draft

## Overview

Expand nihonGO to cover the full JLPT curriculum from N5 to N1. Uses a hybrid approach: Genki textbooks provide N5-N4 foundations, then JLPT-focused themed units take over for N3-N1. Content is sourced from open community resources and expanded with AI-generated materials.

## Learning Path

```
┌─────────────────────────────────────────────────────────┐
│  ALPHABETS (Entry Point)                                │
│  Hiragana → Katakana → Basic Kanji                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  GENKI 1 (N5 Foundation)          unlocks → N4 Content  │
│  Lessons 1-12                                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  GENKI 2 (N4 Foundation)          unlocks → N3 Content  │
│  Lessons 13-23                                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  N3 JLPT Course (Intermediate)                          │
│  Themed units + Mock exam     pass exam → unlocks N2    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  N2 JLPT Course (Upper Intermediate)                    │
│  Themed units + Mock exam     pass exam → unlocks N1    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  N1 JLPT Course (Advanced)                              │
│  Themed units + Mock exam                               │
└─────────────────────────────────────────────────────────┘
```

## Level Requirements

| Level | Unlock Requirement | Content Source |
|-------|-------------------|----------------|
| Alphabets | None (starting point) | Custom |
| N5 (Genki 1) | Complete alphabets (recommended) | Genki textbook |
| N4 (Genki 2) | Complete Genki 1 | Genki textbook |
| N3 | Complete Genki 2 | JLPT resources + AI |
| N2 | Pass N3 mock exam (≥60%) | JLPT resources + AI |
| N1 | Pass N2 mock exam (≥60%) | JLPT resources + AI |

## Themed Unit Structure

Each JLPT level (N3-N1) contains 10 themed units. Each unit covers all skills:

```
Unit Example: N3 Unit 1 - Daily Life (日常生活)
├── Vocabulary (30-40 words related to theme)
├── Kanji (10-15 kanji used in theme context)
├── Grammar (3-5 grammar patterns)
├── Reading (1-2 passages using unit content)
├── Listening (2-3 audio exercises)
└── Unit Review Quiz
```

## Themes by Level

### N3 (Intermediate)

| Unit | Theme | Theme (Japanese) | Topics |
|------|-------|------------------|--------|
| 1 | Daily Life | 日常生活 | Routines, household, neighborhood |
| 2 | Work & Office | 仕事 | Meetings, emails, workplace culture |
| 3 | Health & Body | 健康 | Medical visits, symptoms, wellness |
| 4 | Travel & Transport | 旅行・交通 | Reservations, directions, tourism |
| 5 | Shopping & Services | 買い物・サービス | Returns, complaints, banking |
| 6 | Education | 教育 | School life, studying, exams |
| 7 | Media & Entertainment | メディア | News, TV, movies, internet |
| 8 | Relationships | 人間関係 | Family, friends, social situations |
| 9 | Nature & Environment | 自然・環境 | Weather, seasons, geography |
| 10 | Review + Mock Exam | 復習・模試 | Full N3 practice test |

### N2 (Upper Intermediate)

| Unit | Theme | Theme (Japanese) | Topics |
|------|-------|------------------|--------|
| 1 | Business Japanese | ビジネス日本語 | Formal speech, negotiations, reports |
| 2 | Current Events | 時事問題 | Politics, economics, social issues |
| 3 | Science & Technology | 科学・技術 | Innovation, research, digital life |
| 4 | Culture & Traditions | 文化・伝統 | Customs, festivals, history |
| 5 | Law & Society | 法律・社会 | Rules, rights, civic life |
| 6 | Academia | 学術 | Research, presentations, papers |
| 7 | Psychology & Emotions | 心理・感情 | Abstract feelings, motivations |
| 8 | Literature & Arts | 文学・芸術 | Reviews, critiques, creative writing |
| 9 | Advanced Opinions | 意見・議論 | Debates, arguments, nuance |
| 10 | Review + Mock Exam | 復習・模試 | Full N2 practice test |

### N1 (Advanced)

| Unit | Theme | Theme (Japanese) | Topics |
|------|-------|------------------|--------|
| 1 | Formal & Literary Japanese | 文語・書き言葉 | Classical patterns, written style |
| 2 | Business Mastery | ビジネス上級 | Keigo, contracts, high-level negotiation |
| 3 | Academic Writing | 学術論文 | Thesis, citations, formal argumentation |
| 4 | Journalism | 報道・ジャーナリズム | Editorial style, reporting, analysis |
| 5 | Legal & Official | 法律・公文書 | Documents, regulations, bureaucracy |
| 6 | Philosophy & Abstract | 哲学・抽象 | Complex ideas, nuanced expression |
| 7 | Regional & Historical | 方言・歴史 | Dialects, archaic forms, etymology |
| 8 | Idiomatic Mastery | 慣用表現 | Proverbs, four-character compounds |
| 9 | Native-Level Nuance | ニュアンス | Subtle distinctions, implied meaning |
| 10 | Review + Mock Exam | 復習・模試 | Full N1 practice test |

## Data Model

### Types

```typescript
// types/jlpt.ts

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

interface JLPTUnit {
  id: string;                    // "n3-unit-01"
  level: JLPTLevel;
  unitNumber: number;
  theme: string;                 // "Daily Life"
  themeJapanese: string;         // "日常生活"
  sections: {
    vocabulary: JLPTVocabulary[];
    kanji: JLPTKanji[];
    grammar: JLPTGrammar[];
    reading: JLPTReading[];
    listening: JLPTListening[];
  };
}

interface JLPTVocabulary {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleReading: string;
  exampleMeaning: string;
}

interface JLPTKanji {
  id: string;
  character: string;
  onYomi: string[];
  kunYomi: string[];
  meaning: string;
  strokeCount: number;
  strokeOrder: string[];         // SVG paths
  commonWords: { word: string; reading: string; meaning: string }[];
  chineseNote?: string;          // For users with Chinese background
}

interface JLPTGrammar {
  id: string;
  pattern: string;               // "〜ために"
  meaning: string;               // "in order to"
  formation: string;             // "Verb dictionary form + ために"
  explanation: string;
  examples: { japanese: string; reading: string; english: string }[];
  similarPatterns?: string[];    // References to related grammar
}

interface JLPTReading {
  id: string;
  title: string;
  passage: string;
  passageReading: string;        // With furigana markup
  questions: ReadingQuestion[];
  source?: string;               // Attribution if from open source
}

interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface JLPTListening {
  id: string;
  title: string;
  audioUri: string;
  transcript: string;
  transcriptReading: string;
  questions: ListeningQuestion[];
}

interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}
```

## Mock Exam Format

Each level ends with a mock exam matching official JLPT structure:

### N3 Mock Exam (~100 minutes)

| Section | Questions | Time |
|---------|-----------|------|
| Vocabulary | 25 questions | 15 min |
| Grammar | 20 questions | 20 min |
| Reading | 15 questions | 40 min |
| Listening | 20 questions | 25 min |
| **Total** | **80 questions** | **100 min** |

### N2 Mock Exam (~120 minutes)

| Section | Questions | Time |
|---------|-----------|------|
| Vocabulary | 30 questions | 20 min |
| Grammar | 25 questions | 25 min |
| Reading | 20 questions | 45 min |
| Listening | 25 questions | 30 min |
| **Total** | **100 questions** | **120 min** |

### N1 Mock Exam (~140 minutes)

| Section | Questions | Time |
|---------|-----------|------|
| Vocabulary | 35 questions | 25 min |
| Grammar | 30 questions | 30 min |
| Reading | 25 questions | 50 min |
| Listening | 30 questions | 35 min |
| **Total** | **120 questions** | **140 min** |

### Mock Exam Features

- Timed mode (enforced) or practice mode (untimed)
- Section-by-section results breakdown
- Review wrong answers with explanations
- Track best scores and attempt history
- Retake anytime (questions shuffle from pool)
- Passing threshold: 60% overall

## Progression System

```typescript
// stores/progressStore.ts additions

interface LevelProgress {
  level: JLPTLevel;
  unitsCompleted: string[];      // Unit IDs
  mockExamAttempts: MockExamAttempt[];
  unlocked: boolean;
  unlockedAt?: string;
}

interface MockExamAttempt {
  id: string;
  level: JLPTLevel;
  date: string;
  totalScore: number;            // Percentage
  sectionScores: {
    vocabulary: number;
    grammar: number;
    reading: number;
    listening: number;
  };
  passed: boolean;               // ≥60%
  timeSpent: number;             // Seconds
}

// Unlock logic
function checkUnlock(level: JLPTLevel): boolean {
  switch (level) {
    case 'N5': return true;  // Always available (Genki 1)
    case 'N4': return isGenki1Complete();
    case 'N3': return isGenki2Complete();
    case 'N2': return hasPassed('N3');
    case 'N1': return hasPassed('N2');
  }
}
```

## Content Sources

| Content Type | Primary Source | AI Expansion |
|--------------|---------------|--------------|
| Vocabulary lists | Tanos.co.uk, JLPT Sensei | Generate example sentences |
| Kanji lists | KanjiVG, KANJIDIC | Generate common word associations |
| Grammar patterns | Bunpro, Tae Kim, JLPT Sensei | Generate additional examples |
| Reading passages | NHK Easy News (N3-N4), Aozora Bunko (N2-N1) | Generate theme-matched passages |
| Listening | AI TTS initially | Native recordings as future enhancement |
| Mock exam questions | Community resources | Generate varied question pools |

## File Structure

```
/data/
  jlpt/
    types.ts                     # JLPT type definitions
    sources.ts                   # Attribution for open source content
    n3/
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
        index.ts
      mockExam.ts                # Question pool for N3 exam
      index.ts
    n4/
      units/
      mockExam.ts
      index.ts
    n5/
      units/
      mockExam.ts
      index.ts
    n2/
      units/
      mockExam.ts
      index.ts
    n1/
      units/
      mockExam.ts
      index.ts
    index.ts
```

## New Components

```
/components/
  jlpt/
    UnitCard.tsx                 # Unit preview with progress
    VocabularySection.tsx        # Vocab list with quiz trigger
    KanjiSection.tsx             # Kanji cards with writing practice
    GrammarSection.tsx           # Grammar explanations + practice
    ReadingSection.tsx           # Passage display + questions
    ListeningSection.tsx         # Audio player + questions
    MockExam.tsx                 # Timed exam interface
    ExamTimer.tsx                # Countdown timer for sections
    ExamResults.tsx              # Score breakdown + review
    LevelProgress.tsx            # Progress bar + stats
    LockedLevel.tsx              # Shows unlock requirements
```

## New Screens

```
/app/
  jlpt/
    index.tsx                    # JLPT hub (level selection)
    [level]/
      index.tsx                  # Level overview (unit list)
      [unitId].tsx               # Unit lesson screen
      mock-exam.tsx              # Mock exam screen
      results.tsx                # Exam results screen
```

## Implementation Phases

### Phase 1: Foundation
- Alphabet lessons (separate design doc)
- Progress tracking infrastructure
- Level unlock system
- JLPT type definitions

### Phase 2: N3 Content
- Build full N3 course (10 units)
- N3 mock exam
- Reading and listening components
- Validates the JLPT unit structure before scaling

### Phase 3: N4/N5 Supplements
- Optional JLPT-style practice for Genki levels
- N4 and N5 mock exams
- Bridges Genki content to JLPT format

### Phase 4: N2 Content
- Full N2 course (10 units)
- N2 mock exam

### Phase 5: N1 Content
- Full N1 course (10 units)
- N1 mock exam

### Phase 6: Enhancements
- SRS flashcard system
- Native audio recordings
- Stroke accuracy validation
- AI-powered practice conversations

## Out of Scope (Future Features)

- SRS flashcard system for long-term retention
- Native speaker audio recordings
- AI conversation practice
- Handwriting recognition with accuracy scoring
- Study groups / social features
- Offline mode for JLPT content
