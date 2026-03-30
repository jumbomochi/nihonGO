import { Platform, NativeModules } from 'react-native';
import { Asset } from 'expo-asset';
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
 * Resolve an audio path to a URI that works on the current platform.
 *
 * Production native: resolves from the bundled asset manifest
 * Dev native:        resolves against the Metro dev server
 * Web:               resolves against window.location.origin
 */
export function resolveAudioUri(path: string): string {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${path}`;
    }
    return path;
  }

  // Native production: use bundled asset
  const moduleId = audioManifest[path];
  if (moduleId != null) {
    const asset = Asset.fromModule(moduleId);
    if (asset.localUri) return asset.localUri;
    if (asset.uri) return asset.uri;
  }

  // Native dev: resolve against Metro server
  if (_cachedBaseUrl === null) {
    _cachedBaseUrl = getDevServerBaseUrl() ?? '';
  }

  if (_cachedBaseUrl) {
    return `${_cachedBaseUrl}${path}`;
  }

  return path;
}
