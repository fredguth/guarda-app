import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { PendingLink } from '../services/shareService';

const PENDING_KEY = 'pending_deep_link';

export function usePendingDeepLink() {
  const pendingRef = useRef<PendingLink | null>(null);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem(PENDING_KEY)
      .then(saved => {
        if (!saved) return;
        try { pendingRef.current = JSON.parse(saved); }
        catch { AsyncStorage.removeItem(PENDING_KEY); }
      })
      .catch(() => {});
  }, []));

  return pendingRef;
}
