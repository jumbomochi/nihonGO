# nihonGO Asset Generation Prompts

Prompts for generating custom illustrations for the app. Use a consistent mascot character across all assets for cohesive brand identity.

## Style Guide

**Base style directive** (prepend to all prompts):
> Flat vector illustration, kawaii Japanese style, soft pastel palette (primary: sakura pink #ec4899, accents: white, light gray #f3f4f6, warm gold #f59e0b). Clean lines, minimal detail, mobile app illustration. No text, no watermarks. Transparent or white background. 1024x1024 PNG.

**Mascot**: Friendly tanuki (Japanese raccoon dog) with round features, small eyes, wearing a tiny sakura petal on its head. Consistent across all illustrations.

---

## Splash Screen / App Launch

> [style guide] A friendly tanuki character standing in the center, holding a large speech bubble containing the hiragana character ご. A few cherry blossom petals drift gently around it. The tanuki looks welcoming with a slight head tilt. Simple, centered composition suitable for a loading screen.

**Usage**: `components/common/AnimatedSplash.tsx` — replaces the 🌸 emoji
**Size**: 512x512 (displays at 112x112pt, needs 3x retina)

---

## Chat Empty State — Tutor Welcome

> [style guide] The tanuki tutor sitting cross-legged at a low Japanese chabudai table with a cup of matcha tea. One paw is raised in a friendly wave. A small open notebook with Japanese characters sits on the table. Two cherry blossom petals float nearby. The scene feels warm, inviting, and approachable — like meeting a friend for a study session.

**Usage**: `app/(tabs)/chat.tsx` — replaces the flag emoji in the empty state
**Size**: 512x512 (displays at 80x80pt)

---

## Lesson Completion Celebration

> [style guide] The tanuki jumping joyfully with arms raised, eyes closed in a happy expression. Small sparkles and cherry blossom petals surround it in a burst pattern. A tiny gold star floats above its head. The mood is celebratory but gentle — encouraging, not over the top.

**Usage**: `components/lesson/CompletionCelebration.tsx` — replaces the 🎉 emoji
**Size**: 512x512 (displays at ~120x120pt)

---

## Locked Content / Coming Soon

> [style guide] The tanuki peeking over a traditional wooden torii gate, standing on tiptoes with curious wide eyes. Behind the gate, cherry blossom trees are partially visible, suggesting something beautiful awaits. A small wooden sign hangs on the gate. The mood is curious and encouraging — "keep going, you're almost there."

**Usage**: Locked JLPT levels, locked kanji section, coming soon lessons
**Size**: 512x512

---

## Empty Lesson List

> [style guide] The tanuki sitting on a stack of books, looking up at a single cherry blossom petal falling from above. The stack has 3-4 books of different sizes. The tanuki's expression is peaceful and expectant — ready to start learning. Minimal background.

**Usage**: Empty state when no lessons completed yet
**Size**: 512x512

---

## Error State

> [style guide] The tanuki sitting with a slightly confused expression, holding a torn piece of paper. A small sweat drop on its forehead. One cherry blossom petal is wilted on the ground beside it. The mood is sympathetic — "something went wrong, but it's okay."

**Usage**: `components/common/ErrorBoundary.tsx`, network errors, load failures
**Size**: 512x512

---

## Quiz / Practice Ready

> [style guide] The tanuki in a determined pose, wearing a small hachimaki headband (white with a red circle). One paw is clenched in a "let's do this" fist pump. A few sparkle effects around it. The mood is energetic and focused — ready for a challenge.

**Usage**: Quiz start screens, practice mode entry, speed challenge
**Size**: 512x512

---

## Streak / Daily Review

> [style guide] The tanuki running happily along a path made of stepping stones, each stone has a small cherry blossom on it. Behind the tanuki, the stones glow warmly (representing completed days). Ahead, the stones are lighter (days to come). A small flame icon floats near the tanuki. The mood is momentum — keep the streak going.

**Usage**: Streak display, daily review prompt, profile stats
**Size**: 512x512

---

## Onboarding — Welcome

> [style guide] The tanuki standing with open arms in a welcoming gesture, surrounded by floating hiragana characters (あ い う え お) in soft pink bubbles. Cherry blossom branch in the upper corner. The mood is warm and exciting — the beginning of a journey.

**Usage**: First onboarding screen (`welcome.tsx`)
**Size**: 512x512

---

## Onboarding — Complete / Profile Ready

> [style guide] The tanuki giving a thumbs up with a confident smile, wearing the sakura petal on its head. A small graduation scroll or certificate is tucked under its other arm. A few sparkles and one cherry blossom petal. The mood is "you're all set, let's go!"

**Usage**: Final onboarding screen (`complete.tsx`)
**Size**: 512x512

---

## Kana Character Learning

> [style guide] The tanuki holding up a large card showing a single hiragana character (あ), like a teacher showing a flashcard to a class. The tanuki is smiling encouragingly. The card has a subtle sakura pink border. Clean, simple composition.

**Usage**: Kana lesson screens, character card headers
**Size**: 512x512

---

## Notes

- Generate all assets at 1024x1024 for maximum quality, they'll be downscaled in the app
- Export as PNG with transparent background where possible
- Keep the tanuki proportions and features identical across all illustrations
- If the generator struggles with "tanuki", try "cute round raccoon character, Japanese style"
- Test each asset against both light and dark backgrounds before integrating
