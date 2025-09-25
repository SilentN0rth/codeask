'use client';
import Loading from '@/components/ui/Loading';
import { useAuthContext } from '../../../context/useAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthForm from '@/components/layout/Login/AuthForm';

export default function RegisterPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(`/users/${user.profile_slug}`);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return <AuthForm defaultMode="register" />;
}
