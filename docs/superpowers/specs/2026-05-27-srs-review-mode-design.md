# SRS Review Mode — Design

**Status:** Approved (pending user spec review)
**Date:** 2026-05-27
**Approach:** Unified SRS abstraction (single mastery map keyed by `${type}:${id}`)

## Goal

Add a daily spaced-repetition review surface across kana and vocabulary. Reuse the existing kana mastery scaffolding (`characterMastery`, intervals `[1, 2, 4, 7, 14, 30]` days, `ReviewQueue.tsx`) by promoting it to a generic SRS layer so kanji and grammar can be added later as adapters without further schema work.

## Decisions

| Question | Answer |
|---|---|
| Content scope (v1) | Kana + vocabulary |
| Session UX | Multiple-choice, 4 options |
| Entry point | Home-screen card + Profile-tab badge |
| Enrollment trigger | On vocab quiz completion (seeded from per-item quiz performance) |
| Algorithm | Existing fixed intervals — no SM-2 |

## 1. Data model & store

Single mastery map keyed by `${type}:${id}`:

```typescript
// types/srs.ts
export type SrsItemType = 'kana' | 'vocab';

export interface SrsItem {
  itemKey: string;          // "kana:hiragana-a" | "vocab:greetings-konnichiwa"
  type: SrsItemType;
  refId: string;
  correctCount: number;
  incorrectCount: number;
  masteryLevel: number;     // 0-5
  lastReviewedAt: string;
  nextReviewDate: string;
  payload: KanaPayload | VocabPayload;
}

interface KanaPayload { kind: 'kana'; character: string; romaji: string; }
interface VocabPayload { kind: 'vocab'; japanese: string; reading: string; english: string; lessonId: string; }
```

`payload` is denormalised so the review queue and session do not need to join against `data/alphabet` or `data/genki` at runtime.

### Store changes (`stores/progressStore.ts`)

- Replace `characterMastery: Record<string, CharacterMastery>` with `srsItems: Record<string, SrsItem>`.
- New actions:
  - `enrollSrsItem(input: SrsEnrollInput): void` — idempotent insert; no-op if `itemKey` already exists
  - `gradeSrsItem(itemKey: string, correct: boolean, payload?: SrsItem['payload']): void` — upsert; creates the item from `payload` if it doesn't exist (used by kana call-sites), otherwise updates counts and mastery
  - `getDueSrsItems(type?: SrsItemType): SrsItem[]`
  - `getDueCount(type?: SrsItemType): number`

```typescript
interface SrsEnrollInput {
  itemKey: string;
  type: SrsItemType;
  refId: string;
  payload: SrsItem['payload'];
  seedCorrect: boolean;  // first-attempt grade, sets initial counts and mastery
}
```
- Remove `updateCharacterMastery` and `getCharactersDueForReview`; update the 5 call-sites (kana lesson screen, matching game, speed challenge — see "Modified files" below).

### Per-type adapter (`lib/srs/adapters.ts`)

```typescript
export interface SrsAdapter {
  promptText(item: SrsItem): string;
  promptHint?(item: SrsItem): string;     // e.g. vocab reading
  answerText(item: SrsItem): string;
  generateDistractors(item: SrsItem, corpus: SrsItem[]): string[];  // returns 3
}
export const srsAdapters: Record<SrsItemType, SrsAdapter> = { kana, vocab };
```

Distractor pool: items of the same `type` already in `srsItems`. Fallback when the pool has < 4 candidates: pad from the full content corpus (`ALL_HIRAGANA` / `ALL_KATAKANA`, or all known vocab for the user's level).

### Migration (`lib/srs/migration.ts`)

One-shot in persist's `onRehydrateStorage`. If `state.characterMastery` exists and `state.srsItems` is empty:
1. Walk each `characterMastery` entry.
2. Look up the kana payload from `data/alphabet`.
3. Write `srsItems['kana:' + id]` with original counts and timestamps preserved.
4. Drop `characterMastery`.

Orphan IDs (no match in `data/alphabet`) are dropped and logged via Sentry; migration continues. Re-running on already-migrated state is a no-op.

## 2. Components & screens

### New files

| File | Purpose |
|---|---|
| `types/srs.ts` | `SrsItem`, `SrsItemType`, payload types |
| `lib/srs/adapters.ts` | Per-type prompt/answer/distractor logic |
| `lib/srs/migration.ts` | One-shot `characterMastery → srsItems` shim |
| `components/srs/ReviewSession.tsx` | Full-screen MCQ session, type-agnostic |
| `components/srs/DailyReviewCard.tsx` | Home-screen entry card |

### Modified files

| File | Change |
|---|---|
| `stores/progressStore.ts` | Schema swap + new actions + migration hook |
| `app/(tabs)/index.tsx` | Mount `DailyReviewCard` near top |
| `app/(tabs)/_layout.tsx` | Profile-tab `tabBarBadge` bound to `getDueCount()` |
| `components/practice/VocabQuiz.tsx` | On completion, enroll each word via `enrollSrsItem` |
| `components/alphabet/AlphabetLessonScreen.tsx` | Swap `updateCharacterMastery` → `gradeSrsItem('kana:'+id, correct)` |
| `components/games/MatchingGame.tsx` | Same call-site rename |
| `components/games/SpeedChallenge.tsx` | Same call-site rename |
| `components/alphabet/ReviewQueue.tsx` | Delete (replaced by `DailyReviewCard`) |

### `ReviewSession` UI

```
┌─────────────────────────────────────┐
│ [✕]           3 / 12          🔥 5  │  Progress + correct streak
├─────────────────────────────────────┤
│ ████████████░░░░░░░░░░░░░░░░░░░░░░ │  Session progress bar
├─────────────────────────────────────┤
│         こんにちは                   │  Prompt (from adapter)
│           (こんにちは)               │  Reading hint (vocab only)
├─────────────────────────────────────┤
│  [ Hello                          ] │
│  [ Good evening                   ] │
│  [ Excuse me                      ] │
│  [ Goodbye                        ] │
└─────────────────────────────────────┘
```

Brief correct/incorrect flash → auto-advance (reuses `SpeedChallenge` pattern). End screen: items reviewed, accuracy, XP earned. Session capped at 20 items; if `>20` due, end screen offers "Review remaining N".

### `DailyReviewCard` states

- **Due items:** orange accent + "X items due · Start review" button + breakdown ("12 kana · 8 vocab")
- **All caught up:** green accent + "Next review in ~Xh" (from min `nextReviewDate`)
- **Empty pool:** muted + CTA "Finish a vocab quiz or kana lesson to start building your review queue" → links to nearest unfinished lesson

### Profile tab badge

Standard Expo Router `tabBarBadge` bound to `getDueCount()`. Hidden when 0.

## 3. Data flow & error handling

### Enrollment (vocab quiz → SRS)

`VocabQuiz` already tracks per-question correctness. On completion:

```typescript
// vocab is already in scope inside VocabQuiz — no new lookup helper needed
results.forEach(({ vocab, wasCorrect }) => {
  enrollSrsItem({
    itemKey: `vocab:${vocab.id}`,
    type: 'vocab',
    refId: vocab.id,
    payload: { kind: 'vocab', japanese: vocab.japanese, reading: vocab.reading, english: vocab.english, lessonId },
    seedCorrect: wasCorrect,
  });
});
```

`enrollSrsItem` is idempotent — if `itemKey` already exists, it returns early without modifying state. Re-taking a quiz does not reset progress.

### Kana enrollment

Kana entries are written by `gradeSrsItem` on the first practice/quiz/game answer — call-sites pass the `payload` argument (built from the kana corpus) along with the grade. If the item doesn't exist, `gradeSrsItem` creates it with `correctCount: correct ? 1 : 0`, `incorrectCount: correct ? 0 : 1`, then runs the existing mastery math (current `updateCharacterMastery` formula). No separate enrollment call needed for kana — preserves the current "answer your first character → it enters the SRS" behaviour.

### Due queue assembly

```typescript
const now = new Date().toISOString();
return Object.values(srsItems)
  .filter(item => item.nextReviewDate <= now)
  .filter(item => !type || item.type === type)
  .sort((a, b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
```

Session takes the first 20 from this sorted list.

### Session grading

On MCQ answer:
1. Compare against `srsAdapters[item.type].answerText(item)`.
2. `gradeSrsItem(itemKey, correct)` — runs the existing mastery math (intervals `[1, 2, 4, 7, 14, 30]` based on level).
3. `addXp(correct ? 10 : 5)` — `addXp` already updates `lastActivityDate` for streaks.
4. Update local session state (correct-answer streak, accuracy).

### Edge cases

| Scenario | Behaviour |
|---|---|
| Distractor pool has < 4 candidates | Adapter pads from full content corpus (`ALL_HIRAGANA` / all known vocab). Always returns 4. |
| Source content removed (lesson edit) | Review still works — `payload` is the snapshot. UI skips "back to lesson" link if `lessonId` no longer resolves. |
| Corrupt persist (item without payload) | `getDueSrsItems` filters out items where adapter is undefined. Logged once via Sentry. |
| Session opened with 0 due items | Should never happen (entry card hidden). Defensive end-screen "All caught up" + close. |
| Migration encounters orphan ID | Drop entry, log to Sentry, continue. |
| Offline | Full flow works — store is local AsyncStorage. No network calls. |

### XP / streak integration

- Correct answer: `+10 XP` (also bumps `lastActivityDate`)
- Incorrect answer: `+5 XP`
- Session 100% accuracy: bonus via existing `recordPerfectQuiz()` (+25 XP)

### Non-goals for v1

- Per-lesson review filter
- "Only items I got wrong" filter
- Leech detection / suspension
- Undo last answer
- Review history log
- Server sync

## 4. Testing

### Unit tests

**`__tests__/progressStore.srs.test.ts`**
- `enrollSrsItem` with `seedCorrect: true` → mastery 1, `nextReviewDate` ≈ now+1d
- `enrollSrsItem` with `seedCorrect: false` → mastery 0, `nextReviewDate` ≈ now+1d
- `enrollSrsItem` twice with same `itemKey` → second call is a no-op
- `gradeSrsItem` correct on level-3 item → level becomes 4, `nextReviewDate` jumps to +14d
- `gradeSrsItem` incorrect → existing accuracy formula reduces level
- `getDueSrsItems()` returns only items where `nextReviewDate <= now`, sorted oldest first
- `getDueSrsItems('kana')` filters by type
- `getDueCount()` matches `getDueSrsItems().length`

**`__tests__/adapters.test.ts`**
- Kana adapter: `promptText` = character, `answerText` = romaji, 3 unique non-correct distractors
- Vocab adapter: `promptText` = japanese, `promptHint` = reading, `answerText` = english, 3 unique non-correct distractors
- Distractor fallback: corpus < 4 candidates → pads from full content set, never returns < 4
- Distractors never contain the correct answer

**`__tests__/migration.test.ts`**
- Fixture: persisted state JSON with old `characterMastery` shape
- After migration: `srsItems` populated with `kana:`-prefixed keys, payloads correctly filled, `characterMastery` deleted
- Re-running on already-migrated state: no-op
- Orphan character ID: dropped, others unaffected, completes successfully

### Integration test

**`__tests__/VocabQuiz.enrollment.test.tsx`**
- Render `VocabQuiz` with mock vocab and store
- Answer 3 correct, 2 incorrect, complete quiz
- Assert 5 `srsItems` entries created with matching `seedCorrect` values
- Re-run same quiz: existing entries unchanged

### Manual test plan

To be run on physical device after implementation:
1. Empty pool → home card shows empty CTA; Profile tab has no badge
2. First enrollment → complete a vocab quiz → home card flips to "X items due"; badge appears
3. 5 due items → all correct → end screen 5/5, +50 XP, "All caught up"
4. 5 items, mixed → mastery levels and next-due dates update correctly
5. Enroll 25 items, open session → shows 20, end-screen offers "Review remaining 5"
6. Regression: existing kana quiz/matching/speed-challenge still grade items
7. Migration: install with old persisted state → first launch migrates without data loss; review session works on migrated items
8. Airplane mode → entire review flow works
9. Complete session → badge decrements live; hits 0 → badge hides

### Out of scope for v1

- Performance benchmarks (defer until pool > 1000 items)
- Snapshot tests for `ReviewSession` UI
- E2E tests (no Detox in repo)
