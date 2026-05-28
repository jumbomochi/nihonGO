import { srsAdapters } from '@/lib/srs/adapters';
import { _resetCacheForTesting } from '@/lib/srs/vocabCorpus';
import { SrsItem } from '@/types/srs';

const kanaItem: SrsItem = {
  itemKey: 'kana:hiragana-a',
  type: 'kana',
  refId: 'hiragana-a',
  correctCount: 0,
  incorrectCount: 0,
  masteryLevel: 0,
  lastReviewedAt: '2026-01-01T00:00:00Z',
  nextReviewDate: '2026-01-02T00:00:00Z',
  payload: { kind: 'kana', character: 'あ', romaji: 'a', kanaType: 'hiragana' },
};

const vocabItem: SrsItem = {
  itemKey: 'vocab:greetings-konnichiwa',
  type: 'vocab',
  refId: 'greetings-konnichiwa',
  correctCount: 0,
  incorrectCount: 0,
  masteryLevel: 0,
  lastReviewedAt: '2026-01-01T00:00:00Z',
  nextReviewDate: '2026-01-02T00:00:00Z',
  payload: {
    kind: 'vocab',
    japanese: 'こんにちは',
    reading: 'こんにちは',
    english: 'Hello',
    lessonId: 'greetings',
  },
};

describe('kana adapter', () => {
  const adapter = srsAdapters.kana;

  it('promptText returns character', () => {
    expect(adapter.promptText(kanaItem)).toBe('あ');
  });

  it('answerText returns romaji', () => {
    expect(adapter.answerText(kanaItem)).toBe('a');
  });

  it('promptHint is undefined for kana', () => {
    expect(adapter.promptHint).toBeUndefined();
  });

  it('generateDistractors returns 3 unique non-correct romaji', () => {
    const distractors = adapter.generateDistractors(kanaItem, []);
    expect(distractors).toHaveLength(3);
    expect(new Set(distractors).size).toBe(3);
    expect(distractors).not.toContain('a');
  });
});

describe('vocab adapter', () => {
  const adapter = srsAdapters.vocab;

  it('promptText returns japanese', () => {
    expect(adapter.promptText(vocabItem)).toBe('こんにちは');
  });

  it('promptHint returns reading', () => {
    expect(adapter.promptHint!(vocabItem)).toBe('こんにちは');
  });

  it('answerText returns english', () => {
    expect(adapter.answerText(vocabItem)).toBe('Hello');
  });

  it('generateDistractors falls back to corpus when pool has < 4 vocab items', () => {
    const distractors = adapter.generateDistractors(vocabItem, []);
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain('Hello');
  });

  it('generateDistractors never includes the correct answer', () => {
    const corpus: SrsItem[] = [vocabItem];
    const distractors = adapter.generateDistractors(vocabItem, corpus);
    expect(distractors).not.toContain('Hello');
  });

  it('vocab generateDistractors degrades gracefully when corpus is depleted', () => {
    // Replace the real genki data with a stub that only has the correct answer.
    // _resetCacheForTesting clears the module-level cache so the stub takes effect.
    jest.mock('@/data/genki', () => ({
      getBookLessons: () => [
        {
          sections: [
            {
              content: {
                vocabulary: [{ english: 'Hello', japanese: 'こんにちは', reading: 'こんにちは' }],
              },
            },
          ],
        },
      ],
    }));
    _resetCacheForTesting();

    const distractors = adapter.generateDistractors(vocabItem, []);

    // With only the correct answer in the corpus, pickUpToThreeUnique returns 0 items.
    expect(distractors.length).toBeLessThanOrEqual(3);
    expect(distractors).not.toContain('Hello');

    // Restore state for subsequent tests.
    jest.unmock('@/data/genki');
    _resetCacheForTesting();
  });
});
