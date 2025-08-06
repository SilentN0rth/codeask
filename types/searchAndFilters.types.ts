import { ReactNode } from "react";

export interface ChooseButtonFilterProps {
    selectedFilter: string;
    className?: string;
    onFilterChange: (value: string) => void;
}

export type FilterProps = {
    className?: string;
    value: string;
    onChange: (val: string) => void;
};

type CommonOptions = "newest" | "oldest" | "name";

export type SortQuestionOption = CommonOptions | "answers" | "likes" | "views";

export type SortTagOption = CommonOptions | "popularity";

export type SortUserOption = CommonOptions | "mostAnswers" | "mostQuestions" | "mostReputation";

export type SortJobOption = "newest" | "mostViewed" | "highestSalary";

export type SortFilterProps = {
    selectedSort: SortQuestionOption;
    className?: string;
    onSortChange: (sort: SortQuestionOption) => void;
};

export type BasicItem = {
    id: number | string;
    name: string;
    [key: string]: any; // ← pozwala na avatar, team itd.
};

export type UniversalFilterProps<T extends BasicItem> = {
    items: T[];
    value: string;
    onChange: (val: string) => void;
    className?: string;
    ariaLabel: string;
    renderItem?: (item: T) => ReactNode;
};

export interface TaskInterface {
    id: string;
    title: string;
    description: string;
    points: number;
    difficulty: "easy" | "medium" | "hard";
    tags: string[];
    // category: "frontend" | "backend" | "fullstack" | "devops" | "general";
    status: "available" | "completed" | "locked";
    createdAt: string;
    updatedAt: string;
    estimatedTimeMinutes?: number;
    prerequisites?: string[];
    rewardDescription?: string;
    isDaily?: boolean;
}

export type SortOption = {
    label: string;
    value: string;
};

export type SortSelectProps = {
    options: SortOption[];
    selectedSort: string;
    onSortChange: (value: string) => void;
    className?: string;
};
