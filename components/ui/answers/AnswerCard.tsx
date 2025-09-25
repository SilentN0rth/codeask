'use client';

import { useEffect, useState } from 'react';
import UserPopover from '../popovers/UserPopover';
import LikeDislikeButtons from '../LikeDislikeButtons';
import { AnswerCardProps } from '@/types/answers.types';
import { getRelativeTimeFromNow } from '@/lib/utils/getRelativeTimeFromNow';
import { getUserById } from '@/services/client/users';
import { UserInterface } from '@/types/users.types';
import AnswerSkeleton from './AnswerSkeleton';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  addToast,
} from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import ReportButton from '../modals/ReportButton';

const AnswerCard = ({
  answer,
  author: initialAuthor,
  onEdit,
  onDelete,
}: {
  answer: AnswerCardProps;
  author?: UserInterface;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const [author, setAuthor] = useState<UserInterface | null>(
    initialAuthor ?? null
  );
  const [loading, setLoading] = useState(!initialAuthor);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (author || !answer.author_id) return;

      setLoading(true);
      try {
        const user = await getUserById(answer.author_id);
        setAuthor(user);
      } finally {
        setLoading(false);
      }
    };

    void fetchAuthor();
  }, [answer.author_id, author]);
  const handleCopyLink = () => {
    const url = new URL(pathname, window.location.origin);

    searchParams.forEach((value, key) => {
      if (key !== 'answer') {
        url.searchParams.set(key, value);
      }
    });

    url.hash = `answer-${answer.id}`;

    void navigator.clipboard.writeText(url.toString());
    addToast({
      title: 'Skopiowano link',
      color: 'success',
    });
  };

  return (
    <div
      className="group relative w-full overflow-hidden rounded-xl border border-default-100 bg-cBgDark-800 p-4"
      id={`answer-${answer.id}`}
    >
      <div className="absolute right-4 top-4">
        <Dropdown shadow="none">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <SvgIcon
                icon="mdi:dots-vertical"
                className="size-5 text-default-400"
              />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Opcje odpowiedzi" variant="flat">
            <DropdownItem
              key="edit"
              startContent={<SvgIcon icon="mdi:pencil" className="size-4" />}
              onClick={onEdit}
            >
              Edytuj
            </DropdownItem>
            <DropdownItem
              key="copy"
              startContent={<SvgIcon icon="line-md:link" className="size-4" />}
              onClick={handleCopyLink}
            >
              Kopiuj link
            </DropdownItem>
            {/* <DropdownItem
              key="report"
              startContent={
                <SvgIcon icon="mdi:flag" className="size-4 text-danger" />
              }
              className="text-danger"
              onPress={onOpenChange}
            >
              Zgłoś
            </DropdownItem> */}

            <DropdownItem
              key="delete"
              startContent={
                <SvgIcon icon="mdi:trash-can" className="size-4 text-danger" />
              }
              className="text-danger"
              onClick={onDelete}
            >
              Usuń
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {/* <ReportModal
        type={'answer'}
        targetId={answer.id}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      /> */}
      {loading ? (
        <AnswerSkeleton />
      ) : (
        <>
          <UserPopover
            author={author}
            className="max-w-screen-xsm"
            isAnswer
            subText={
              <>
                Dodano odpowiedź: {getRelativeTimeFromNow(answer.created_at)}
                &nbsp;
                {answer.updated_at && (
                  <span className="text-gray-600">(edytowano)</span>
                )}
              </>
            }
          />

          <div
            className="prose prose-sm prose-invert mb-4 max-w-none text-default-600"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: answer.content as string }}
          />

          <div className="flex gap-2">
            <LikeDislikeButtons
              initialLikes={answer.likes_count}
              initialDislikes={answer.dislikes_count}
              answerId={answer.id}
            />
            <ReportButton type="answer" targetId={answer.id} />
          </div>
        </>
      )}
      {answer.updated_at && (
        <p className="-bottom-4 right-4 mt-2 place-self-end text-xs text-cMuted-500 transition-[bottom] group-hover:bottom-3 sm:absolute">
          Edytowano:&nbsp;
          <span className="text-success-500">
            {getRelativeTimeFromNow(answer.updated_at)}
          </span>
        </p>
      )}
    </div>
  );
};

export default AnswerCard;
