import { Skeleton } from "@heroui/react";
import React from "react";

const LeftSidebarAccountSectionSkeleton = () => {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Skeleton className="col-span-2 h-5 w-2/5 rounded-lg" />
            <Skeleton className="col-span-1 h-8  rounded-lg" />
            <Skeleton className="col-span-1 h-8  rounded-lg" />
            <Skeleton className="col-span-2 h-8  rounded-lg" />
        </div>
    );
};

export default LeftSidebarAccountSectionSkeleton;
