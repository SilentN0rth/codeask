import { ReactNode } from "react";

export interface AnswerCardProps {
    answer: {
        id: number;
        author: string;
        avatar: string;
        date: string;
        content: ReactNode;
        likes: number;
        dislikes: number;
    };
}
