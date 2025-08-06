"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { UserInterface } from "@/types/users.types";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ActivityType } from "@/types/activity.types";
import { SvgIcon } from "@/lib/utils/icons";

const iconMap: Record<ActivityType, React.ReactNode> = {
    question: <SvgIcon icon="mdi:comment-question-outline" className="text-cCta-500" width={18} />,
    answer: <SvgIcon icon="mdi:comment-text-multiple-outline" className="text-cCta-500" width={18} />,
    like: <SvgIcon icon="mdi:thumb-up-outline" className="text-success" width={18} />,
    dislike: <SvgIcon icon="mdi:thumb-down-outline" className="text-danger" width={18} />,
    report: <SvgIcon icon="mdi:flag" className="text-danger" width={18} />,
    badge: <SvgIcon icon="mdi:medal-outline" className="text-warning" width={18} />,
    joined: <SvgIcon icon="mdi:calendar-account" className="text-default-500" width={18} />,
    comment: <SvgIcon icon="mdi:comment-outline" className="text-default-400" width={18} />,
    follow: <SvgIcon icon="mdi:account-multiple-plus-outline" className="text-cCta-500" width={18} />,
    mention: <SvgIcon icon="mdi:at" className="text-cCta-500" width={18} />,
};

export default function ProfileLatestActivity({ user }: { user: UserInterface | null }) {
    const recentActivity = user?.recent_activity;

    const sortedActivity = recentActivity
        ? [...recentActivity].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        : [];

    return (
        <Card className="col-span-full border border-divider bg-cBgDark-800 shadow-none">
            <CardBody className="divide-y divide-divider p-0">
                {sortedActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 px-4 py-3 text-sm">
                        {iconMap[activity.type] || (
                            <SvgIcon icon="mdi:help-circle-outline" className="text-default-400" width={18} />
                        )}
                        <div>
                            <p>{activity.description}</p>
                            <p className="text-xs text-default-400">
                                {format(new Date(activity.timestamp), "d MMM yyyy, HH:mm", { locale: pl })}
                            </p>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
}
