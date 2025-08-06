"use client";

import React from "react";
import { Button, Tooltip, useDisclosure, addToast } from "@heroui/react";
import { SvgIcon } from "@/lib/utils/icons";
import { ReportTargetType } from "@/types/modals.types";
import { useToastActionCooldown } from "hooks/useToastActionCooldown";

import { ReportModal } from "./ReportModal";

type ReportButtonProps = {
    type: ReportTargetType;
    targetId: string;
};

const getTitle = (type: ReportTargetType) => {
    switch (type) {
        case "question":
            return "Zgłoś pytanie";
        case "answer":
            return "Zgłoś odpowiedź";
        case "user":
            return "Zgłoś użytkownika";
        default:
            return "Zgłoszenie";
    }
};

export const ReportButton: React.FC<ReportButtonProps> = ({ type, targetId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { isActive: isReported } = useToastActionCooldown({
        addToast,
        disableButton: true,
        cooldownMs: 5000,
        onSuccessMessage: {
            title: "Zgłoszenie wysłane",
            description: "Dziękujemy za zgłoszenie. Zostanie ono niezwłocznie przeanalizowane.",
            icon: <SvgIcon icon="solar:shield-check-bold" />,
        },
        onFailMessage: {
            title: "Zgłoszenie już było wysłane",
            description: "To zgłoszenie zostało już przyjęte.",
            icon: <SvgIcon icon="solar:shield-check-outline" />,
        },
    });

    return (
        <>
            <Tooltip content={isReported ? "Zgłoszono" : getTitle(type)}>
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={isReported ? undefined : onOpen}
                    className={isReported ? "text-danger-500" : "text-default-500 hover:text-danger"}
                    isDisabled={isReported}>
                    <SvgIcon icon="mdi:flag" className="text-xl" />
                </Button>
            </Tooltip>

            <ReportModal type={type} targetId={targetId} isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
};

export default ReportButton;
