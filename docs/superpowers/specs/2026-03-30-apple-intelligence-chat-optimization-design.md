# Apple Intelligence Chat Optimization

**Date:** 2026-03-30
**Scope:** Prompt optimization + session continuity for Apple Intelligence chat

## Problem

The current implementation recreates the Apple Intelligence `LanguageModelSession` on every message, destroying the native multi-turn context. It then manually slices and re-injects truncated conversation history into each prompt. The system prompt also over-instructs the on-device model with capabilities it already has (Japanese language handling, conciseness).

## Design

### 1. Prompt Optimization

**Before:**
```
You are nihonGO, a Japanese tutor. Learner level: complete beginner. Style: detailed explanations. Learner knows Chinese characters. Use Japanese with romaji in parentheses. Keep responses focused and concise.
```

**After:**
```
You are nihonGO, a friendly Japanese tutor. Speak naturally. Learner level: complete beginner. Style: detailed explanations.
```

Removed:
- "Use Japanese with romaji in parentheses" — Apple Intelligence handles Japanese natively
- "Learner knows Chinese characters" — learner context, not persona
- "Keep responses focused and concise" — on-device model is already concise by nature

Kept:
- Persona identity ("nihonGO, a friendly Japanese tutor")
- "Speak naturally" — encourages natural tutoring tone
- Proficiency level — defines complexity of responses
- Learning style — defines response format (detailed vs. conversational)

### 2. Session Lifecycle

**Before:**
```
Every message:
  1. createSession(systemPrompt)     // destroys previous session
  2. slice last 5 messages           // manual context management
  3. pack into "Recent conversation:\n..." string
  4. sendMessage(packedString)
```

**After:**
```
First message (or after clear):
  1. createSession(systemPrompt)     // one-time setup

Every message:
  1. sendMessage(userMessage)        // just the new message

Clear chat:
  1. resetSession()                  // clean slate
```

The native `LanguageModelSession` accumulates conversation turns automatically. The Swift module already handles `exceededContextWindowSize` by resetting the session and retrying with just the current message (AppleIntelligenceModule.swift:94-97).

### 3. Session State Tracking

A module-level boolean (`hasActiveSession`) in `aiProvider.ts` tracks whether a session exists. This avoids passing session state through React component trees.

- Set to `true` after `createSession` succeeds
- Set to `false` after `resetSession` or on error
- Checked before each `sendMessage` — creates session if needed

## Files Changed

### `lib/aiProvider.ts`
- Simplify `buildSystemPrompt`: persona + level + style only
- Add module-level `hasActiveSession` boolean
- Rewrite `sendAppleIntelligenceMessage`: remove context slicing, send only latest user message, create session lazily on first call
- Add `resetAppleSession` export for use by `clearChat`

### `hooks/useChat.ts`
- Import and call `resetAppleSession` in `clearChat`

### No changes needed
- `modules/apple-intelligence/` (Swift + TS) — already supports the correct lifecycle
- Claude and Ollama code paths — unchanged
- Chat UI components — unchanged
- Error handling — unchanged
