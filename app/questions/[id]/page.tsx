import { getQuestionById } from "@/services/server/questions";
import { redirect } from "next/navigation";

interface Props {
    params: { id: string };
}

export default async function Page({ params }: Props) {
    const question = await getQuestionById(params.id);

    if (!question) {
        redirect("/questions");
    }

    redirect(`/questions/${params.id}/${question.question_slug}`);
}
