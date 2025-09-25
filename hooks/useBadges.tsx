'use client';

import { useState, useEffect } from 'react';
import { UserInterface } from '@/types/users.types';
import { supabase } from 'supabase/supabaseClient';
import {
  BadgeAwardResult,
  checkAndAwardBadges,
} from '@/services/server/badges';

interface UseBadgesReturn {
  badges: UserInterface['badges'];
  isLoading: boolean;
  error: string | null;
  checkBadges: (
    action:
      | 'question_created'
      | 'answer_created'
      | 'answer_liked'
      | 'daily_active'
  ) => Promise<BadgeAwardResult[]>;
  refreshBadges: () => Promise<void>;
}

export function useBadges(userId: string | null): UseBadgesReturn {
  const [badges, setBadges] = useState<UserInterface['badges']>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBadges = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('badges')
        .eq('id', userId)
        .single();

      if (fetchError) {
        setError('Nie udało się pobrać odznak');
        return;
      }

      setBadges(data.badges);
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania odznak');
    } finally {
      setIsLoading(false);
    }
  };

  const checkBadges = async (
    action:
      | 'question_created'
      | 'answer_created'
      | 'answer_liked'
      | 'daily_active'
      | 'user_followed'
      | 'reputation_changed'
  ): Promise<BadgeAwardResult[]> => {
    if (!userId) return [];

    try {
      const results = await checkAndAwardBadges(userId, action);

      await refreshBadges();

      return results;
    } catch (err) {
      console.error('Błąd sprawdzania odznak:', err);
      return [];
    }
  };

  useEffect(() => {
    if (userId) {
      refreshBadges();
    }
  }, [userId]);

  return {
    badges,
    isLoading,
    error,
    checkBadges,
    refreshBadges,
  };
}
