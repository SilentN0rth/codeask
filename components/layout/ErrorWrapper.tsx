"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { ErrorWrapperProps } from "@/types/index.types";

const ErrorWrapper = ({
    title = "Coś poszło nie tak",
    description = "Spróbuj ponownie później lub wróć na stronę główną.",
    icon = "solar:danger-triangle-bold",
    children,
}: ErrorWrapperProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4 gap-4">
            <Icon icon={icon} className="text-red-500 w-12 h-12" />
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-default-500 max-w-md">{description}</p>
            {children}
            <Button as={Link} radius="sm" href="/" className="mt-2">
                Wróć na stronę główną
            </Button>
        </div>
    );
};

export default ErrorWrapper;
