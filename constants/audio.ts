/**
 * Audio playback speed options
 */
export const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5] as const;

export type PlaybackSpeed = (typeof PLAYBACK_SPEEDS)[number];

/**
 * Default playback speed
 */
export const DEFAULT_PLAYBACK_SPEED: PlaybackSpeed = 1.0;
