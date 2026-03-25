# JLPT Remaining Work

## High Priority

### 1. Push Changes to Remote
- [ ] Fix SSH key permissions or push manually
- 5 commits pending

### 2. Audio Integration for Listening Sections
- [ ] Generate or source audio files for listening exercises
- [ ] Implement audio playback in listening section UI
- [ ] Add audio progress indicators
- Current state: UI has placeholder "Play Audio" buttons but no actual audio

### 3. Practice Test Functionality
- [ ] Implement answer selection and state management
- [ ] Add answer checking logic
- [ ] Calculate and display scores
- [ ] Track practice test completion in progress store
- Affects: N5 Units 9-10, N4 Unit 10, potentially all levels

### 4. Mock Exam Implementation
- [ ] Ensure mock exam works for N5 and N4 levels
- [ ] Timer functionality
- [ ] Section navigation (vocabulary, grammar, reading, listening)
- [ ] Score calculation and pass/fail determination
- [ ] Progress tracking for exam completion
- File: `app/jlpt/[level]/mock-exam.tsx`

## Medium Priority

### 5. Progress Tracking for JLPT
- [ ] Verify progress store tracks JLPT unit completion
- [ ] Add XP rewards for JLPT content
- [ ] Track which vocabulary/kanji have been studied
- [ ] Spaced repetition integration

### 6. Content Review & Quality
- [ ] Review N5 exam-focused content for accuracy
- [ ] Review N4 exam-focused content for accuracy
- [ ] Verify vocabulary doesn't duplicate Genki content
- [ ] Check grammar patterns are JLPT-specific

### 7. UI Polish
- [ ] Test all JLPT screens on mobile devices
- [ ] Verify dark mode works correctly
- [ ] Check Japanese font rendering
- [ ] Test accessibility with screen readers

## Low Priority

### 8. Performance Optimization
- [ ] Lazy load JLPT unit data
- [ ] Optimize large vocabulary lists
- [ ] Add skeleton loading states

### 9. Offline Support
- [ ] Cache JLPT content for offline access
- [ ] Handle offline state in UI

### 10. Analytics & Insights
- [ ] Track which units users spend most time on
- [ ] Identify difficult vocabulary/grammar points
- [ ] Study session statistics

## Technical Debt

### 11. React Native Web Warnings
- [ ] Investigate aria-hidden warning during navigation
- [ ] Consider using `inert` attribute or custom navigation transitions
- Not blocking functionality, but appears in console

### 12. Deprecated Dependencies
- [ ] Migrate from expo-av to expo-audio/expo-video (deprecated in SDK 54)
- [ ] Update packages to recommended versions:
  - expo@54.0.31 → ~54.0.32
  - expo-font@14.0.10 → ~14.0.11
  - expo-router@6.0.21 → ~6.0.22
  - react-native-gesture-handler@2.30.0 → ~2.28.0
  - react-native-svg@15.15.1 → 15.12.1
