"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const usePublicUrl = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [url, setUrl] = useState("");

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const search = searchParams.toString();
        setUrl(`${baseUrl}${pathname}${search ? `?${search}` : ""}`);
    }, [pathname, searchParams]);

    return url;
};

export default usePublicUrl;
