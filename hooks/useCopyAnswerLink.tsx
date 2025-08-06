"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useCopyAnswerLink = (answerId: number) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleCopyLink = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("answer", String(answerId));
        const fullUrl = `${window.location.origin}${pathname}?${params.toString()}`;

        navigator.clipboard.writeText(fullUrl);
    }, [pathname, searchParams, answerId]);

    return handleCopyLink;
};
