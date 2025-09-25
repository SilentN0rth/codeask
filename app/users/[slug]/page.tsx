import { notFound } from 'next/navigation';
import PageProfileClient from './page.client';
import { getUserBySlug } from '@/services/server/users';
import { UserInterface } from '@/types/users.types';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const user = (await getUserBySlug(resolvedParams.slug)) as UserInterface;
  if (!user) {
    notFound();
    return null;
  }

  return <PageProfileClient user={user} />;
}
