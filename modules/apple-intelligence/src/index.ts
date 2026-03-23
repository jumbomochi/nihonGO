import { requireNativeModule, Platform } from 'expo-modules-core';

type AppleIntelligenceAvailability =
  | 'available'
  | 'device_not_eligible'
  | 'not_enabled'
  | 'model_not_ready'
  | 'unavailable'
  | 'not_supported'
  | 'unknown';

interface AppleIntelligenceModuleType {
  isAvailable(): Promise<boolean>;
  getAvailabilityStatus(): Promise<AppleIntelligenceAvailability>;
  createSession(systemPrompt: string): Promise<boolean>;
  sendMessage(message: string): Promise<string>;
  resetSession(): Promise<boolean>;
}

// Only load the native module on iOS, and gracefully handle Expo Go
// where native modules aren't available
let NativeModule: AppleIntelligenceModuleType | null = null;
if (Platform.OS === 'ios') {
  try {
    NativeModule = requireNativeModule<AppleIntelligenceModuleType>('AppleIntelligence');
  } catch {
    // Native module not available (e.g. running in Expo Go)
  }
}

export async function isAvailable(): Promise<boolean> {
  if (!NativeModule) return false;
  try {
    return await NativeModule.isAvailable();
  } catch {
    return false;
  }
}

export async function getAvailabilityStatus(): Promise<AppleIntelligenceAvailability> {
  if (!NativeModule) return 'not_supported';
  try {
    return await NativeModule.getAvailabilityStatus();
  } catch {
    return 'not_supported';
  }
}

export async function createSession(systemPrompt: string): Promise<boolean> {
  if (!NativeModule) return false;
  return NativeModule.createSession(systemPrompt);
}

export async function sendMessage(message: string): Promise<string> {
  if (!NativeModule) {
    throw new Error('Apple Intelligence is not available on this platform.');
  }
  return NativeModule.sendMessage(message);
}

export async function resetSession(): Promise<boolean> {
  if (!NativeModule) return false;
  return NativeModule.resetSession();
}

export function getStatusMessage(status: AppleIntelligenceAvailability): string {
  switch (status) {
    case 'available':
      return 'Apple Intelligence is ready';
    case 'device_not_eligible':
      return 'This device does not support Apple Intelligence';
    case 'not_enabled':
      return 'Enable Apple Intelligence in Settings > Apple Intelligence & Siri';
    case 'model_not_ready':
      return 'Apple Intelligence is downloading — please wait';
    case 'unavailable':
      return 'Apple Intelligence is currently unavailable';
    case 'not_supported':
      return 'Apple Intelligence requires iOS 26 or later';
    default:
      return 'Apple Intelligence status unknown';
  }
}
