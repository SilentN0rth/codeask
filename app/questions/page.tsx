"use server";
import { getQuestions } from "@/lib/actions/getQuestions.action";
import QuestionsPage from "../../components/layout/QuestionsPage";
import { QuestionCardProps } from "@/types/questions.types";

export default async function Page() {
    const result = await getQuestions({});
    const questions: QuestionCardProps[] = JSON.parse(JSON.stringify(result.questions));
    return <QuestionsPage questions={questions} />;
}
