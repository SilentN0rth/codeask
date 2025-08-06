import { getQuestionById } from "@/services/server/questions";
import { notFound, redirect } from "next/navigation";
import QuestionPageClient from "./page.client";

export default async function QuestionPage({ params }: { params: { slug: string; id: string } }) {
    const question = await getQuestionById(params.id);

    if (!question) return notFound();

    if (question.question_slug !== params.slug) {
        redirect(`/questions/${params.id}/${question.question_slug}`);
    }

    return <QuestionPageClient question={question} />;
}
