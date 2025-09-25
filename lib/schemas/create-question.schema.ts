import { z } from 'zod';
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

export const createQuestionSchema = z.object({
  title: z
    .string()
    .min(10, 'Tytuł pytania musi mieć co najmniej 10 znaków')
    .max(100, 'Tytuł pytania jest za długi'),

  shortContent: z
    .string()
    .min(20, 'Krótki opis pytania musi mieć co najmniej 20 znaków')
    .max(150, 'Krótki opis pytania jest za długi'),
  content: z.string().refine(
    (val) => {
      const text = stripHtml(val).trim();
      return text.length <= 5000;
    },
    {
      message: 'Zawartość pytania nie może mieć więcej niż 5000 znaków ',
    }
  ),

  tags: z
    .array(z.string())
    .max(5, 'Do pytania możesz dołączyć maksymalnie 5 tagów'),
});

export type CreateQuestionForm = z.infer<typeof createQuestionSchema>;
