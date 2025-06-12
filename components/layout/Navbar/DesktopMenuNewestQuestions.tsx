"use client";
import { QuestionCardProps } from "@/types/questions.types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

const DesktopMenuNewestQuestions = ({ questions }: { questions: QuestionCardProps[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <ul className="hidden flex-col 3xl:flex">
            {questions.map(({ title, likes, unlikes, views }, index) => {
                const isHovered = hoveredIndex === index;
                return (
                    <motion.li
                        key={title}
                        layout
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="relative overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute left-0 top-0 h-full w-[2px] rounded-r bg-cCta-500"
                        />

                        <Link
                            href="#"
                            className="relative flex flex-col rounded-lg p-3 transition-all can-hover:hover:ml-5 can-hover:hover:bg-cCta-500 can-hover:hover:px-5 can-hover:hover:py-2">
                            <motion.div
                                initial={false}
                                animate={{
                                    opacity: isHovered ? 1 : 0,
                                    height: isHovered ? "auto" : 0,
                                    marginBottom: isHovered ? 4 : 0,
                                }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                style={{ overflow: "hidden" }}
                                className="flex gap-x-3 text-xs text-cTextDark-100 ">
                                <span className="flex items-center gap-1">
                                    <Icon icon="mdi:eye" /> {views}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Icon icon="mdi:like" /> {likes}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Icon icon="mdi:dislike" /> {unlikes}
                                </span>
                            </motion.div>
                            <span className="line-clamp-1">{title}</span>
                        </Link>
                    </motion.li>
                );
            })}
        </ul>
    );
};

export default DesktopMenuNewestQuestions;
