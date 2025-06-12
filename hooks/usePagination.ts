"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function usePagination<T>(items: T[], perPage = 18) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentPage = Number(searchParams.get("page")) || 1;
    const totalPages = Math.ceil(items.length / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const paginatedItems = items.slice(startIndex, startIndex + perPage);

    const setPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    return {
        paginatedItems,
        currentPage,
        totalPages,
        setPage,
    };
}
