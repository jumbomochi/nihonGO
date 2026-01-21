import { GrammarComparison } from '@/types/genki';

// Pre-defined grammar comparisons for similar grammar points
export const GRAMMAR_COMPARISONS: GrammarComparison[] = [
  {
    id: 'compare-kore-kono',
    grammarA: 'l02-g01', // これ/それ/あれ/どれ
    grammarB: 'l02-g02', // この/その/あの/どの + Noun
    keyDifferences: [
      {
        aspect: 'Usage',
        grammarA: 'Stands alone as a pronoun (replaces the noun)',
        grammarB: 'Must be followed by a noun (modifies the noun)',
      },
      {
        aspect: 'Sentence Position',
        grammarA: 'Acts as the subject or object: これは本です',
        grammarB: 'Comes before a noun: この本は...',
      },
      {
        aspect: 'Translation',
        grammarA: '"this one," "that one" (the thing itself)',
        grammarB: '"this ___," "that ___" (describing which thing)',
      },
    ],
    commonMistakes: [
      'Using これ when you need この + noun: ✗ これ本 → ✓ この本',
      'Using この alone without a noun: ✗ このは高いです → ✓ これは高いです',
      'Mixing up それ/その when pointing to something near the listener',
    ],
    usageTip:
      'If you can point and say "this one" or "that one" without naming the object, use これ/それ/あれ. If you\'re describing "this book" or "that person," use この/その/あの + the noun.',
    contrastExamples: [
      {
        situation: 'Asking about an item',
        grammarA: {
          japanese: 'これは何ですか。',
          english: 'What is this? (pointing at unknown object)',
        },
        grammarB: {
          japanese: 'この本は何ですか。',
          english: 'What is this book? (asking about a specific book)',
        },
      },
      {
        situation: 'Stating ownership',
        grammarA: {
          japanese: 'それは私のです。',
          english: "That (one) is mine.",
        },
        grammarB: {
          japanese: 'その傘は私のです。',
          english: 'That umbrella is mine.',
        },
      },
      {
        situation: 'Asking "which"',
        grammarA: {
          japanese: 'どれがいいですか。',
          english: 'Which one is good?',
        },
        grammarB: {
          japanese: 'どの本がいいですか。',
          english: 'Which book is good?',
        },
      },
    ],
  },
  {
    id: 'compare-wa-question',
    grammarA: 'l01-g01', // X は Y です
    grammarB: 'l01-g02', // Question Sentences (か)
    keyDifferences: [
      {
        aspect: 'Purpose',
        grammarA: 'Makes a statement: "X is Y"',
        grammarB: 'Asks a yes/no question: "Is X Y?"',
      },
      {
        aspect: 'Sentence Ending',
        grammarA: 'Ends with です (statement)',
        grammarB: 'Ends with ですか (question)',
      },
      {
        aspect: 'Intonation',
        grammarA: 'Falling intonation at the end',
        grammarB: 'Slightly rising or flat (か does the question work)',
      },
    ],
    commonMistakes: [
      'Forgetting か when asking questions in polite speech',
      'Using rising intonation instead of か in formal situations',
      'Adding か to statements accidentally, making them questions',
    ],
    usageTip:
      'In polite Japanese, always use か to form questions—don\'t rely on intonation alone. In casual speech with friends, you can drop か and use rising intonation instead.',
    contrastExamples: [
      {
        situation: 'About being a student',
        grammarA: {
          japanese: '私は学生です。',
          english: 'I am a student. (statement)',
        },
        grammarB: {
          japanese: '学生ですか。',
          english: 'Are you a student? (question)',
        },
      },
      {
        situation: 'About nationality',
        grammarA: {
          japanese: '田中さんは日本人です。',
          english: 'Tanaka is Japanese. (statement)',
        },
        grammarB: {
          japanese: '日本人ですか。',
          english: 'Are you Japanese? (question)',
        },
      },
    ],
  },
];

/**
 * Get a comparison by its ID
 */
export function getComparison(id: string): GrammarComparison | undefined {
  return GRAMMAR_COMPARISONS.find((c) => c.id === id);
}

/**
 * Get a comparison for a pair of grammar points (order doesn't matter)
 */
export function getComparisonForPair(
  grammarA: string,
  grammarB: string
): GrammarComparison | undefined {
  return GRAMMAR_COMPARISONS.find(
    (c) =>
      (c.grammarA === grammarA && c.grammarB === grammarB) ||
      (c.grammarA === grammarB && c.grammarB === grammarA)
  );
}

/**
 * Get all comparisons that include a specific grammar point
 */
export function getComparisonsForGrammar(grammarId: string): GrammarComparison[] {
  return GRAMMAR_COMPARISONS.filter(
    (c) => c.grammarA === grammarId || c.grammarB === grammarId
  );
}

/**
 * Check if a grammar point has any comparisons available
 */
export function hasComparison(grammarId: string): boolean {
  return GRAMMAR_COMPARISONS.some(
    (c) => c.grammarA === grammarId || c.grammarB === grammarId
  );
}
