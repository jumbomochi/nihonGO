// components/games/MatchingGame.tsx

import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { KanaPair } from '@/types/alphabet';
import { MatchingCard as MatchingCardType, MatchingPairType } from '@/types/games';
import { MatchingCard } from './MatchingCard';
import {
  generateMatchingCards,
  checkMatch,
  calculateMatchingScore,
} from '@/lib/matchingGameUtils';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/common/Button';

interface MatchingGameProps {
  pairs: KanaPair[];
  pairType: MatchingPairType;
  pairCount?: number;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const MATCH_DELAY = 800; // ms to show match before hiding

export function MatchingGame({
  pairs,
  pairType,
  pairCount = 5,
  onClose,
  onComplete,
}: MatchingGameProps) {
  const [cards, setCards] = useState<MatchingCardType[]>([]);
  const [selectedCard, setSelectedCard] = useState<MatchingCardType | null>(null);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const recordMatchingGameWin = useProgressStore((s) => s.recordMatchingGameWin);
  const updateCharacterMastery = useProgressStore((s) => s.updateCharacterMastery);

  useEffect(() => {
    const generatedCards = generateMatchingCards(pairs, pairType, pairCount);
    setCards(generatedCards);
  }, [pairs, pairType, pairCount]);

  const handleCardPress = useCallback(
    (card: MatchingCardType) => {
      if (isProcessing || card.isMatched) return;

      if (!selectedCard) {
        // First card selected
        setSelectedCard(card);
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c))
        );
      } else if (selectedCard.id === card.id) {
        // Same card tapped - deselect
        setSelectedCard(null);
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, isSelected: false } : c))
        );
      } else {
        // Second card selected - check for match
        setMoves((m) => m + 1);
        setIsProcessing(true);

        const isMatch = checkMatch(selectedCard, card);

        if (isMatch) {
          // Match found!
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === card.pairId
                ? { ...c, isMatched: true, isSelected: false }
                : c
            )
          );
          setMatchedCount((m) => {
            const newCount = m + 1;
            if (newCount === pairCount) {
              // Game complete
              const endTime = Date.now();
              const finalScore = calculateMatchingScore(
                pairCount,
                moves + 1,
                endTime - startTime
              );
              setScore(finalScore);
              setIsComplete(true);
              recordMatchingGameWin();
            }
            return newCount;
          });

          // Update mastery for matched characters
          updateCharacterMastery(selectedCard.id, true);
          updateCharacterMastery(card.id, true);

          setSelectedCard(null);
          setIsProcessing(false);
        } else {
          // No match - show both selected briefly then hide
          setCards((prev) =>
            prev.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c))
          );

          // Update mastery for incorrect match
          updateCharacterMastery(selectedCard.id, false);
          updateCharacterMastery(card.id, false);

          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === card.id || c.id === selectedCard.id
                  ? { ...c, isSelected: false }
                  : c
              )
            );
            setSelectedCard(null);
            setIsProcessing(false);
          }, MATCH_DELAY);
        }
      }
    },
    [selectedCard, isProcessing, pairCount, moves, startTime, recordMatchingGameWin, updateCharacterMastery]
  );

  const handlePlayAgain = () => {
    const generatedCards = generateMatchingCards(pairs, pairType, pairCount);
    setCards(generatedCards);
    setSelectedCard(null);
    setMoves(0);
    setMatchedCount(0);
    setIsComplete(false);
    setScore(0);
  };

  if (isComplete) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center px-6">
        <FontAwesome name="trophy" size={64} color="#eab308" />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
          Great job!
        </Text>
        <Text className="text-4xl font-bold text-sakura-600 mt-2">
          {score} XP
        </Text>
        <Text className="text-gray-500 mt-2">
          Completed in {moves} moves
        </Text>
        <View className="flex-row gap-4 mt-8">
          <Button title="Play Again" onPress={handlePlayAgain} />
          <Button
            title="Done"
            variant="outline"
            onPress={() => {
              onComplete(score);
              onClose();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Match the Pairs
        </Text>
        <View className="flex-row items-center">
          <FontAwesome name="hand-pointer-o" size={14} color="#9ca3af" />
          <Text className="text-gray-500 ml-1">{moves}</Text>
        </View>
      </View>

      {/* Progress */}
      <View className="px-4 py-2">
        <View className="flex-row items-center justify-center">
          <Text className="text-sm text-gray-500">
            {matchedCount} / {pairCount} matched
          </Text>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
          <View
            className="h-full bg-sakura-500 rounded-full"
            style={{ width: `${(matchedCount / pairCount) * 100}%` }}
          />
        </View>
      </View>

      {/* Cards Grid */}
      <View className="flex-1 px-4 py-6">
        <View className="flex-row flex-wrap justify-center gap-3">
          {cards.map((card) => (
            <MatchingCard
              key={card.id}
              card={card}
              onPress={handleCardPress}
              disabled={isProcessing}
            />
          ))}
        </View>
      </View>

      {/* Pair Type Indicator */}
      <View className="px-4 pb-4">
        <Text className="text-center text-sm text-gray-400">
          {pairType === 'hiragana-romaji' && 'Match hiragana with romaji'}
          {pairType === 'katakana-romaji' && 'Match katakana with romaji'}
          {pairType === 'hiragana-katakana' && 'Match hiragana with katakana'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
