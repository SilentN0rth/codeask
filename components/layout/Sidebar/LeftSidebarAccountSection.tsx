import { cn } from "@heroui/react";
import React from "react";
import LeftSidebarSignedInLoginButtons from "./LeftSidebarSignedInLoginButtons";
import LeftSidebarSignedOutLoginButtons from "./LeftSidebarSignedOutLoginButtons";
import LeftSidebarUtilityButtons from "./LeftSidebarUtilityButtons";

const LeftSidebarAccountSection = ({ isCompact, toggleCompact }: { isCompact: boolean; toggleCompact: () => void }) => {
    return (
        <div className={`relative`}>
            <span className={`text-tiny text-foreground-500  ${isCompact ? "sidebar-compact-headings mr-4" : "mb-1"}`}>
                Konto
            </span>
            <div
                className={cn("mt-auto flex flex-col", {
                    "items-center px-2": isCompact,
                    "gap-xsmall ": !isCompact,
                })}>
                <LeftSidebarSignedOutLoginButtons isCompact={isCompact} />
                <LeftSidebarSignedInLoginButtons isCompact={isCompact} />

                <LeftSidebarUtilityButtons toggleCompact={toggleCompact} isCompact={isCompact} />
            </div>
        </div>
    );
};

export default LeftSidebarAccountSection;
