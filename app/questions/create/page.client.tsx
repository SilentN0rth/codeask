"use client";

import PageTitle from "@/components/ui/PageTitle";
import QuestionForm from "@/components/layout/Questions/QuestionForm";

export default function CreateQuestion({ userId }: { userId: string }) {
    

    return (
        <div className="wrapper flex-column gap-y-3">
            <PageTitle title="Utwórz pytanie" className="mb-3" />
            <QuestionForm userId={userId} />
        </div>
    );
}
