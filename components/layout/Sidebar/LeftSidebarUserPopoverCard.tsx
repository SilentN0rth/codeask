import UserTriggerPopoverCard from "@/components/ui/cards/YourAccountUserCard";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React from "react";

const LeftSidebarUserPopoverCard = ({ isCompact }: { isCompact: boolean }) => {
    return (
        <>
            <SignedIn>
                <div>
                    <UserTriggerPopoverCard isCompact={isCompact} />
                </div>
            </SignedIn>
            <SignedOut>
                <div>
                    <UserTriggerPopoverCard isLoggedOut isCompact={isCompact} />
                </div>
            </SignedOut>
        </>
    );
};

export default LeftSidebarUserPopoverCard;
