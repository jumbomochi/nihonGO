import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { AIProvider } from '@/lib/aiProvider';
import { DEFAULT_OLLAMA_URL, DEFAULT_OLLAMA_MODEL } from '@/lib/ollama';

const API_KEY_STORAGE_KEY = 'nihongo-claude-api-key';
const AI_PROVIDER_STORAGE_KEY = 'nihongo-ai-provider';
const OLLAMA_URL_STORAGE_KEY = 'nihongo-ollama-url';
const OLLAMA_MODEL_STORAGE_KEY = 'nihongo-ollama-model';

// Get API key from environment variable (Expo requires EXPO_PUBLIC_ prefix)
const ENV_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || null;

interface SettingsState {
  // Claude settings
  apiKey: string | null;
  isEnvKey: boolean; // Track if key is from environment

  // AI Provider settings
  aiProvider: AIProvider;
  ollamaUrl: string;
  ollamaModel: string;

  // Status
  isLoading: boolean;
  isOnline: boolean;

  // Claude actions
  setApiKey: (key: string) => Promise<void>;
  clearApiKey: () => Promise<void>;
  loadApiKey: () => Promise<void>;

  // AI Provider actions
  setAIProvider: (provider: AIProvider) => Promise<void>;
  setOllamaUrl: (url: string) => Promise<void>;
  setOllamaModel: (model: string) => Promise<void>;
  loadAISettings: () => Promise<void>;

  // Status actions
  setOnline: (status: boolean) => void;
}

// Check if we're in a browser environment with localStorage available
function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
}

async function saveSecurely(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecurely(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

async function deleteSecurely(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Claude settings
  apiKey: null,
  isEnvKey: false,

  // AI Provider settings
  aiProvider: 'claude' as AIProvider,
  ollamaUrl: DEFAULT_OLLAMA_URL,
  ollamaModel: DEFAULT_OLLAMA_MODEL,

  // Status
  isLoading: true,
  isOnline: true, // Assume online initially

  // Claude actions
  setApiKey: async (key: string) => {
    await saveSecurely(API_KEY_STORAGE_KEY, key);
    set({ apiKey: key, isEnvKey: false });
  },

  clearApiKey: async () => {
    await deleteSecurely(API_KEY_STORAGE_KEY);
    // If env key exists, fall back to it; otherwise set to null
    if (ENV_API_KEY) {
      set({ apiKey: ENV_API_KEY, isEnvKey: true });
    } else {
      set({ apiKey: null, isEnvKey: false });
    }
  },

  loadApiKey: async () => {
    set({ isLoading: true });
    try {
      // First check for environment variable
      if (ENV_API_KEY) {
        set({ apiKey: ENV_API_KEY, isEnvKey: true, isLoading: false });
        return;
      }
      // Fall back to secure storage
      const key = await getSecurely(API_KEY_STORAGE_KEY);
      set({ apiKey: key, isEnvKey: false, isLoading: false });
    } catch (error) {
      // Ensure loading state is cleared even on error
      console.warn('Failed to load API key:', error);
      set({ apiKey: null, isEnvKey: false, isLoading: false });
    }
  },

  // AI Provider actions
  setAIProvider: async (provider: AIProvider) => {
    await saveSecurely(AI_PROVIDER_STORAGE_KEY, provider);
    set({ aiProvider: provider });
  },

  setOllamaUrl: async (url: string) => {
    await saveSecurely(OLLAMA_URL_STORAGE_KEY, url);
    set({ ollamaUrl: url });
  },

  setOllamaModel: async (model: string) => {
    await saveSecurely(OLLAMA_MODEL_STORAGE_KEY, model);
    set({ ollamaModel: model });
  },

  loadAISettings: async () => {
    try {
      const [provider, url, model] = await Promise.all([
        getSecurely(AI_PROVIDER_STORAGE_KEY),
        getSecurely(OLLAMA_URL_STORAGE_KEY),
        getSecurely(OLLAMA_MODEL_STORAGE_KEY),
      ]);

      set({
        aiProvider: (provider as AIProvider) || 'claude',
        ollamaUrl: url || DEFAULT_OLLAMA_URL,
        ollamaModel: model || DEFAULT_OLLAMA_MODEL,
      });
    } catch (error) {
      console.warn('Failed to load AI settings:', error);
    }
  },

  // Status actions
  setOnline: (status: boolean) => {
    set({ isOnline: status });
  },
}));
