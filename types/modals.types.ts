import { reportSchema } from "@/lib/schemas/report.schema";
import z from "zod";
// Report Modal

export type ReportTargetType = "question" | "answer" | "user";

export interface ReportModalProps {
    type: ReportTargetType;
    targetId: string;
}

export type ReportForm = z.infer<typeof reportSchema>;

// Share Modal

export interface ShareModalProps {
    questionId: string;
}
