# Apple Intelligence Chat Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the Apple Intelligence chat path by simplifying the system prompt and leveraging the native `LanguageModelSession`'s built-in multi-turn context instead of manually managing conversation history.

**Architecture:** Two changes in `lib/aiProvider.ts` — a slimmed-down system prompt for Apple Intelligence (keeping the full prompt for Claude/Ollama), and a rewritten `sendAppleIntelligenceMessage` that lazily creates one persistent session instead of recreating it per message. One small change in `hooks/useChat.ts` to reset the session on chat clear.

**Tech Stack:** TypeScript, React Native, Expo Modules (Apple Intelligence native module)

---

### Task 1: Simplify system prompt for Apple Intelligence

**Files:**
- Modify: `lib/aiProvider.ts:42-48`

The current `buildSystemPrompt` is shared across all providers. Apple Intelligence doesn't need the instructional parts (romaji, conciseness) that Claude benefits from. Add a provider parameter so each path gets the right prompt.

- [ ] **Step 1: Add provider parameter to `buildSystemPrompt` and create Apple-specific prompt**

In `lib/aiProvider.ts`, replace the existing `buildSystemPrompt` function:

```typescript
function buildSystemPrompt(userContext: UserContext, provider: AIProvider): string {
  const level = userContext.proficiencyLevel.replace('_', ' ');
  const style = userContext.learningStyle === 'detailed' ? 'detailed explanations' : 'concise, practical';

  if (provider === 'apple') {
    return `You are nihonGO, a friendly Japanese tutor. Speak naturally. Learner level: ${level}. Style: ${style}.`;
  }

  const kanjiNote = userContext.knowsChinese ? ' Learner knows Chinese characters.' : '';
  return `You are nihonGO, a Japanese tutor. Learner level: ${level}. Style: ${style}.${kanjiNote} Use Japanese with romaji in parentheses. Keep responses focused and concise.`;
}
```

- [ ] **Step 2: Update all `buildSystemPrompt` call sites to pass provider**

In `lib/aiProvider.ts`, in the `sendMessage` function, change:

```typescript
const systemPrompt = buildSystemPrompt(userContext);
```

to:

```typescript
const systemPrompt = buildSystemPrompt(userContext, config.provider);
```

This is the only call site — `buildSystemPrompt` is not exported.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project /Users/huiliang/GitHub/nihonGO/tsconfig.json`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add lib/aiProvider.ts
git commit -m "refactor: simplify Apple Intelligence system prompt to persona-only"
```

---

### Task 2: Rewrite Apple Intelligence session lifecycle

**Files:**
- Modify: `lib/aiProvider.ts:141-167`

Stop recreating the session on every message. Add module-level session tracking, lazy session creation, and an exported `resetAppleSession` function.

- [ ] **Step 1: Add session state tracking and reset function**

In `lib/aiProvider.ts`, after the `const CLAUDE_API_URL` line (line 40), add:

```typescript
// Track whether an Apple Intelligence session is active.
// The native LanguageModelSession accumulates conversation turns,
// so we only create a session once and reuse it across messages.
let hasActiveAppleSession = false;

/**
 * Reset the Apple Intelligence session. Call when clearing chat.
 */
export async function resetAppleSession(): Promise<void> {
  hasActiveAppleSession = false;
  await AppleIntelligence.resetSession();
}
```

- [ ] **Step 2: Rewrite `sendAppleIntelligenceMessage` to use persistent session**

Replace the entire `sendAppleIntelligenceMessage` function:

```typescript
/**
 * Send message using Apple Intelligence (on-device).
 * Creates a session lazily on first call; subsequent messages reuse it.
 * The native LanguageModelSession handles multi-turn context automatically.
 */
async function sendAppleIntelligenceMessage(
  message: string,
  systemPrompt: string,
): Promise<string> {
  const isAvailable = await AppleIntelligence.isAvailable();
  if (!isAvailable) {
    const status = await AppleIntelligence.getAvailabilityStatus();
    throw new ApiError(AppleIntelligence.getStatusMessage(status), 0);
  }

  if (!hasActiveAppleSession) {
    await AppleIntelligence.createSession(systemPrompt);
    hasActiveAppleSession = true;
  }

  return AppleIntelligence.sendMessage(message);
}
```

- [ ] **Step 3: Update the call site in `sendMessage` to pass only the latest message**

In the `sendMessage` function, change the Apple provider branch from:

```typescript
  if (config.provider === 'apple') {
    return sendAppleIntelligenceMessage(messages, systemPrompt);
  }
```

to:

```typescript
  if (config.provider === 'apple') {
    const lastMessage = messages[messages.length - 1];
    return sendAppleIntelligenceMessage(lastMessage.content, systemPrompt);
  }
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project /Users/huiliang/GitHub/nihonGO/tsconfig.json`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add lib/aiProvider.ts
git commit -m "feat: persistent Apple Intelligence session with lazy creation"
```

---

### Task 3: Reset session on chat clear

**Files:**
- Modify: `hooks/useChat.ts:1-2, 90-98`

Wire up `clearChat` to reset the Apple Intelligence session so a fresh conversation starts clean.

- [ ] **Step 1: Import `resetAppleSession` and call it in `clearChat`**

In `hooks/useChat.ts`, change the import:

```typescript
import { sendMessage, AIProviderConfig } from '@/lib/aiProvider';
```

to:

```typescript
import { sendMessage, AIProviderConfig, resetAppleSession } from '@/lib/aiProvider';
```

Then update `clearChat`:

```typescript
  const clearChat = useCallback(() => {
    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    messagesRef.current = [];
    setMessages([]);
    setError(null);
    resetAppleSession();
  }, []);
```

Note: `resetAppleSession` returns a Promise but we fire-and-forget here — the UI state clears immediately and the native session resets in the background.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project /Users/huiliang/GitHub/nihonGO/tsconfig.json`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add hooks/useChat.ts
git commit -m "feat: reset Apple Intelligence session on chat clear"
```
