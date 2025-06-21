"use client";

import ErrorWrapper from "@/components/layout/ErrorWrapper";
import PageTitle from "@/components/ui/PageTitle";
// import TagsPageClient from "@/components/ui/search/TagsPageClient";
import TagCard from "@/components/ui/tags/TagCard";
import { FILTER_TAGS } from "@/constants/SearchAndFilters";
import { usePagination } from "@/hooks/usePagination";
import { Button, Pagination } from "@heroui/react";
import { useSidebarContext } from "context/LeftSidebarContext";
// import { Suspense } from "react";

const PER_PAGE = 60;

const Page = () => {
    const { isCompact } = useSidebarContext();
    const { paginatedItems, currentPage, totalPages, setPage } = usePagination(FILTER_TAGS, PER_PAGE);

    return (
        <div className="wrapper">
            {paginatedItems.length > 0 ? (
                <>
                    <PageTitle title="Tagi" />
                    {/* <div className="flex justify-between">
                        <Suspense fallback={<div>Ładowanie filtrów…</div>}>
                            <TagsPageClient />
                        </Suspense>
                    </div> */}
                    <div
                        className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${
                            isCompact
                                ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
                                : "lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6"
                        }`}>
                        {paginatedItems.map((tag) => (
                            <TagCard tag={tag} key={tag.id} />
                        ))}
                        <Button className="h-full border-1 border-divider" variant="bordered">
                            Dodaj tag
                        </Button>

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
};

export default Page;
