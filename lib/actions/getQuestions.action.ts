"use server";

import Question from "database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "database/tag.model";
import { GetQuestionsParams } from "@/types/mongoose/shared.types";
import User from "database/user.model";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        // Connect to DB
        connectToDatabase();
        const questions = await Question.find({})
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .sort({ createdAt: -1 });

        return { questions };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
