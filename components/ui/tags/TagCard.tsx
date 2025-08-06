"use client";

import { SvgIcon } from "@/lib/utils/icons";
import { Tag } from "@/types/tags.types";
import { Link as LinkHeroUI } from "@heroui/react";
import Link from "next/link";
export const TagCard = ({ tag }: { tag: Tag }) => {
    return (
        <LinkHeroUI
            as={Link}
            className="flex h-12 justify-between gap-6 rounded-lg border border-cBgDark-700 px-4 text-sm text-cTextDark-100 transition-colors hover:bg-cBgDark-700/70"
            href={`/tags/${tag.id}/${tag.name}`}>
            <p className="line-clamp-1">#{tag.name}</p>
            <span className="flex items-center justify-center gap-1 text-small text-foreground-500">
                <SvgIcon icon="mdi:help-circle-outline" className="size-4" />
                {tag.question_count}
            </span>
        </LinkHeroUI>
    );
};

export default TagCard;
