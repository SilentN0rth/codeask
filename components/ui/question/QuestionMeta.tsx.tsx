/* eslint-disable camelcase */
import { Button } from "@heroui/react";
import Link from "next/link";
import LikeDislikeButtons from "../LikeDislikeButtons";
import SlideUpText from "../effects/SlideUpText";
import { QuestionCardProps } from "@/types/questions.types";
import { getLocalTimeString } from "@/lib/utils/getLocalTimeString";
import { SvgIcon } from "@/lib/utils/icons";

const QuestionMeta = ({ question }: { question: QuestionCardProps | null }) => {
    if (!question) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-y-3 text-sm text-default-500">
            <ul className="flex text-sm text-default-600">
                {question.updated_at ? (
                    <li>
                        <p>
                            Edytowano:&nbsp;
                            <SlideUpText className="text-default-500">
                                {getLocalTimeString(question.updated_at)}
                            </SlideUpText>
                        </p>
                    </li>
                ) : (
                    ""
                )}
                <li className={`${question.updated_at ? "ml-7 list-disc " : ""}`}>
                    <p>
                        Wyświetlono: <SlideUpText className="text-default-500">{question.views_count} razy</SlideUpText>
                    </p>
                </li>
            </ul>

            <div className="flex flex-wrap items-center gap-x-2 text-default-500">
                <LikeDislikeButtons initialLikes={question.likes_count} initialDislikes={question.unlikes_count} />
                <Button
                    as={Link}
                    href="#answers"
                    size="sm"
                    variant="light"
                    className="flex min-w-fit items-center gap-1.5 px-2.5 text-default-600 hover:text-foreground"
                    startContent={<SvgIcon icon="solar:chat-dots-linear" width={20} />}>
                    {question.answers_count} <span className="hidden lg:inline-block">odpowiedzi</span>
                </Button>
            </div>
        </div>
    );
};

export default QuestionMeta;
