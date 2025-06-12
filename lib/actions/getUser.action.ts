"use server";

import User from "database/user.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "database/question.model";
// import path from "path";

export async function getUserById(params: any) {
    try {
        connectToDatabase();
        const { userId } = params;
        const user = await User.findOne({ clerkId: userId });
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createUser(userData: any) {
    try {
        connectToDatabase();
        const newUser = await User.create(userData);
        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function updateUser(params: any) {
    try {
        connectToDatabase();
        const { clerkId, updateData, path } = params;
        await User.findOneAndUpdate({ clerkId }, updateData, {
            new: true,
        });
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(params: any) {
    try {
        connectToDatabase();

        const { clerkId } = params;
        const user = await User.findOneAndDelete({ clerkId });
        if (!user) {
            throw new Error("User not found");
        }
        // const userQuestionIds = await Question.find({ author: user._id }).distinct("_id");

        await Question.deleteMany({ author: user._id });

        const deletedUser = await User.findById(user._id);
        return deletedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
