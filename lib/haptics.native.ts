// Native haptics implementation using expo-haptics
import * as Haptics from 'expo-haptics';

export const triggerImpact = async (style: 'Light' | 'Medium' | 'Heavy' = 'Light'): Promise<void> => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[style]);
};

export const triggerSelection = async (): Promise<void> => {
  await Haptics.selectionAsync();
};

export const triggerNotification = async (type: 'Success' | 'Warning' | 'Error' = 'Success'): Promise<void> => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType[type]);
};
