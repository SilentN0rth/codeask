import z from "zod";

export const loginSchema = z.object({
    email: z.string().email("Niepoprawny email"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        email: z.string().email("Niepoprawny email"),
        password: z.string().min(6, "Hasło musi mieć minimum 6 znaków"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Hasła muszą być takie same",
        path: ["confirmPassword"],
    });

export type RegisterForm = z.infer<typeof registerSchema>;
