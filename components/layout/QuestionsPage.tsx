"use client";

import ErrorWrapper from "@/components/layout/ErrorWrapper";
import { QuestionCard } from "@/components/ui/cards/QuestionCard";
import PageTitle from "@/components/ui/PageTitle";
import { usePagination } from "@/hooks/usePagination";
import { QuestionCardProps } from "@/types/questions.types";
import { Pagination } from "@heroui/react";
import { useSidebarContext } from "context/LeftSidebarContext";
import ClientSearcherWrapper from "../ui/search/ClientSearcherWrapper";
import { UserInterface } from "@/types/users.types";

export default function QuestionsPage({ questions, users }: { questions: QuestionCardProps[], users: UserInterface[] }) {
    const PER_PAGE = 18;
    const { isCompact } = useSidebarContext();
    const { paginatedItems, currentPage, totalPages, setPage } = usePagination(questions, PER_PAGE);

    return (
        <div className="wrapper">
            {questions.length > 0 ? (
                <>
                    <PageTitle title="Pytania" />
                    <ClientSearcherWrapper className="mb-4" />

                    <div
                        className={`grid gap-3 ${
                            isCompact ? "lg:grid-cols-2 2xl:grid-cols-3" : "xl:grid-cols-2 4xl:grid-cols-3"
                        }`}>
                        {paginatedItems.map((question, index) => (
                            <QuestionCard key={index} {...question} />
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
