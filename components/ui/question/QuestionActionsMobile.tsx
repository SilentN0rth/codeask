'use client';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
} from '@heroui/react';
import React from 'react';
import ShareModal from '../modals/ShareModal';
import { UserInterface } from '@/types/users.types';
import { SvgIcon } from '@/lib/utils/icons';
import { useSidebarContext } from 'context/LeftSidebarContext';

interface QuestionActionsMobileProps {
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

const QuestionActionsMobile: React.FC<QuestionActionsMobileProps> = ({
  user,
  questionAuthor,
  questionSlug,
  status,
  canArchive,
  canClose,
  canReopen,
  isArchived,
  isClosed,
  isSaved,
  handleArchiveQuestion,
  handleUnarchiveQuestion,
  handleCloseQuestion,
  handleReopenQuestion,
  handleSaveToggle,
  handleDeleteQuestion,
}) => {
  const { isOpen: isShareOpen, onOpenChange: onShareOpenChange } =
    useDisclosure();
  const { isCompact } = useSidebarContext();
  const dropdownItems = [];

  if (user && questionAuthor && user.id === questionAuthor.id) {
    if (status === 'opened') {
      dropdownItems.push(
        <DropdownItem
          key="edit"
          as="a"
          href={`/questions/${questionSlug}/edit`}
          startContent={<SvgIcon icon="mdi:pencil" className="size-4" />}
        >
          Edytuj pytanie
        </DropdownItem>
      );
    } else {
      dropdownItems.push(
        <DropdownItem
          key="edit-disabled"
          startContent={
            <SvgIcon icon="cuida:edit-outline" className="size-4" />
          }
        >
          {status === 'archived'
            ? 'Zarchiwizowanych pytań nie można edytować'
            : 'Zamkniętych pytań nie można edytować'}
        </DropdownItem>
      );
    }
  }

  if (
    user &&
    ((questionAuthor && user.id === questionAuthor.id) ||
      (user.is_moderator ?? false))
  ) {
    dropdownItems.push(
      <DropdownItem
        key="delete"
        className="text-danger-500"
        startContent={<SvgIcon icon="mdi:trash-can" className="size-4" />}
        onPress={handleDeleteQuestion}
      >
        Usuń pytanie
      </DropdownItem>
    );
  }

  dropdownItems.push(
    <DropdownItem
      key="share"
      startContent={<SvgIcon icon="mdi:share-variant" className="size-4" />}
      onPress={() => onShareOpenChange()}
    >
      Udostępnij
    </DropdownItem>
  );

  // dropdownItems.push(
  //   <DropdownItem
  //     key="report"
  //     startContent={<SvgIcon icon="mdi:flag" className="size-4" />}
  //     onPress={() => onReportOpenChange()}
  //   >
  //     Zgłoś
  //   </DropdownItem>
  // );

  if (canArchive && !isArchived) {
    dropdownItems.push(
      <DropdownItem
        key="archive"
        startContent={<SvgIcon icon="mdi:archive" className="size-4" />}
        onPress={handleArchiveQuestion}
      >
        Zarchiwizuj pytanie
      </DropdownItem>
    );
  }
  if (canArchive && isArchived) {
    dropdownItems.push(
      <DropdownItem
        key="unarchive"
        startContent={<SvgIcon icon="mdi:archive-remove" className="size-4" />}
        onPress={handleUnarchiveQuestion}
      >
        Cofnij archiwizację
      </DropdownItem>
    );
  }

  if (canClose && !isClosed && !isArchived) {
    dropdownItems.push(
      <DropdownItem
        key="close"
        startContent={<SvgIcon icon="mdi:lock" className="size-4" />}
        onPress={handleCloseQuestion}
      >
        Zamknij pytanie
      </DropdownItem>
    );
  }
  if (canReopen && isClosed) {
    dropdownItems.push(
      <DropdownItem
        key="reopen"
        startContent={<SvgIcon icon="mdi:lock-open" className="size-4" />}
        onPress={handleReopenQuestion}
      >
        Ponownie otwórz pytanie
      </DropdownItem>
    );
  }

  dropdownItems.push(
    <DropdownItem
      key="save"
      startContent={
        <SvgIcon
          icon={
            isSaved
              ? 'material-symbols:bookmark'
              : 'material-symbols:bookmark-outline'
          }
          className="size-4"
        />
      }
      onPress={handleSaveToggle}
    >
      {isSaved ? 'Usuń z zapisanych' : 'Zapisz pytanie'}
    </DropdownItem>
  );

  return (
    <div
      className={`m-[auto_0_auto_auto] lg:hidden ${isCompact ? 'md:hidden' : ''}`}
    >
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-default-500 hover:text-foreground"
            aria-label="Otwórz menu akcji pytania"
          >
            <SvgIcon icon="mdi:dots-vertical" className="text-xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Akcje pytania">{dropdownItems}</DropdownMenu>
      </Dropdown>

      {/* Modals */}
      <ShareModal
        showTrigger={false}
        isOpen={isShareOpen}
        onOpenChange={onShareOpenChange}
      />
      {/* <ReportModal
        type="question"
        targetId={questionId}
        isOpen={isReportOpen}
        onOpenChange={onReportOpenChange}
      /> */}
    </div>
  );
};

export default QuestionActionsMobile;
