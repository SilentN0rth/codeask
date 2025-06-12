import { Schema, models, model, Document } from "mongoose";

export interface IQuestion extends Document {
    title: string;
    content: string;
    tags: Schema.Types.ObjectId[]; // Populated as Tag[]
    views: number;
    upvotes: Schema.Types.ObjectId[]; // Populated as User[]
    downvotes: Schema.Types.ObjectId[]; // Populated as User[]
    author: Schema.Types.ObjectId; // Populated as User
    answers: Schema.Types.ObjectId[]; // Populated as Answer[]
    createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
    views: { type: Number, default: 0 },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
    createdAt: { type: Date, default: Date.now },
});

const Question = models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
