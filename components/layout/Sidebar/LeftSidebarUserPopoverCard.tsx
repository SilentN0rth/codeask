import UserTriggerSkeletonPopoverCard from "@/components/ui/cards/UserTriggerSkeletonPopoverCard";
import UserTriggerPopoverCard from "@/components/ui/cards/YourAccountUserCard";
import { useAuthContext } from "context/useAuthContext";
import React from "react";
const LeftSidebarUserPopoverCard = ({ isCompact }: { isCompact: boolean }) => {
    const { user, loading, error = true } = useAuthContext();
    if (loading) return <UserTriggerSkeletonPopoverCard />;
    if (error) return <p>Błąd: {error}</p>;
    return (
        <div>
            <UserTriggerPopoverCard isCompact={isCompact} user={user} />
        </div>
    );
};

export default LeftSidebarUserPopoverCard;
