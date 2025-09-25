'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateQuestion from './page.client';
import Loading from '@/components/ui/Loading';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

export default function Page() {
  const { user, loading } = useAuthRedirect();

  const router = useRouter();

  useEffect(() => {
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loading />
      </div>
    );
  }

  return <CreateQuestion userId={user?.id as string} />;
}
