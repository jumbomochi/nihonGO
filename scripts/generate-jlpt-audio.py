#!/usr/bin/env python3
"""
Generate Japanese audio files for JLPT N3 content using edge-tts.
Uses Microsoft Edge's neural TTS voices for high-quality Japanese speech.

Usage:
    python scripts/generate-jlpt-audio.py --level n3              # Generate all N3 audio
    python scripts/generate-jlpt-audio.py --level n3 --unit 1     # Generate Unit 1 only
    python scripts/generate-jlpt-audio.py --level n3 --dry-run    # Show what would be generated
"""

import asyncio
import argparse
import os
import re
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    import edge_tts
except ImportError:
    print("Please install edge-tts: pip install edge-tts")
    exit(1)

# Japanese voices
VOICE_FEMALE = "ja-JP-NanamiNeural"  # Female voice (default)
VOICE_MALE = "ja-JP-KeitaNeural"     # Male voice

# Base directories
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data" / "jlpt"
AUDIO_DIR = PROJECT_DIR / "assets" / "audio" / "generated" / "jlpt"

# Rate limits to avoid overwhelming the TTS service
CONCURRENT_REQUESTS = 3
DELAY_BETWEEN_BATCHES = 1.0  # seconds


def parse_typescript_file(file_path: Path) -> Dict[str, Any]:
    """Parse a JLPT unit TypeScript file and extract content.

    This is a simple parser that extracts vocabulary items using regex.
    It's not a full TypeScript parser but works for our structured data files.
    """
    content = file_path.read_text(encoding='utf-8')

    result = {
        'vocabulary': [],
        'grammar_examples': [],
        'reading_passages': [],
        'listening_transcripts': []
    }

    # Extract vocabulary items
    # Pattern: { id: 'xxx', word: 'xxx', reading: 'xxx', ...exampleSentence: 'xxx'... }
    vocab_pattern = re.compile(
        r"\{\s*"
        r"id:\s*['\"]([^'\"]+)['\"].*?"
        r"word:\s*['\"]([^'\"]+)['\"].*?"
        r"reading:\s*['\"]([^'\"]+)['\"].*?"
        r"exampleSentence:\s*['\"]([^'\"]+)['\"]",
        re.DOTALL
    )

    for match in vocab_pattern.finditer(content):
        vocab_id, word, reading, example = match.groups()
        result['vocabulary'].append({
            'id': vocab_id,
            'word': word,
            'reading': reading,
            'example': example
        })

    # Extract grammar examples
    # Pattern: { japanese: 'xxx', reading: 'xxx', english: 'xxx' }
    grammar_pattern = re.compile(
        r"japanese:\s*['\"]([^'\"]+)['\"].*?"
        r"reading:\s*['\"]([^'\"]+)['\"].*?"
        r"english:\s*['\"]([^'\"]+)['\"]",
        re.DOTALL
    )

    for match in grammar_pattern.finditer(content):
        japanese, reading, english = match.groups()
        # Skip if this looks like vocabulary (has an id field nearby)
        if japanese not in [v['example'] for v in result['vocabulary']]:
            result['grammar_examples'].append({
                'japanese': japanese,
                'reading': reading,
                'english': english
            })

    # Extract reading passages (using template literals with backticks)
    passage_pattern = re.compile(
        r"passage:\s*`([^`]+)`",
        re.DOTALL
    )

    for match in passage_pattern.finditer(content):
        passage = match.group(1).strip()
        if len(passage) > 50:
            result['reading_passages'].append(passage)

    # Extract listening transcripts (using template literals with backticks)
    transcript_pattern = re.compile(
        r"transcript:\s*`([^`]+)`",
        re.DOTALL
    )

    for match in transcript_pattern.finditer(content):
        transcript = match.group(1).strip()
        if len(transcript) > 30:
            result['listening_transcripts'].append(transcript)

    return result


async def generate_audio(
    text: str,
    output_path: Path,
    voice: str = VOICE_FEMALE,
    rate: str = "0%"
) -> bool:
    """Generate audio file from Japanese text."""
    try:
        communicate = edge_tts.Communicate(text, voice, rate=rate)
        await communicate.save(str(output_path))
        return True
    except Exception as e:
        print(f"    Error generating audio: {e}")
        return False


async def generate_batch(items: List[Dict], semaphore: asyncio.Semaphore):
    """Generate a batch of audio files with concurrency limit."""
    async def generate_with_semaphore(item):
        async with semaphore:
            return await generate_audio(
                item['text'],
                item['path'],
                item.get('voice', VOICE_FEMALE),
                item.get('rate', '0%')
            )

    tasks = [generate_with_semaphore(item) for item in items]
    return await asyncio.gather(*tasks)


async def generate_unit_audio(
    unit_number: int,
    level: str,
    dry_run: bool = False
) -> Dict[str, int]:
    """Generate all audio for a single JLPT unit."""
    level_lower = level.lower()
    unit_dir = DATA_DIR / level_lower / "units"

    # Find the unit file
    unit_files = list(unit_dir.glob(f"unit{unit_number:02d}*.ts"))
    if not unit_files:
        print(f"  Unit {unit_number} file not found in {unit_dir}")
        return {'generated': 0, 'skipped': 0, 'errors': 0}

    unit_file = unit_files[0]
    print(f"\n  Processing: {unit_file.name}")

    # Parse the unit file
    content = parse_typescript_file(unit_file)

    # Create output directory
    output_dir = AUDIO_DIR / level_lower / f"unit{unit_number:02d}"
    vocab_dir = output_dir / "vocabulary"
    examples_dir = output_dir / "examples"
    reading_dir = output_dir / "reading"
    listening_dir = output_dir / "listening"

    if not dry_run:
        for d in [vocab_dir, examples_dir, reading_dir, listening_dir]:
            d.mkdir(parents=True, exist_ok=True)

    stats = {'generated': 0, 'skipped': 0, 'errors': 0}
    audio_items = []
    manifest = {
        'unit': unit_number,
        'level': level_lower,
        'vocabulary': [],
        'examples': [],
        'reading': [],
        'listening': []
    }

    # Prepare vocabulary audio items
    print(f"    Vocabulary: {len(content['vocabulary'])} items")
    for vocab in content['vocabulary']:
        word_file = vocab_dir / f"{vocab['id']}_word.mp3"
        example_file = examples_dir / f"{vocab['id']}_example.mp3"

        # Word pronunciation
        if not word_file.exists():
            audio_items.append({
                'text': vocab['word'],
                'path': word_file,
                'rate': '-10%'  # Slightly slower for vocabulary
            })
            manifest['vocabulary'].append({
                'id': vocab['id'],
                'word': vocab['word'],
                'reading': vocab['reading'],
                'file': f"vocabulary/{vocab['id']}_word.mp3"
            })
        else:
            stats['skipped'] += 1

        # Example sentence
        if not example_file.exists():
            audio_items.append({
                'text': vocab['example'],
                'path': example_file,
                'rate': '0%'
            })
            manifest['examples'].append({
                'id': vocab['id'],
                'text': vocab['example'],
                'file': f"examples/{vocab['id']}_example.mp3"
            })
        else:
            stats['skipped'] += 1

    # Prepare reading passage audio
    print(f"    Reading passages: {len(content['reading_passages'])} items")
    for i, passage in enumerate(content['reading_passages'], 1):
        passage_file = reading_dir / f"passage_{i:02d}.mp3"
        if not passage_file.exists():
            audio_items.append({
                'text': passage,
                'path': passage_file,
                'rate': '-5%'  # Slightly slower for comprehension
            })
            manifest['reading'].append({
                'index': i,
                'file': f"reading/passage_{i:02d}.mp3"
            })
        else:
            stats['skipped'] += 1

    # Prepare listening transcript audio
    print(f"    Listening transcripts: {len(content['listening_transcripts'])} items")
    for i, transcript in enumerate(content['listening_transcripts'], 1):
        transcript_file = listening_dir / f"transcript_{i:02d}.mp3"
        if not transcript_file.exists():
            audio_items.append({
                'text': transcript,
                'path': transcript_file,
                'rate': '0%'
            })
            manifest['listening'].append({
                'index': i,
                'file': f"listening/transcript_{i:02d}.mp3"
            })
        else:
            stats['skipped'] += 1

    print(f"    Total to generate: {len(audio_items)}, skipped: {stats['skipped']}")

    if dry_run:
        stats['generated'] = len(audio_items)
        return stats

    # Generate audio in batches
    if audio_items:
        semaphore = asyncio.Semaphore(CONCURRENT_REQUESTS)

        # Process in batches
        batch_size = 10
        for i in range(0, len(audio_items), batch_size):
            batch = audio_items[i:i + batch_size]
            print(f"    Generating batch {i // batch_size + 1}/{(len(audio_items) + batch_size - 1) // batch_size}...")

            results = await generate_batch(batch, semaphore)
            stats['generated'] += sum(1 for r in results if r)
            stats['errors'] += sum(1 for r in results if not r)

            if i + batch_size < len(audio_items):
                await asyncio.sleep(DELAY_BETWEEN_BATCHES)

    # Save manifest
    manifest_path = output_dir / "manifest.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"    Manifest saved: {manifest_path}")

    return stats


async def main():
    parser = argparse.ArgumentParser(description="Generate JLPT audio files")
    parser.add_argument(
        "--level",
        choices=["n5", "n4", "n3", "n2", "n1"],
        default="n3",
        help="JLPT level to generate audio for"
    )
    parser.add_argument(
        "--unit",
        type=int,
        help="Specific unit number to generate (default: all units)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be generated without actually generating"
    )
    args = parser.parse_args()

    print("JLPT Audio Generator for nihonGO")
    print("=" * 40)
    print(f"Level: {args.level.upper()}")
    print(f"Voice: {VOICE_FEMALE}")
    print(f"Output: {AUDIO_DIR / args.level}")
    if args.dry_run:
        print("Mode: DRY RUN (no files will be created)")
    print()

    level_dir = DATA_DIR / args.level / "units"
    if not level_dir.exists():
        print(f"Error: No unit files found at {level_dir}")
        return

    # Find all unit files
    unit_files = sorted(level_dir.glob("unit*.ts"))
    if not unit_files:
        print(f"Error: No unit files found in {level_dir}")
        return

    # Parse unit numbers from filenames
    unit_numbers = []
    for f in unit_files:
        match = re.search(r'unit(\d+)', f.name)
        if match:
            unit_numbers.append(int(match.group(1)))

    # Filter to specific unit if requested
    if args.unit:
        if args.unit not in unit_numbers:
            print(f"Error: Unit {args.unit} not found. Available units: {unit_numbers}")
            return
        unit_numbers = [args.unit]

    print(f"Units to process: {unit_numbers}")

    total_stats = {'generated': 0, 'skipped': 0, 'errors': 0}

    for unit_num in unit_numbers:
        stats = await generate_unit_audio(unit_num, args.level, args.dry_run)
        total_stats['generated'] += stats['generated']
        total_stats['skipped'] += stats['skipped']
        total_stats['errors'] += stats['errors']

    print("\n" + "=" * 40)
    print("Summary:")
    print(f"  Generated: {total_stats['generated']} files")
    print(f"  Skipped (already exist): {total_stats['skipped']} files")
    print(f"  Errors: {total_stats['errors']} files")

    if args.dry_run:
        print("\nThis was a dry run. Use without --dry-run to generate files.")
    else:
        print(f"\nAudio files saved to: {AUDIO_DIR / args.level}")


if __name__ == "__main__":
    asyncio.run(main())
