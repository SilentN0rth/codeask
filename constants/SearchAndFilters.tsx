import { TagCardInterface } from "@/types/tags.types";
import { SortJobOption, SortQuestionOption, SortTagOption, SortUserOption } from "@/types/searchAndFilters.types";
import { UserInterface } from "@/types/users.types";

export const FILTER_OPTIONS = [
    { label: "Użytkownik", value: "user" },
    { label: "Tagi", value: "tags" },
    { label: "Kategoria", value: "category" },
];

export const SORT_QUESTION_OPTIONS: { label: string; value: SortQuestionOption }[] = [
    { label: "Data (rosnąco)", value: "dateUpper" },
    { label: "Data (malejąco)", value: "dateLower" },
    { label: "Odpowiedzi", value: "answers" },
    { label: "Polubienia", value: "likes" },
    { label: "Wyświetlenia", value: "views" },
    { label: "Nazwa (A-Z)", value: "name" },
];

export const SORT_TAG_OPTIONS: { label: string; value: SortTagOption }[] = [
    { label: "Data (rosnąco)", value: "dateUpper" },
    { label: "Data (malejąco)", value: "dateLower" },
    { label: "Popularność", value: "popularity" },
    { label: "Nazwa (A-Z)", value: "name" },
];

export const SORT_USER_OPTIONS: { label: string; value: SortUserOption }[] = [
    { label: "Najnowsi", value: "newest" },
    { label: "Najstarsi", value: "oldest" },
    { label: "Najwięcej odpowiedzi", value: "mostAnswers" },
    { label: "Najwięcej punktów", value: "mostPoints" },
    { label: "Nazwa (A-Z)", value: "name" },
];

export const SORT_JOB_OPTIONS: { label: string; value: SortJobOption }[] = [
    { label: "Najnowsze", value: "newest" },
    { label: "Najczęściej oglądane", value: "mostViewed" },
    { label: "Najwyższe wynagrodzenie", value: "highestSalary" },
];

export const FILTER_TAGS: TagCardInterface[] = [
    { id: "React", name: "React", questionCount: 124 },
    { id: "TypeScript", name: "TypeScript", questionCount: 98 },
    { id: "Next.js", name: "Next.js", questionCount: 76 },
    { id: "Node.js", name: "Node.js", questionCount: 54 },
    { id: "Prism.js", name: "Prism.js", questionCount: 76 },
    { id: "Typescript", name: "Typescript", questionCount: 91 },
    { id: "Laravel", name: "Laravel", questionCount: 14 },
    { id: "Python", name: "Python", questionCount: 88 },
];

export const FILTER_CATEGORIES = [
    { id: "Wszystkie", name: "Wszystkie" },
    { id: "Frontend", name: "Frontend" },
    { id: "Backend", name: "Backend" },
    { id: "DevOps", name: "DevOps" },
    { id: "Inne", name: "Inne" },
];
export const USERS: UserInterface[] = [
    {
        id: "1",
        name: "Tony Reichert",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
        bio: "Management w naszym zespole.",
        role: "Management",
        createdAt: "2022-03-16",
        answersCount: 50,
        questionsCount: 14,
        reputation: 284,
    },
    {
        id: "2",
        name: "Zoey Lang",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
        bio: "Development w naszym zespole.",
        role: "Development",
        createdAt: "2021-06-10",
        answersCount: 99,
        questionsCount: 48,
        reputation: 4222,
    },
    {
        id: "3",
        name: "Jane Fisher",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
        bio: "Development w naszym zespole.",
        role: "Development",
        createdAt: "2021-02-16",
        answersCount: 35,
        questionsCount: 33,
        reputation: 4719,
    },
    {
        id: "4",
        name: "William Howard",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
        bio: "Marketing w naszym zespole.",
        role: "Marketing",
        createdAt: "2019-03-25",
        answersCount: 70,
        questionsCount: 47,
        reputation: 4895,
    },
    {
        id: "5",
        name: "Kristen Copper",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
        bio: "Sales w naszym zespole.",
        role: "Sales",
        createdAt: "2023-03-21",
        answersCount: 84,
        questionsCount: 8,
        reputation: 139,
    },
    {
        id: "6",
        name: "Brian Kim",
        avatarUrl: "https://api.dicebear.com/6.x/thumbs/svg?seed=BrianKim",
        bio: "Management w naszym zespole.",
        role: "Management",
        createdAt: "2022-04-19",
        answersCount: 137,
        questionsCount: 9,
        reputation: 3940,
    },
    {
        id: "7",
        name: "Michael Hunt",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
        bio: "Design w naszym zespole.",
        role: "Design",
        createdAt: "2024-05-21",
        answersCount: 109,
        questionsCount: 0,
        reputation: 4171,
    },
    {
        id: "8",
        name: "Samantha Brooks",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
        bio: "HR w naszym zespole.",
        role: "HR",
        createdAt: "2021-01-12",
        answersCount: 5,
        questionsCount: 9,
        reputation: 3025,
    },
    {
        id: "9",
        name: "Frank Harrison",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
        bio: "Użytkownik w naszym zespole.",
        role: "Użytkownik",
        createdAt: "2020-06-11",
        answersCount: 118,
        questionsCount: 37,
        reputation: 2825,
    },
    {
        id: "10",
        name: "Emma Adams",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
        bio: "Operations w naszym zespole.",
        role: "Operations",
        createdAt: "2024-03-10",
        answersCount: 131,
        questionsCount: 30,
        reputation: 3888,
    },
    {
        id: "11",
        name: "Brandon Stevens",
        avatarUrl: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
        bio: "Development w naszym zespole.",
        role: "Development",
        createdAt: "2021-05-18",
        answersCount: 33,
        questionsCount: 50,
        reputation: 2238,
    },
];
