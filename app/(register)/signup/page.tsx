"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { signUp, signInWithProvider } from "@/services/server/auth";
import { profile } from "console";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function RegisterPage() {
    const { user, loading } = useCurrentUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const router = useRouter();

    // Po udanej rejestracji (kiedy mamy profil) przekieruj na profil użytkownika
    useEffect(() => {
        if (profile) {
            const nameSlug = profile.name.toLowerCase().replace(/\s+/g, ".");
            router.push(`/profile/${user?.id}/${nameSlug}`);
        }
    }, [profile, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoadingAction(true);

        try {
            const { error } = await signUp(email, password);
            if (error) throw error;
            // Nie musisz tu robić redirectu — to zrobi useEffect po zmianie profile
        } catch (err: any) {
            setErrorMsg(err.message || "Nieznany błąd rejestracji.");
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (profile) {
        return (
            <div className="mx-auto max-w-sm p-4">
                <p>Zalogowany jako: {profile.name}</p>
                {/* Tu możesz dodać przycisk do wylogowania, jeśli chcesz */}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-sm p-4">
            <h2 className="mb-4 text-xl font-bold">Rejestracja</h2>

            <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2 w-full rounded border p-2"
            />

            <input
                type="password"
                placeholder="Hasło"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 w-full rounded border p-2"
            />

            {errorMsg && <p className="mb-2 text-red-600">{errorMsg}</p>}

            <button
                type="submit"
                disabled={loadingAction}
                className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
                {loadingAction ? "Proszę czekać..." : "Zarejestruj się"}
            </button>

            <hr className="my-4" />

            <div className="flex justify-center gap-4">
                <button
                    type="button"
                    onClick={() => signInWithProvider("google")}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                    Google
                </button>
                <button
                    type="button"
                    onClick={() => signInWithProvider("github")}
                    className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-900">
                    GitHub
                </button>
                <button
                    type="button"
                    onClick={() => signInWithProvider("facebook")}
                    className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
                    Facebook
                </button>
            </div>
        </form>
    );
}
