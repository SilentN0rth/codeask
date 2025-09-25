'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User } from '@supabase/supabase-js';
import { UserInterface } from '@/types/users.types';
import {
  signIn,
  signOut,
  signUp,
  signInWithProvider,
} from '@/services/server/auth';
import { supabase } from 'supabase/supabaseClient';
import { useUserOnlineStatus } from '@/hooks/useUserOnlineStatus';

type AuthContextType = {
  authUser: User | null;
  user: UserInterface | null;
  loading: boolean;
  error: string | null;
  signIn: typeof signIn;
  signUp: typeof signUp;
  signOut: () => Promise<void>;
  signInWithProvider: typeof signInWithProvider;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: UserInterface) => void;
};

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  user: null,
  loading: true,
  error: null,
  signIn,
  signUp,
  signOut: async () => {},
  signInWithProvider,
  refreshUser: async () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const fetchUser = async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (isFetchingUser) {
      return;
    }

    setIsFetchingUser(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        setError('Nie udało się pobrać profilu.');
        setUser(null);
      } else {
        setUser(data);
        setError(null);
      }
    } catch (err) {
      setError('Nieoczekiwany błąd podczas pobierania profilu.');
      setUser(null);
    } finally {
      setIsFetchingUser(false);
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!authUser) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        setError('Nie udało się odświeżyć profilu.');
      } else {
        setUser(data);
        setError(null);
      }
    } catch (err) {
      setError('Nieoczekiwany błąd podczas odświeżania profilu.');
    }
  };

  const updateUser = (updatedUser: UserInterface) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (!sessionData.session) {
        try {
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();
          if (refreshData.session) {
            setAuthUser(refreshData.session.user);
            fetchUser(refreshData.session.user);
            return;
          }
        } catch (refreshErr) {}
      }

      if (sessionData.session?.user) {
        setAuthUser(sessionData.session.user);
        fetchUser(sessionData.session.user);
        return;
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      const sessionUser = userData.user ?? null;
      setAuthUser(sessionUser);
      fetchUser(sessionUser);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const sessionUser = session?.user ?? null;
      setAuthUser(sessionUser);

      if (sessionUser?.id !== authUser?.id) {
        fetchUser(sessionUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useUserOnlineStatus(authUser?.id ?? null);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut: () => signOut({ setAuthUser, setUser, setError }),
        signInWithProvider,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
