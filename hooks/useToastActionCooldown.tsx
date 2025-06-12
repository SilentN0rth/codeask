import { UseToastActionCooldownParams } from "@/types/toasts.types";
import { useState, useCallback } from "react";

export function useToastActionCooldown({
    addToast,
    cooldownMs = 3000,
    disableButton = true,
    onSuccessMessage,
    onFailMessage,
    onSuccess,
    onFail,
}: UseToastActionCooldownParams) {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleClick = useCallback(() => {
        if (isDisabled) return;

        const nextActiveState = !isActive;
        setIsActive(nextActiveState);

        if (disableButton) setIsDisabled(true);

        if (nextActiveState) {
            addToast({
                title: onSuccessMessage.title,
                description: onSuccessMessage.description,
                timeout: onSuccessMessage.timeout ?? cooldownMs,
                icon: onSuccessMessage.icon,
                color: onSuccessMessage.color ?? "primary",
            });
            onSuccess?.();
        } else {
            if (onFailMessage) {
                addToast({
                    title: onFailMessage.title,
                    description: onFailMessage.description,
                    timeout: onFailMessage.timeout ?? cooldownMs,
                    icon: onFailMessage.icon,
                    color: onFailMessage.color ?? "danger",
                });
            }
            onFail?.();
        }

        setTimeout(() => {
            if (disableButton) setIsDisabled(false);
        }, cooldownMs);
    }, [addToast, cooldownMs, disableButton, isDisabled, isActive, onSuccess, onSuccessMessage, onFail, onFailMessage]);

    return {
        isActive,
        isDisabled,
        handleClick,
    };
}
