"use server";
/* eslint-disable camelcase */
import { generateSlug } from "@/lib/utils/generateSlug";
import type { User } from "@supabase/supabase-js";
import { createActivity } from "./activity";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { supabase } from "supabase/supabaseClient";
import { UserInterface } from "@/types/users.types";

import { SortUserOption } from "@/types/searchAndFilters.types";

export async function createUserProfile(user: User) {
    const baseName = user.email?.split("@")[0] || "user";
    const username = baseName.toLowerCase();
    const profileSlug = generateSlug(username);

    const { data: userData, error: userError } = await supabase.from("users").insert([
        {
            id: user.id,
            name: baseName,
            email: user.email,
            username,
            profile_slug: profileSlug,
            avatar_url: "",
            background_url: "",
            bio: null,
            specialization: "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at ?? null,
            updated_at: user.updated_at,
            confirmed_at: user.confirmed_at,

            answers_count: 0,
            questions_count: 0,
            reputation: 0,

            badges: { gold: 0, silver: 0, bronze: 0 },

            is_moderator: false,
            permissions: [],

            following_count: 0,
            followers_count: 0,

            website_url: null,
            twitter_url: null,
            github_url: null,
            location: null,
        },
    ]);

    if (userError) throw userError;

    try {
        await createActivity({
            user_id: user.id,
            type: "joined",
            description: "Dołączył do platformy.",
            timestamp: user.created_at,
        });
    } catch (activityError) {
        console.error("Błąd dodawania aktywności:", activityError);
        throw activityError;
    }

    return userData;
}

export async function getCurrentUser(): Promise<UserInterface | null> {
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) return null;

    const { user } = session;

    // Pobieramy pełne dane użytkownika z tabeli `users`
    const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();

    if (error || !data) return null;

    return data as UserInterface;
}

export async function getUserById(id: string) {
    const { data, error } = await supabase
        .from("users")
        .select(
            `
            *,
            recent_activity:activity_items (
                id,
                type,
                description,
                timestamp
            ) order(timestamp desc)
        `
        )
        .eq("id", id)
        .single();

    if (error) {
        console.error("getUserById error:", error.message);
        return null;
    }

    if (!data) {
        console.warn("getUserById: no user found for id", id);
        return null;
    }

    return data;
}

export async function getUsers({
    search,
    sort,
}: {
    search?: string;
    sort?: SortUserOption;
} = {}): Promise<UserInterface[]> {
    const supabase = createServerComponentClient({ cookies });

    let query = supabase.from("users").select("*");

    // SEARCH
    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    // SORT
    switch (sort) {
        case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
        case "mostAnswers":
            query = query.order("answers_count", { ascending: false });
            break;
        case "mostReputation":
            query = query.order("reputation", { ascending: false });
            break;
        case "mostQuestions":
            query = query.order("questions_count", { ascending: false });
            break;
        case "name":
            query = query.order("name", { ascending: true });
            break;
        case "newest":
        default:
            query = query.order("created_at", { ascending: false });
            break;
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
}
