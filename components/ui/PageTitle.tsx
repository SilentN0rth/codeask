import { ClassName } from "@/types/index.types";
import React from "react";

const PageTitle = ({ title, className }: { title: string } & ClassName) => {
    return (
        <h1
            className={`relative mb-6 pl-3 text-3xl font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:bg-cCta-500 before:content-[''] ${className}`}>
            {title}
        </h1>
    );
};

export default PageTitle;
