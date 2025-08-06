"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode, ElementType } from "react";

interface Props {
    children: ReactNode;
    disableWrapper?: boolean;
    className?: string;
    as?: ElementType;
}

const PaddingWrapper = ({ children, disableWrapper, className = "", as: Component = "div" }: Props) => {
    const pathname = usePathname();
    const isProfilePage = pathname.startsWith("/users");

    let classNameInline = "flex-1 text-cTextDark-100 ";

    if (disableWrapper === true) {
        classNameInline += " pt-[90px]";
    } else if (disableWrapper === false) {
        classNameInline += "wrapper pb-16 pt-[120px]";
    } else if (isProfilePage) {
        classNameInline += " pt-[90px]";
    } else {
        classNameInline += " px-6 pb-16 pt-[120px]";
    }

    return <Component className={`${classNameInline} ${className}`}>{children}</Component>;
};

export default PaddingWrapper;
