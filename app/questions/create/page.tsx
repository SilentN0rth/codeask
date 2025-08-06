"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CreateQuestion from "./page.client";
import { useAuthContext } from "context/useAuthContext";

export default function Page() {
    const { user, loading } = useAuthContext();

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return <div className="p-8 text-center text-default-500">Ładowanie…</div>;
    }

    return <CreateQuestion userId={user?.id as string} />;
}
