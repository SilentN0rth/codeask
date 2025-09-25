'use server';
import { getTags } from '@/services/server/tags';
import PageClient from './page.client';

type Props = {
  searchParams: Promise<Record<string, string>>;
};

const Page = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const { search, sort, status } = resolvedSearchParams;

  const { tags } = await getTags({ search, sort, status });

  return <PageClient tags={tags || []} />;
};

export default Page;

// "use server";

// import { getQuestions } from "@/services/server/questions";
// import QuestionsPage from "../../components/layout/QuestionsPage";

// export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
//     const { search, sort, filter, value } = searchParams;

//     const { questions } = await getQuestions({ search, sort, filter, value });

//     if (!questions) return <div>Nie udało się załadować pytań.</div>;
//     return <QuestionsPage questions={questions} />;
// }
