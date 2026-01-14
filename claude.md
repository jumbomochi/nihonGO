# nihonGO - Japanese Language Tutor

A mobile-first Japanese language learning application designed for beginners, powered by AI tutoring principles.

## Project Overview

nihonGO replaces traditional textbook learning with a personalized, interactive AI tutoring experience. The app focuses on practical Japanese acquisition through conversation, cultural context, and adaptive learning.

## Core Learning Philosophy

Based on modern AI-tutoring approaches, the app emphasizes:

1. **Cultural Context First** - Explain *why* natives choose specific expressions, not just grammar rules
2. **Practical Examples** - Real-world scenarios over abstract textbook situations
3. **Comparative Learning** - Show differences between similar grammar points with native usage patterns
4. **Personalized Experience** - Adapt to learner's background, goals, and preferred learning style

## Key Features

### Learner Profile
- Native language background
- Prior language learning experience (especially CJK languages)
- Current Japanese proficiency level
- Specific learning goals
- Preferred learning style (detailed explanations vs. conversational practice)

### Learning Modes

**Study Mode** (Detailed learners)
- In-depth grammar explanations with cultural context
- Multiple examples across different scenarios
- Deep dives into the "why" behind language choices

**Conversation Mode** (Conversational learners)
- Quick, practical explanations
- Immediate application through dialogue
- Natural conversation flow with corrections

### Grammar & Vocabulary
- Compare similar grammar points side-by-side
- Contextual vocabulary with native usage examples
- Kanji learning with origin explanations (especially for learners with Chinese background)

## Tech Stack

- **Framework**: React Native with Expo (mobile-first, cross-platform)
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Zustand
- **AI Integration**: Claude API for tutoring interactions
- **Storage**: AsyncStorage for local data, optional Supabase for sync

## Project Structure

```
/app                 # Expo Router app directory
  /(tabs)            # Tab-based navigation
  /lesson            # Lesson screens
  /chat              # Conversation mode
/components          # Reusable UI components
/lib                 # Utilities and API clients
/hooks               # Custom React hooks
/stores              # Zustand state stores
/constants           # App constants and theme
/assets              # Images, fonts, audio
```

## Development Guidelines

- Mobile-first design: all features must work excellently on phones
- Offline-capable: core content should work without internet
- Accessibility: support screen readers and dynamic text sizing
- Performance: fast load times, smooth animations
- Japanese text: proper font rendering for kanji, hiragana, katakana

## Getting Started

```bash
npm install
npx expo start
```

## Environment Variables

```
EXPO_PUBLIC_CLAUDE_API_KEY=your_api_key_here
```
