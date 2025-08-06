"use client";


import AuthModal from "./AuthModal";
import { registerSchema, RegisterForm } from "@/lib/schemas/login-register.schema";
import { useAuthContext } from "context/useAuthContext";

export default function RegisterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { signUp, user } = useAuthContext();

    return (
        <AuthModal
            isOpen={isOpen}
            onClose={onClose}
            user={user}
            title="Zarejestruj się"
            toastTitle="Zarejestrowano pomyślnie"
            toastDescription="Sprawdź skrzynke pocztową, na którą wysłany został link weryfikacyjny."
            description="Utwórz nowe konto, aby zacząć korzystać z serwisu"
            schema={registerSchema}
            defaultValues={{ email: "", password: "", confirmPassword: "" }} // np. jeśli masz confirm
            onSubmit={async (data: RegisterForm) => {
                const { error } = await signUp(data.email, data.password);
                if (error) throw error;
            }}
            fields={["email", "password", "confirmPassword"]}
        />
    );
}
