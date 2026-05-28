import { SrsItem, SrsItemType, KanaPayload, VocabPayload } from '@/types/srs';
import { ALL_HIRAGANA, ALL_KATAKANA } from '@/data/alphabet';
import { getAllVocabularyForLevel } from '@/lib/srs/vocabCorpus';

export interface SrsAdapter {
  promptText: (item: SrsItem) => string;
  promptHint?: (item: SrsItem) => string;
  answerText: (item: SrsItem) => string;
  generateDistractors: (item: SrsItem, pool: SrsItem[]) => string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickThreeUnique(candidates: string[], exclude: string): string[] {
  const filtered = Array.from(new Set(candidates)).filter((c) => c !== exclude);
  return shuffle(filtered).slice(0, 3);
}

const kanaAdapter: SrsAdapter = {
  promptText: (item) => {
    if (item.payload.kind !== 'kana') return '';
    return (item.payload as KanaPayload).character;
  },
  answerText: (item) => {
    if (item.payload.kind !== 'kana') return '';
    return (item.payload as KanaPayload).romaji;
  },
  generateDistractors: (item, pool) => {
    if (item.payload.kind !== 'kana') return [];
    const kanaPayload = item.payload as KanaPayload;
    const correct = kanaPayload.romaji;

    const poolRomaji = pool
      .filter((p) => p.payload.kind === 'kana' && (p.payload as KanaPayload).kanaType === kanaPayload.kanaType)
      .map((p) => (p.payload as KanaPayload).romaji);

    const corpusRomaji =
      kanaPayload.kanaType === 'hiragana'
        ? ALL_HIRAGANA.map((k) => k.romaji)
        : ALL_KATAKANA.map((k) => k.romaji);

    return pickThreeUnique([...poolRomaji, ...corpusRomaji], correct);
  },
};

const vocabAdapter: SrsAdapter = {
  promptText: (item) => {
    if (item.payload.kind !== 'vocab') return '';
    return (item.payload as VocabPayload).japanese;
  },
  promptHint: (item) => {
    if (item.payload.kind !== 'vocab') return '';
    return (item.payload as VocabPayload).reading;
  },
  answerText: (item) => {
    if (item.payload.kind !== 'vocab') return '';
    return (item.payload as VocabPayload).english;
  },
  generateDistractors: (item, pool) => {
    if (item.payload.kind !== 'vocab') return [];
    const correct = (item.payload as VocabPayload).english;

    const poolEnglish = pool
      .filter((p) => p.payload.kind === 'vocab')
      .map((p) => (p.payload as VocabPayload).english);

    const corpusEnglish = getAllVocabularyForLevel().map((v) => v.english);

    return pickThreeUnique([...poolEnglish, ...corpusEnglish], correct);
  },
};

export const srsAdapters: Record<SrsItemType, SrsAdapter> = {
  kana: kanaAdapter,
  vocab: vocabAdapter,
};
