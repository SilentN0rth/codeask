"use client";

import { BasicItem, UniversalFilterProps } from "@/types/searchAndFilters.types";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React from "react";

function UniversalFilter<T extends BasicItem>({
    items,
    value,
    className,
    onChange,
    ariaLabel,
    renderItem,
}: UniversalFilterProps<T>) {
    return (
        <Autocomplete
            aria-label={ariaLabel}
            defaultItems={items}
            selectedKey={value}
            onSelectionChange={(key) => {
                if (key !== null) onChange(String(key));
            }}
            className={`size-full ${className}`}
            variant="bordered"
            radius="md"
            inputProps={{
                classNames: {
                    base: "h-full",
                    inputWrapper: " h-full !border-cBgDark-700 !bg-cBgDark-800 hover:!bg-cBgDark-900",
                    input: "text-base ",
                },
            }}
            popoverProps={{
                offset: 10,

                classNames: {
                    base: "",
                    content: "  p-1 border-small border-default-100 bg-cBgDark-800 ",
                },
            }}
            placeholder={ariaLabel}>
            {(item) => (
                <AutocompleteItem key={item.id} textValue={item.name}>
                    {renderItem ? renderItem(item) : item.name}
                </AutocompleteItem>
            )}
        </Autocomplete>
    );
}

export default UniversalFilter;
