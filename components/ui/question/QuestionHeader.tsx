"use client";
import { addToast, Button, Tooltip } from "@heroui/react";
import React from "react";
import ReportModal from "../modals/ReportButton";
import ShareModal from "../modals/ShareModal";
import { useToastActionCooldown } from "hooks/useToastActionCooldown";
import UserPopover from "../popovers/UserPopover";
import { UserInterface } from "@/types/users.types";
import { SvgIcon } from "@/lib/utils/icons";

const QuestionHeader = ({
    questionAuthor,
    questionId,
    time,
}: {
    questionAuthor: UserInterface | null;
    questionId: string;
    time: string;
}) => {
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
            icon: <SvgIcon icon="carbon:checkmark-filled" />,
        },
        onFailMessage: {
            title: "Odznaczyłeś zapisane pytanie",
            description: "Pytanie nie będzie wyświetlane na liście zapisanych pytań.",
            icon: <SvgIcon icon="carbon:close-filled" />,
        },
    });

    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
            <UserPopover className="!max-w-[600px]" author={questionAuthor} subText={`Utworzono pytanie: ${time}`} />

            <div className="flex items-center gap-2">
                <ShareModal />
                <ReportModal type="question" targetId={questionId} />
                <Tooltip content={isSaved ? "Zapisano" : "Zapisz pytanie"}>
                    <Button
                        isDisabled={isDisabled}
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={handleClick}
                        className={isSaved ? "text-cCta-500" : "text-default-500"}>
                        <SvgIcon icon="stash:save-ribbon" className="text-xl" />
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default QuestionHeader;
