'use client';

import { loginSchema, LoginForm } from '@/lib/schemas/login-register.schema';
import AuthModal from './AuthModal';
import { useAuthContext } from 'context/useAuthContext';

export default function LoginModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { signIn, user } = useAuthContext();

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      user={user}
      title="Zaloguj się"
      toastTitle="Zalogowano pomyślnie"
      toastDescription="Od teraz możesz przeglądać i zamieszczać treści."
      description="aby móc w pełni korzystać z naszego serwisu"
      schema={loginSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={async (data: LoginForm) => {
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
      }}
      fields={['email', 'password']}
    />
  );
}
