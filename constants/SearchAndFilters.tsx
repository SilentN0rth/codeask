import { SortJobOption, SortQuestionOption, SortTagOption, SortUserOption } from "@/types/searchAndFilters.types";

export const FILTER_OPTIONS = [
    { label: "Użytkownik", value: "user" },
    { label: "Tagi", value: "tags" },
];

export const SORT_QUESTION_OPTIONS: { label: string; value: SortQuestionOption }[] = [
    { label: "Najnowsze", value: "newest" },
    { label: "Najstarsze", value: "oldest" },
    { label: "Odpowiedzi", value: "answers" },
    { label: "Polubienia", value: "likes" },
    { label: "Wyświetlenia", value: "views" },
    { label: "Nazwa (A-Z)", value: "name" },
];

export const SORT_TAG_OPTIONS: { label: string; value: SortTagOption }[] = [
    { label: "Najnowsze", value: "newest" },
    { label: "Najstarsze", value: "oldest" },
    { label: "Popularność", value: "popularity" },
    { label: "Nazwa (A-Z)", value: "name" },
];

export const SORT_USER_OPTIONS: { label: string; value: SortUserOption }[] = [
    { label: "Najnowsi", value: "newest" },
    { label: "Najstarsi", value: "oldest" },
    { label: "Najwięcej odpowiedzi", value: "mostAnswers" },
    { label: "Najwięcej pytań", value: "mostQuestions" },
    { label: "Najwięcej reputacji", value: "mostReputation" },
    { label: "Nazwa (A-Z)", value: "name" },
];

export const SORT_JOB_OPTIONS: { label: string; value: SortJobOption }[] = [
    { label: "Najnowsze", value: "newest" },
    { label: "Najczęściej oglądane", value: "mostViewed" },
    { label: "Najwyższe wynagrodzenie", value: "highestSalary" },
];
