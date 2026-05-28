import { useProgressStore } from '@/stores/progressStore';
import { SRS_INTERVALS_DAYS, SrsEnrollInput } from '@/types/srs';

const baseVocabEnroll = (overrides: Partial<SrsEnrollInput> = {}): SrsEnrollInput => ({
  itemKey: 'vocab:greetings-konnichiwa',
  type: 'vocab',
  refId: 'greetings-konnichiwa',
  payload: {
    kind: 'vocab',
    japanese: 'こんにちは',
    reading: 'こんにちは',
    english: 'Hello',
    lessonId: 'greetings',
  },
  seedCorrect: true,
  ...overrides,
});

beforeEach(() => {
  useProgressStore.getState().resetProgress();
});

describe('SRS actions', () => {
  it('enrollSrsItem with seedCorrect=true creates item at mastery 1, due in 1 day', () => {
    const { enrollSrsItem } = useProgressStore.getState();
    enrollSrsItem(baseVocabEnroll({ seedCorrect: true }));

    const item = useProgressStore.getState().srsItems['vocab:greetings-konnichiwa'];
    expect(item).toBeDefined();
    expect(item.masteryLevel).toBe(1);
    expect(item.correctCount).toBe(1);
    expect(item.incorrectCount).toBe(0);

    const dueIn = new Date(item.nextReviewDate).getTime() - Date.now();
    expect(dueIn).toBeGreaterThan(SRS_INTERVALS_DAYS[1] * 86400000 - 5000);
    expect(dueIn).toBeLessThan(SRS_INTERVALS_DAYS[1] * 86400000 + 5000);
  });

  it('enrollSrsItem with seedCorrect=false creates item at mastery 0', () => {
    useProgressStore.getState().enrollSrsItem(baseVocabEnroll({ seedCorrect: false }));
    const item = useProgressStore.getState().srsItems['vocab:greetings-konnichiwa'];
    expect(item.masteryLevel).toBe(0);
    expect(item.correctCount).toBe(0);
    expect(item.incorrectCount).toBe(1);
  });

  it('enrollSrsItem twice with same itemKey is a no-op', () => {
    const { enrollSrsItem } = useProgressStore.getState();
    enrollSrsItem(baseVocabEnroll({ seedCorrect: true }));
    const firstDate = useProgressStore.getState().srsItems['vocab:greetings-konnichiwa'].lastReviewedAt;
    enrollSrsItem(baseVocabEnroll({ seedCorrect: false }));
    const second = useProgressStore.getState().srsItems['vocab:greetings-konnichiwa'];
    expect(second.lastReviewedAt).toBe(firstDate);
    expect(second.correctCount).toBe(1);
    expect(second.incorrectCount).toBe(0);
  });

  it('gradeSrsItem on existing item increments counts and advances mastery on correct', () => {
    const { enrollSrsItem, gradeSrsItem } = useProgressStore.getState();
    enrollSrsItem(baseVocabEnroll({ seedCorrect: true }));
    gradeSrsItem('vocab:greetings-konnichiwa', true);
    gradeSrsItem('vocab:greetings-konnichiwa', true);

    const item = useProgressStore.getState().srsItems['vocab:greetings-konnichiwa'];
    expect(item.correctCount).toBe(3);
    expect(item.masteryLevel).toBe(5);
  });

  it('gradeSrsItem on non-existent itemKey with payload upserts (kana use case)', () => {
    const { gradeSrsItem } = useProgressStore.getState();
    gradeSrsItem('kana:hiragana-a', true, {
      kind: 'kana',
      character: 'あ',
      romaji: 'a',
      kanaType: 'hiragana',
    });
    const item = useProgressStore.getState().srsItems['kana:hiragana-a'];
    expect(item).toBeDefined();
    expect(item.correctCount).toBe(1);
    expect(item.payload.kind).toBe('kana');
  });

  it('gradeSrsItem without payload on non-existent itemKey is a no-op', () => {
    useProgressStore.getState().gradeSrsItem('vocab:does-not-exist', true);
    expect(useProgressStore.getState().srsItems['vocab:does-not-exist']).toBeUndefined();
  });

  it('getDueSrsItems returns items where nextReviewDate <= now, sorted oldest first', () => {
    const { enrollSrsItem } = useProgressStore.getState();
    enrollSrsItem(baseVocabEnroll({ itemKey: 'vocab:a', refId: 'a' }));
    enrollSrsItem(baseVocabEnroll({ itemKey: 'vocab:b', refId: 'b' }));
    useProgressStore.setState((state) => ({
      srsItems: {
        ...state.srsItems,
        'vocab:a': { ...state.srsItems['vocab:a'], nextReviewDate: '2020-01-01T00:00:00.000Z' },
        'vocab:b': { ...state.srsItems['vocab:b'], nextReviewDate: '2099-01-01T00:00:00.000Z' },
      },
    }));

    const due = useProgressStore.getState().getDueSrsItems();
    expect(due.map((i) => i.itemKey)).toEqual(['vocab:a']);
  });

  it('getDueSrsItems filters by type', () => {
    const { enrollSrsItem, gradeSrsItem } = useProgressStore.getState();
    enrollSrsItem(baseVocabEnroll());
    gradeSrsItem('kana:hiragana-a', true, {
      kind: 'kana', character: 'あ', romaji: 'a', kanaType: 'hiragana',
    });
    useProgressStore.setState((state) => ({
      srsItems: Object.fromEntries(
        Object.entries(state.srsItems).map(([k, v]) => [k, { ...v, nextReviewDate: '2020-01-01T00:00:00.000Z' }])
      ),
    }));

    expect(useProgressStore.getState().getDueSrsItems('kana').map((i) => i.itemKey)).toEqual(['kana:hiragana-a']);
    expect(useProgressStore.getState().getDueSrsItems('vocab').map((i) => i.itemKey)).toEqual(['vocab:greetings-konnichiwa']);
  });

  it('getDueCount matches getDueSrsItems length', () => {
    const { enrollSrsItem } = useProgressStore.getState();
    enrollSrsItem(baseVocabEnroll());
    useProgressStore.setState((state) => ({
      srsItems: Object.fromEntries(
        Object.entries(state.srsItems).map(([k, v]) => [k, { ...v, nextReviewDate: '2020-01-01T00:00:00.000Z' }])
      ),
    }));
    expect(useProgressStore.getState().getDueCount()).toBe(1);
    expect(useProgressStore.getState().getDueCount('kana')).toBe(0);
  });
});

describe('migration on rehydration', () => {
  it('migrates characterMastery to srsItems on first load if srsItems empty', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    await AsyncStorage.setItem(
      'nihongo-progress-storage',
      JSON.stringify({
        state: {
          characterMastery: {
            'hiragana-a': {
              characterId: 'hiragana-a',
              correctCount: 5,
              incorrectCount: 1,
              masteryLevel: 4,
              lastPracticed: '2026-01-01T00:00:00.000Z',
              nextReviewDate: '2026-01-15T00:00:00.000Z',
            },
          },
          srsItems: {},
        },
        version: 0,
      })
    );

    await useProgressStore.persist.rehydrate();

    const items = useProgressStore.getState().srsItems;
    expect(items['kana:hiragana-a']).toBeDefined();
    expect(items['kana:hiragana-a'].correctCount).toBe(5);
  });
});
