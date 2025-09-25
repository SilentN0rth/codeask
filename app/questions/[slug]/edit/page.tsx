'use server';

import { getQuestionBySlug } from '@/services/server/questions';
import { notFound } from 'next/navigation';
import EditQuestion from './page.client';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const question = await getQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  return <EditQuestion question={question} />;
}
