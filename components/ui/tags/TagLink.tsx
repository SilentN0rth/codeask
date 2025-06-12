import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const TagLink = ({ item }: { item: string }) => {
    return (
        <Button
            size="sm"
            variant="bordered"
            radius="sm"
            as={Link}
            href={`/tags/${item}`}
            className="h-fit min-w-fit border-divider px-2 py-0.5 text-xs text-default-600">
            {item}
        </Button>
    );
};

export default TagLink;
