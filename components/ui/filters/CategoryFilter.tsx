"use client";

import { FilterProps } from "@/types/searchAndFilters.types";
import UniversalFilter from "./UniversalLocalFilter";
import { FILTER_CATEGORIES } from "@/constants/SearchAndFilters";

const CategoryFilter = ({ className, value, onChange }: FilterProps) => {
    return (
        <UniversalFilter
            value={value}
            className={className}
            onChange={onChange}
            items={FILTER_CATEGORIES}
            ariaLabel="Kategoria"
        />
    );
};

export default CategoryFilter;
