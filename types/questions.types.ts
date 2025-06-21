import { Tag } from "./tags.types";
import { UserInterface } from "./users.types";

export interface QuestionCardProps {
    title: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
    unlikes: number;
    answers: number;
    shares: number;
    views: number;
    author: UserInterface;
    tags?: Tag[];
    isCompact?: boolean;
}
