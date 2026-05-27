# SRS Review Mode — Design (WIP)

**Status:** Draft — brainstorming paused after section 2 of 4.
**Started:** 2026-05-27
**Approach selected:** B — unified SRS abstraction.

## Decisions locked in

| Question | Answer |
|---|---|
| Content scope (v1) | Kana + vocabulary (no kanji/grammar yet) |
| Session UX | Multiple-choice, 4 options |
| Entry point | Home-screen card + Profile-tab badge |
| Enrollment trigger | On vocab quiz completion — initial mastery seeded from per-item quiz performance |
| Algorithm | Reuse existing fixed intervals `[1, 2, 4, 7, 14, 30]` days (no SM-2 for v1) |

## Section 1 — Data model & store ✅ approved

Single unified mastery map keyed by `${type}:${id}`:

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

**Store changes (`stores/progressStore.ts`):**
- Replace `characterMastery: Record<string, CharacterMastery>` with `srsItems: Record<string, SrsItem>`.
- New actions: `enrollSrsItem(item)`, `gradeSrsItem(itemKey, correct)`, `getDueSrsItems(type?)`, `getDueCount(type?)`.
- Delete `updateCharacterMastery` / `getCharactersDueForReview`; migrate call-sites.

**Per-type adapter (`lib/srs/adapters.ts`):**
```typescript
export const srsAdapters: Record<SrsItemType, SrsAdapter> = { kana, vocab };
// each adapter: promptText, answerText, generateDistractors(pool, item)
```

**Migration (`lib/srs/migration.ts`):**
One-time hydrator in persist's `onRehydrateStorage`. If `state.characterMastery` exists and `state.srsItems` is empty → walk each entry, write `srsItems['kana:'+id]` with proper payload, drop `characterMastery`.

## Section 2 — Components & screens ✅ approved

**New files (5):**
- `types/srs.ts`
- `lib/srs/adapters.ts`
- `lib/srs/migration.ts`
- `components/srs/ReviewSession.tsx` — full-screen MCQ, type-agnostic
- `components/srs/DailyReviewCard.tsx` — home-screen entry card

**Modified files:**
- `stores/progressStore.ts` — schema swap + new actions + migration hook
- `app/(tabs)/index.tsx` — mount `DailyReviewCard` near top
- `app/(tabs)/_layout.tsx` — Profile tab badge bound to `getDueCount()`
- `components/practice/VocabQuiz.tsx` — on completion, enroll each word
- `components/alphabet/AlphabetLessonScreen.tsx` — swap `updateCharacterMastery` → `gradeSrsItem`
- `components/games/MatchingGame.tsx`, `SpeedChallenge.tsx` — same call-site rename
- `components/alphabet/ReviewQueue.tsx` — delete (replaced by `DailyReviewCard`)

**`ReviewSession` UI layout:**
```
┌─────────────────────────────────────┐
│ [✕]           3 / 12          🔥 5  │
├─────────────────────────────────────┤
│ ████████████░░░░░░░░░░░░░░░░░░░░░░ │
├─────────────────────────────────────┤
│         こんにちは                   │
│           (こんにちは)               │  reading hint (vocab only)
├─────────────────────────────────────┤
│  [ Hello                          ] │
│  [ Good evening                   ] │
│  [ Excuse me                      ] │
│  [ Goodbye                        ] │
└─────────────────────────────────────┘
```

Brief correct/incorrect flash → auto-advance (reuses `SpeedChallenge` pattern). End screen shows items reviewed, accuracy, XP earned (10/item correct, half for incorrect). Session capped at 20 items; surface "20 of N" if more due.

**`DailyReviewCard` states:**
- Due items: orange accent + "X items due · Start review" + breakdown ("12 kana · 8 vocab")
- All caught up: green + "Next review in ~Xh" (from min `nextReviewDate`)
- Empty pool: muted + CTA linking to nearest unfinished lesson

**Profile tab badge:** Expo Router `tabBarBadge` bound to `getDueCount()`. Hidden when 0.

## Open sections (resume here next session)

- **Section 3 — Data flow & error handling:** vocab quiz → enrollment payload shape; what happens when an enrolled item's source vocab/kana is later removed from content; offline behaviour; duplicate enrollment guard; how the session handles fewer than 4 items in the pool (distractor fallback strategy); XP integration.
- **Section 4 — Testing:** unit tests for adapter MCQ generation, migration shim with real persisted-store fixture, store actions; integration test for VocabQuiz → enrollment flow; manual test plan for the review session UI.

After both sections approved: spec self-review → user reviews written spec → invoke `superpowers:writing-plans`.
