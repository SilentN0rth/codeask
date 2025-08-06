/* eslint-disable camelcase */
"use client";

import { Avatar, Card, CardBody, CardFooter, CardHeader, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import { TagItem } from "../tags/TagItem";
import Link from "next/link";
import { QuestionCardProps } from "@/types/questions.types";
import { getLocalTimeString } from "@/lib/utils/getLocalTimeString";
import { getRelativeTimeFromNow } from "@/lib/utils/getRelativeTimeFromNow";
import { SvgIcon } from "@/lib/utils/icons";

export const QuestionCard: React.FC<QuestionCardProps> = ({
    id,
    title,
    question_slug,
    short_content,
    created_at,
    updated_at,
    likes_count,
    unlikes_count,
    answers_count,
    shares_count,
    views_count,
    author,
    tags,
}) => {
    const [hovered, setHovered] = useState(false);
    const localTime = getLocalTimeString(created_at);
    const activityTime = getRelativeTimeFromNow(updated_at);

    return (
        <Card
            shadow="none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="flex-column  items-stretch justify-between gap-2 rounded-xl border border-transparent bg-neutral-800/20  p-4 text-cTextDark-100   !transition-[border] odd:bg-cBgDark-800 hover:border-divider">
            <CardHeader className="flex w-full items-center justify-between  p-0">
                <div className="flex items-start gap-3">
                    <Avatar src={author?.avatar_url} radius={"sm"} size="sm" className="h-9 w-6" />
                    <div className="flex-column">
                        <p className="text-sm font-medium text-default-600">{author?.name}</p>
                        <p className="text-xs font-medium text-default-500">{author?.specialization}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end text-right text-xs text-default-500">
                    <span>Utworzono pytanie: {localTime}</span>
                    {updated_at && <span className="text-default-400">Aktywność: {activityTime}</span>}
                    <span className="text-green-500">Status: otwarte</span>
                </div>
            </CardHeader>

            <CardBody className="flex-column gap-3 p-0">
                <Link
                    href={`/questions/`}
                    className={`w-fit border-l-2 border-transparent text-base font-semibold transition-[color,border,padding] hover:text-slate-300  ${hovered ? " !border-cCta-500 pl-2.5" : ""}`}>
                    {title}
                </Link>
                <p className="line-clamp-4 max-w-96 text-[0.82rem] text-default-500">{short_content}</p>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <TagItem
                                className="px-3 py-1 text-xs"
                                key={tag.id}
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
                        <SvgIcon icon="mdi:thumb-up-outline" width={18} />
                        {likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:thumb-down-outline" width={18} />
                        {unlikes_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:message-outline" width={18} />
                        {answers_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:share-variant" width={18} />
                        {shares_count}
                    </span>
                    <span className="flex items-center gap-1">
                        <SvgIcon icon="mdi:eye-outline" width={18} />
                        {views_count}
                    </span>
                </div>

                <Tooltip content="Przejdź do pytania">
                    <Link
                        href={`/questions/${id}/${question_slug}`}
                        aria-label="Przejdź do pytania"
                        className={`
                            absolute bottom-4 right-4 flex items-center justify-center
                            rounded-lg border border-default-500
                            p-1
                            transition-[transform,opacity,border,color] duration-300 hover:border-cCta-500 hover:text-cCta-500
                            ${hovered ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-12 opacity-0"}
                            text-default-500
                           
                            `}>
                        <SvgIcon icon="mdi:arrow-right" width={20} />
                    </Link>
                </Tooltip>
            </CardFooter>
        </Card>
    );
};
