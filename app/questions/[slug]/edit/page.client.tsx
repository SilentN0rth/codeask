'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditQuestionForm from './EditQuestionForm';
import Loading from '@/components/ui/Loading';
import { QuestionCardProps } from '@/types/questions.types';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

interface EditQuestionProps {
  question: QuestionCardProps;
}

export default function EditQuestion({ question }: EditQuestionProps) {
  const { user, loading } = useAuthRedirect();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && question.author.id !== user.id) {
      router.replace('/questions');
    }

    if (!loading && user && question.status !== 'opened') {
      router.replace('/questions');
    }
  }, [loading, user, router, question.author.id, question.status]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <Loading />
      </div>
    );
  }

  if (question.author.id !== user.id) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="mb-4 text-4xl text-danger-500">⛔</div>
        <h2 className="mb-2 text-xl font-semibold text-danger-500">
          Brak uprawnień
        </h2>
        <p className="text-default-500">
          Nie masz uprawnień do edycji tego pytania.
        </p>
      </div>
    );
  }

  if (question.status !== 'opened') {
    return (
      <div className="p-8 text-center">
        <p>
          {question.status === 'archived'
            ? 'Zarchiwizowanych pytań nie można edytować.'
            : 'Zamkniętych pytań nie można edytować.'}
        </p>
      </div>
    );
  }

  return <EditQuestionForm question={question} userId={user.id} />;
}
