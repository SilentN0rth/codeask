"use client";

import { useEffect, useState } from "react";
import { FilterProps } from "@/types/searchAndFilters.types";
import UniversalFilter from "./UniversalLocalFilter";
import { getTags } from "@/services/server/tags";
import { Tag } from "@/types/tags.types";

const TagsFilter = ({ className, value, onChange }: FilterProps) => {
    const [tagItems, setTagItems] = useState<Tag[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            const { tags } = await getTags();
            setTagItems(tags);
        };

        fetchTags();
    }, []);

    return <UniversalFilter value={value} className={className} onChange={onChange} items={tagItems} ariaLabel="Tag" />;
};

export default TagsFilter;
