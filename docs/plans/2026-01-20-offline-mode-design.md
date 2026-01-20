# Offline Mode Detection and Graceful Fallback

**GitHub Issue:** #5
**Date:** 2026-01-20
**Status:** Approved

## Overview

Add network status detection to nihonGO with graceful degradation when offline. AI-dependent features (Chat, AI lessons) will be disabled while offline; static Genki lessons remain fully functional.

## Architecture

### Network Detection

Use `expo-network` (Expo's built-in API) for connectivity monitoring:
- `getNetworkStateAsync()` for initial state
- `addNetworkStateListener()` for real-time updates

### State Management

Extend `settingsStore.ts` with network state:

```typescript
// additions to settingsStore
isOnline: boolean
setOnline: (status: boolean) => void
```

### New Files

| File | Purpose |
|------|---------|
| `hooks/useNetworkStatus.ts` | Hook to monitor network and update store |
| `components/common/OfflineBanner.tsx` | Persistent banner shown when offline |

### Modified Files

| File | Changes |
|------|---------|
| `stores/settingsStore.ts` | Add `isOnline` state |
| `app/_layout.tsx` | Initialize network listener, render OfflineBanner |
| `app/(tabs)/chat.tsx` | Disable input when offline |
| `app/(tabs)/index.tsx` | Badge AI lesson cards when offline |
| `app/lesson/[topic].tsx` | Block AI lessons when offline, offer Genki redirect |

## Data Flow

```
expo-network listener
       |
       v
useNetworkStatus hook (in _layout.tsx)
       |
       v
settingsStore.setOnline()
       |
       v
Components read settingsStore.isOnline
       |
       v
UI updates reactively
```

## Component Specifications

### useNetworkStatus Hook

```typescript
// hooks/useNetworkStatus.ts
export function useNetworkStatus(): void {
  // - On mount: check getNetworkStateAsync()
  // - Subscribe to addNetworkStateListener()
  // - Update settingsStore.setOnline()
  // - Cleanup listener on unmount
  // - 2-second debounce to prevent flicker
}
```

### OfflineBanner Component

```typescript
// components/common/OfflineBanner.tsx
// Props: { visible: boolean }
// - Renders at top of screen when visible
// - Amber/yellow warning color
// - Icon + "You're offline - some features unavailable"
// - Animated fade in/out
// - Returns null when not visible
```

## Screen Behaviors

### Chat Screen (offline)

- Input field disabled
- Placeholder: "Chat requires internet connection"
- Send button grayed out
- Existing messages remain visible (read-only)

### AI Lesson Screen (offline)

- Don't attempt API call
- Show message: "This lesson requires internet"
- Button: "Browse Genki Lessons Instead" (navigates to Learn tab)

### Genki Lesson Screen (offline)

- No changes, works normally with static data

### Learn Tab (offline)

- AI lesson cards show subtle "Offline" badge
- Genki lesson cards unchanged

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| App launches offline | Banner shows immediately, AI features disabled |
| Connection drops mid-chat | Banner appears, input disables, partial message preserved |
| Connection restored | Banner auto-hides, features re-enable |
| Flaky connection | 2-second debounce prevents banner flickering |

## Out of Scope

- Response caching for AI content
- Offline message queue
- Connection quality indicators
- Manual retry button

## Dependencies

```bash
npx expo install expo-network
```

## Implementation Order

1. Install `expo-network`
2. Add `isOnline` to `settingsStore`
3. Create `useNetworkStatus` hook
4. Create `OfflineBanner` component
5. Integrate hook + banner in `_layout.tsx`
6. Update `chat.tsx` with offline handling
7. Update `lesson/[topic].tsx` with offline handling
8. Update `index.tsx` with offline badges
