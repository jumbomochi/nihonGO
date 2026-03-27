# JLPT Audio Generation & Listening Playback — Design Spec

## Overview

Generate TTS audio files for all JLPT levels (N5-N1) and wire the existing AudioPlayer component into the ListeningSection so users can listen to audio during JLPT exercises.

## Part 1: Generate Audio Files

### Script

Use the existing `scripts/generate-jlpt-audio.py` which generates MP3 files via `edge-tts` (Microsoft neural TTS).

### Scope

- All 5 JLPT levels: N5, N4, N3, N2, N1
- All 10 units per level (50 units total)
- All audio types: vocabulary words, example sentences, reading passages, listening transcripts

### Output Structure

```
assets/audio/generated/jlpt/{level}/{unitXX}/
  vocabulary/{id}_word.mp3
  examples/{id}_example.mp3
  reading/passage_{i:02d}.mp3
  listening/transcript_{i:02d}.mp3
  manifest.json
```

### Voice Configuration

- Female: `ja-JP-NanamiNeural`
- Male: `ja-JP-KeitaNeural`
- Vocabulary: -10% rate (slower for learning)
- Examples: normal rate
- Reading: -5% rate (slightly slower for comprehension)
- Listening: normal rate

### Prerequisites

- Python 3 with `edge-tts` library installed (`pip install edge-tts`)

## Part 2: Wire ListeningSection to AudioPlayer

### Current State

`components/jlpt/ListeningSection.tsx` renders a "Play Audio" button that is purely decorative — no `onPress` handler, no audio integration.

### Target State

- The "Play Audio" button triggers audio playback using the existing `AudioPlayer` component
- AudioPlayer provides play/pause, seek, and speed controls
- When no audio file exists, show the transcript as fallback with a "No audio available" note

### Audio Path Resolution

Resolve paths dynamically at runtime rather than hardcoding `audioUri` in data files. The naming convention is predictable:

```
assets/audio/generated/jlpt/{level}/unit{XX}/listening/transcript_{index:02d}.mp3
```

Create a utility function `getJLPTAudioPath(level, unitNumber, type, index)` that constructs the correct path. This avoids editing every JLPT data file and prevents drift between data and audio files.

### Component Changes

**ListeningSection.tsx:**
- Accept `level` and `unitNumber` props (needed for path resolution)
- Add state for audio visibility (show/hide AudioPlayer)
- On "Play Audio" press: show AudioPlayer with the resolved audio URI
- On playback error: fall back to showing transcript text

### Integration Points

- `JLPTUnitScreen.tsx` passes `level` and `unitNumber` to `ListeningSection`
- `AudioPlayer.tsx` used as-is (already handles play/pause/seek/speed/errors)

## Part 3: Populate Audio in Mock Exam

### Current State

Mock exam listening questions show transcript text but have no audio playback.

### Target State

- Mock exam listening section uses the same dynamic path resolution
- Audio plays before/during answering listening questions
- Same AudioPlayer integration as ListeningSection

## Out of Scope

- expo-av to expo-audio migration (not blocking, works on SDK 54)
- Vocabulary/example audio playback in JLPT lesson screens (separate feature, audio files will be ready)
- Practice test scoring changes (already fully working)
- Genki audio changes (already working)
