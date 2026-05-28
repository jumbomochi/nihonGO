import { useProgressStore } from '@/stores/progressStore';
import { ContentVocabulary } from '@/types/content';

beforeEach(() => {
  useProgressStore.getState().resetProgress();
});

describe('VocabQuiz enrollment via store', () => {
  it('enrolls multiple vocab items with seedCorrect reflecting each answer', () => {
    const vocab: ContentVocabulary[] = [
      { id: 'v1', japanese: 'あ', reading: 'あ', english: 'A', partOfSpeech: 'other', source: 'genki' },
      { id: 'v2', japanese: 'い', reading: 'い', english: 'I', partOfSpeech: 'other', source: 'genki' },
      { id: 'v3', japanese: 'う', reading: 'う', english: 'U', partOfSpeech: 'other', source: 'genki' },
    ];
    const results = [
      { vocabId: 'v1', correct: true },
      { vocabId: 'v2', correct: false },
      { vocabId: 'v3', correct: true },
    ];

    const { enrollSrsItem } = useProgressStore.getState();
    results.forEach(({ vocabId, correct }) => {
      const v = vocab.find((x) => x.id === vocabId)!;
      enrollSrsItem({
        itemKey: `vocab:${vocabId}`,
        type: 'vocab',
        refId: vocabId,
        payload: {
          kind: 'vocab',
          japanese: v.japanese,
          reading: v.reading,
          english: v.english,
          lessonId: 'test-lesson',
        },
        seedCorrect: correct,
      });
    });

    const items = useProgressStore.getState().srsItems;
    expect(Object.keys(items).filter((k) => k.startsWith('vocab:'))).toHaveLength(3);
    expect(items['vocab:v1'].masteryLevel).toBe(1); // correct seed
    expect(items['vocab:v2'].masteryLevel).toBe(0); // incorrect seed
    expect(items['vocab:v3'].masteryLevel).toBe(1);
  });

  it('idempotent — calling enrollSrsItem on same vocab twice does not reset progress', () => {
    const v = { id: 'v1', japanese: 'あ', reading: 'あ', english: 'A', partOfSpeech: 'other' as const, source: 'genki' as const };
    const { enrollSrsItem, gradeSrsItem } = useProgressStore.getState();

    enrollSrsItem({
      itemKey: 'vocab:v1', type: 'vocab', refId: 'v1',
      payload: { kind: 'vocab', japanese: v.japanese, reading: v.reading, english: v.english, lessonId: 'l1' },
      seedCorrect: true,
    });
    gradeSrsItem('vocab:v1', true);
    gradeSrsItem('vocab:v1', true);

    enrollSrsItem({
      itemKey: 'vocab:v1', type: 'vocab', refId: 'v1',
      payload: { kind: 'vocab', japanese: v.japanese, reading: v.reading, english: v.english, lessonId: 'l1' },
      seedCorrect: false,
    });

    const item = useProgressStore.getState().srsItems['vocab:v1'];
    expect(item.correctCount).toBe(3); // 1 from seed + 2 from grades, not reset
    expect(item.masteryLevel).toBe(5);
  });
});
