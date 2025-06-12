"use client";

import { FilterProps } from "@/types/searchAndFilters.types";
import UniversalFilter from "./UniversalLocalFilter";
import { FILTER_TAGS } from "@/constants/SearchAndFilters";

const TagsFilter = ({ className, value, onChange }: FilterProps) => {
    return (
        <UniversalFilter
            value={value}
            className={className}
            onChange={onChange}
            items={FILTER_TAGS}
            ariaLabel="Tag"
        />
    );
};

export default TagsFilter;
