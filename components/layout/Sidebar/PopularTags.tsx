/* eslint-disable camelcase */
"use client";

import { AccordionItem, Accordion } from "@heroui/react";
import { SvgIcon } from "@/lib/utils/icons";
import React, { useEffect, useState } from "react";
import { Tag } from "@/types/tags.types";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
    tags: Tag[];
};

const PopularTags = ({ tags }: Props) => {
    const params = useParams();
    const pathname = usePathname();

    const isOnTagPage = pathname.startsWith("/tags");

    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

    useEffect(() => {
        if (isOnTagPage) {
            setSelectedTagId(params?.id as string);
        }
    }, [isOnTagPage, params?.id]);

    const activeTagId = selectedTagId;

    return (
        <ul className="flex-column">
            {tags.slice(0, 10).map(({ id, name, question_count }) => {
                const isActive = activeTagId === id;

                return isActive ? (
                    <Accordion
                        as={"li"}
                        key={id}
                        defaultExpandedKeys={["0"]}
                        className="!px-0"
                        itemClasses={{
                            content: "ml-5 py-0 flex-column gap-y-1",
                            trigger:
                                "h-[40px] my-1 !px-3 bg-cCta-500/10 rounded-md  rounded-l-none border-l-2 border-cCta-500",
                        }}>
                        <AccordionItem
                            key={"0"}
                            aria-label={`tag-${name}`}
                            title={
                                <div className="flex w-full items-center justify-between text-sm text-cCta-500">
                                    <p>#{name}</p>
                                    <p className="text-xs text-cMuted-300">{question_count}</p>
                                </div>
                            }>
                            {[0, 1, 2].map((item) => (
                                <Link
                                    key={item}
                                    href={`/questions/id/name`}
                                    className={`group relative block w-full rounded-md bg-cCta-500/5 p-3 text-sm transition-[padding] hover:pl-4`}>
                                    <p className="flex items-center">
                                        Jak wycentrować div?
                                        <SvgIcon
                                            icon="mdi:arrow-right"
                                            className="absolute right-5 top-1/2 size-4 -translate-y-1/2 text-cCta-500 opacity-0 transition-all duration-200 group-hover:translate-x-2 group-hover:opacity-100"
                                        />
                                    </p>
                                </Link>
                            ))}
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <li key={id}>
                        <button
                            onClick={() => setSelectedTagId(id)}
                            className={`group relative my-0.5 flex h-[40px] w-full items-center justify-between gap-1 rounded-md px-3 py-1.5 text-sm text-cTextDark-100 transition-colors duration-200`}>
                            <span className="absolute left-0 top-0 h-full w-0.5 scale-y-50 rounded bg-cCta-500 opacity-0 transition-all duration-200 group-hover:scale-y-100 group-hover:opacity-100" />
                            <p>#{name}</p>
                            <p className="text-xs text-cMuted-300">{question_count}</p>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default PopularTags;
