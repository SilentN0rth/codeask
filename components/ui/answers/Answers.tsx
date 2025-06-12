"use client";
import React, { useRef, useState } from "react";
import AnswerCard from "./AnswerCard";
import dynamic from "next/dynamic";
import LoadingHorizontalDots from "../LoadingHorizontalDots";
import { Button } from "@heroui/react";
import { ANSWERS } from "@/constants/Answers";

const DynamicEditor = dynamic(() => import("@/components/TinyMCE/Editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-24 justify-center bg-[#0f1113]">
            <LoadingHorizontalDots />
        </div>
    ),
});

export default function Answers() {
    const editorRef = useRef<any>(null);
    const [isEditorVisible, setIsEditorVisible] = useState<boolean>(false);

    const handleAddAnswer = () => {
        const content = editorRef.current?.getContent() || "";
        // tutaj możesz podpiąć logikę dodania odpowiedzi, np. wysłać na serwer, albo dodać do state
        alert("Dodano odpowiedź:\n\n" + content);
    };

    return (
        <div className="flex w-full flex-col gap-4">
            {ANSWERS.map((answer) => (
                <AnswerCard key={answer.id} answer={answer} />
            ))}

            {isEditorVisible && <DynamicEditor />}
            <Button
                onPress={() => {
                    if (isEditorVisible) {
                        handleAddAnswer();
                    } else {
                        setIsEditorVisible(true);
                    }
                }}
                className=" w-fit  bg-cCta-500 hover:bg-cCta-700">
                {isEditorVisible ? "Dodaj odpowiedź" : "Odpowiedz"}
            </Button>
        </div>
    );
}
