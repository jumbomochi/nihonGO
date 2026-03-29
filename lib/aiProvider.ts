// lib/aiProvider.ts
// Unified AI provider that supports Claude API, local Ollama, and Apple Intelligence

import { LearningStyle, ProficiencyLevel } from '@/stores/userStore';
import { sendOllamaMessage, DEFAULT_OLLAMA_URL, DEFAULT_OLLAMA_MODEL } from './ollama';
import {
  AuthError,
  RateLimitError,
  NetworkError,
  ApiError,
  ValidationError,
} from './errors';
import * as AppleIntelligence from '@/modules/apple-intelligence/src';

export type AIProvider = 'claude' | 'ollama' | 'apple';

export interface AIProviderConfig {
  provider: AIProvider;
  // Claude settings
  claudeApiKey?: string;
  // Ollama settings
  ollamaUrl?: string;
  ollamaModel?: string;
}

export interface UserContext {
  nativeLanguage: string;
  priorLanguages: string[];
  knowsChinese: boolean;
  proficiencyLevel: ProficiencyLevel;
  learningGoals: string[];
  learningStyle: LearningStyle;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

function buildSystemPrompt(userContext: UserContext): string {
  const level = userContext.proficiencyLevel.replace('_', ' ');
  const style = userContext.learningStyle === 'detailed' ? 'detailed explanations' : 'concise, practical';
  const kanjiNote = userContext.knowsChinese ? ' Learner knows Chinese characters.' : '';

  return `You are nihonGO, a Japanese tutor. Learner level: ${level}. Style: ${style}.${kanjiNote} Use Japanese with romaji in parentheses. Keep responses focused and concise.`;
}

/**
 * Send message using Claude API
 */
async function sendClaudeMessage(
  messages: Message[],
  systemPrompt: string,
  apiKey: string,
  signal?: AbortSignal
): Promise<string> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new ValidationError('API key is required', 'Please enter your API key in Settings.');
  }

  let response: Response;

  try {
    response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new NetworkError('Failed to connect to API');
    }
    throw error;
  }

  if (!response.ok) {
    let errorDetails = '';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorJson = await response.json();
        errorDetails = errorJson.error?.message || errorJson.message || '';
      } else {
        errorDetails = await response.text();
      }
    } catch {
      errorDetails = 'Unknown error';
    }

    switch (response.status) {
      case 401:
        throw new AuthError('Invalid API key');
      case 429:
        throw new RateLimitError('Too many requests');
      case 400:
        throw new ApiError(`Bad request: ${errorDetails}`, 400);
      case 500:
      case 502:
      case 503:
        throw new ApiError('Claude API is temporarily unavailable', response.status);
      default:
        throw new ApiError(`API error: ${errorDetails}`, response.status);
    }
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Invalid response from API', 500);
  }

  if (!data.content?.[0]?.text) {
    throw new ApiError('Unexpected response format from API', 500);
  }

  return data.content[0].text;
}

/**
 * Send message using Apple Intelligence (on-device)
 */
async function sendAppleIntelligenceMessage(
  messages: Message[],
  systemPrompt: string,
): Promise<string> {
  const isAvailable = await AppleIntelligence.isAvailable();
  if (!isAvailable) {
    const status = await AppleIntelligence.getAvailabilityStatus();
    throw new ApiError(AppleIntelligence.getStatusMessage(status), 0);
  }

  await AppleIntelligence.createSession(systemPrompt);

  // Send only the last user message to avoid exceeding the small context window.
  // For multi-turn conversations, include brief context from recent messages.
  const lastMessage = messages[messages.length - 1];

  if (messages.length > 1) {
    // Include last 2 exchanges as brief context (max 4 messages)
    const recentHistory = messages.slice(-5, -1);
    const context = recentHistory
      .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content.slice(0, 150)}`)
      .join('\n');
    return AppleIntelligence.sendMessage(`Recent conversation:\n${context}\n\nStudent: ${lastMessage.content}`);
  }

  return AppleIntelligence.sendMessage(lastMessage.content);
}

/**
 * Unified send message function that routes to the appropriate provider
 */
export async function sendMessage(
  messages: Message[],
  userContext: UserContext,
  config: AIProviderConfig,
  signal?: AbortSignal
): Promise<string> {
  if (messages.length === 0) {
    throw new ValidationError('At least one message is required');
  }

  const systemPrompt = buildSystemPrompt(userContext);

  if (config.provider === 'apple') {
    return sendAppleIntelligenceMessage(messages, systemPrompt);
  }

  if (config.provider === 'ollama') {
    return sendOllamaMessage(messages, systemPrompt, {
      model: config.ollamaModel || DEFAULT_OLLAMA_MODEL,
      baseUrl: config.ollamaUrl || DEFAULT_OLLAMA_URL,
      signal,
    });
  }

  // Default to Claude
  if (!config.claudeApiKey) {
    throw new ValidationError('API key is required', 'Please enter your API key in Settings.');
  }

  return sendClaudeMessage(messages, systemPrompt, config.claudeApiKey, signal);
}

/**
 * Create a lesson prompt for AI-generated lessons
 */
export function createLessonPrompt(topic: string, userContext: UserContext): string {
  const levelContext = {
    complete_beginner: 'This is their very first exposure to Japanese.',
    beginner: 'They know hiragana/katakana and basic greetings.',
    elementary: 'They can form simple sentences and know common vocabulary.',
    intermediate: 'They can hold basic conversations and read simple texts.',
  };

  return `Teach me: ${topic}. ${levelContext[userContext.proficiencyLevel]} Include key vocabulary with romaji, examples, and a short exercise.`;
}

/**
 * Get provider display name
 */
export function getProviderName(provider: AIProvider): string {
  switch (provider) {
    case 'claude':
      return 'Claude (Cloud)';
    case 'ollama':
      return 'Ollama (Local)';
    case 'apple':
      return 'Apple Intelligence';
    default:
      return 'Unknown';
  }
}
