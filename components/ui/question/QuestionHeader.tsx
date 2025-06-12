"use client";
import { addToast, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";
import ReportModal from "../modals/ReportModal";
import ShareModal from "../modals/ShareModal";
import { useToastActionCooldown } from "hooks/useToastActionCooldown";
import UserPopover from "../popovers/UserPopover";

const QuestionHeader = () => {
    const {
        isActive: isSaved,
        isDisabled,
        handleClick,
    } = useToastActionCooldown({
        addToast,
        cooldownMs: 3000,
        disableButton: true,
        onSuccessMessage: {
            title: "Pytanie oznaczone jako zapisane",
            description: "Możesz je teraz znaleźć na swojej liście zapisanych pytań.",
            icon: <Icon icon="carbon:checkmark-filled" />,
        },
        onFailMessage: {
            title: "Odznaczyłeś zapisane pytanie",
            description: "Pytanie nie będzie wyświetlane na liście zapisanych pytań.",
            icon: <Icon icon="carbon:close-filled" />,
        },
    });

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <UserPopover subText={"Opublikowano: 2 godziny temu"} />

            <div className="flex items-center gap-2">
                <ShareModal questionId="question-789" />
                <ReportModal type="question" targetId="question-789" />
                <Tooltip content={isSaved ? "Zapisano" : "Zapisz pytanie"}>
                    <Button
                        isDisabled={isDisabled}
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleClick}
                        className={isSaved ? "text-cCta-500" : "text-default-500"}>
                        <Icon icon="stash:save-ribbon" className="text-xl" />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default QuestionHeader;
