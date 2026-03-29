import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Resolve a public/ audio path to a full URI for the current platform.
 *
 * Web:    prepends window.location.origin
 * Native: prepends the Metro dev server URL so expo-av can fetch the file
 *
 * All audio files must live under public/ so Metro can serve them.
 */
export function resolveAudioUri(path: string): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  }

  // Native: resolve against the Metro dev server
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri}${path}`;
  }

  return path;
}
