"use client";

import { SortSelectProps } from "@/types/searchAndFilters.types";
import { Select, SelectItem } from "@heroui/react";

const SortSelect = ({ options, selectedSort, onSortChange, className }: SortSelectProps) => {
    return (
        <Select
            size="sm"
            radius="sm"
            className={`h-full ${className ?? ""}`}
            label="Sortuj według"
            selectedKeys={new Set([selectedSort])}
            onSelectionChange={(keys) => {
                const key = Array.from(keys)[0];
                if (typeof key === "string") {
                    onSortChange(key);
                }
            }}
            classNames={{
                mainWrapper: "h-full",
                trigger: "h-full border-2 !border-cBgDark-700 !bg-cBgDark-800 hover:!bg-cBgDark-900",
            }}>
            {options.map((option) => (
                <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
        </Select>
    );
};

export default SortSelect;
