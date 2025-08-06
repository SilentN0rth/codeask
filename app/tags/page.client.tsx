"use client";

import ErrorWrapper from "@/components/layout/ErrorWrapper";
import PageTitle from "@/components/ui/PageTitle";
import TagCard from "@/components/ui/tags/TagCard";
import { SvgIcon } from "@/lib/utils/icons";
import { Tag } from "@/types/tags.types";
import { usePagination } from "@/hooks/usePagination";
import { Button, Pagination } from "@heroui/react";
import TagsPageClient from "@/components/ui/search/TagsPageClient";
import Link from "next/link";

const PER_PAGE = 60;

const PageClient = ({ tags }: { tags: Tag[] }) => {
    const { paginatedItems, currentPage, totalPages, setPage } = usePagination(tags, PER_PAGE);

    return (
        <div className="wrapper">
            {paginatedItems.length > 0 ? (
                <>
                    <PageTitle title="Tagi" />
                    <TagsPageClient />
                    <div className="flex flex-wrap !items-stretch gap-3">
                        {paginatedItems.map((tag) => (
                            <TagCard tag={tag} key={tag.id} />
                        ))}
                        <Button
                            as={Link}
                            href="/questions/create"
                            className="group size-12 border-1 border-divider"
                            variant="bordered"
                            isIconOnly
                            startContent={
                                <SvgIcon
                                    icon="mdi:plus"
                                    className="size-5 transition-transform group-hover:rotate-180 group-hover:scale-125"
                                />
                            }
                        />
                    </div>
                    <Pagination
                        classNames={{
                            base: "flex place-self-center",
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
                </>
            ) : (
                <ErrorWrapper />
            )}
        </div>
    );
};

export default PageClient;
