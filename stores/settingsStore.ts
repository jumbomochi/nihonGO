import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_KEY_STORAGE_KEY = 'nihongo-claude-api-key';

// Get API key from environment variable (Expo requires EXPO_PUBLIC_ prefix)
const ENV_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY || null;

interface SettingsState {
  apiKey: string | null;
  isLoading: boolean;
  isEnvKey: boolean; // Track if key is from environment
  setApiKey: (key: string) => Promise<void>;
  clearApiKey: () => Promise<void>;
  loadApiKey: () => Promise<void>;
}

async function saveSecurely(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getSecurely(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

async function deleteSecurely(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: null,
  isLoading: true,
  isEnvKey: false,

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
    // First check for environment variable
    if (ENV_API_KEY) {
      set({ apiKey: ENV_API_KEY, isEnvKey: true, isLoading: false });
      return;
    }
    // Fall back to secure storage
    const key = await getSecurely(API_KEY_STORAGE_KEY);
    set({ apiKey: key, isEnvKey: false, isLoading: false });
  },
}));
