import { Skeleton } from "@heroui/react";
import React from "react";
import UserTriggerSkeletonPopoverCard from "../cards/UserTriggerSkeletonPopoverCard";

const AnswerSkeleton = () => {
    return (
        <div className="flex-column gap-4">
            <UserTriggerSkeletonPopoverCard longSubText={true} />
            <Skeleton className="flex h-4 w-full rounded-lg" />
            <div className="flex h-8 gap-2">
                <Skeleton className="flex h-full w-16 rounded-lg" />
                <Skeleton className="flex h-full w-16 rounded-lg" />
                <Skeleton className="flex h-full w-8 rounded-lg" />
            </div>
        </div>
    );
};

export default AnswerSkeleton;
