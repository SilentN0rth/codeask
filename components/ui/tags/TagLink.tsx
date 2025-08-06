import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { Tag } from "@/types/tags.types";

const TagLink = ({ tag }: { tag: Tag }) => {
    return (
        <Button
            size="sm"
            variant="bordered"
            radius="sm"
            as={Link}
            href={`/tags/${tag.id}/${tag.name}`}
            className="h-fit min-w-fit border-divider px-2 py-0.5 text-xs text-default-600">
            {tag.name}
        </Button>
    );
};

export default TagLink;
