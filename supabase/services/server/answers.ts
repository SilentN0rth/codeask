"use server";
/* eslint-disable camelcase */
import { supabase } from "supabase/supabaseClient";
import { createActivity } from "./activity";

export async function addAnswer({
    content,
    questionId,
    authorId,
}: {
    content: string;
    questionId: string;
    authorId: string;
}) {
    // 1. Dodanie odpowiedzi
    const { data: answerData, error: answerError } = await supabase
        .from("answers")
        .insert([
            {
                content,
                question_id: questionId,
                author_id: authorId,
                likes_count: 0,
                dislikes_count: 0,
            },
        ])
        .select()
        .single();

    if (answerError) throw answerError;
    const { data: question, error: fetchQuestionError } = await supabase
        .from("questions")
        .select("answers_count")
        .eq("id", questionId)
        .single();

    if (!fetchQuestionError) {
        const { error: questionUpdateError } = await supabase
            .from("questions")
            .update({ answers_count: (question?.answers_count || 0) + 1 })
            .eq("id", questionId);
        if (questionUpdateError) {
            console.error("Błąd aktualizacji liczby odpowiedzi w pytaniu:", questionUpdateError.message);
        }
    } else {
        console.error("Błąd pobierania pytania:", fetchQuestionError.message);
    }

    // 3. Aktualizacja liczby odpowiedzi użytkownika
    const { data: user, error: fetchUserError } = await supabase
        .from("users")
        .select("answers_count")
        .eq("id", authorId)
        .single();

    if (!fetchUserError) {
        const { error: userUpdateError } = await supabase
            .from("users")
            .update({ answers_count: (user?.answers_count || 0) + 1 })
            .eq("id", authorId);

        if (userUpdateError) {
            console.error("Błąd aktualizacji liczby odpowiedzi użytkownika:", userUpdateError.message);
        }
    } else {
        console.error("Błąd pobierania użytkownika:", fetchUserError.message);
    }

    // 4. Aktywność
    try {
        await createActivity({
            user_id: authorId,
            type: "answer",
            description: "Udzielił odpowiedzi na pytanie.",
            timestamp: new Date().toISOString(),
        });
    } catch (activityError) {
        console.warn("Błąd dodawania aktywności (nie przerywa działania):", activityError);
    }

    return answerData;
}

export async function updateAnswer({ id, content }: { id: string; content: string }) {
    // 1. Pobierz aktualną odpowiedź, by znać obecną wartość updates_count
    const { data: existingAnswer, error: fetchError } = await supabase
        .from("answers")
        .select("updates_count")
        .eq("id", id)
        .single();

    if (fetchError) throw fetchError;

    const newUpdatesCount = (existingAnswer?.updates_count || 0) + 1;

    // 2. Aktualizacja odpowiedzi
    const { data: answerData, error: answerError } = await supabase
        .from("answers")
        .update({
            content,
            updated_at: new Date(),
            updates_count: newUpdatesCount,
        })
        .eq("id", id)
        .select()
        .single();

    if (answerError) throw answerError;

    return answerData;
}

export async function deleteAnswer(id: string, questionId: string): Promise<boolean> {
    // 1. Usuń odpowiedź
    const { error: deleteError } = await supabase.from("answers").delete().eq("id", id);

    if (deleteError) {
        console.error("deleteAnswer error:", deleteError.message);
        return false;
    }

    // 2. Zmniejsz licznik odpowiedzi w pytaniu o 1
    // Najpierw pobierz aktualną wartość
    const { data: question, error: fetchQuestionError } = await supabase
        .from("questions")
        .select("answers_count")
        .eq("id", questionId)
        .single();

    if (fetchQuestionError) {
        console.error("fetchQuestionError:", fetchQuestionError.message);
        return false;
    }

    const newCount = Math.max(0, (question?.answers_count || 1) - 1);

    const { error: updateQuestionError } = await supabase
        .from("questions")
        .update({ answers_count: newCount })
        .eq("id", questionId);

    if (updateQuestionError) {
        console.error("updateQuestionError:", updateQuestionError.message);
        return false;
    }

    return true;
}
