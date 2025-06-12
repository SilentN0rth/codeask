import { QuestionCardProps } from "@/types/questions.types";
import Link from "next/link";
import React from "react";

const MobileMenuNewestQuestions = ({ questions }: { questions: QuestionCardProps[] }) => {
    return (
        <ul className=" 3xl:hidden">
            {questions.slice(0, 10).map(({ title }) => (
                <li key={title} className="flex text-sm transition-colors hover:text-cCta-500">
                    <Link className="py-2 " href="#">
                        {title}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default MobileMenuNewestQuestions;
