"use client";
import PageTitle from "@/components/ui/PageTitle";
import LocalJobSearcher from "@/components/ui/search/LocalJobSearcher";
import { useSidebarContext } from "context/LeftSidebarContext";
import React from "react";

const Page = () => {
    const { isCompact } = useSidebarContext();
    return (
        <div className="wrapper">
            <PageTitle title="Oferty pracy" />
                <LocalJobSearcher />
            <div
                className={`grid grid-cols-1 gap-3 sm:grid-cols-2 ${isCompact ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" : "lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6"}`}></div>
        </div>
    );
};

export default Page;
