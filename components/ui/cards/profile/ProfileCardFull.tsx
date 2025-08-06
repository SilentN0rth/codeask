"use client";

import { UserInterface } from "@/types/users.types";
import { Card, CardBody, Link, Skeleton } from "@heroui/react";
import ProfileCardHeader from "./ProfileCardHeader";
import ProfileCardMetaSection from "./ProfileCardMetaSection";
import ProfileCardStats from "./ProfileCardStats";
import ProfileCardTabs from "./ProfileCardTabs";
import ProfileCardBadges from "./ProfileCardBadges";
import { SvgIcon } from "@/lib/utils/icons";
import { useEffect, useState } from "react";
import { getUserById } from "@/services/client/users";

type TabKey = "profile" | "activity" | "stats";

export default function ProfileCardFull({
    author: initialAuthor,
    className,
    enabledTabs = ["profile", "activity", "stats"],
}: {
    author: UserInterface | null;
    className?: string;
    isFollowing?: boolean;
    enabledTabs?: TabKey[];
}) {
    const tabs = [
        { key: "profile", label: "Profil", href: `/profile`, icon: "ph:user-bold" },
        { key: "activity", label: "Aktywność", href: "/users/activity", icon: "mdi:clock-outline" },
        { key: "stats", label: "Statystyki", href: "/users/stats", icon: "mdi:chart-bar" },
    ];
    const visibleTabs = tabs.filter((tab) => enabledTabs.includes(tab.key as TabKey));
    const [isLoading, setIsLoading] = useState(true);
    const [author, setAuthor] = useState<UserInterface | null>(null);
    const [refreshToggle, setRefreshToggle] = useState(false);
    useEffect(() => {
        (async () => {
            if (!initialAuthor?.id) return;
            const user = await getUserById(initialAuthor?.id);
            setAuthor(user);
            setIsLoading(false);
        })();
    }, [initialAuthor?.id, refreshToggle]); // dodajemy refreshToggle jako zależność

    const handleFollowChanged = async () => {
        if (!author?.id) return;
        const updatedUser = await getUserById(author.id);
        setAuthor(updatedUser);

        // wymusz rerender, zmieniając toggle
        setRefreshToggle((prev) => !prev);
    };

    return isLoading ? (
        <Card
            className={`group relative z-10 flex w-screen max-w-screen-sm flex-col overflow-hidden   border border-divider bg-cBgDark-800 text-white shadow-none`}>
            <div className="px-6 py-7">
                <Skeleton className="h-10 w-24 place-self-end rounded-md" />
                <div className="grid grid-cols-[auto,1fr] gap-5">
                    <Skeleton className="size-16 rounded-full" />
                    <div className="flex w-full flex-col gap-y-3">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="col-span-full flex flex-col gap-y-5">
                        <Skeleton className="h-24 w-full" />
                        <div className="flex flex-col gap-y-3">
                            <Skeleton className="h-3 w-1/3" />
                            <Skeleton className="h-3 w-1/5" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-5 w-1/3" />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            <Skeleton className="col-span-full h-3" />
                            <Skeleton className="col-span-1 h-5" />
                            <Skeleton className="col-span-1 h-5" />
                            <Skeleton className="col-span-1 h-5" />
                            <Skeleton className="col-span-1 h-5" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                <Skeleton className="col-span-1 h-14" />
                <Skeleton className="col-span-1 h-14" />
                <Skeleton className="col-span-1 h-14" />
                <Skeleton className="col-span-1 h-10" />
                <Skeleton className="col-span-1 h-10" />
                <Skeleton className="col-span-1 h-10" />
            </div>
        </Card>
    ) : (
        <Card
            className={`group relative z-10 overflow-visible border border-divider bg-cBgDark-800  pt-3 text-white shadow-none ${className}`}>
            <ProfileCardHeader isLoading={isLoading} author={author} onFollowChanged={handleFollowChanged} />
            <CardBody className="flex-column gap-y-4 px-6 text-sm text-gray-300">
                <ProfileCardMetaSection author={author} />
                <ProfileCardBadges user={author} />
            </CardBody>

            <ProfileCardStats author={author} />
            <ProfileCardTabs tabs={visibleTabs} />
        </Card>
    );
}

export function ProfileMeta({ icon, text, className }: { icon: string; text: string; className?: string }) {
    return (
        <span className={`block break-all text-sm ${className}`}>
            <SvgIcon icon={icon} width={18} className="mr-1.5 inline" />
            <span>{text}</span>
        </span>
    );
}

export function ProfileLink({ href }: { href: string }) {
    const displayUrl = href.replace(/^https?:\/\//, "");
    const shortened = displayUrl.length > 40 ? displayUrl.slice(0, 37).trimEnd() + "…" : displayUrl;

    return (
        <Link
            href={href}
            isExternal
            className="flex w-fit !min-w-fit max-w-full items-center text-sm text-cCta-500 hover:underline"
            title={displayUrl}>
            <SvgIcon icon="solar:link-bold" className="mr-2 text-medium" />
            <span className="max-w-[220px] truncate">{shortened}</span>
        </Link>
    );
}
