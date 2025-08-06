"use client";

import { useState } from "react";
import { Divider } from "@heroui/react";
import QuestionTags from "@/components/ui/question/QuestionTags";
import QuestionContent from "@/components/ui/question/QuestionContent";
import Answers from "@/components/ui/answers/Answers";
import { QuestionCardProps } from "@/types/questions.types";
import QuestionStickyMenu from "@/components/ui/question/QuestionStickyMenu";

export default function QuestionPageClient({ question }: { question: QuestionCardProps }) {
    const [questionData, setQuestionData] = useState<QuestionCardProps>(question);

    return (
        <article className="flex-column w-full gap-5">
            <QuestionStickyMenu question={questionData} />

            <div className="wrapper flex-column w-full gap-5">
                <div className="flex flex-col gap-4">
                    <QuestionTags tags={questionData.tags} />
                    <QuestionContent title={questionData.title} content={questionData.content} />
                </div>

                <Divider />

                <div id="answers" className="flex w-full flex-col items-start justify-start">
                    <div className="mb-4 flex w-full flex-wrap items-end justify-between gap-x-2">
                        <h2 className="relative  pl-3 text-base font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:bg-cCta-500 before:content-['']">
                            Odpowiedz na pytanie
                        </h2>
                        <p className="hidden text-tiny text-cMuted-500 sm:block">
                            {question.answers_count === 0
                                ? "bądź pierwszy, kto pomoże!"
                                : "dołącz do wspólnej dyskusji!"}
                        </p>
                    </div>
                    <Answers question={questionData} setQuestion={setQuestionData} />
                </div>
            </div>
        </article>
    );
}
