"use client";
// global-error.tsx: obsługuje błędy globalnie, dla całej aplikacji gdy brak lokalnego error.tsx. Jeśli nie znajdzie eror.tsx, to renderuje ten.

import React from "react";

const GlobalError = ({ error }: { error: Error }) => {
    return <h1>Coś poszło bardzo źle: {error.message}</h1>;
};

export default GlobalError;
