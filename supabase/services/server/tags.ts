"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Tag } from "@/types/tags.types";

export async function getTags({
    search,
    sort,
}: {
    search?: string;
    sort?: string;
} = {}): Promise<{ tags: Tag[]; error: any }> {
    const supabase = createServerComponentClient({ cookies });

    let query = supabase.from("tags").select("*");

    if (search) {
        query = query.ilike("name", `%${search}%`);
    }

    switch (sort) {
        case "newest":
            query = query.order("created_at", { ascending: false });
            break;
        case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
        case "name":
            query = query.order("name", { ascending: true });
            break;
        case "popularity":
        default:
            query = query.order("question_count", { ascending: false });
            break;
    }

    const { data, error } = await query;

    if (error) throw error;

    return { tags: data as Tag[], error };
}
