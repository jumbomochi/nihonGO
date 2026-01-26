#!/usr/bin/env python3
"""
Generate Japanese audio files for Genki lessons using edge-tts.
Parses lesson TypeScript files to extract vocabulary and dialogue.

Usage:
    python scripts/generate-lesson-audio.py                    # Generate all lessons
    python scripts/generate-lesson-audio.py --lesson 1         # Generate lesson 1 only
    python scripts/generate-lesson-audio.py --book genki1      # Generate all Genki 1 lessons
"""

import asyncio
import argparse
import os
import re
import json
from pathlib import Path
from typing import List, Dict, Any

try:
    import edge_tts
except ImportError:
    print("Please install edge-tts: pip install edge-tts")
    exit(1)

# Japanese voices
VOICE_FEMALE = "ja-JP-NanamiNeural"  # Female voice (Mary, etc.)
VOICE_MALE = "ja-JP-KeitaNeural"     # Male voice (Takeshi, etc.)

# Base directories
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
LESSON_DIR = PROJECT_DIR / "data" / "genki"
AUDIO_OUTPUT_DIR = PROJECT_DIR / "assets" / "audio" / "generated" / "lessons"


def parse_lesson_file(filepath: Path) -> Dict[str, Any]:
    """Parse a TypeScript lesson file and extract vocabulary and dialogues."""
    content = filepath.read_text(encoding='utf-8')

    result = {
        'vocabulary': [],
        'dialogues': [],  # List of dialogues, each with id, title, lines
        'has_multiple_dialogues': False
    }

    # Extract vocabulary items
    vocab_pattern = r"\{\s*id:\s*'[^']+',\s*japanese:\s*'([^']+)',\s*reading:\s*'([^']+)',\s*romaji:\s*'([^']+)',\s*english:\s*'([^']+)'"
    for match in re.finditer(vocab_pattern, content, re.DOTALL):
        result['vocabulary'].append({
            'japanese': match.group(1),
            'reading': match.group(2),
            'romaji': match.group(3),
            'english': match.group(4)
        })

    # Check if this lesson has multiple dialogues (dialogues: [...])
    has_dialogues_array = 'dialogues: [' in content or 'dialogues:[' in content

    if has_dialogues_array:
        result['has_multiple_dialogues'] = True
        # Parse multiple dialogues
        # Find each dialogue block: { id: 'l01-d01', title: '...', ... lines: [...] }
        dialogue_block_pattern = r"\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)'[^}]*?lines:\s*\[(.*?)\]"

        for dlg_match in re.finditer(dialogue_block_pattern, content, re.DOTALL):
            dialogue_id = dlg_match.group(1)
            dialogue_title = dlg_match.group(2)
            lines_content = dlg_match.group(3)

            # Parse lines within this dialogue
            lines = []
            line_pattern_dq = r'\{\s*speaker:\s*\'([^\']+)\',\s*japanese:\s*\'([^\']+)\',\s*reading:\s*\'([^\']+)\',\s*english:\s*"([^"]+)"'
            line_pattern_sq = r"\{\s*speaker:\s*'([^']+)',\s*japanese:\s*'([^']+)',\s*reading:\s*'([^']+)',\s*english:\s*'([^']+)'"

            all_line_matches = []
            for match in re.finditer(line_pattern_dq, lines_content, re.DOTALL):
                all_line_matches.append((match.start(), {
                    'speaker': match.group(1),
                    'japanese': match.group(2),
                    'reading': match.group(3),
                    'english': match.group(4)
                }))
            for match in re.finditer(line_pattern_sq, lines_content, re.DOTALL):
                japanese_text = match.group(2)
                if not any(m[1]['japanese'] == japanese_text for m in all_line_matches):
                    all_line_matches.append((match.start(), {
                        'speaker': match.group(1),
                        'japanese': match.group(2),
                        'reading': match.group(3),
                        'english': match.group(4)
                    }))

            all_line_matches.sort(key=lambda x: x[0])
            lines = [m[1] for m in all_line_matches]

            if lines:
                result['dialogues'].append({
                    'id': dialogue_id,
                    'title': dialogue_title,
                    'lines': lines
                })
    else:
        # Single dialogue (legacy format)
        dialogue_pattern_dq = r'\{\s*speaker:\s*\'([^\']+)\',\s*japanese:\s*\'([^\']+)\',\s*reading:\s*\'([^\']+)\',\s*english:\s*"([^"]+)"'
        dialogue_pattern_sq = r"\{\s*speaker:\s*'([^']+)',\s*japanese:\s*'([^']+)',\s*reading:\s*'([^']+)',\s*english:\s*'([^']+)'"

        all_matches = []
        for match in re.finditer(dialogue_pattern_dq, content, re.DOTALL):
            all_matches.append((match.start(), {
                'speaker': match.group(1),
                'japanese': match.group(2),
                'reading': match.group(3),
                'english': match.group(4)
            }))
        for match in re.finditer(dialogue_pattern_sq, content, re.DOTALL):
            japanese_text = match.group(2)
            if not any(m[1]['japanese'] == japanese_text for m in all_matches):
                all_matches.append((match.start(), {
                    'speaker': match.group(1),
                    'japanese': match.group(2),
                    'reading': match.group(3),
                    'english': match.group(4)
                }))

        all_matches.sort(key=lambda x: x[0])
        lines = [m[1] for m in all_matches]

        if lines:
            result['dialogues'].append({
                'id': 'default',
                'title': 'Dialogue',
                'lines': lines
            })

    return result


async def generate_audio(text: str, output_path: Path, voice: str = VOICE_FEMALE):
    """Generate audio file from Japanese text."""
    if output_path.exists():
        return False  # Skip existing

    output_path.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(output_path))
    return True


def get_voice_for_speaker(speaker: str) -> str:
    """Determine voice based on speaker name."""
    # Common male names in Genki
    male_speakers = ['Takeshi', 'Robert', 'Ken', 'Kenji', 'Tom', 'Tanaka', 'Yamashita', 'Yamada', 'Professor', 'Father', 'Grandfather']

    for name in male_speakers:
        if name.lower() in speaker.lower():
            return VOICE_MALE

    return VOICE_FEMALE


def sanitize_filename(text: str) -> str:
    """Create a safe filename from text."""
    safe = re.sub(r'[^\w\s\-]', '', text)
    safe = re.sub(r'\s+', '_', safe)
    return safe[:50]


async def generate_lesson_audio(book: str, lesson_num: int):
    """Generate all audio for a single lesson."""
    lesson_file = LESSON_DIR / book / f"lesson{lesson_num:02d}.ts"

    if not lesson_file.exists():
        print(f"  Lesson file not found: {lesson_file}")
        return

    print(f"\n=== {book.upper()} Lesson {lesson_num} ===")

    # Parse lesson
    lesson_data = parse_lesson_file(lesson_file)

    # Output directories
    lesson_audio_dir = AUDIO_OUTPUT_DIR / book / f"lesson{lesson_num:02d}"
    vocab_dir = lesson_audio_dir / "vocabulary"
    dialogue_dir = lesson_audio_dir / "dialogue"

    # Generate vocabulary audio
    if lesson_data['vocabulary']:
        print(f"  Generating {len(lesson_data['vocabulary'])} vocabulary items...")
        for i, vocab in enumerate(lesson_data['vocabulary']):
            filename = f"{i+1:03d}_{sanitize_filename(vocab['romaji'])}.mp3"
            output_path = vocab_dir / filename

            if output_path.exists():
                continue

            text = vocab['reading'] if vocab['reading'] else vocab['japanese']
            await generate_audio(text, output_path, VOICE_FEMALE)
            print(f"    Generated: {vocab['japanese']} ({vocab['reading']})")

    # Generate dialogue audio
    total_lines = sum(len(d['lines']) for d in lesson_data['dialogues'])
    if total_lines > 0:
        print(f"  Generating {total_lines} dialogue lines across {len(lesson_data['dialogues'])} dialogue(s)...")

        has_multiple = lesson_data['has_multiple_dialogues']

        for dlg_idx, dialogue in enumerate(lesson_data['dialogues']):
            if has_multiple:
                print(f"    Dialogue {dlg_idx + 1}: {dialogue['title']}")

            for line_idx, line in enumerate(dialogue['lines']):
                if has_multiple:
                    # Multiple dialogues: d01_001_mary.mp3
                    filename = f"d{dlg_idx+1:02d}_{line_idx+1:03d}_{line['speaker'].lower()}.mp3"
                else:
                    # Single dialogue: 001_mary.mp3
                    filename = f"{line_idx+1:03d}_{line['speaker'].lower()}.mp3"

                output_path = dialogue_dir / filename

                if output_path.exists():
                    continue

                voice = get_voice_for_speaker(line['speaker'])
                await generate_audio(line['japanese'], output_path, voice)
                print(f"      Generated: [{line['speaker']}] {line['japanese'][:30]}...")

    # Save manifest
    manifest_dialogues = []
    for dlg_idx, dialogue in enumerate(lesson_data['dialogues']):
        dlg_manifest = {
            'id': dialogue['id'],
            'title': dialogue['title'],
            'lines': []
        }
        for line_idx, line in enumerate(dialogue['lines']):
            if lesson_data['has_multiple_dialogues']:
                audio_path = f"dialogue/d{dlg_idx+1:02d}_{line_idx+1:03d}_{line['speaker'].lower()}.mp3"
            else:
                audio_path = f"dialogue/{line_idx+1:03d}_{line['speaker'].lower()}.mp3"

            dlg_manifest['lines'].append({
                'speaker': line['speaker'],
                'japanese': line['japanese'],
                'english': line['english'],
                'audio': audio_path
            })
        manifest_dialogues.append(dlg_manifest)

    manifest = {
        'book': book,
        'lesson': lesson_num,
        'vocabulary_count': len(lesson_data['vocabulary']),
        'dialogue_count': len(lesson_data['dialogues']),
        'total_dialogue_lines': total_lines,
        'has_multiple_dialogues': lesson_data['has_multiple_dialogues'],
        'vocabulary': [
            {
                'japanese': v['japanese'],
                'reading': v['reading'],
                'romaji': v['romaji'],
                'english': v['english'],
                'audio': f"vocabulary/{i+1:03d}_{sanitize_filename(v['romaji'])}.mp3"
            }
            for i, v in enumerate(lesson_data['vocabulary'])
        ],
        'dialogues': manifest_dialogues
    }

    manifest_path = lesson_audio_dir / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"  Saved manifest: {manifest_path}")


async def main():
    parser = argparse.ArgumentParser(description="Generate lesson audio files")
    parser.add_argument("--lesson", type=int, help="Specific lesson number")
    parser.add_argument("--book", choices=['genki1', 'genki2'], help="Specific book")
    args = parser.parse_args()

    print("Genki Lesson Audio Generator")
    print("=" * 40)
    print(f"Voice (Female): {VOICE_FEMALE}")
    print(f"Voice (Male): {VOICE_MALE}")
    print(f"Output: {AUDIO_OUTPUT_DIR}")

    books = [args.book] if args.book else ['genki1', 'genki2']

    for book in books:
        book_dir = LESSON_DIR / book
        if not book_dir.exists():
            continue

        lesson_files = sorted(book_dir.glob("lesson*.ts"))

        for lesson_file in lesson_files:
            match = re.search(r'lesson(\d+)', lesson_file.name)
            if not match:
                continue

            lesson_num = int(match.group(1))

            if args.lesson and lesson_num != args.lesson:
                continue

            await generate_lesson_audio(book, lesson_num)

    print("\n✓ Lesson audio generation complete!")


if __name__ == "__main__":
    asyncio.run(main())
