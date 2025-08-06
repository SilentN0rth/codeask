// "use client";

// import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
// import { User } from "@supabase/supabase-js";
// import { UserInterface } from "@/types/users.types";
// import { signIn, signOut as supabaseSignOut, signUp, signInWithProvider } from "@/services/server/auth";
// import { supabase } from "supabase/supabaseClient";

// type AuthContextType = {
//     authUser: User | null;
//     user: UserInterface | null;
//     loading: boolean;
//     error: string | null;
//     signIn: typeof signIn;
//     signUp: typeof signUp;
//     signOut: () => Promise<void>;
//     signInWithProvider: typeof signInWithProvider;
//     refreshUser: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType>({
//     authUser: null,
//     user: null,
//     loading: true,
//     error: null,
//     signIn,
//     signUp,
//     signOut: async () => {},
//     signInWithProvider,
//     refreshUser: async () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//     const [authUser, setAuthUser] = useState<User | null>(null);
//     const [user, setUser] = useState<UserInterface | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // eslint-disable-next-line no-undef
//     const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const lastActivityTimeRef = useRef<number>(0);

//     const fetchUser = async (authUser: User | null) => {
//         if (!authUser) {
//             setUser(null);
//             setLoading(false);
//             return;
//         }

//         const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single();

//         if (error) {
//             setError("Nie udało się pobrać profilu.");
//             setUser(null);
//         } else {
//             setUser(data);
//         }
//         setLoading(false);
//     };

//     const refreshUser = async () => {
//         if (!authUser) return;

//         const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single();

//         if (error) {
//             setError("Nie udało się odświeżyć profilu.");
//         } else {
//             setUser(data);
//         }
//     };

//     const setOnline = async () => {
//         if (!authUser) return;
//         try {
//             await supabase.from("users").update({ is_online: true }).eq("id", authUser.id);
//         } catch (error) {
//             console.error("Błąd podczas ustawiania online", error);
//         }
//     };

//     const setOffline = async () => {
//         if (!authUser) return;
//         try {
//             await supabase.from("users").update({ is_online: false }).eq("id", authUser.id);
//         } catch (error) {
//             console.error("Błąd podczas ustawiania offline", error);
//         }
//     };

//     const handleActivity = () => {
//         const now = Date.now();
//         if (now - lastActivityTimeRef.current > 5000) {
//             setOnline();
//             resetInactivityTimer();
//             lastActivityTimeRef.current = now;
//         }
//     };

//     const setupActivityListeners = () => {
//         const activityEvents = ["mousemove", "keydown", "scroll", "touchstart"];
//         activityEvents.forEach((event) => window.addEventListener(event, handleActivity));
//         return () => activityEvents.forEach((event) => window.removeEventListener(event, handleActivity));
//     };

//     const resetInactivityTimer = () => {
//         if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
//         inactivityTimeoutRef.current = setTimeout(
//             () => {
//                 setOffline().catch(console.error);
//                 refreshUser();
//             },
//             5 * 60 * 1000
//         );
//     };

//     // Poprawiona funkcja signOut, która najpierw ustawia offline, potem wylogowuje
//     const signOut = async () => {
//         try {
//             if (authUser) {
//                 await setOffline();
//             }
//             await supabaseSignOut();
//             setUser(null);
//             setAuthUser(null);
//         } catch (error) {
//             console.error("Błąd podczas wylogowania", error);
//         }
//     };

//     useEffect(() => {
//         supabase.auth.getSession().then(({ data }) => {
//             const sessionUser = data.session?.user ?? null;
//             setAuthUser(sessionUser);
//             fetchUser(sessionUser);
//         });

//         const {
//             data: { subscription },
//         } = supabase.auth.onAuthStateChange(async (_event, session) => {
//             const sessionUser = session?.user ?? null;
//             setAuthUser(sessionUser);

//             if (sessionUser) {
//                 await supabase
//                     .from("users")
//                     .update({
//                         last_sign_in_at: new Date().toISOString(),
//                         is_online: true,
//                     })
//                     .eq("id", sessionUser.id);
//             }

//             fetchUser(sessionUser);
//         });

//         return () => {
//             subscription.unsubscribe();
//         };
//     }, []);

//     // Aktywność użytkownika i automatyczne oznaczanie online/offline
//     useEffect(() => {
//         if (!authUser) return;

//         setOnline();
//         resetInactivityTimer();
//         const cleanup = setupActivityListeners();

//         return () => {
//             cleanup();
//             if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
//         };
//     }, [authUser]);

//     return (
//         <AuthContext.Provider
//             value={{
//                 authUser,
//                 user,
//                 loading,
//                 error,
//                 signIn,
//                 signUp,
//                 signOut,
//                 signInWithProvider,
//                 refreshUser,
//             }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuthContext = () => useContext(AuthContext);

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { UserInterface } from "@/types/users.types";
import { signIn, signOut, signUp, signInWithProvider } from "@/services/server/auth";
import { supabase } from "supabase/supabaseClient";
import { useUserOnlineStatus } from "@/hooks/useUserOnlineStatus";

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
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async (authUser: User | null) => {
        if (!authUser) {
            setUser(null);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single();

        if (error) {
            setError("Nie udało się pobrać profilu.");
            setUser(null);
        } else {
            setUser(data);
        }
        setLoading(false);
    };

    const refreshUser = async () => {
        if (!authUser) return;

        const { data, error } = await supabase.from("users").select("*").eq("id", authUser.id).single();

        if (error) {
            setError("Nie udało się odświeżyć profilu.");
        } else {
            setUser(data);
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            const sessionUser = data.session?.user ?? null;
            setAuthUser(sessionUser);
            fetchUser(sessionUser);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setAuthUser(sessionUser);
            fetchUser(sessionUser);
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
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
