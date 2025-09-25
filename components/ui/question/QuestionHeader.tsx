'use client';
import { addToast } from '@heroui/react';
import React, { useState, useEffect } from 'react';
import UserPopover from '../popovers/UserPopover';
import QuestionActionsDesktop from './QuestionActionsDesktop';
import QuestionActionsMobile from './QuestionActionsMobile';
import { UserInterface } from '@/types/users.types';
import { useAuthContext } from 'context/useAuthContext';
import {
  archiveQuestion,
  unarchiveQuestion,
  closeQuestion,
  reopenQuestion,
  deleteQuestion,
} from '@/services/client/questions';
import {
  saveQuestion,
  unsaveQuestion,
  isQuestionSaved,
} from '@/services/client/savedQuestions';
import DeleteQuestionModal from '../modals/DeleteQuestionModal';
import { useRouter } from 'next/navigation';
import { showLoginRequiredToast } from '@/components/ui/toasts/LoginRequiredToast';

const QuestionHeader = ({
  questionAuthor,
  questionId,
  questionSlug,
  questionTitle,
  time,
  status,
  onStatusChange,
}: {
  questionAuthor: UserInterface | null;
  questionId: string;
  questionSlug: string;
  questionTitle: string;
  time: string;
  status: 'opened' | 'closed' | 'archived';
  onStatusChange: (newStatus: 'opened' | 'closed' | 'archived') => void;
}) => {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (user) {
        const saved = await isQuestionSaved(questionId);
        setIsSaved(saved);
      }
    };
    void checkSavedStatus();
  }, [questionId, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      showLoginRequiredToast({ action: 'zapisać pytanie' });
      return;
    }

    setIsSaving(true);
    try {
      if (isSaved) {
        const result = await unsaveQuestion(questionId);
        if (result.success) {
          setIsSaved(false);
          addToast({
            title: 'Pytanie usunięte z zapisanych',
            description:
              'Pytanie nie będzie wyświetlane na liście zapisanych pytań.',
            color: 'success',
          });
        } else {
          addToast({
            title: 'Błąd',
            description:
              result.error ?? 'Nie udało się usunąć pytania z zapisanych',
            color: 'danger',
          });
        }
      } else {
        const result = await saveQuestion(questionId);
        if (result.success) {
          setIsSaved(true);
          addToast({
            title: 'Pytanie zapisane',
            description:
              'Możesz je teraz znaleźć na swojej liście zapisanych pytań.',
            color: 'success',
          });
        } else {
          addToast({
            title: 'Błąd',
            description: result.error ?? 'Nie udało się zapisać pytania',
            color: 'danger',
          });
        }
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Wystąpił nieoczekiwany błąd podczas zapisywania pytania',
        color: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const canArchive = user?.is_moderator;
  const isArchived = status === 'archived';
  const isClosed = status === 'closed';

  const canClose =
    user && (user.is_moderator ?? user.id === questionAuthor?.id);

  const canReopen = user?.is_moderator;

  const handleArchiveQuestion = async () => {
    if (!canArchive) return;

    try {
      setIsArchiving(true);

      const response = await archiveQuestion(questionId, user.id);

      if (response.success) {
        onStatusChange('archived');
        addToast({
          title: 'Pytanie zarchiwizowane',
          description: 'Pytanie zostało przeniesione do archiwum',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Błąd',
          description: response.error ?? 'Nie udało się zarchiwizować pytania',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Nie udało się zarchiwizować pytania',
        color: 'danger',
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUnarchiveQuestion = async () => {
    if (!canArchive) return;

    try {
      setIsArchiving(true);

      const response = await unarchiveQuestion(questionId, user.id);

      if (response.success) {
        onStatusChange('opened');
        addToast({
          title: 'Archiwizacja cofnięta',
          description: 'Pytanie zostało ponownie otwarte',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Błąd',
          description: response.error ?? 'Nie udało się cofnąć archiwizacji',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Nie udało się cofnąć archiwizacji',
        color: 'danger',
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const handleCloseQuestion = async () => {
    if (!canClose) return;

    try {
      setIsClosing(true);

      const response = await closeQuestion(questionId);

      if (response.success) {
        onStatusChange('closed');
        addToast({
          title: 'Pytanie zamknięte',
          description:
            'Pytanie zostało zamknięte. Nie można już dodawać odpowiedzi.',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Błąd',
          description: response.error ?? 'Nie udało się zamknąć pytania',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Nie udało się zamknąć pytania',
        color: 'danger',
      });
    } finally {
      setIsClosing(false);
    }
  };

  const handleReopenQuestion = async () => {
    if (!canReopen) return;

    try {
      setIsClosing(true);

      const response = await reopenQuestion(questionId);

      if (response.success) {
        onStatusChange('opened');
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
      setIsClosing(false);
    }
  };

  const handleDeleteQuestion = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!user) {
      addToast({
        title: 'Błąd',
        description: 'Musisz być zalogowany, aby usunąć pytanie',
        color: 'danger',
      });
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteQuestion(questionId);

      if (result.success) {
        addToast({
          title: 'Sukces',
          description: 'Pytanie zostało usunięte',
          color: 'success',
        });

        setTimeout(() => {
          router.replace('/questions');
        }, 1000);
      } else {
        addToast({
          title: 'Błąd',
          description: result.error ?? 'Nie udało się usunąć pytania',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Błąd',
        description: 'Nie udało się usunąć pytania',
        color: 'danger',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <UserPopover
        className="!max-w-[600px]"
        author={questionAuthor}
        subText={`Pytanie utworzone: ${time}`}
      />

      <QuestionActionsDesktop
        user={user}
        questionAuthor={questionAuthor}
        questionId={questionId}
        questionSlug={questionSlug}
        questionTitle={questionTitle}
        status={status}
        canArchive={!!canArchive}
        canClose={!!canClose}
        canReopen={!!canReopen}
        isArchived={isArchived}
        isClosed={isClosed}
        isArchiving={isArchiving}
        isClosing={isClosing}
        isSaved={isSaved}
        isSaving={isSaving}
        handleArchiveQuestion={() => void handleArchiveQuestion()}
        handleUnarchiveQuestion={() => void handleUnarchiveQuestion()}
        handleCloseQuestion={() => void handleCloseQuestion()}
        handleReopenQuestion={() => void handleReopenQuestion()}
        handleSaveToggle={() => void handleSaveToggle()}
        handleDeleteQuestion={handleDeleteQuestion}
      />

      <QuestionActionsMobile
        user={user}
        questionAuthor={questionAuthor}
        questionId={questionId}
        questionSlug={questionSlug}
        questionTitle={questionTitle}
        status={status}
        canArchive={!!canArchive}
        canClose={!!canClose}
        canReopen={!!canReopen}
        isArchived={isArchived}
        isClosed={isClosed}
        isArchiving={isArchiving}
        isClosing={isClosing}
        isSaved={isSaved}
        isSaving={isSaving}
        handleArchiveQuestion={() => void handleArchiveQuestion()}
        handleUnarchiveQuestion={() => void handleUnarchiveQuestion()}
        handleCloseQuestion={() => void handleCloseQuestion()}
        handleReopenQuestion={() => void handleReopenQuestion()}
        handleSaveToggle={() => void handleSaveToggle()}
        handleDeleteQuestion={handleDeleteQuestion}
      />

      <DeleteQuestionModal
        questionTitle={questionTitle}
        questionAuthor={questionAuthor ?? undefined}
        currentUser={user ?? undefined}
        onConfirm={() => void handleConfirmDelete()}
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default QuestionHeader;
