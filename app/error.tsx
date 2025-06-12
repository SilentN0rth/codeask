"use client";
import React from "react";
// error.tsx: obsługuje błędy lokalnie, tylko dla konkretnej trasy (folderu).
const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
    return (
        <div>
            <h2>Wystąpił błąd! {error ? "BŁĄD" : ""}</h2>
            <button onClick={reset}>Spróbuj ponownie</button>
        </div>
    );
};

export default Error;
