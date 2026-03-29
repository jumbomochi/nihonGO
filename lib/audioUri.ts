import { Platform, NativeModules } from 'react-native';

/**
 * Get the Metro dev server base URL by extracting it from the JS bundle source URL.
 * This is reliable because the app already loaded its bundle from this server.
 */
function getDevServerBaseUrl(): string | null {
  const scriptURL: string | undefined =
    NativeModules.SourceCode?.getConstants?.()?.scriptURL ??
    NativeModules.SourceCode?.scriptURL;

  if (!scriptURL) return null;

  // scriptURL looks like: http://192.168.1.100:8082/index.bundle?platform=ios&...
  const match = scriptURL.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : null;
}

let _cachedBaseUrl: string | null = null;

/**
 * Resolve a public/ audio path to a full URI for the current platform.
 *
 * Web:    prepends window.location.origin
 * Native: prepends the Metro dev server URL so expo-av can fetch the file
 */
export function resolveAudioUri(path: string): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  }

  // Native: resolve against the Metro dev server
  if (_cachedBaseUrl === null) {
    _cachedBaseUrl = getDevServerBaseUrl() ?? '';
  }

  if (_cachedBaseUrl) {
    return `${_cachedBaseUrl}${path}`;
  }

  return path;
}
