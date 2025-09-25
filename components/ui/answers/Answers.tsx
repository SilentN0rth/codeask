'use client';

import AnswerCard from './AnswerCard';
import dynamic from 'next/dynamic';
import Loading from '../Loading';
import { Button, addToast } from '@heroui/react';
import UniversalPagination from '../UniversalPagination';
import { useState, useEffect } from 'react';
import { QuestionCardProps } from '@/types/questions.types';
import {
  addAnswer,
  deleteAnswer,
  updateAnswer,
} from '@/services/server/answers';
import {
  unarchiveQuestion,
  refreshQuestion,
  reopenQuestion,
} from '@/services/client/questions';
import { SvgIcon } from '@/lib/utils/icons';
import { AnswerCardProps } from '@/types/answers.types';
import { usePagination } from '@/hooks/usePagination';
import { useAuthContext } from 'context/useAuthContext';
import { showLoginRequiredToast } from '@/components/ui/toasts/LoginRequiredToast';

const DynamicEditor = dynamic(() => import('@/components/TinyMCE/Editor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-24 justify-center bg-[#0f1113]">
      <Loading />
    </div>
  ),
});

const ANSWERS_PER_PAGE = 20; // Optymalna ilość dla UX i wydajności

export default function Answers({
  question,
  setQuestion,
}: {
  question: QuestionCardProps;
  setQuestion: (q: QuestionCardProps) => void;
}) {
  const { user } = useAuthContext();

  const [isAddingAnswer, setIsAddingAnswer] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [answers, setAnswers] = useState(question.answers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [isReopening, setIsReopening] = useState(false);

  useEffect(() => {
    setAnswers(question.answers);
  }, [question.answers]);

  const {
    paginatedItems: paginatedAnswers,
    currentPage,
    totalPages,
    setPage,
  } = usePagination(answers, ANSWERS_PER_PAGE);

  const handleEditAnswer = (answerToEdit: AnswerCardProps) => {
    setEditingAnswerId(answerToEdit.id);
    setContent(answerToEdit.content as string);
    setIsAddingAnswer(false);
    setError(false);
  };

  const handleDeleteAnswer = async (answerId: string) => {
    try {
      setIsSubmitting(true);
      const success = await deleteAnswer(answerId, question.id);

      if (success) {
        setAnswers((prev) => prev.filter((ans) => ans.id !== answerId));
        void refreshQuestion(question.id, setQuestion);
        addToast({
          title: 'Usunięto odpowiedź',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Błąd',
          description: 'Nie udało się usunąć odpowiedzi',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Coś poszło nie tak',
        color: 'danger',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnswer = async () => {
    if (!content.trim()) {
      setError(true);
      return;
    }

    setIsSubmitting(true);

    if (editingAnswerId) {
      try {
        const response = (await updateAnswer({
          id: editingAnswerId,
          content,
        })) as AnswerCardProps;

        if (response) {
          setAnswers((prev) =>
            prev.map((ans) => (ans.id === editingAnswerId ? response : ans))
          );
          setEditingAnswerId(null);
          setContent('');
          setError(false);
          void refreshQuestion(question.id, setQuestion);
          addToast({
            title: 'Zaktualizowano odpowiedź',
            color: 'success',
          });
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
      setIsSubmitting(false);
    } else {
      const now = Date.now();
      if (lastSubmitTime && now - lastSubmitTime < 5000) {
        addToast({
          title: 'Poczekaj chwilę',
          description: 'Możesz dodać kolejną odpowiedź za kilka sekund',
          color: 'warning',
        });
        setIsSubmitting(false);
        return;
      }

      try {
        const response = (await addAnswer({
          questionId: question.id,
          content,
          authorId: user?.id as string,
        })) as AnswerCardProps;
        if (response) {
          setAnswers((prev) => [...prev, response]);
          setContent('');
          setIsAddingAnswer(false);
          setError(false);
          setLastSubmitTime(now);
          void refreshQuestion(question.id, setQuestion);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
      setIsSubmitting(false);
    }
  };

  const handleUnarchiveQuestion = async () => {
    if (!user) return;

    const isAdmin = user.is_moderator;
    const isAuthor = user.id === question.author.id;

    if (!isAdmin && !isAuthor) {
      addToast({
        title: 'Brak uprawnień',
        description:
          'Tylko moderator lub autor pytania może odblokować archiwizację',
        color: 'danger',
      });
      return;
    }

    try {
      setIsUnarchiving(true);

      const response = await unarchiveQuestion(question.id, user.id);

      if (response.success) {
        const updatedQuestion = { ...question, status: 'opened' as const };
        setQuestion(updatedQuestion);

        setAnswers(updatedQuestion.answers);

        addToast({
          title: 'Pytanie odblokowane',
          description: 'Pytanie zostało przywrócone do stanu otwartego',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Błąd',
          description: response.error ?? 'Nie udało się odblokować pytania',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Nie udało się odblokować pytania',
        color: 'danger',
      });
    } finally {
      setIsUnarchiving(false);
    }
  };

  const handleReopenQuestion = async () => {
    if (!user) return;

    const isModerator = user.is_moderator;

    if (!isModerator) {
      addToast({
        title: 'Brak uprawnień',
        description: 'Tylko moderator może ponownie otworzyć zamknięte pytanie',
        color: 'danger',
      });
      return;
    }

    try {
      setIsReopening(true);

      const response = await reopenQuestion(question.id);

      if (response.success) {
        const updatedQuestion = { ...question, status: 'opened' as const };
        setQuestion(updatedQuestion);

        setAnswers(updatedQuestion.answers);

        addToast({
          title: 'Pytanie ponownie otwarte',
          description:
            'Pytanie zostało ponownie otwarte. Można dodawać odpowiedzi.',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Błąd',
          description:
            response.error ?? 'Nie udało się ponownie otworzyć pytania',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Nie udało się ponownie otworzyć pytania',
        color: 'danger',
      });
    } finally {
      setIsReopening(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {paginatedAnswers.map((answer: AnswerCardProps) =>
        editingAnswerId === answer.id ? (
          <div
            key={answer.id}
            data-error={error}
            className="rounded-xl bg-cBgDark-800 p-4"
          >
            <DynamicEditor
              key={editingAnswerId} // <--- wymusza re-mount edytora przy zmianie edytowanej odpowiedzi
              hasError={error}
              value={content}
              onContentChange={(html: string) => setContent(html)}
              isSubmitting={isSubmitting && editingAnswerId === answer.id}
            />
            {error && (
              <div className="p-1 font-light text-danger text-tiny">
                Treść odpowiedzi jest wymagana
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <Button
                onPress={() => void handleAddAnswer()}
                isDisabled={isSubmitting}
                className="bg-cCta-500 hover:bg-cCta-700"
              >
                Zapisz zmiany
              </Button>
              <Button
                onPress={() => void handleAddAnswer()}
                variant="light"
                isDisabled={isSubmitting}
              >
                Anuluj
              </Button>
            </div>
          </div>
        ) : (
          <AnswerCard
            key={answer.id}
            answer={answer}
            author={answer.author_id === user?.id ? user : undefined}
            onEdit={() => void handleEditAnswer(answer)}
            onDelete={() => void handleDeleteAnswer(answer.id)}
          />
        )
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mx-auto"
            ariaLabel="Przejdź między stronami odpowiedzi"
          />
        </div>
      )}

      {question.status === 'opened' &&
        user &&
        isAddingAnswer &&
        editingAnswerId === null && (
          <div data-error={error}>
            <DynamicEditor
              hasError={error}
              value={content}
              onContentChange={(html: string) => setContent(html)}
              isSubmitting={isSubmitting}
            />
            {error && (
              <div className="p-1 font-light text-danger text-tiny">
                Treść odpowiedzi jest wymagana
              </div>
            )}
          </div>
        )}

      {question.status === 'opened' && (
        <Button
          onPress={() => {
            // Sprawdź autoryzację tylko gdy użytkownik chce rozpocząć dodawanie odpowiedzi
            if (!editingAnswerId && !isAddingAnswer && !user) {
              showLoginRequiredToast({ action: 'dodać odpowiedź' });
              return;
            }

            if (editingAnswerId) {
              void handleAddAnswer();
            } else if (isAddingAnswer) {
              void handleAddAnswer();
            } else {
              setIsAddingAnswer(true);
              setContent('');
              setError(false);
            }
          }}
          className="w-fit bg-cCta-500 hover:bg-cCta-700"
          isDisabled={isSubmitting}
        >
          {editingAnswerId
            ? 'Zapisz zmiany'
            : isAddingAnswer
              ? 'Dodaj odpowiedź'
              : 'Odpowiedz'}
        </Button>
      )}

      {question.status !== 'opened' && (
        <div className="space-y-3">
          <div className="text-cMuted-500 text-small">
            {question.status === 'closed' ? (
              'To pytanie jest zamknięte. Nie można już dodawać odpowiedzi. '
            ) : (
              <>
                To pytanie jest zarchiwizowane. Nie można już dodawać
                odpowiedzi.&nbsp;
                {user &&
                  (user.is_moderator ??
                    (false || user.id === question.author.id)) && (
                    <SvgIcon
                      icon="mdi:archive-minus"
                      className="ml-2 inline size-4 text-gray-400"
                    />
                  )}
              </>
            )}

            {question.status === 'archived' &&
              user &&
              (user.is_moderator ??
                (false || user.id === question.author.id)) && (
                <button
                  onClick={() => void handleUnarchiveQuestion()}
                  disabled={isUnarchiving}
                  className="inline w-fit items-center text-cCta-500 underline decoration-cCta-500/30 transition-colors hover:text-cCta-700 hover:decoration-cCta-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cofnij archiwizację
                </button>
              )}

            {question.status === 'closed' && user && user.is_moderator && (
              <button
                onClick={() => void handleReopenQuestion()}
                disabled={isReopening}
                className="inline w-fit items-center text-cCta-500 underline decoration-cCta-500/30 transition-colors hover:text-cCta-700 hover:decoration-cCta-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ponownie otwórz pytanie
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
