'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from 'context/useAuthContext';
import { supabase } from 'supabase/supabaseClient';

export function useAuthRedirect() {
  const { user, loading, authUser } = useAuthContext();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: currentUser },
          error,
        } = await supabase.auth.getUser();

        if (!currentUser) {
          router.replace('/login');
          return;
        }
      } catch (err) {
        router.replace('/login');
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    if (!loading) {
      if (authUser) {
        setIsCheckingAuth(false);
      } else {
        checkAuth();
      }
    }
  }, [loading, authUser, router]);

  const isLoading = loading || isCheckingAuth;

  return { user, loading: isLoading, authUser };
}
