"use server";

import Question from "database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "database/tag.model";
import { CreateQuestionParams } from "@/types/mongoose/shared.types";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        // Connect to DB
        connectToDatabase();

        const { title, content, tags, views, upvotes, downvotes, author, answers, createdAt, updatedAt, path } = params;
        const question = await Question.create({
            title,
            content,
            views,
            upvotes,
            downvotes,
            answers,
            createdAt,
            updatedAt,
            author,
        });
        const tagDocuments = [];
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { question: question._id } },
                { upsert: true, new: true }
            );
            tagDocuments.push(existingTag._id);
        }
        await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagDocuments } } });
        revalidatePath(path);
    } catch (error) {}
}
