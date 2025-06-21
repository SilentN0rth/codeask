"use client";

import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSidebarContext } from "context/LeftSidebarContext";
import { ClassName } from "@/types/index.types";
import { SortQuestionOption } from "@/types/searchAndFilters.types";
import SortSelect from "../filters/SortSelect";
import ChooseButtonFilter from "../filters/ChooseButtonFilter";
import UserFilter from "../filters/UserFilter";
import TagsFilter from "../filters/TagsFilter";
import CategoryFilter from "../filters/CategoryFilter";
import { SORT_QUESTION_OPTIONS } from "@/constants/SearchAndFilters";
import { useLocalSearch } from "hooks/useLocalSearch";

const LocalQuestionSearcher = ({ className }: ClassName) => {
    const { isCompact } = useSidebarContext();

    const { searchInput, handleSearchChange, sortBy, handleSortChange, customValues, updateCustomValue } =
        useLocalSearch<SortQuestionOption>({
            initialSearch: true,
            initialSort: true,
            customParams: ["filter", "value"],
        });

    const selectedFilter = customValues.filter;
    const filterValue = customValues.value;

    const renderFilterComponent = () => {
        const commonProps = {
            value: filterValue,
            onChange: (val: string) => updateCustomValue("value", val),
            className: `col-span-7 ${
                isCompact
                    ? "sm:col-span-8 md:col-span-4 lg:col-span-3 xl:col-span-2"
                    : "lg:col-span-8 xl:col-span-4 2xl:col-span-3"
            }`,
        };

        switch (selectedFilter) {
            case "user":
                return <UserFilter {...commonProps} />;
            case "tags":
                return <TagsFilter {...commonProps} />;
            case "category":
                return <CategoryFilter {...commonProps} />;
            default:
                return null;
        }
    };

    return (
            <div className={`grid grid-cols-12 place-content-end gap-2 ${className}`}>
                <Input
                    aria-label="Search"
                    value={searchInput}
                    onValueChange={handleSearchChange}
                    radius="sm"
                    classNames={{
                        base: `col-span-12 flex h-full gap-2 ${isCompact ? "sm:col-span-8 md:col-span-full lg:col-span-4 xl:col-span-6" : "lg:col-span-8 xl:col-span-full 2xl:col-span-3"}`,
                        input: "text-base",
                        inputWrapper: "h-full border-2 border-cBgDark-700 !bg-cBgDark-800 hover:!bg-cBgDark-900 h-14",
                    }}
                    placeholder="Szukaj..."
                    startContent={<Icon className="text-sm text-default-500 md:text-lg" icon="solar:magnifer-linear" />}
                    endContent={
                        <Button
                            variant="light"
                            radius="sm"
                            className="-mr-1.5 !min-w-fit text-cTextDark-100 hover:!bg-cBgDark-700">
                            <Icon icon="mdi:magnify" className="size-5" />
                        </Button>
                    }
                />
                <SortSelect
                    options={SORT_QUESTION_OPTIONS}
                    className={`col-span-full ${isCompact ? "sm:col-span-4 md:col-span-4 lg:col-span-3 xl:col-span-2" : "lg:col-span-4 2xl:col-span-3"}`}
                    selectedSort={sortBy}
                    onSortChange={(val) => handleSortChange(val as SortQuestionOption)}
                />
                <ChooseButtonFilter
                    className={`col-span-5 ${isCompact ? "sm:col-span-4 md:col-span-4 lg:col-span-2 xl:col-span-2" : "lg:col-span-4 2xl:col-span-3"}`}
                    selectedFilter={selectedFilter}
                    onFilterChange={(val) => updateCustomValue("filter", val)}
                />
                {renderFilterComponent()}
            </div>
    );
};

export default LocalQuestionSearcher;
