import { Platform, NativeModules } from 'react-native';
import { AVPlaybackSource } from 'expo-av';
import audioManifest from '@/data/audioManifest.generated';

/**
 * Get the Metro dev server base URL by extracting it from the JS bundle source URL.
 */
function getDevServerBaseUrl(): string | null {
  const scriptURL: string | undefined =
    NativeModules.SourceCode?.getConstants?.()?.scriptURL ??
    NativeModules.SourceCode?.scriptURL;

  if (!scriptURL) return null;

  const match = scriptURL.match(/^(https?:\/\/[^/]+)/);
  return match ? match[1] : null;
}

let _cachedBaseUrl: string | null = null;

/**
 * Resolve an audio path to a URI string. Used for web HTML5 Audio
 * and as a fallback when no bundled asset exists.
 */
export function resolveAudioUri(path: string): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  }

  if (_cachedBaseUrl === null) {
    _cachedBaseUrl = getDevServerBaseUrl() ?? '';
  }

  if (_cachedBaseUrl) {
    return `${_cachedBaseUrl}${path}`;
  }

  return path;
}

/**
 * Resolve an audio path to a source that expo-av can play.
 *
 * Returns the require() module ID if the asset is bundled (works offline),
 * otherwise returns { uri } for dev server / web playback.
 */
export function resolveAudioSource(path: string): AVPlaybackSource {
  if (Platform.OS !== 'web') {
    const moduleId = audioManifest[path];
    if (moduleId != null) return moduleId;
  }

  return { uri: resolveAudioUri(path) };
}
