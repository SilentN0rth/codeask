"use client";

import { TagCardInterface } from "@/types/tags.types";
import { Link as LinkHeroUI } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export const TagCard = ({ tag }: { tag: TagCardInterface }) => {
    return (
        <LinkHeroUI
            className="flex justify-between rounded-lg border border-cBgDark-700 p-3 text-cTextDark-100 transition-colors hover:bg-cBgDark-700/70"
            as={Link}
            href={`/tags/${tag.id}`}>
            <p className="line-clamp-1">#{tag.name}</p>
            <span className="flex items-center justify-center gap-1 text-small text-foreground-500">
                <Icon icon="mdi:help-circle-outline" />
                {tag.questionCount}
            </span>
        </LinkHeroUI>
    );
};

export default TagCard;
