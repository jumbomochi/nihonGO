// No-op haptics for web platform
// expo-haptics is not supported on web and causes bundler errors

export const triggerImpact = async (_style?: 'Light' | 'Medium' | 'Heavy'): Promise<void> => {
  // No-op on web
};

export const triggerSelection = async (): Promise<void> => {
  // No-op on web
};

export const triggerNotification = async (_type?: 'Success' | 'Warning' | 'Error'): Promise<void> => {
  // No-op on web
};
