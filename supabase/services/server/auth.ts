import { supabase } from "supabase/supabaseClient";
import { createUserProfile } from "./users";
import { Dispatch, SetStateAction } from "react";

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    if (data.user) {
        await createUserProfile(data.user);
    }

    return { data, error };
}

export function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut({
    setAuthUser,
    setUser,
    setError,
}: {
    setAuthUser: Dispatch<SetStateAction<any>>;
    setUser: Dispatch<SetStateAction<any>>;
    setError: Dispatch<SetStateAction<string | null>>;
}) {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        const userId = session?.user?.id;

        if (userId) {
            const { error: updateError } = await supabase.from("users").update({ is_online: false }).eq("id", userId);

            if (updateError) {
                console.error("Błąd aktualizacji is_online:", updateError);
            }
        }

        await supabase.auth.signOut();

        setAuthUser(null);
        setUser(null);
    } catch (error) {
        console.error("Błąd podczas wylogowania", error);
        setError("Błąd podczas wylogowania");
    }
}

export function signInWithProvider(provider: "google" | "github" | "facebook") {
    return supabase.auth.signInWithOAuth({ provider });
}
