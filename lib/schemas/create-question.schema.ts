import { z } from "zod";
function stripHtml(html: string): string {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
}


export const createQuestionSchema = z.object({
    title: z.string().min(10, "Tytuł pytania musi mieć co najmniej 10 znaków").max(100, "Tytuł pytania jest za długi"),

    shortContent: z
        .string()
        .max(300, "Krótki opis pytania jest za długi")
        .optional()
        .refine((val) => val === undefined || val.length === 0 || val.length >= 20, {
            message: "Treść pytania jest zbyt krótka (minimum 20 znaków)",
        }),

    content: z.string().refine(
        (val) => {
            const text = stripHtml(val).trim();
            return text.length >= 50 && text.length <= 5000;
        },
        {
            message: "Zawartość pytania musi mieć od 50 do 5000 znaków ",
        }
    ),

    tags: z
        .array(z.string())
        .min(1, "Pytanie musi mieć co najmniej 1 tag")
        .max(5, "Do pytania możesz dołączyć maksymalnie 5 tagów"),
});

export type CreateQuestionForm = z.infer<typeof createQuestionSchema>;
