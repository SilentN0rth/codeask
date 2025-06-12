"use client";

import { FILTER_OPTIONS } from "@/constants/SearchAndFilters";
import { ChooseButtonFilterProps } from "@/types/searchAndFilters.types";
import { Select, SelectItem } from "@heroui/react";

const ChooseButtonFilter = ({ className, selectedFilter, onFilterChange }: ChooseButtonFilterProps) => {
    return (
        <Select
            size="sm"
            radius="sm"
            className={`h-full ${className}`}
            label="Wybierz filtr"
            selectedKeys={[selectedFilter]}
            onChange={(e) => onFilterChange(e.target.value)}
            classNames={{
                mainWrapper: "h-full",
                trigger: "h-full border-2 !border-cBgDark-700 !bg-cBgDark-800 hover:!bg-cBgDark-900",
            }}>
            {FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
        </Select>
    );
};

export default ChooseButtonFilter;
