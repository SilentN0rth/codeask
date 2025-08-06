"use client";

import AnswerCard from "./AnswerCard";
import dynamic from "next/dynamic";
import LoadingHorizontalDots from "../LoadingHorizontalDots";
import { Button, addToast } from "@heroui/react";
import { useState } from "react";
import { QuestionCardProps } from "@/types/questions.types";
import { addAnswer, deleteAnswer, updateAnswer } from "@/services/server/answers";
import { refreshQuestion } from "@/services/client/questions";
import { SvgIcon } from "@/lib/utils/icons";
import { useAuthContext } from "context/useAuthContext";
import { AnswerCardProps } from "@/types/answers.types";

const DynamicEditor = dynamic(() => import("@/components/TinyMCE/Editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-24 justify-center bg-[#0f1113]">
            <LoadingHorizontalDots />
        </div>
    ),
});

export default function Answers({
    question,
    setQuestion,
}: {
    question: QuestionCardProps;
    setQuestion: (q: QuestionCardProps) => void;
}) {
    const { user } = useAuthContext();

    const [isAddingAnswer, setIsAddingAnswer] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [answers, setAnswers] = useState(question.answers);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);

    // Obsługa kliknięcia "Edytuj" w konkretnej odpowiedzi
    const handleEditAnswer = (answerToEdit: AnswerCardProps) => {
        setEditingAnswerId(answerToEdit.id);
        setContent(answerToEdit.content as string);
        setIsAddingAnswer(false);
        setError(false);
    };

    const handleDeleteAnswer = async (answerId: string) => {
        try {
            setIsSubmitting(true);
            const success = await deleteAnswer(answerId, question.id);

            if (success) {
                setAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
                refreshQuestion(question.id, setQuestion);
                addToast({
                    title: "Usunięto odpowiedź",
                    color: "success",
                });
            } else {
                addToast({
                    title: "Błąd",
                    description: "Nie udało się usunąć odpowiedzi",
                    color: "danger",
                });
            }
        } catch (error) {
            addToast({
                title: "Błąd",
                description: "Coś poszło nie tak",
                color: "danger",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddAnswer = async () => {
        if (!content.trim()) {
            setError(true);
            return;
        }

        setIsSubmitting(true);

        if (editingAnswerId) {
            // Edytowanie odpowiedzi
            try {
                const response = await updateAnswer({
                    id: editingAnswerId,
                    content,
                });

                if (response) {
                    setAnswers((prev) => prev.map((ans) => (ans.id === (editingAnswerId) ? response : ans)));
                    setEditingAnswerId(null);
                    setContent("");
                    setError(false);
                    refreshQuestion(question.id, setQuestion);
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
            setIsSubmitting(false);
        } else {
            const now = Date.now();
            if (lastSubmitTime && now - lastSubmitTime < 5000) {
                addToast({
                    title: "Poczekaj chwilę",
                    description: "Możesz dodać kolejną odpowiedź za kilka sekund",
                    icon: <SvgIcon icon="mdi:timer-sand" />,
                    color: "warning",
                });
                setIsSubmitting(false);
                return;
            }

            try {
                const response = await addAnswer({
                    content,
                    questionId: question.id,
                    authorId: user?.id as string,
                });
                if (response) {
                    setAnswers((prev) => [...prev, response]);
                    setContent("");
                    setIsAddingAnswer(false);
                    setError(false);
                    setLastSubmitTime(now);
                    refreshQuestion(question.id, setQuestion);
                } else {
                    setError(true);
                }
            } catch {
                setError(true);
            }
            setIsSubmitting(false);
        }
    };

    // Anulowanie edycji
    const handleCancelEdit = () => {
        setEditingAnswerId(null);
        setContent("");
        setError(false);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            {answers.map((answer: AnswerCardProps) =>
                editingAnswerId === answer.id ? (
                    // Edytor zamiast karty edytowanej odpowiedzi
                    <div key={answer.id} data-error={error} className="rounded-xl bg-cBgDark-800 p-4">
                        <DynamicEditor
                            key={editingAnswerId} // <--- wymusza re-mount edytora przy zmianie edytowanej odpowiedzi
                            hasError={error}
                            value={content}
                            onContentChange={(html: string) => setContent(html)}
                            isSubmitting={isSubmitting && (editingAnswerId) === answer.id}
                        />
                        {error && (
                            <div className="p-1 text-tiny font-light text-danger">Treść odpowiedzi jest wymagana</div>
                        )}
                        <div className="mt-2 flex gap-2">
                            <Button
                                onPress={handleAddAnswer}
                                isDisabled={isSubmitting}
                                className="bg-cCta-500 hover:bg-cCta-700">
                                Zapisz zmiany
                            </Button>
                            <Button onPress={handleCancelEdit} variant="light" isDisabled={isSubmitting}>
                                Anuluj
                            </Button>
                        </div>
                    </div>
                ) : (
                    <AnswerCard
                        key={answer.id}
                        answer={answer}
                        author={answer.author_id === user?.id ? user : undefined}
                        onEdit={() => handleEditAnswer(answer)}
                        onDelete={() => handleDeleteAnswer(answer.id)}
                    />
                )
            )}

            {/* Edytor nowej odpowiedzi na dole */}
            {isAddingAnswer && editingAnswerId === null && (
                <div data-error={error}>
                    <DynamicEditor
                        hasError={error}
                        value={content}
                        onContentChange={(html: string) => setContent(html)}
                        isSubmitting={isSubmitting}
                    />
                    {error && (
                        <div className="p-1 text-tiny font-light text-danger">Treść odpowiedzi jest wymagana</div>
                    )}
                </div>
            )}

            <Button
                onPress={() => {
                    if (editingAnswerId) {
                        handleAddAnswer();
                    } else if (isAddingAnswer) {
                        handleAddAnswer();
                    } else {
                        setIsAddingAnswer(true);
                        setContent("");
                        setError(false);
                    }
                }}
                className="w-fit bg-cCta-500 hover:bg-cCta-700"
                isDisabled={isSubmitting}>
                {editingAnswerId ? "Zapisz zmiany" : isAddingAnswer ? "Dodaj odpowiedź" : "Odpowiedz"}
            </Button>
        </div>
    );
}
