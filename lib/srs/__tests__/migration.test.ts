import { migrateCharacterMasteryToSrs } from '@/lib/srs/migration';

const oldCharacterMastery = {
  'hiragana-a': {
    characterId: 'hiragana-a',
    correctCount: 3,
    incorrectCount: 1,
    masteryLevel: 4,
    lastPracticed: '2026-01-15T10:00:00.000Z',
    nextReviewDate: '2026-01-22T10:00:00.000Z',
  },
  'hiragana-i': {
    characterId: 'hiragana-i',
    correctCount: 2,
    incorrectCount: 0,
    masteryLevel: 3,
    lastPracticed: '2026-01-15T10:00:00.000Z',
    nextReviewDate: '2026-01-19T10:00:00.000Z',
  },
};

describe('migrateCharacterMasteryToSrs', () => {
  it('converts each characterMastery entry to an srsItem with kana payload', () => {
    const result = migrateCharacterMasteryToSrs(oldCharacterMastery);
    expect(Object.keys(result).sort()).toEqual([
      'kana:hiragana-a',
      'kana:hiragana-i',
    ]);

    const a = result['kana:hiragana-a'];
    expect(a.type).toBe('kana');
    expect(a.refId).toBe('hiragana-a');
    expect(a.correctCount).toBe(3);
    expect(a.incorrectCount).toBe(1);
    expect(a.masteryLevel).toBe(4);
    expect(a.lastReviewedAt).toBe('2026-01-15T10:00:00.000Z');
    expect(a.nextReviewDate).toBe('2026-01-22T10:00:00.000Z');
    expect(a.payload.kind).toBe('kana');
    if (a.payload.kind === 'kana') {
      expect(a.payload.character).toBe('あ');
      expect(a.payload.romaji).toBe('a');
      expect(a.payload.kanaType).toBe('hiragana');
    }
  });

  it('drops entries with character IDs that do not exist in the kana corpus', () => {
    const result = migrateCharacterMasteryToSrs({
      'hiragana-a': oldCharacterMastery['hiragana-a'],
      'orphan-id': { ...oldCharacterMastery['hiragana-a'], characterId: 'orphan-id' },
    });
    expect(Object.keys(result)).toEqual(['kana:hiragana-a']);
  });

  it('drops entries with garbage card-id keys (pre-existing bug from MatchingGame/SpeedChallenge)', () => {
    const result = migrateCharacterMasteryToSrs({
      'pair-0-hiragana': { ...oldCharacterMastery['hiragana-a'], characterId: 'pair-0-hiragana' },
      'speed-q-3': { ...oldCharacterMastery['hiragana-a'], characterId: 'speed-q-3' },
    });
    expect(Object.keys(result)).toEqual([]);
  });

  it('returns empty object for empty input', () => {
    expect(migrateCharacterMasteryToSrs({})).toEqual({});
  });
});
