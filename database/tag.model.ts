import { Schema, models, model, Document } from "mongoose";

export interface ITag extends Document {
    name: string;
    popularity: number;
    createdAt: Date;
}

const TagSchema = new Schema<ITag>({
    name: { type: String, required: true, unique: true },
    popularity: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Tag = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
