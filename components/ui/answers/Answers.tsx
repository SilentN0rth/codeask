"use client";
import AnswerCard from "./AnswerCard";
import dynamic from "next/dynamic";
import LoadingHorizontalDots from "../LoadingHorizontalDots";
import { Button } from "@heroui/react";
import { ANSWERS } from "@/constants/Answers";
import { useState } from "react";

const DynamicEditor = dynamic(() => import("@/components/TinyMCE/Editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-24 justify-center bg-[#0f1113]">
            <LoadingHorizontalDots />
        </div>
    ),
});

export default function Answers() {
    const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false);
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    const handleAddAnswer = () => {
        if (!content.trim()) {
            setError(true);
            return;
        }

        setError(false);
        alert("Dodano odpowiedź:\n\n" + content);

        setContent("");
        setIsEditorVisible(false);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            {ANSWERS.map((answer) => (
                <AnswerCard key={answer.id} answer={answer} />
            ))}

            {isEditorVisible && (
                <div data-error={error}>
                    <DynamicEditor hasError={error} onContentChange={(html: string) => setContent(html)} />
                    {error && (
                        <div className="p-1 text-tiny font-light text-danger">Treść odpowiedzi jest wymagana</div>
                    )}
                </div>
            )}

            <Button
                onPress={() => {
                    if (isEditorVisible) {
                        handleAddAnswer();
                    } else {
                        setIsEditorVisible(true);
                    }
                }}
                className="w-fit bg-cCta-500 hover:bg-cCta-700">
                {isEditorVisible ? "Dodaj odpowiedź" : "Odpowiedz"}
            </Button>
        </div>
    );
}
