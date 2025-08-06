"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Tooltip } from "@heroui/react";
import { UserInterface } from "@/types/users.types";
import { SvgIcon } from "@/lib/utils/icons";
import { getRelativeTimeFromNow } from "@/lib/utils/getRelativeTimeFromNow";

const UserCard: React.FC<{ user: UserInterface | null }> = ({ user }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <Card
            shadow="none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex-column items-stretch justify-between gap-3 rounded-xl border border-transparent bg-neutral-800/20 p-4 text-cTextDark-100 transition-[border] hover:border-divider">
            <CardHeader className="flex w-full items-center justify-between gap-4 p-0">
                <div className="flex items-start gap-3">
                    <Avatar src={user?.avatar_url} radius="lg" size="sm" className="size-10 bg-transparent" />
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-default-600">{user?.name}</p>
                        {user?.specialization && <p className="text-xs text-default-500">{user.specialization}</p>}
                    </div>
                </div>
                <p className="text-right text-xs text-default-500">
                    Dołączył: {getRelativeTimeFromNow(user!.created_at)}
                </p>
            </CardHeader>

            <CardBody className="flex flex-col gap-2  p-0 text-[0.85rem] text-default-500">
                {user?.bio ? (
                    <p className="line-clamp-3">{user.bio}</p>
                ) : (
                    <p className="italic text-default-400">Użytkownik nie podał biografii.</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm font-medium text-default-500">
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:message-outline" className="text-lg" />
                        {user?.answers_count} odpowiedzi
                    </span>
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:help-circle-outline" className="text-lg" />
                        {user?.questions_count} pytań
                    </span>
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:star-outline" className="text-lg" />
                        {user?.reputation} punktów
                    </span>
                </div>
            </CardBody>

            <CardFooter className="relative overflow-visible p-0 pt-2">
                <Tooltip content="Zobacz profil">
                    <Link
                        href={`/users/${user?.id}/${user?.profile_slug}`}
                        aria-label="Zobacz profil użytkownika"
                        className={`absolute bottom-0 right-0 flex items-center justify-center rounded-lg border border-default-500 p-1 text-default-500 transition-[transform,opacity,border,color] duration-300 hover:border-cCta-500 hover:text-cCta-500 ${
                            hovered ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-12 opacity-0"
                        }`}>
                        <SvgIcon icon="mdi:arrow-right" className="text-xl" />
                    </Link>
                </Tooltip>
            </CardFooter>
        </Card>
    );
};

export default UserCard;
