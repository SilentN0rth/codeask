import { getQuestionBySlug } from '@/services/server/questions';
import { notFound } from 'next/navigation';
import QuestionPageClient from './page.client';

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const question = await getQuestionBySlug(resolvedParams.slug);

  if (!question) return notFound();

  return <QuestionPageClient question={question} />;
}
