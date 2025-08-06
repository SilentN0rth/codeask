"use server";
import { QuestionCardProps } from "@/types/questions.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabase } from "supabase/supabaseClient";

export async function getQuestionById(id: string): Promise<QuestionCardProps | null> {
    const { data, error } = await supabase
        .from("questions")
        .select(
            `
            *,
            author:author_id (
                *
            ),
            tags (
                *
            ),
            answers (
                *
            )
            `
        )
        .eq("id", id)
        .single();

    if (error) {
        console.error("getQuestionById error:", error.message);
        return null;
    }
    if (data?.answers) {
        data.answers.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    return data;
}

export async function getQuestions({
    search,
    sort,
    filter,
    value,
}: {
    search?: string;
    sort?: string;
    filter?: string;
    value?: string;
} = {}): Promise<{ questions: QuestionCardProps[]; error: any }> {
    const supabase = createServerComponentClient({ cookies });

    let query = supabase.from("questions").select(
        `
        *,
        author:author_id (*)
      `
    );

    if (search) {
        query = query.ilike("title", `%${search}%`);
    }

    if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
    } else if (sort === "oldest") {
        query = query.order("created_at", { ascending: true });
    } else if (sort === "answers") {
        query = query.order("answers_count", { ascending: false });
    } else if (sort === "likes") {
        query = query.order("likes_count", { ascending: false });
    } else if (sort === "views") {
        query = query.order("views_count", { ascending: false });
    } else if (sort === "name") {
        query = query.order("title", { ascending: true });
    } else {
        query = query.order("created_at", { ascending: false }); // domyślna
    }

    if (filter && value) {
        if (filter === "user") {
            query = query.eq("author_id", value);
        } else if (filter === "tags") {
            const { data: tag, error: tagError } = await supabase.from("tags").select("id").eq("id", value).single();

            if (tagError) throw tagError;

            const { data: questionTags, error: questionTagsError } = await supabase
                .from("question_tags")
                .select("question_id")
                .eq("tag_id", tag.id);

            if (questionTagsError) throw questionTagsError;

            const questionIds = (questionTags ?? []).map((qt) => qt.question_id);

            query = query.in("id", questionIds.length > 0 ? questionIds : [-1]);
        }
    }

    const { data, error } = await query;

    if (error) throw error;

    return { questions: data as QuestionCardProps[], error };
}

export async function getNewestQuestions(): Promise<{ questions: QuestionCardProps[]; error: any }> {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase
        .from("questions")
        .select(
            `
            *,
            author:author_id (*)
        `
        )
        .order("created_at", { ascending: false })
        .limit(10);

    if (error) throw error;

    return { questions: data as QuestionCardProps[], error };
}
