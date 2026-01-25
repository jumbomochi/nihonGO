// lib/ollama.ts
// Ollama client for local LLM inference

import { NetworkError, ApiError } from './errors';

// Default Ollama settings
export const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'qwen2.5:3b';

// Available models optimized for Japanese
export const RECOMMENDED_MODELS = [
  { id: 'qwen2.5:3b', name: 'Qwen 2.5 3B', size: '~2GB', japanese: 'Excellent' },
  { id: 'qwen2.5:7b', name: 'Qwen 2.5 7B', size: '~4.5GB', japanese: 'Excellent' },
  { id: 'qwen2.5:1.5b', name: 'Qwen 2.5 1.5B', size: '~1GB', japanese: 'Good' },
  { id: 'gemma2:2b', name: 'Gemma 2 2B', size: '~1.5GB', japanese: 'Good' },
  { id: 'llama3.2:3b', name: 'Llama 3.2 3B', size: '~2GB', japanese: 'Moderate' },
] as const;

interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
  options?: {
    temperature?: number;
    num_predict?: number;
  };
}

interface OllamaChatResponse {
  model: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
}

interface OllamaTagsResponse {
  models: Array<{
    name: string;
    size: number;
    modified_at: string;
  }>;
}

/**
 * Check if Ollama is running and accessible
 */
export async function checkOllamaStatus(
  baseUrl: string = DEFAULT_OLLAMA_URL
): Promise<{ running: boolean; models: string[] }> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
    });

    if (!response.ok) {
      return { running: false, models: [] };
    }

    const data: OllamaTagsResponse = await response.json();
    const models = data.models?.map((m) => m.name) || [];

    return { running: true, models };
  } catch {
    return { running: false, models: [] };
  }
}

/**
 * Pull a model from Ollama registry
 */
export async function pullModel(
  modelName: string,
  baseUrl: string = DEFAULT_OLLAMA_URL,
  onProgress?: (status: string) => void
): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, stream: false }),
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model: ${response.statusText}`);
    }

    onProgress?.('Model pulled successfully');
    return true;
  } catch (error) {
    onProgress?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

/**
 * Send a chat message to Ollama
 */
export async function sendOllamaMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
  options: {
    model?: string;
    baseUrl?: string;
    signal?: AbortSignal;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    model = DEFAULT_OLLAMA_MODEL,
    baseUrl = DEFAULT_OLLAMA_URL,
    signal,
    temperature = 0.7,
    maxTokens = 2048,
  } = options;

  // Build messages array with system prompt
  const ollamaMessages: OllamaMessage[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const requestBody: OllamaChatRequest = {
    model,
    messages: ollamaMessages,
    stream: false,
    options: {
      temperature,
      num_predict: maxTokens,
    },
  };

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new NetworkError(
      'Failed to connect to Ollama. Make sure Ollama is running locally.'
    );
  }

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errorData = await response.json();
      errorDetails = errorData.error || response.statusText;
    } catch {
      errorDetails = response.statusText;
    }

    if (response.status === 404) {
      throw new ApiError(
        `Model "${model}" not found. Run: ollama pull ${model}`,
        404
      );
    }

    throw new ApiError(`Ollama error: ${errorDetails}`, response.status);
  }

  let data: OllamaChatResponse;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Invalid response from Ollama', 500);
  }

  if (!data.message?.content) {
    throw new ApiError('Empty response from Ollama', 500);
  }

  return data.message.content;
}

/**
 * Simple translation using Ollama
 * Optimized prompt for translation tasks
 */
export async function translateWithOllama(
  text: string,
  fromLang: string,
  toLang: string,
  options: {
    model?: string;
    baseUrl?: string;
    signal?: AbortSignal;
  } = {}
): Promise<string> {
  const systemPrompt = `You are a precise translator. Translate the given text from ${fromLang} to ${toLang}.
Only output the translation, nothing else. Preserve formatting and tone.`;

  const response = await sendOllamaMessage(
    [{ role: 'user', content: text }],
    systemPrompt,
    {
      ...options,
      temperature: 0.3, // Lower temperature for more consistent translations
    }
  );

  return response.trim();
}
