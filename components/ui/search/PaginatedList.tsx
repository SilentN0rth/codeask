"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "@heroui/react";
import React from "react";
import { ClassName } from "@/types/index.types";

type PaginatedListProps<T> = {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    perPage?: number;
};

export default function PaginatedList<T>({
    items,
    renderItem,
    perPage = 18,
    className,
}: PaginatedListProps<T> & ClassName) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(items.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedItems = items.slice(startIndex, startIndex + perPage);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    if (items.length === 0) return null;

    return (
        <div className={className}>
            {paginatedItems.map(renderItem)}
            {totalPages > 1 && (
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
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
}
