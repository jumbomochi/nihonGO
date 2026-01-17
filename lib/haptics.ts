// Base haptics module - re-exports native implementation
// Platform-specific files (haptics.web.ts, haptics.native.ts) will be
// used by the bundler based on the target platform
export { triggerImpact, triggerSelection, triggerNotification } from './haptics.native';
