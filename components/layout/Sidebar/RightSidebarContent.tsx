import { getQuestions } from "@/lib/actions/getQuestions.action";
import { QuestionCardProps } from "@/types/questions.types";
import ClientRightSidebarContent from "./ClientRightSidebarContent"; // nowy komponent

const RightSidebarContent = async () => {
    const result = await getQuestions({});
    const questions: QuestionCardProps[] = JSON.parse(JSON.stringify(result.questions));

    return <ClientRightSidebarContent questions={questions} />;
};

export default RightSidebarContent;
