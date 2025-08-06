"use client";

import { Button, Input } from "@heroui/react";
import { useSidebarContext } from "context/LeftSidebarContext";
import { ClassName } from "@/types/index.types";
import { SortJobOption } from "@/types/searchAndFilters.types";
import SortSelect from "../filters/SortSelect";
import { SORT_JOB_OPTIONS } from "@/constants/SearchAndFilters";
import { useLocalSearch } from "hooks/useLocalSearch";
import { SvgIcon } from "@/lib/utils/icons";

const LocalJobSearcher = ({ className }: ClassName) => {
    const { isCompact } = useSidebarContext();

    const { searchInput, handleSearchChange, sortBy, handleSortChange } = useLocalSearch<SortJobOption>({
        initialSearch: true,
        initialSort: true,
    });

    return (
        <div className={`mb-4 grid grid-cols-12 place-content-end gap-2 ${className}`}>
            <Input
                aria-label="Search"
                value={searchInput}
                onValueChange={handleSearchChange}
                radius="sm"
                classNames={{
                    base: `col-span-12 text-base flex h-full gap-2 ${isCompact ? "sm:col-span-8 md:col-span-full lg:col-span-4 xl:col-span-6" : "lg:col-span-8 xl:col-span-full 2xl:col-span-3"}`,
                    input: `text-base`,
                    inputWrapper: "h-full border-2 border-cBgDark-700 !bg-cBgDark-800 hover:!bg-cBgDark-900 h-14",
                }}
                placeholder="Szukaj..."
                startContent={<SvgIcon className="text-sm text-default-500 md:text-lg" icon="solar:magnifer-linear" />}
                endContent={
                    <Button
                        variant="light"
                        radius="sm"
                        className="-mr-1.5 !min-w-fit text-cTextDark-100 hover:!bg-cBgDark-700">
                        <SvgIcon icon="mdi:magnify" className="size-5" />
                    </Button>
                }
            />
            <SortSelect
                options={SORT_JOB_OPTIONS}
                className={`col-span-full ${isCompact ? "sm:col-span-4 md:col-span-4 lg:col-span-3 xl:col-span-2" : "lg:col-span-4 2xl:col-span-3"}`}
                selectedSort={sortBy}
                onSortChange={(val) => handleSortChange(val as SortJobOption)}
            />
        </div>
    );
};

export default LocalJobSearcher;
