import { useEffect, useRef } from 'react';
import * as Network from 'expo-network';
import type { EventSubscription } from 'expo-modules-core';
import { useSettingsStore } from '@/stores/settingsStore';

const DEBOUNCE_MS = 2000;

export function useNetworkStatus(): void {
  const setOnline = useSettingsStore((state) => state.setOnline);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let subscription: EventSubscription | null = null;

    const updateNetworkStatus = (isConnected: boolean) => {
      // Clear any pending debounce
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Debounce to prevent flicker on flaky connections
      debounceTimer.current = setTimeout(() => {
        setOnline(isConnected);
      }, DEBOUNCE_MS);
    };

    const initNetworkStatus = async () => {
      try {
        // Get initial network state
        const state = await Network.getNetworkStateAsync();
        const isConnected = state.isConnected ?? false;
        // Set immediately on init (no debounce)
        setOnline(isConnected);

        // Subscribe to network state changes
        subscription = Network.addNetworkStateListener((state) => {
          const isConnected = state.isConnected ?? false;
          updateNetworkStatus(isConnected);
        });
      } catch (error) {
        console.warn('Failed to initialize network status:', error);
        // Assume online if we can't determine status
        setOnline(true);
      }
    };

    initNetworkStatus();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [setOnline]);
}
