import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, ScrollView, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useProgressStore } from '@/stores/progressStore';
import {
  JLPTLevel,
  ExamQuestion,
  MockExamAttempt,
  JLPTVocabulary,
  JLPTKanji,
  JLPTGrammar,
  JLPTReading,
  JLPTListening,
} from '@/data/jlpt/types';
import { getN3Units } from '@/data/jlpt/n3';
import { getN2Units } from '@/data/jlpt/n2';
import { getN1Units } from '@/data/jlpt/n1';

type ExamPhase = 'intro' | 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'results';

interface ExamState {
  phase: ExamPhase;
  currentQuestionIndex: number;
  answers: { questionId: string; selectedIndex: number; correct: boolean }[];
  timeRemaining: number;
  startTime: number | null;
}

interface SectionQuestions {
  vocabulary: ExamQuestion[];
  grammar: ExamQuestion[];
  reading: ExamQuestion[];
  listening: ExamQuestion[];
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate vocabulary questions from unit data
function generateVocabularyQuestions(vocabularyItems: JLPTVocabulary[], count: number): ExamQuestion[] {
  const shuffled = shuffleArray(vocabularyItems);
  const questions: ExamQuestion[] = [];

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const item = shuffled[i];
    const questionType = Math.random() > 0.5 ? 'meaning' : 'reading';

    if (questionType === 'meaning') {
      // Question: What does this word mean?
      const wrongOptions = shuffleArray(
        vocabularyItems.filter((v) => v.id !== item.id).map((v) => v.meaning)
      ).slice(0, 3);
      const options = shuffleArray([item.meaning, ...wrongOptions]);
      const correctIndex = options.indexOf(item.meaning);

      questions.push({
        id: `vocab-${item.id}-meaning`,
        type: 'vocabulary',
        subtype: 'word-meaning',
        question: `「${item.word}」の意味は何ですか？`,
        questionReading: `「${item.reading}」のいみはなんですか？`,
        options,
        correctIndex,
        explanation: `${item.word}（${item.reading}）means "${item.meaning}"`,
        points: 1,
      });
    } else {
      // Question: How do you read this word?
      const wrongOptions = shuffleArray(
        vocabularyItems.filter((v) => v.id !== item.id).map((v) => v.reading)
      ).slice(0, 3);
      const options = shuffleArray([item.reading, ...wrongOptions]);
      const correctIndex = options.indexOf(item.reading);

      questions.push({
        id: `vocab-${item.id}-reading`,
        type: 'vocabulary',
        subtype: 'kanji-reading',
        question: `「${item.word}」の読み方は何ですか？`,
        options,
        correctIndex,
        explanation: `${item.word} is read as "${item.reading}"`,
        points: 1,
      });
    }
  }

  return questions;
}

// Generate grammar questions from unit data
function generateGrammarQuestions(grammarItems: JLPTGrammar[], count: number): ExamQuestion[] {
  const shuffled = shuffleArray(grammarItems);
  const questions: ExamQuestion[] = [];

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const item = shuffled[i];

    // Question: Fill in the blank / Choose correct usage
    const wrongOptions = shuffleArray(
      grammarItems.filter((g) => g.id !== item.id).map((g) => g.pattern)
    ).slice(0, 3);
    const options = shuffleArray([item.pattern, ...wrongOptions]);
    const correctIndex = options.indexOf(item.pattern);

    questions.push({
      id: `grammar-${item.id}`,
      type: 'grammar',
      subtype: 'pattern-meaning',
      question: `次の意味を表す文法は何ですか？\n「${item.meaning}」`,
      options,
      correctIndex,
      explanation: `${item.pattern} means "${item.meaning}"\n${item.explanation}`,
      points: 1,
    });
  }

  return questions;
}

// Generate reading questions from unit data
function generateReadingQuestions(readingItems: JLPTReading[], count: number): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  for (const reading of readingItems) {
    for (const q of reading.questions) {
      if (questions.length >= count) break;

      questions.push({
        id: `reading-${reading.id}-${q.id}`,
        type: 'reading',
        subtype: 'comprehension',
        question: q.question,
        questionReading: q.questionReading,
        context: reading.passage.slice(0, 300) + (reading.passage.length > 300 ? '...' : ''),
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || '',
        points: 2,
      });
    }
    if (questions.length >= count) break;
  }

  return shuffleArray(questions).slice(0, count);
}

// Generate listening questions from unit data
function generateListeningQuestions(listeningItems: JLPTListening[], count: number): ExamQuestion[] {
  const questions: ExamQuestion[] = [];

  for (const listening of listeningItems) {
    for (const q of listening.questions) {
      if (questions.length >= count) break;

      questions.push({
        id: `listening-${listening.id}-${q.id}`,
        type: 'listening',
        subtype: 'comprehension',
        question: q.question,
        questionReading: q.questionReading,
        context: `[Transcript]\n${listening.transcript.slice(0, 200)}...`,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation || '',
        points: 2,
      });
    }
    if (questions.length >= count) break;
  }

  return shuffleArray(questions).slice(0, count);
}

export default function MockExamScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const jlptLevel = level?.toUpperCase() as JLPTLevel;
  const { recordJLPTExamAttempt, addXp } = useProgressStore();

  // Generate questions once on mount
  const sectionQuestions = useMemo<SectionQuestions>(() => {
    const getUnitsForLevel = () => {
      switch (jlptLevel) {
        case 'N3':
          return getN3Units();
        case 'N2':
          return getN2Units();
        case 'N1':
          return getN1Units();
        default:
          return [];
      }
    };
    const units = getUnitsForLevel();
    const allVocabulary = units.flatMap((u) => u.sections.vocabulary);
    const allKanji = units.flatMap((u) => u.sections.kanji);
    const allGrammar = units.flatMap((u) => u.sections.grammar);
    const allReading = units.flatMap((u) => u.sections.reading);
    const allListening = units.flatMap((u) => u.sections.listening);

    return {
      vocabulary: generateVocabularyQuestions(allVocabulary, 20),
      grammar: generateGrammarQuestions(allGrammar, 20),
      reading: generateReadingQuestions(allReading, 20),
      listening: generateListeningQuestions(allListening, 20),
    };
  }, [jlptLevel]);

  const [examState, setExamState] = useState<ExamState>({
    phase: 'intro',
    currentQuestionIndex: 0,
    answers: [],
    timeRemaining: 100 * 60, // 100 minutes in seconds
    startTime: null,
  });

  const currentQuestions = useMemo(() => {
    switch (examState.phase) {
      case 'vocabulary':
        return sectionQuestions.vocabulary;
      case 'grammar':
        return sectionQuestions.grammar;
      case 'reading':
        return sectionQuestions.reading;
      case 'listening':
        return sectionQuestions.listening;
      default:
        return [];
    }
  }, [examState.phase, sectionQuestions]);

  const currentQuestion = currentQuestions[examState.currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (examState.phase === 'intro' || examState.phase === 'results') return;
    if (examState.timeRemaining <= 0) {
      // Time's up - move to results
      setExamState((prev) => ({ ...prev, phase: 'results' }));
      return;
    }

    const timer = setInterval(() => {
      setExamState((prev) => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.phase, examState.timeRemaining]);

  const handleStartExam = useCallback(() => {
    setExamState({
      phase: 'vocabulary',
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 100 * 60,
      startTime: Date.now(),
    });
  }, []);

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion) return;

      const isCorrect = selectedIndex === currentQuestion.correctIndex;

      setExamState((prev) => {
        const newAnswers = [
          ...prev.answers,
          {
            questionId: currentQuestion.id,
            selectedIndex,
            correct: isCorrect,
          },
        ];

        // Check if moving to next question or next section
        const isLastQuestion = prev.currentQuestionIndex >= currentQuestions.length - 1;

        if (isLastQuestion) {
          // Move to next section
          const phases: ExamPhase[] = ['vocabulary', 'grammar', 'reading', 'listening', 'results'];
          const currentPhaseIndex = phases.indexOf(prev.phase as ExamPhase);
          const nextPhase = phases[currentPhaseIndex + 1];

          return {
            ...prev,
            answers: newAnswers,
            phase: nextPhase,
            currentQuestionIndex: 0,
          };
        }

        return {
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      });
    },
    [currentQuestion, currentQuestions]
  );

  const handleQuitExam = useCallback(() => {
    Alert.alert('Quit Exam', 'Are you sure you want to quit? Your progress will be lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Quit', style: 'destructive', onPress: () => router.back() },
    ]);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Calculate results
  const results = useMemo(() => {
    if (examState.phase !== 'results') return null;

    const vocabularyAnswers = examState.answers.filter((a) => a.questionId.startsWith('vocab-'));
    const grammarAnswers = examState.answers.filter((a) => a.questionId.startsWith('grammar-'));
    const readingAnswers = examState.answers.filter((a) => a.questionId.startsWith('reading-'));
    const listeningAnswers = examState.answers.filter((a) => a.questionId.startsWith('listening-'));

    const vocabCorrect = vocabularyAnswers.filter((a) => a.correct).length;
    const grammarCorrect = grammarAnswers.filter((a) => a.correct).length;
    const readingCorrect = readingAnswers.filter((a) => a.correct).length;
    const listeningCorrect = listeningAnswers.filter((a) => a.correct).length;

    const vocabScore = vocabularyAnswers.length > 0 ? (vocabCorrect / vocabularyAnswers.length) * 100 : 0;
    const grammarScore = grammarAnswers.length > 0 ? (grammarCorrect / grammarAnswers.length) * 100 : 0;
    const readingScore = readingAnswers.length > 0 ? (readingCorrect / readingAnswers.length) * 100 : 0;
    const listeningScore = listeningAnswers.length > 0 ? (listeningCorrect / listeningAnswers.length) * 100 : 0;

    const totalCorrect = vocabCorrect + grammarCorrect + readingCorrect + listeningCorrect;
    const totalQuestions = examState.answers.length;
    const totalScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    const passed = totalScore >= 60;

    const timeSpent = examState.startTime ? Math.floor((Date.now() - examState.startTime) / 1000) : 0;

    return {
      vocabScore,
      grammarScore,
      readingScore,
      listeningScore,
      totalScore,
      passed,
      totalCorrect,
      totalQuestions,
      timeSpent,
    };
  }, [examState]);

  // Save results when exam ends
  useEffect(() => {
    if (examState.phase === 'results' && results) {
      const attempt: MockExamAttempt = {
        id: `${jlptLevel}-exam-${Date.now()}`,
        level: jlptLevel,
        date: new Date().toISOString(),
        totalScore: results.totalScore,
        sectionScores: {
          vocabulary: results.vocabScore,
          grammar: results.grammarScore,
          reading: results.readingScore,
          listening: results.listeningScore,
        },
        passed: results.passed,
        timeSpent: results.timeSpent,
        answers: examState.answers,
      };

      recordJLPTExamAttempt(attempt);

      // Award XP based on performance
      const xpEarned = Math.floor(results.totalScore / 2) + (results.passed ? 50 : 0);
      addXp(xpEarned);
    }
  }, [examState.phase, results, jlptLevel, recordJLPTExamAttempt, addXp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSectionProgress = () => {
    const phases = ['vocabulary', 'grammar', 'reading', 'listening'];
    const currentIndex = phases.indexOf(examState.phase);
    return currentIndex >= 0 ? `${currentIndex + 1}/4` : '';
  };

  // Render intro screen
  if (examState.phase === 'intro') {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Pressable onPress={handleBack} className="p-2 -ml-2">
            <FontAwesome name="arrow-left" size={20} color="#6b7280" />
          </Pressable>
          <Text className="flex-1 text-lg font-semibold text-gray-900 dark:text-white ml-2">
            {jlptLevel} Mock Exam
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-6 py-8">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-sakura-100 dark:bg-sakura-900/30 rounded-full items-center justify-center mb-4">
              <FontAwesome name="graduation-cap" size={40} color="#ec4899" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              JLPT {jlptLevel} Practice Test
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center">
              Test your knowledge with a full-length mock exam
            </Text>
          </View>

          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
            <Text className="font-semibold text-gray-900 dark:text-white mb-4">
              Exam Structure
            </Text>

            {[
              { section: 'Vocabulary', questions: 20, time: '25 min', icon: 'book' },
              { section: 'Grammar', questions: 20, time: '25 min', icon: 'puzzle-piece' },
              { section: 'Reading', questions: 20, time: '25 min', icon: 'file-text-o' },
              { section: 'Listening', questions: 20, time: '25 min', icon: 'headphones' },
            ].map((item, index) => (
              <View
                key={item.section}
                className={`flex-row items-center py-3 ${index < 3 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
              >
                <View className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl items-center justify-center">
                  <FontAwesome name={item.icon as any} size={18} color="#ec4899" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {item.section}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.questions} questions</Text>
                </View>
                <Text className="text-sm text-gray-400">{item.time}</Text>
              </View>
            ))}
          </View>

          <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 mb-8">
            <View className="flex-row items-center mb-2">
              <FontAwesome name="info-circle" size={18} color="#f59e0b" />
              <Text className="font-semibold text-amber-800 dark:text-amber-200 ml-2">
                Important
              </Text>
            </View>
            <Text className="text-amber-700 dark:text-amber-300 text-sm leading-5">
              • Total time: 100 minutes{'\n'}
              • Passing score: 60%{'\n'}
              • You cannot pause once started{'\n'}
              • Passing unlocks the next level
            </Text>
          </View>

          <Pressable
            onPress={handleStartExam}
            className="bg-sakura-500 rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">Start Exam</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render results screen
  if (examState.phase === 'results' && results) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Text className="flex-1 text-lg font-semibold text-gray-900 dark:text-white">
            Exam Results
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-6 py-8">
          {/* Score Circle */}
          <View className="items-center mb-8">
            <View
              className={`w-32 h-32 rounded-full items-center justify-center ${
                results.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              <Text
                className={`text-4xl font-bold ${
                  results.passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.round(results.totalScore)}%
              </Text>
            </View>
            <Text
              className={`text-xl font-semibold mt-4 ${
                results.passed ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {results.passed ? 'Passed! 🎉' : 'Not Passed'}
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 mt-1">
              {results.totalCorrect}/{results.totalQuestions} correct
            </Text>
          </View>

          {/* Section Scores */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6">
            <Text className="font-semibold text-gray-900 dark:text-white mb-4">
              Section Breakdown
            </Text>

            {[
              { name: 'Vocabulary', score: results.vocabScore, icon: 'book' },
              { name: 'Grammar', score: results.grammarScore, icon: 'puzzle-piece' },
              { name: 'Reading', score: results.readingScore, icon: 'file-text-o' },
              { name: 'Listening', score: results.listeningScore, icon: 'headphones' },
            ].map((section, index) => (
              <View key={section.name} className={`mb-${index < 3 ? '4' : '0'}`}>
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <FontAwesome name={section.icon as any} size={14} color="#6b7280" />
                    <Text className="text-gray-700 dark:text-gray-300 ml-2">
                      {section.name}
                    </Text>
                  </View>
                  <Text
                    className={`font-medium ${
                      section.score >= 60 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Math.round(section.score)}%
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      section.score >= 60 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${section.score}%` }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Stats */}
          <View className="flex-row mb-8">
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mr-2">
              <FontAwesome name="clock-o" size={20} color="#6b7280" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Time Spent</Text>
              <Text className="font-semibold text-gray-900 dark:text-white">
                {Math.floor(results.timeSpent / 60)} min
              </Text>
            </View>
            <View className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 ml-2">
              <FontAwesome name="star" size={20} color="#f59e0b" />
              <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">XP Earned</Text>
              <Text className="font-semibold text-gray-900 dark:text-white">
                +{Math.floor(results.totalScore / 2) + (results.passed ? 50 : 0)} XP
              </Text>
            </View>
          </View>

          {results.passed && (
            <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 mb-6">
              <View className="flex-row items-center">
                <FontAwesome name="unlock" size={20} color="#22c55e" />
                <Text className="font-semibold text-green-800 dark:text-green-200 ml-2">
                  Level Unlocked!
                </Text>
              </View>
              <Text className="text-green-700 dark:text-green-300 text-sm mt-2">
                {jlptLevel === 'N3' && 'N2 content is now available!'}
                {jlptLevel === 'N2' && 'N1 content is now available!'}
                {jlptLevel === 'N1' && 'Congratulations on reaching the highest level!'}
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleBack}
            className="bg-sakura-500 rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">Done</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render exam questions
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Pressable onPress={handleQuitExam} className="p-2 -ml-2">
          <FontAwesome name="times" size={20} color="#6b7280" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-sm text-gray-500">
            Section {getSectionProgress()} • {examState.phase.charAt(0).toUpperCase() + examState.phase.slice(1)}
          </Text>
          <Text className="text-xs text-gray-400">
            Question {examState.currentQuestionIndex + 1}/{currentQuestions.length}
          </Text>
        </View>
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
          <FontAwesome name="clock-o" size={14} color={examState.timeRemaining < 300 ? '#ef4444' : '#6b7280'} />
          <Text
            className={`ml-1 font-mono ${
              examState.timeRemaining < 300 ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            {formatTime(examState.timeRemaining)}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-gray-200 dark:bg-gray-800">
        <View
          className="h-full bg-sakura-500"
          style={{
            width: `${((examState.currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
          }}
        />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        {currentQuestion && (
          <>
            {/* Context for reading/listening */}
            {currentQuestion.context && (
              <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-sm text-gray-600 dark:text-gray-300 leading-5">
                  {currentQuestion.context}
                </Text>
              </View>
            )}

            {/* Question */}
            <View className="mb-6">
              <Text className="text-lg font-medium text-gray-900 dark:text-white leading-7">
                {currentQuestion.question}
              </Text>
              {currentQuestion.questionReading && (
                <Text className="text-sm text-gray-500 mt-1">
                  {currentQuestion.questionReading}
                </Text>
              )}
            </View>

            {/* Options */}
            <View>
              {currentQuestion.options.map((option, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleAnswer(index)}
                  className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3 flex-row items-center border-2 border-transparent active:border-sakura-500"
                >
                  <View className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full items-center justify-center mr-3">
                    <Text className="font-medium text-gray-600 dark:text-gray-300">
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text className="flex-1 text-gray-700 dark:text-gray-200">{option}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
