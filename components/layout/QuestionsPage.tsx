"use client";

import ErrorWrapper from "@/components/layout/ErrorWrapper";
import { QuestionCard } from "@/components/ui/cards/QuestionCard";
import PageTitle from "@/components/ui/PageTitle";
import LocalQuestionSearcher from "@/components/ui/search/LocalQuestionSearcher";
import { usePagination } from "@/hooks/usePagination";
import { QuestionCardProps } from "@/types/questions.types";
import { Pagination } from "@heroui/react";
import { useSidebarContext } from "context/LeftSidebarContext";

export default function QuestionsPage({ questions }: { questions: QuestionCardProps[] }) {
    const PER_PAGE = 18;
    const { isCompact } = useSidebarContext();
    const { paginatedItems, currentPage, totalPages, setPage } = usePagination(questions, PER_PAGE);

    return (
        <div className="wrapper">
            {paginatedItems.length > 0 ? (
                <>
                    <PageTitle title="Pytania" />
                    <LocalQuestionSearcher className="mb-4" />

                    <div
                        className={`grid gap-3 ${
                            isCompact ? "lg:grid-cols-2 2xl:grid-cols-3" : "xl:grid-cols-2 4xl:grid-cols-3"
                        }`}>
                        {paginatedItems.map((question, index) => (
                            <QuestionCard isCompact={isCompact} key={index} {...question} />
                        ))}

                        <Pagination
                            classNames={{
                                item: "bg-cBgDark-700",
                                cursor: "rounded-sm bg-cCta-500",
                                prev: "bg-cBgDark-700",
                                next: "bg-cBgDark-700",
                            }}
                            className="col-span-full mx-auto mt-4"
                            isCompact
                            showControls
                            page={currentPage}
                            total={totalPages}
                            onChange={setPage}
                        />
                    </div>
                </>
            ) : (
                <ErrorWrapper />
            )}
        </div>
    );
}
