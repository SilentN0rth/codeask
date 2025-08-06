"use client";

import { Popover, PopoverTrigger, Avatar, Button, PopoverContent } from "@heroui/react";
import { ReactNode, useState } from "react";
import ProfileCardFull from "../cards/profile/ProfileCardFull";
import { UserInterface } from "@/types/users.types";

const UserPopover = ({
    subText = "",
    className,
    isAnswer = false,
    author,
}: {
    className?: string;
    subText?: ReactNode;
    author: UserInterface | null;
    isAnswer?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover isOpen={isOpen} size="lg" onOpenChange={setIsOpen}>
            <PopoverTrigger>
                <Button
                    disableAnimation
                    disableRipple
                    radius="none"
                    className={`flex !scale-100 items-center gap-3  border-l-3 border-transparent !bg-transparent p-2 pl-0 text-left !transition-all ${isOpen && isAnswer ? "border-cCta-500 !pl-3" : "hover:border-cCta-500 hover:!pl-3"} ${isAnswer ? "!mb-3" : ""}`}
                    aria-expanded={isOpen}>
                    <Avatar size="sm" src={author?.avatar_url} alt="avatar" />
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold text-cTextDark-100">{author?.name}</span>
                        <span className="text-xs text-default-400">{subText}</span>
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className={`${className} w-full border border-divider p-0 shadow-lg`}>
                <ProfileCardFull author={author}  />
            </PopoverContent>
        </Popover>
    );
};

export default UserPopover;
