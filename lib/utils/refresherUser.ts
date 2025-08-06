// lib/refreshUser.ts (albo services/client/refreshUser.ts)

import { getUserById } from "@/services/client/users";
import { UserInterface } from "@/types/users.types";

/**
 * Odświeża dane dowolnego użytkownika po ID, niezależnie od kontekstu zalogowania.
 */
export const refreshUser = async (userId: string): Promise<UserInterface | null> => {
    if (!userId) return null;

    try {
        const user = await getUserById(userId);
        return user;
    } catch (error) {
        console.error("Błąd podczas odświeżania użytkownika:", error);
        return null;
    }
};
