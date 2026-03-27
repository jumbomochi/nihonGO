# JLPT Audio Generation & Listening Playback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate TTS audio for all JLPT levels and wire the AudioPlayer into ListeningSection so users can play listening exercises.

**Architecture:** Run the existing `generate-jlpt-audio.py` script for all 5 levels. Add a utility to construct audio paths following the same pattern as Genki audio (relative string paths passed to `Audio.Sound.createAsync({ uri })`). Modify ListeningSection to embed the existing AudioPlayer component. Pass level/unit context from JLPTUnitScreen.

**Tech Stack:** `edge-tts` (Python, for generation), `expo-av` (runtime playback via existing AudioPlayer component)

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/jlptAudio.ts` | Create | Construct audio path strings for JLPT content |
| `components/jlpt/ListeningSection.tsx` | Modify | Add AudioPlayer integration, transcript toggle |
| `components/jlpt/JLPTUnitScreen.tsx` | Modify | Pass level and unitNumber to ListeningSection |
| `assets/audio/generated/jlpt/` | Create (via script) | Generated MP3 audio files |

---

### Task 1: Generate JLPT Audio Files

Run the existing generation script for all 5 levels. This is a script execution task.

**Files:**
- Run: `scripts/generate-jlpt-audio.py`
- Output: `assets/audio/generated/jlpt/{n5,n4,n3,n2,n1}/unit{01-10}/`

- [ ] **Step 1: Install edge-tts**

```bash
pip install edge-tts
```

- [ ] **Step 2: Dry-run for N5 unit 1 to verify the script works**

```bash
python scripts/generate-jlpt-audio.py --level n5 --unit 1 --dry-run
```

Expected: Summary showing vocabulary, examples, reading, and listening counts. No files created.

- [ ] **Step 3: Generate audio for all levels**

```bash
python scripts/generate-jlpt-audio.py --level n5
python scripts/generate-jlpt-audio.py --level n4
python scripts/generate-jlpt-audio.py --level n3
python scripts/generate-jlpt-audio.py --level n2
python scripts/generate-jlpt-audio.py --level n1
```

- [ ] **Step 4: Verify generated files exist**

```bash
ls assets/audio/generated/jlpt/n5/unit01/
```

Expected: `vocabulary/`, `examples/`, `reading/`, `listening/`, `manifest.json`

```bash
ls assets/audio/generated/jlpt/n5/unit07/listening/
```

Expected: `transcript_01.mp3`, `transcript_02.mp3`, etc.

- [ ] **Step 5: Gitignore generated audio and commit**

Add to `.gitignore`:

```
# Generated audio files (regenerate with scripts/generate-*-audio.py)
assets/audio/generated/
```

```bash
git add .gitignore
git commit -m "chore: gitignore generated audio files"
```

---

### Task 2: Create Audio Path Utility

**Files:**
- Create: `lib/jlptAudio.ts`

The Genki audio uses relative string paths (e.g., `/audio/lessons/genki1/lesson01/dialogue/file.mp3`) passed to `Audio.Sound.createAsync({ uri })`. On web, `window.location.origin` is prepended. On native, the path is used directly. Follow the same pattern.

- [ ] **Step 1: Create lib/jlptAudio.ts**

```typescript
import { Platform } from 'react-native';

const JLPT_AUDIO_BASE_PATH = '/audio/generated/jlpt';

/**
 * Get the audio URI for a JLPT listening transcript.
 * Follows the same pattern as Genki audio paths in data/genki/audio/audioManifest.ts.
 */
export function getListeningAudioUri(
  level: string,
  unitNumber: number,
  transcriptIndex: number,
): string {
  const levelLower = level.toLowerCase();
  const unitPadded = String(unitNumber).padStart(2, '0');
  const indexPadded = String(transcriptIndex).padStart(2, '0');
  const path = `${JLPT_AUDIO_BASE_PATH}/${levelLower}/unit${unitPadded}/listening/transcript_${indexPadded}.mp3`;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/jlptAudio.ts
git commit -m "feat: add JLPT audio path utility"
```

---

### Task 3: Wire ListeningSection to AudioPlayer

**Files:**
- Modify: `components/jlpt/JLPTUnitScreen.tsx:82-83`
- Modify: `components/jlpt/ListeningSection.tsx` (full rewrite)

- [ ] **Step 1: Pass level and unitNumber to ListeningSection**

In `components/jlpt/JLPTUnitScreen.tsx`, change line 83:

Before:
```typescript
        return <ListeningSection listenings={unit.sections.listening} />;
```

After:
```typescript
        return (
          <ListeningSection
            listenings={unit.sections.listening}
            level={jlptLevel}
            unitNumber={unit.unitNumber}
          />
        );
```

- [ ] **Step 2: Rewrite ListeningSection with AudioPlayer integration**

Replace the entire contents of `components/jlpt/ListeningSection.tsx`:

```typescript
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { JLPTListening, JLPTLevel } from '@/data/jlpt/types';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { getListeningAudioUri } from '@/lib/jlptAudio';

interface ListeningSectionProps {
  listenings: JLPTListening[];
  level: JLPTLevel;
  unitNumber: number;
}

export function ListeningSection({ listenings, level, unitNumber }: ListeningSectionProps) {
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState<{ [key: number]: boolean }>({});

  const toggleAudio = (index: number) => {
    setActiveAudioIndex(activeAudioIndex === index ? null : index);
  };

  const toggleTranscript = (index: number) => {
    setShowTranscript((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <View className="gap-4">
      {listenings.map((listening, index) => {
        const audioUri = getListeningAudioUri(level, unitNumber, index + 1);
        const isAudioActive = activeAudioIndex === index;

        return (
          <View
            key={listening.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {listening.title}
            </Text>

            {/* Audio Player or Play Button */}
            {isAudioActive ? (
              <View className="mb-4">
                <AudioPlayer
                  uri={audioUri}
                  title={listening.title}
                  titleJapanese={listening.titleJapanese}
                  compact
                />
              </View>
            ) : (
              <Pressable
                onPress={() => toggleAudio(index)}
                className="flex-row items-center bg-sakura-100 dark:bg-sakura-900/30 rounded-xl p-4 mb-4"
              >
                <FontAwesome name="play-circle" size={32} color="#ec4899" />
                <View className="ml-3">
                  <Text className="text-sm font-medium text-sakura-700 dark:text-sakura-300">
                    Play Audio
                  </Text>
                  <Text className="text-xs text-sakura-600">
                    {listening.duration} seconds
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Transcript Toggle */}
            <Pressable
              onPress={() => toggleTranscript(index)}
              className="flex-row items-center mb-3"
            >
              <FontAwesome
                name={showTranscript[index] ? 'eye-slash' : 'eye'}
                size={14}
                color="#6b7280"
              />
              <Text className="text-xs text-gray-500 ml-2">
                {showTranscript[index] ? 'Hide Transcript' : 'Show Transcript'}
              </Text>
            </Pressable>

            {showTranscript[index] && (
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3">
                <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {listening.transcript}
                </Text>
              </View>
            )}

            {/* Questions */}
            <Text className="text-sm font-medium text-gray-500 mb-2">Questions</Text>
            {listening.questions.map((q, idx) => (
              <View key={q.id} className="mb-3">
                <Text className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {idx + 1}. {q.question}
                </Text>
                {q.options.map((opt, optIdx) => (
                  <Pressable
                    key={optIdx}
                    className="flex-row items-center py-2 px-3 rounded-lg mb-1 bg-gray-100 dark:bg-gray-700"
                  >
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/jlpt/ListeningSection.tsx components/jlpt/JLPTUnitScreen.tsx
git commit -m "feat: wire AudioPlayer into JLPT ListeningSection with transcript toggle"
```

---

### Task 4: Configure Asset Bundling

Ensure generated audio files are included in EAS builds.

**Files:**
- Modify: `app.json`

- [ ] **Step 1: Add assetBundlePatterns to app.json**

In the `expo` object of `app.json`, add the following field (place it after `newArchEnabled`):

```json
"assetBundlePatterns": [
  "assets/**/*"
]
```

This ensures all files under `assets/` (including generated JLPT audio) are bundled in EAS production builds.

- [ ] **Step 2: Verify config is valid**

```bash
npx expo config --type public
```

Expected: Resolved config output with no errors, `assetBundlePatterns` visible.

- [ ] **Step 3: Commit**

```bash
git add app.json
git commit -m "feat: configure asset bundling for JLPT audio files"
```
