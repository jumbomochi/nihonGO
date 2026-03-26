# App Store Preparation — Design Spec

## Overview

Prepare nihonGO for App Store publication by creating a hosted privacy policy, integrating Sentry for crash/performance monitoring, and updating App Store configuration.

## 1. Privacy Policy Page (GitHub Pages)

### Hosting

- Create `docs/privacy.html` — a standalone, styled HTML page
- GitHub Pages serves from `docs/` folder on `master` branch
- Final URL: `https://jumbomochi.github.io/nihonGO/privacy`
- GitHub Pages must be enabled in repo settings (manual step)

### Content

The privacy policy must cover:

- **Local data storage**: User profile (native language, proficiency, goals) stored locally via AsyncStorage. No account required.
- **AI provider communication**: Chat messages are sent to the user's chosen AI provider (Claude API, Ollama, or Apple Intelligence). On-device providers (Ollama, Apple Intelligence) do not transmit data externally.
- **Microphone usage**: Audio is used for pronunciation practice via on-device speech recognition. Audio is not stored or transmitted.
- **Crash reporting (Sentry)**: Anonymous crash reports and performance data are collected. Includes device type, OS version, stack traces. No PII is collected.
- **No data sales**: User data is never sold to third parties.
- **No user accounts**: The app does not require or support user accounts.
- **Data retention**: All user data is stored on-device and deleted when the app is uninstalled.
- **Contact information**: An email address for privacy inquiries.

### Design

- Clean, minimal, mobile-friendly HTML
- Matches nihonGO branding (simple, no heavy styling)
- No external dependencies (inline CSS)

## 2. Sentry Integration

### Package

- `@sentry/react-native` — the officially supported SDK for Expo/React Native
- Expo plugin via `@sentry/react-native/expo`

### Initialization

- Initialize Sentry in `app/_layout.tsx` at app startup
- Wrap the root component with `Sentry.wrap()`
- Configuration:
  - `dsn`: loaded from `EXPO_PUBLIC_SENTRY_DSN` environment variable
  - `tracesSampleRate`: `0.2` (20% of transactions for performance monitoring)
  - `enableAutoSessionTracking`: `true`
  - `enableNativeFramesTracking`: `true` (iOS)
  - Disable in development (`enabled: !__DEV__`)

### What Gets Captured

- Unhandled JS exceptions and native crashes
- Performance traces (screen loads, navigation)
- Session health (crash-free rate)
- Device metadata: type, OS version, app version

### What Does NOT Get Captured

- Chat message content
- User profile data
- Audio recordings
- API keys

### Setup Requirements

- Sentry account and project (manual step — user creates)
- DSN added to environment variables
- EAS build required (not compatible with Expo Go)

## 3. App Store Configuration

### app.json Updates

- Add `expo.ios.privacyUrl` pointing to `https://jumbomochi.github.io/nihonGO/privacy`
- Verify `bundleIdentifier`, `buildNumber`, and `version` are set

### eas.json

- Submit section has placeholder Apple credentials (appleId, ascAppId, appleTeamId)
- User fills these in before first submission

### App Store Privacy Nutrition Labels

When submitting, the following declarations apply:

| Data Type | Collected | Linked to User | Used for Tracking |
|-----------|-----------|-----------------|-------------------|
| Crash Data | Yes | No | No |
| Performance Data | Yes | No | No |
| Diagnostics | Yes | No | No |

No other data types need to be declared.

## Out of Scope

- Remote database / user accounts / cloud sync
- Push notifications
- App Store screenshots and marketing copy
- App Store review text and keywords
- TestFlight distribution setup
