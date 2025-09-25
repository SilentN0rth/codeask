/* eslint-disable no-undef */
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from 'supabase/supabaseClient';

const OFFLINE_TIMEOUT = 5 * 60 * 1000; // 5 minut w ms
const HEARTBEAT_INTERVAL = 30 * 1000; // 30 sekund
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 sekunda

export function useUserOnlineStatus(userId: string | null) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);

  const retryWithBackoff = useCallback(
    async (
      operation: () => Promise<any>,
      operationName: string,
      maxAttempts: number = MAX_RETRY_ATTEMPTS
    ) => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await operation();
          if (result.error) {
            throw new Error(result.error.message || 'Database error');
          }
          retryCountRef.current = 0;
          return result;
        } catch (error) {
          console.warn(`${operationName} attempt ${attempt} failed:`, error);

          if (attempt === maxAttempts) {
            console.error(
              `Failed ${operationName} after ${maxAttempts} attempts:`,
              error
            );
            retryCountRef.current = attempt;
            return { error };
          }

          const delay = RETRY_DELAY * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    },
    []
  );

  const setOffline = useCallback(async () => {
    if (!userId) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < 5000) {
      return;
    }
    lastUpdateRef.current = now;

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ userId })], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/set-offline', blob);
    } else {
      await retryWithBackoff(
        async () =>
          await supabase
            .from('users')
            .update({ is_online: false })
            .eq('id', userId),
        'setOffline'
      );
    }
  }, [userId, retryWithBackoff]);

  const setOnline = useCallback(async () => {
    if (!userId) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < 5000) {
      return;
    }
    lastUpdateRef.current = now;

    await retryWithBackoff(
      async () =>
        await supabase
          .from('users')
          .update({
            is_online: true,
            last_sign_in_at: new Date().toISOString(),
          })
          .eq('id', userId),
      'setOnline'
    );
  }, [userId, retryWithBackoff]);

  const resetOfflineTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setOffline();
    }, OFFLINE_TIMEOUT);
  }, [setOffline]);

  useEffect(() => {
    if (!userId) return;

    setOnline();
    resetOfflineTimer();

    const heartbeatInterval =
      retryCountRef.current > 0 ? HEARTBEAT_INTERVAL * 2 : HEARTBEAT_INTERVAL;

    heartbeatRef.current = setInterval(() => {
      setOnline();
    }, heartbeatInterval);

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetOfflineTimer)
    );

    window.addEventListener('beforeunload', setOffline);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setOffline();
      } else if (document.visibilityState === 'visible') {
        setOnline();
        resetOfflineTimer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetOfflineTimer)
      );
      window.removeEventListener('beforeunload', setOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      setOffline();
    };
  }, [userId, setOnline, setOffline, resetOfflineTimer]);
}
