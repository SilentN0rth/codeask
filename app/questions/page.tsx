"use server";

import { getQuestions } from "@/services/server/questions";
import QuestionsPage from "../../components/layout/QuestionsPage";
import { getUsers } from "@/services/server/users";

export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
    const { search, sort, filter, value } = searchParams;

    const { questions } = await getQuestions({ search, sort, filter, value });
    const users = await getUsers();

    if (!questions) return <div>Nie udało się załadować pytań.</div>;
    return <QuestionsPage questions={questions} users={users} />;
}
