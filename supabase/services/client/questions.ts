/* eslint-disable camelcase */
import { supabase } from "supabase/supabaseClient";
import { generateSlug } from "@/lib/utils/generateSlug";
import { createActivity } from "@/services/server/activity";
import { QuestionCardProps } from "@/types/questions.types";

type CreateQuestionProps = {
    title: string;
    content: string;
    short_content: string;
    tags: string[];
    authorId: string;
};

export async function createQuestion({ title, content, short_content, tags, authorId }: CreateQuestionProps) {
    // 1. Stwórz slug na podstawie tytułu
    const questionSlug = generateSlug(title);

    // 2. Stwórz pytanie
    const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert([
            {
                title,
                content,
                short_content,
                author_id: authorId,
                question_slug: questionSlug,
            },
        ])
        .select()
        .single();

    if (questionError) throw questionError;

    const questionId = questionData.id;

    // 3. Przetwórz tagi — upewnij się, że istnieją, albo je dodaj
    const tagIds: string[] = [];

    for (const tagName of tags) {
        const trimmed = tagName.trim().toLowerCase();

        // a) Sprawdź, czy tag już istnieje
        const { data: existingTag, error: tagSelectError } = await supabase
            .from("tags")
            .select("id, question_count")
            .eq("name", trimmed)
            .single();

        if (tagSelectError && tagSelectError.code !== "PGRST116") throw tagSelectError;

        let tagId: string;

        if (existingTag) {
            tagId = existingTag.id;

            // Zwiększ licznik question_count
            await supabase
                .from("tags")
                .update({ question_count: existingTag.question_count + 1 })
                .eq("id", tagId);
        } else {
            // b) Stwórz nowy tag
            const { data: newTag, error: tagInsertError } = await supabase
                .from("tags")
                .insert([{ name: trimmed, question_count: 1 }])
                .select()
                .single();

            if (tagInsertError) throw tagInsertError;

            tagId = newTag.id;
        }

        tagIds.push(tagId);
    }

    // 4. Połącz pytanie z tagami w question_tags
    const tagLinks = tagIds.map((tagId) => ({
        question_id: questionId,
        tag_id: tagId,
    }));

    const { error: linkError } = await supabase.from("question_tags").insert(tagLinks);
    if (linkError) throw linkError;

    // 5. Zarejestruj aktywność za pomocą createActivity
    try {
        await createActivity({
            user_id: authorId,
            type: "question",
            description: `Zadał pytanie: "${title}"`,
            timestamp: new Date().toISOString(),
        });
    } catch (activityError) {
        console.error("Błąd dodawania aktywności:", activityError);
        // Jeśli chcesz, możesz tu rzucić wyjątek
        // throw activityError;
    }

    return questionData;
}

export async function refreshQuestion(questionId: string, setQuestion: (question: QuestionCardProps) => void) {
    if (!questionId) return;

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
            )`
        )
        .eq("id", questionId)
        .single();

    if (error) {
        throw new Error("Nie udało się odświeżyć pytania.");
    } else {
        setQuestion(data);
    }
}