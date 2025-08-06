/* eslint-disable camelcase */
"use client";
import { SvgIcon } from "@/lib/utils/icons";
import { QuestionCardProps } from "@/types/questions.types";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

const DesktopMenuNewestQuestions = ({ questions }: { questions: QuestionCardProps[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <ul className="hidden flex-col 3xl:flex">
            {questions.map((question, index) => {
                const isHovered = hoveredIndex === index;
                return (
                    <motion.li
                        key={question.id}
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
                            href={`/questions/${question.id}/${question.question_slug}`}
                            className={`group relative block w-full rounded-md p-3 text-sm transition-[padding] hover:pl-4 can-hover:hover:bg-cCta-500/5`}>
                            <p className="flex items-center">
                                {question.title}
                                <SvgIcon
                                    icon="mdi:arrow-right"
                                    className="absolute right-5 top-1/2 size-4 -translate-y-1/2 text-cCta-500 opacity-0 transition-all duration-200 can-hover:group-hover:translate-x-2 can-hover:group-hover:opacity-100"
                                />
                            </p>
                        </Link>
                    </motion.li>
                );
            })}
        </ul>
    );
};

export default DesktopMenuNewestQuestions;
