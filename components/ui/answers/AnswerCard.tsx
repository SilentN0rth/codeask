"use client";

import UserPopover from "../popovers/UserPopover";
import ReportModal from "../modals/ReportModal";
import LikeDislikeButtons from "../LikeDislikeButtons";
import { AnswerCardProps } from "@/types/answers.types";

const AnswerCard = ({ answer }: AnswerCardProps) => {
    return (
        <div className="relative w-full rounded-xl border border-default-100 bg-cBgDark-800 p-4">
            <UserPopover isAnswer={true} subText={"Dodano odpowiedź: 2 godziny temu"} />

            <div className="prose prose-sm prose-invert mb-4 max-w-none text-default-600">{answer.content}</div>

            <div className="flex gap-2">
                <LikeDislikeButtons initialLikes={answer.likes} initialDislikes={answer.dislikes} />

                <ReportModal type="answer" targetId={answer.id as unknown as string} />
            </div>
        </div>
    );
};

export default AnswerCard;
