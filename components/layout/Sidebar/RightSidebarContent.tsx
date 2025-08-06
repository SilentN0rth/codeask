// import { getQuestions } from "@/lib/actions/getQuestions";
// import { QuestionCardProps } from "@/types/questions.types";
import { getNewestQuestions } from "@/services/server/questions";
import ClientRightSidebarContent from "./ClientRightSidebarContent"; // nowy komponent
import { getTags } from "@/services/server/tags";

const RightSidebarContent = async () => {
    const { tags } = await getTags();
    const { questions } = await getNewestQuestions();

    return <ClientRightSidebarContent questions={questions} tags={tags} />;
};

export default RightSidebarContent;
