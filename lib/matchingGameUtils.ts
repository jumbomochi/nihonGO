// lib/matchingGameUtils.ts

import { KanaPair } from '@/types/alphabet';
import { MatchingCard, MatchingPairType } from '@/types/games';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateMatchingCards(
  pairs: KanaPair[],
  pairType: MatchingPairType,
  pairCount: number = 5
): MatchingCard[] {
  // Select random pairs
  const selectedPairs = shuffleArray(pairs).slice(0, pairCount);
  const cards: MatchingCard[] = [];

  selectedPairs.forEach((pair, index) => {
    const pairId = `pair-${index}`;

    switch (pairType) {
      case 'hiragana-romaji':
        cards.push({
          id: `${pairId}-hiragana`,
          content: pair.hiragana.character,
          type: 'hiragana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        cards.push({
          id: `${pairId}-romaji`,
          content: pair.romaji,
          type: 'romaji',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        break;

      case 'katakana-romaji':
        cards.push({
          id: `${pairId}-katakana`,
          content: pair.katakana.character,
          type: 'katakana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        cards.push({
          id: `${pairId}-romaji`,
          content: pair.romaji,
          type: 'romaji',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        break;

      case 'hiragana-katakana':
        cards.push({
          id: `${pairId}-hiragana`,
          content: pair.hiragana.character,
          type: 'hiragana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        cards.push({
          id: `${pairId}-katakana`,
          content: pair.katakana.character,
          type: 'katakana',
          pairId,
          isMatched: false,
          isSelected: false,
        });
        break;
    }
  });

  return shuffleArray(cards);
}

export function checkMatch(card1: MatchingCard, card2: MatchingCard): boolean {
  return card1.pairId === card2.pairId && card1.id !== card2.id;
}

export function calculateMatchingScore(
  totalPairs: number,
  moves: number,
  timeMs: number
): number {
  // Base score: 10 points per pair
  const baseScore = totalPairs * 10;

  // Efficiency bonus: fewer moves = more points
  const perfectMoves = totalPairs; // Best case: one move per pair
  const moveBonus = Math.max(0, (perfectMoves * 2 - moves) * 2);

  // Time bonus: faster = more points (max 30 seconds expected)
  const timeSec = timeMs / 1000;
  const timeBonus = Math.max(0, Math.floor((60 - timeSec) / 2));

  return baseScore + moveBonus + timeBonus;
}
