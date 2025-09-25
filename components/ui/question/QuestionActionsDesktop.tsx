'use client';
import { Button, Tooltip } from '@heroui/react';
import React from 'react';
import ShareModal from '../modals/ShareModal';
import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';
import { useSidebarContext } from 'context/LeftSidebarContext';

interface QuestionActionsDesktopProps {
  user: UserInterface | null;
  questionAuthor: UserInterface | null;
  questionId: string;
  questionSlug: string;
  questionTitle: string;
  status: 'opened' | 'closed' | 'archived';
  canArchive: boolean;
  canClose: boolean;
  canReopen: boolean;
  isArchived: boolean;
  isClosed: boolean;
  isArchiving: boolean;
  isClosing: boolean;
  isSaved: boolean;
  isSaving: boolean;
  handleArchiveQuestion: () => void;
  handleUnarchiveQuestion: () => void;
  handleCloseQuestion: () => void;
  handleReopenQuestion: () => void;
  handleSaveToggle: () => void;
  handleDeleteQuestion: () => void;
}

const QuestionActionsDesktop: React.FC<QuestionActionsDesktopProps> = ({
  user,
  questionAuthor,
  questionSlug,
  status,
  canArchive,
  canClose,
  canReopen,
  isArchived,
  isClosed,
  isArchiving,
  isClosing,
  isSaved,
  isSaving,
  handleArchiveQuestion,
  handleUnarchiveQuestion,
  handleCloseQuestion,
  handleReopenQuestion,
  handleSaveToggle,
  handleDeleteQuestion,
}) => {
  const { isCompact } = useSidebarContext();

  return (
    <div
      className={
        isCompact
          ? 'hidden items-center gap-2 md:flex'
          : 'hidden items-center gap-2 lg:flex'
      }
    >
      {user && questionAuthor && user.id === questionAuthor.id && (
        <>
          {status === 'opened' ? (
            <Tooltip content="Edytuj pytanie">
              <Button
                as="a"
                href={`/questions/${questionSlug}/edit`}
                isIconOnly
                size="sm"
                variant="light"
                className="text-default-500 hover:text-foreground"
              >
                <SvgIcon icon="mdi:pencil" className="text-xl" />
              </Button>
            </Tooltip>
          ) : (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              isDisabled
              aria-label={
                status === 'archived'
                  ? 'Zarchiwizowanych pytań nie można edytować'
                  : 'Zamkniętych pytań nie można edytować'
              }
              className="text-default-500 hover:text-foreground"
            >
              <SvgIcon icon="cuida:edit-outline" className="text-xl" />
            </Button>
          )}
        </>
      )}

      {user &&
        ((questionAuthor && user.id === questionAuthor.id) ??
          user.is_moderator ??
          false) && (
          <Tooltip content="Usuń pytanie">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={handleDeleteQuestion}
              className="text-default-500 hover:bg-danger-500/10 hover:text-danger-500"
            >
              <SvgIcon icon="mdi:trash-can" className="text-xl" />
            </Button>
          </Tooltip>
        )}

      <ShareModal />
      {/* <ReportModal type="question" targetId={questionId} /> */}

      {canArchive && !isArchived && (
        <Tooltip content="Zarchiwizuj pytanie">
          <Button
            isDisabled={isArchiving}
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleArchiveQuestion}
            className="text-default-500 hover:text-cStatusYellow-400"
          >
            <SvgIcon icon="mdi:archive" className="text-xl" />
          </Button>
        </Tooltip>
      )}
      {canArchive && isArchived && (
        <Tooltip content="Cofnij archiwizację pytania">
          <Button
            isDisabled={isArchiving}
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleUnarchiveQuestion}
            className="text-default-500 hover:text-cStatusYellow-400"
          >
            <SvgIcon icon="mdi:archive-remove" className="text-xl" />
          </Button>
        </Tooltip>
      )}

      {canClose && !isClosed && !isArchived && (
        <Tooltip content="Zamknij pytanie">
          <Button
            isDisabled={isClosing}
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleCloseQuestion}
            className="text-default-500 hover:text-red-400"
          >
            <SvgIcon icon="mdi:lock" className="text-xl" />
          </Button>
        </Tooltip>
      )}
      {canReopen && isClosed && (
        <Tooltip content="Ponownie otwórz pytanie">
          <Button
            isDisabled={isClosing}
            isIconOnly
            size="sm"
            variant="light"
            onPress={handleReopenQuestion}
            className="text-gray-500 hover:text-green-400"
          >
            <SvgIcon icon="mdi:lock-open" className="text-xl" />
          </Button>
        </Tooltip>
      )}

      <Tooltip content={isSaved ? 'Usuń z zapisanych' : 'Zapisz pytanie'}>
        <Button
          isDisabled={isSaving}
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleSaveToggle}
          className={`transition-all duration-300 ${
            isSaved
              ? 'bg-cCta-500/20 text-cCta-500 hover:bg-cCta-500/30'
              : 'text-default-500 hover:bg-cCta-500/10 hover:text-cCta-500'
          }`}
        >
          <SvgIcon
            icon={
              isSaved
                ? 'material-symbols:bookmark'
                : 'material-symbols:bookmark-outline'
            }
            className="text-xl"
          />
        </Button>
      </Tooltip>
    </div>
  );
};

export default QuestionActionsDesktop;
