#!/usr/bin/env python3
"""
Generate Japanese audio files for nihonGO app using edge-tts.
Uses Microsoft Edge's neural TTS voices for high-quality Japanese speech.

Usage:
    python scripts/generate-audio.py --type kana      # Generate hiragana/katakana audio
    python scripts/generate-audio.py --type vocab     # Generate vocabulary audio
    python scripts/generate-audio.py --type all       # Generate all audio
"""

import asyncio
import argparse
import os
import json
from pathlib import Path

try:
    import edge_tts
except ImportError:
    print("Please install edge-tts: pip install edge-tts")
    exit(1)

# Japanese voices
VOICE_FEMALE = "ja-JP-NanamiNeural"  # Female voice
VOICE_MALE = "ja-JP-KeitaNeural"     # Male voice

# Output directory
AUDIO_DIR = Path(__file__).parent.parent / "assets" / "audio" / "generated"

# Hiragana characters with readings
HIRAGANA = [
    # Basic vowels
    ("あ", "a"), ("い", "i"), ("う", "u"), ("え", "e"), ("お", "o"),
    # K row
    ("か", "ka"), ("き", "ki"), ("く", "ku"), ("け", "ke"), ("こ", "ko"),
    # S row
    ("さ", "sa"), ("し", "shi"), ("す", "su"), ("せ", "se"), ("そ", "so"),
    # T row
    ("た", "ta"), ("ち", "chi"), ("つ", "tsu"), ("て", "te"), ("と", "to"),
    # N row
    ("な", "na"), ("に", "ni"), ("ぬ", "nu"), ("ね", "ne"), ("の", "no"),
    # H row
    ("は", "ha"), ("ひ", "hi"), ("ふ", "fu"), ("へ", "he"), ("ほ", "ho"),
    # M row
    ("ま", "ma"), ("み", "mi"), ("む", "mu"), ("め", "me"), ("も", "mo"),
    # Y row
    ("や", "ya"), ("ゆ", "yu"), ("よ", "yo"),
    # R row
    ("ら", "ra"), ("り", "ri"), ("る", "ru"), ("れ", "re"), ("ろ", "ro"),
    # W row + N
    ("わ", "wa"), ("を", "wo"), ("ん", "n"),
    # Dakuten (voiced)
    ("が", "ga"), ("ぎ", "gi"), ("ぐ", "gu"), ("げ", "ge"), ("ご", "go"),
    ("ざ", "za"), ("じ", "ji"), ("ず", "zu"), ("ぜ", "ze"), ("ぞ", "zo"),
    ("だ", "da"), ("ぢ", "di"), ("づ", "du"), ("で", "de"), ("ど", "do"),
    ("ば", "ba"), ("び", "bi"), ("ぶ", "bu"), ("べ", "be"), ("ぼ", "bo"),
    # Handakuten (p-sounds)
    ("ぱ", "pa"), ("ぴ", "pi"), ("ぷ", "pu"), ("ぺ", "pe"), ("ぽ", "po"),
]

# Katakana characters with readings
KATAKANA = [
    # Basic vowels
    ("ア", "a"), ("イ", "i"), ("ウ", "u"), ("エ", "e"), ("オ", "o"),
    # K row
    ("カ", "ka"), ("キ", "ki"), ("ク", "ku"), ("ケ", "ke"), ("コ", "ko"),
    # S row
    ("サ", "sa"), ("シ", "shi"), ("ス", "su"), ("セ", "se"), ("ソ", "so"),
    # T row
    ("タ", "ta"), ("チ", "chi"), ("ツ", "tsu"), ("テ", "te"), ("ト", "to"),
    # N row
    ("ナ", "na"), ("ニ", "ni"), ("ヌ", "nu"), ("ネ", "ne"), ("ノ", "no"),
    # H row
    ("ハ", "ha"), ("ヒ", "hi"), ("フ", "fu"), ("ヘ", "he"), ("ホ", "ho"),
    # M row
    ("マ", "ma"), ("ミ", "mi"), ("ム", "mu"), ("メ", "me"), ("モ", "mo"),
    # Y row
    ("ヤ", "ya"), ("ユ", "yu"), ("ヨ", "yo"),
    # R row
    ("ラ", "ra"), ("リ", "ri"), ("ル", "ru"), ("レ", "re"), ("ロ", "ro"),
    # W row + N
    ("ワ", "wa"), ("ヲ", "wo"), ("ン", "n"),
    # Dakuten (voiced)
    ("ガ", "ga"), ("ギ", "gi"), ("グ", "gu"), ("ゲ", "ge"), ("ゴ", "go"),
    ("ザ", "za"), ("ジ", "ji"), ("ズ", "zu"), ("ゼ", "ze"), ("ゾ", "zo"),
    ("ダ", "da"), ("ヂ", "di"), ("ヅ", "du"), ("デ", "de"), ("ド", "do"),
    ("バ", "ba"), ("ビ", "bi"), ("ブ", "bu"), ("ベ", "be"), ("ボ", "bo"),
    # Handakuten (p-sounds)
    ("パ", "pa"), ("ピ", "pi"), ("プ", "pu"), ("ペ", "pe"), ("ポ", "po"),
]

# Common vocabulary for lessons
VOCABULARY = [
    # Greetings
    ("おはようございます", "ohayou gozaimasu", "Good morning"),
    ("こんにちは", "konnichiwa", "Hello/Good afternoon"),
    ("こんばんは", "konbanwa", "Good evening"),
    ("さようなら", "sayounara", "Goodbye"),
    ("ありがとうございます", "arigatou gozaimasu", "Thank you"),
    ("すみません", "sumimasen", "Excuse me/Sorry"),
    ("はい", "hai", "Yes"),
    ("いいえ", "iie", "No"),
    # Self-introduction
    ("わたし", "watashi", "I/me"),
    ("なまえ", "namae", "name"),
    ("はじめまして", "hajimemashite", "Nice to meet you"),
    ("よろしくおねがいします", "yoroshiku onegaishimasu", "Please treat me well"),
    # Numbers
    ("いち", "ichi", "one"),
    ("に", "ni", "two"),
    ("さん", "san", "three"),
    ("よん", "yon", "four"),
    ("ご", "go", "five"),
    ("ろく", "roku", "six"),
    ("なな", "nana", "seven"),
    ("はち", "hachi", "eight"),
    ("きゅう", "kyuu", "nine"),
    ("じゅう", "juu", "ten"),
]


async def generate_audio(text: str, output_path: Path, voice: str = VOICE_FEMALE, is_kana: bool = False):
    """Generate audio file from Japanese text.

    For short sounds like single kana, we:
    - Slow down the rate for clearer pronunciation
    - Add trailing silence by appending a pause marker
    """
    if is_kana or len(text) <= 2:
        # Slower rate for single kana, add pause marker for natural ending
        communicate = edge_tts.Communicate(text + "。", voice, rate="-15%")
    else:
        communicate = edge_tts.Communicate(text, voice)

    await communicate.save(str(output_path))


async def generate_kana_audio():
    """Generate audio for all hiragana and katakana characters."""
    print("\n=== Generating Hiragana Audio ===")
    hiragana_dir = AUDIO_DIR / "hiragana"
    hiragana_dir.mkdir(parents=True, exist_ok=True)

    for char, romaji in HIRAGANA:
        output_path = hiragana_dir / f"{romaji}.mp3"
        if output_path.exists():
            print(f"  Skipping {char} ({romaji}) - already exists")
            continue
        print(f"  Generating {char} ({romaji})...")
        await generate_audio(char, output_path, is_kana=True)

    print("\n=== Generating Katakana Audio ===")
    katakana_dir = AUDIO_DIR / "katakana"
    katakana_dir.mkdir(parents=True, exist_ok=True)

    for char, romaji in KATAKANA:
        output_path = katakana_dir / f"{romaji}.mp3"
        if output_path.exists():
            print(f"  Skipping {char} ({romaji}) - already exists")
            continue
        print(f"  Generating {char} ({romaji})...")
        await generate_audio(char, output_path, is_kana=True)

    print(f"\nKana audio saved to: {AUDIO_DIR}")


async def generate_vocab_audio():
    """Generate audio for vocabulary items."""
    print("\n=== Generating Vocabulary Audio ===")
    vocab_dir = AUDIO_DIR / "vocabulary"
    vocab_dir.mkdir(parents=True, exist_ok=True)

    for japanese, romaji, english in VOCABULARY:
        # Use romaji as filename (sanitized)
        filename = romaji.replace(" ", "_").replace("/", "_")
        output_path = vocab_dir / f"{filename}.mp3"
        if output_path.exists():
            print(f"  Skipping {japanese} - already exists")
            continue
        print(f"  Generating {japanese} ({romaji})...")
        await generate_audio(japanese, output_path)

    # Save manifest
    manifest = {
        "voice": VOICE_FEMALE,
        "items": [
            {"japanese": j, "romaji": r, "english": e, "file": r.replace(" ", "_").replace("/", "_") + ".mp3"}
            for j, r, e in VOCABULARY
        ]
    }
    manifest_path = vocab_dir / "manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"\nVocabulary audio saved to: {vocab_dir}")


async def generate_lesson_vocab_audio(lesson_file: Path):
    """Generate audio for vocabulary from a lesson TypeScript file."""
    # This would parse the lesson files and generate audio
    # For now, just a placeholder
    print(f"Would generate audio from: {lesson_file}")


async def main():
    parser = argparse.ArgumentParser(description="Generate Japanese audio files")
    parser.add_argument(
        "--type",
        choices=["kana", "vocab", "all"],
        default="all",
        help="Type of audio to generate"
    )
    args = parser.parse_args()

    print("Japanese Audio Generator for nihonGO")
    print("=" * 40)
    print(f"Voice: {VOICE_FEMALE}")
    print(f"Output: {AUDIO_DIR}")

    if args.type in ["kana", "all"]:
        await generate_kana_audio()

    if args.type in ["vocab", "all"]:
        await generate_vocab_audio()

    print("\n✓ Audio generation complete!")


if __name__ == "__main__":
    asyncio.run(main())
