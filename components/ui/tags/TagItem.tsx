"use client";

import Link from "next/link";
import React from "react";
import { Icon } from "@iconify/react";
import { TagItemProps } from "@/types/tags.types";

export const TagItem: React.FC<TagItemProps> = ({
    label,
    href,
    className = "px-4 py-2 hover:scale-[1.02]",
    onClose,
}) => {
    const content = (
        <span
            className={`inline-flex items-center gap-1 rounded-md border border-divider text-sm text-cTextDark-100 transition-all 
                hover:border-cCta-500/30 hover:bg-cCta-500/10 active:scale-95
                ${className}`}>
            #{label}
            {onClose && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                    aria-label={`Usuń tag ${label}`}
                    className="ml-1 text-default-500 hover:text-danger">
                    <Icon icon="mdi:close" className="text-sm" />
                </button>
            )}
        </span>
    );

    return href ? <Link href={href}>{content}</Link> : content;
};
