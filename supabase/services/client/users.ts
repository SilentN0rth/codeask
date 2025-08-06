"use client";
import { UserInterface } from "@/types/users.types";
import { supabase } from "supabase/supabaseClient";

export const getUserById = async (id: string): Promise<UserInterface | null> => {
    try {
        const { data, error } = await supabase.from("users").select("*").eq("id", id).single();

        if (error) {
            console.error("Błąd przy pobieraniu użytkownika:", error);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Nieoczekiwany błąd przy pobieraniu użytkownika:", err);
        return null;
    }
};

export const updateUserById = async (id: string, formData: Partial<UserInterface>): Promise<{ error: any | null }> => {
    const { error } = await supabase.from("users").update(formData).eq("id", id);
    return { error };
};
