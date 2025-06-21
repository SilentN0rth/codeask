"use client";

import { Avatar, Card, CardBody, CardFooter, CardHeader, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { TagItem } from "../tags/TagItem";
import Link from "next/link";
import { QuestionCardProps } from "@/types/questions.types";
import { getLocalTimeString } from "@/lib/utils/getLocalTimeString";
import { getRelativeTimeFromNow } from "@/lib/utils/getRelativeTimeFromNow";

export const QuestionCard: React.FC<QuestionCardProps> = ({
    title,
    createdAt,
    likes,
    unlikes,
    answers,
    shares,
    views,
    author,
    updatedAt,
    tags,
    isCompact = false,
}) => {
    const [hovered, setHovered] = useState(false);
    const localTime = getLocalTimeString(createdAt);
    const activityTime = getRelativeTimeFromNow(updatedAt ?? createdAt);

    return (
        <Card
            shadow="none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex-column  items-stretch justify-between gap-2 rounded-xl border border-transparent bg-neutral-800/20  p-4 text-cTextDark-100   !transition-[border] odd:bg-cBgDark-800 hover:border-divider">
            <CardHeader className="flex w-full items-center justify-between  p-0">
                <div className="flex items-start gap-3">
                    <Avatar src={author.avatarUrl} radius={"sm"} size="sm" className="h-9 w-6" />
                    <div className="flex-column">
                        <p className="text-sm font-medium text-default-600">{author.name}</p>
                        <p className="text-xs font-medium text-default-500">Frontend Developer</p>
                    </div>
                </div>
                <div className="flex flex-col items-end text-right text-xs text-default-500">
                    <span>Opublikowano: {localTime}</span>
                    <span className="text-default-400">Aktywność: {activityTime}</span>
                    <span className="text-green-500">Status: otwarte</span>
                </div>
            </CardHeader>

            <CardBody className="flex-column gap-3 p-0">
                <Link
                    href={`/questions/`}
                    className={`w-fit border-l-2 border-transparent text-base font-semibold transition-[color,border,padding] hover:text-slate-300  ${hovered ? " !border-cCta-500 pl-2.5" : ""}`}>
                    {title}
                </Link>
                <p className="line-clamp-4 max-w-96 text-[0.82rem] text-default-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum est, commodi veritatis sed eos omnis
                    unde obcaecati numquam id cumque, ipsa repudiandae nisi. Vitae? Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Natus dolores vitae saepe architecto molestias voluptas itaque nobis
                    eligendi recusandae praesentium?
                </p>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <TagItem
                                className="px-3 py-1 text-xs"
                                key={tag._id}
                                label={tag.name}
                                href={`/tags/${tag.name}`}
                            />
                        ))}
                    </div>
                )}
            </CardBody>

            <CardFooter className="mt-2 overflow-visible p-0 text-sm text-default-500 ">
                <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                        <Icon icon="mdi:thumb-up-outline" className="text-lg" />
                        {likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon icon="mdi:thumb-down-outline" className="text-lg" />
                        {unlikes}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon icon="mdi:message-outline" className="text-lg" />
                        {answers}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon icon="mdi:share-variant" className="text-lg" />
                        {shares}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon icon="mdi:eye-outline" className="text-lg" />
                        {views}
                    </span>
                </div>

                <Tooltip content="Przejdź do pytania">
                    <Link
                        href={`/questions`}
                        aria-label="Przejdź do pytania"
                        className={`
                            absolute bottom-4 right-4 flex items-center justify-center
                            rounded-lg border border-default-500
                            p-1
                            transition-[transform,opacity,border,color] duration-300 hover:border-cCta-500 hover:text-cCta-500
                            ${hovered ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-12 opacity-0"}
                            text-default-500
                           
                            `}>
                        <Icon icon="mdi:arrow-right" className="text-xl" />
                    </Link>
                </Tooltip>
            </CardFooter>
        </Card>
    );
};
