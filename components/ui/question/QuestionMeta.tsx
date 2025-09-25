/* eslint-disable camelcase */
import { Button, Tooltip } from '@heroui/react';
import Link from 'next/link';
import LikeDislikeButtons from '../LikeDislikeButtons';
import { QuestionCardProps } from '@/types/questions.types';
import { SvgIcon } from '@/lib/utils/icons';

const QuestionMeta = ({ question }: { question: QuestionCardProps | null }) => {
  if (!question) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-3 text-sm text-default-500">
      <div className="m-[auto_0_auto_auto] flex flex-wrap items-center gap-x-1">
        <LikeDislikeButtons
          initialLikes={question.likes_count}
          initialDislikes={question.unlikes_count}
          questionId={question.id}
        />
        <Tooltip
          content={`${question.answers_count} odpowiedzi`}
          placement="top"
          showArrow
          classNames={{
            content: 'bg-cBgDark-700 text-white text-xs px-2 py-1 rounded-lg',
          }}
        >
          <Button
            as={Link}
            href="#answers"
            size="sm"
            variant="light"
            className="flex min-w-fit items-center gap-1.5 px-2.5 text-default-600 hover:text-foreground"
            startContent={<SvgIcon icon="solar:chat-line-linear" width={20} />}
          >
            {question.answers_count}{' '}
            <span className="hidden lg:inline-block">odpowiedzi</span>
          </Button>
        </Tooltip>
        <Tooltip
          content={`${question.views_count} wyświetleń`}
          placement="top"
          showArrow
          classNames={{
            content: 'bg-cBgDark-700 text-white text-xs px-2 py-1 rounded-lg',
          }}
        >
          <p className="ml-1 flex cursor-pointer items-center gap-x-1.5 text-xs text-default-600">
            <SvgIcon icon="solar:eye-linear" width={20} />
            {question.views_count}
            <span className="hidden lg:inline-block">wyświetleń</span>
          </p>
        </Tooltip>
      </div>
    </div>
  );
};

export default QuestionMeta;
