import { IUser } from "database/user.model";
import { Schema } from "mongoose";

export interface GetQuestionsParams {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    filter?: string;
}
export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
    views: number;
    upvotes: Schema.Types.ObjectId[]; // można dodać | IUser[] jeśli będzie populated
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId | IUser;
    answers: Schema.Types.ObjectId[]; // lub (Schema.Types.ObjectId | IAnswer)[]
    createdAt: Date;
    updatedAt: Date;
    path: string;
}
