/* eslint-disable no-undef */
import { useEffect, useRef } from "react";
import { supabase } from "supabase/supabaseClient";

const OFFLINE_TIMEOUT = 5 * 60 * 1000; // 5 minut w ms
const HEARTBEAT_INTERVAL = 30 * 1000; // 30 sekund

export function useUserOnlineStatus(userId: string | null) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

    // Ustaw status offline w bazie
    const setOffline = () => {
        if (!userId) return;

        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify({ userId })], { type: "application/json" });
            navigator.sendBeacon("/api/set-offline", blob);
        } else {
            supabase
                .from("users")
                .update({ is_online: false })
                .eq("id", userId)
                .then(({ error }) => {
                    if (error) console.error("Błąd aktualizacji offline:", error);
                    else console.log("Ustawiono offline (fallback) dla userId:", userId);
                });
        }
    };

    // Ustaw status online + aktualizuj last_sign_in_at
    const setOnline = () => {
        if (!userId) return;
        supabase
            .from("users")
            .update({ is_online: true, last_sign_in_at: new Date().toISOString() })
            .eq("id", userId)
            .then(({ error }) => {
                if (error) console.error("Błąd aktualizacji online:", error);
                else console.log("Ustawiono online dla userId:", userId);
            });
    };

    // Reset timer na offline (aktywność użytkownika)
    const resetOfflineTimer = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            console.log("Brak aktywności - ustawiam offline");
            setOffline();
        }, OFFLINE_TIMEOUT);
    };

    useEffect(() => {
        if (!userId) return;

        // Na wejściu: ustaw online i start heartbeat
        setOnline();
        resetOfflineTimer();

        heartbeatRef.current = setInterval(() => {
            setOnline();
        }, HEARTBEAT_INTERVAL);

        const activityEvents = ["mousemove", "keydown", "scroll", "touchstart"];
        activityEvents.forEach((event) => window.addEventListener(event, resetOfflineTimer));

        window.addEventListener("beforeunload", setOffline);

        // Dodaj tutaj
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setOffline();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            activityEvents.forEach((event) => window.removeEventListener(event, resetOfflineTimer));
            window.removeEventListener("beforeunload", setOffline);
            document.removeEventListener("visibilitychange", handleVisibilityChange);

            setOffline();
        };
    }, [userId]);
}
