import z from 'zod';

export const reportSchema = z.object({
  reason: z
    .string()
    .min(50, 'Zgłoszenie powinno zawierać co najmniej 50 znaków')
    .max(800, 'Zgłoszenie powinno zawierać od 50 do 800 znaków'),
  email: z.string().email('Niepoprawny adres e-mail'),
});
