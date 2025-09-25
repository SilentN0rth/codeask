/* eslint-disable camelcase */
'use client';
import { QuestionCardProps } from '@/types/questions.types';
import Link from 'next/link';
import React from 'react';

const NewestQuestions = ({
  questions,
  onClose,
}: {
  questions: QuestionCardProps[];
  onClose?: () => void;
}) => {
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-3">
      {questions.slice(0, 5).map((question) => (
        <Link
          key={question.id}
          href={`/questions/${question.question_slug}`}
          onClick={handleLinkClick}
          className="group block rounded-lg p-3 transition-all duration-200 hover:bg-cBgDark-700"
        >
          <div className="space-y-2">
            <h3 className="line-clamp-1 text-sm font-semibold text-default-600 transition-colors group-hover:text-cCta-500">
              {question.title}
            </h3>
            <p className="line-clamp-1 text-xs leading-relaxed text-default-500">
              {question.short_content}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NewestQuestions;
