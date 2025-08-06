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

// export interface ShareModalProps {
//     questionId: string;
// }

// AuthModal (modals wrapper auth)
type Field = "email" | "password" | "confirmPassword";

export interface AuthModalInterface {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    toastTitle: string;
    toastDescription: string;
    schema: any; // zod schema
    defaultValues: any;
    onSubmit: (data: any) => Promise<void>;
    user: any;
    fields: Field[];
}

// Signing modal
export interface SigningProps {
    isOpen: boolean;
    onClose: () => void;
}
