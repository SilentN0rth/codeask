/* eslint-disable camelcase */
'use client';

import { SvgIcon } from '@/lib/utils/icons';
import React, { useEffect, useState } from 'react';
import { Tag } from '@/types/tags.types';
import { QuestionCardProps } from '@/types/questions.types';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getQuestionsByTag } from '@/services/client/questions';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  tags: Tag[];
  onClose?: () => void;
};

const PopularTags = ({ tags, onClose }: Props) => {
  const params = useParams();
  const pathname = usePathname();
  const isOnTagPage = pathname.startsWith('/tags');

  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [tagQuestions, setTagQuestions] = useState<
    Record<string, QuestionCardProps[]>
  >({});
  const [loadingTags, setLoadingTags] = useState<Record<string, boolean>>({});

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOnTagPage && params?.id) {
      setSelectedTagId(params.id as string);
    }
  }, [isOnTagPage, params?.id]);

  useEffect(() => {
    if (
      !selectedTagId ||
      tagQuestions[selectedTagId] ||
      loadingTags[selectedTagId]
    )
      return;

    setLoadingTags((prev) => ({ ...prev, [selectedTagId]: true }));

    getQuestionsByTag(selectedTagId, 3)
      .then(({ questions }) => {
        if (questions) {
          setTagQuestions((prev) => ({ ...prev, [selectedTagId]: questions }));
        }
      })
      .finally(() => {
        setLoadingTags((prev) => ({ ...prev, [selectedTagId]: false }));
      });
  }, [selectedTagId, tagQuestions, loadingTags]);

  const currentTagQuestions = tagQuestions[selectedTagId ?? ''] ?? [];
  const isLoading = loadingTags[selectedTagId ?? ''];

  return (
    <div className="space-y-2">
      {tags.slice(0, 10).map(({ id, name, question_count }) => {
        const isActive = selectedTagId === id;
        const isThisTagLoading = loadingTags[id];

        return (
          <div key={id} className="space-y-1">
            <button
              onClick={() => setSelectedTagId(isActive ? null : id)}
              disabled={isThisTagLoading}
              className="group relative flex h-10 w-full items-center justify-between gap-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-cBgDark-700 disabled:opacity-50"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 scale-y-50 rounded bg-cCta-500 opacity-0 transition-all duration-200 group-hover:scale-y-100 group-hover:opacity-100" />
              <div className="flex items-center gap-2">
                <p className="text-default-600 transition-colors group-hover:text-cCta-500">
                  #{name}
                </p>
                {isThisTagLoading && (
                  <div className="size-3 animate-spin rounded-full border border-cCta-500 border-t-transparent" />
                )}
              </div>
              <p className="text-xs text-default-500">{question_count}</p>
            </button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="ml-4 space-y-2">
                    {isLoading ? null : currentTagQuestions.length > 0 ? (
                      currentTagQuestions.map((question) => (
                        <Link
                          key={question.id}
                          href={`/questions/${question.question_slug}`}
                          onClick={handleLinkClick}
                          className="group block rounded-lg bg-cBgDark-700 p-3 transition-all duration-200 hover:bg-cCta-500/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-medium text-default-600 transition-colors group-hover:text-cCta-500">
                                {question.title}
                              </p>
                            </div>
                            <SvgIcon
                              icon="mdi:arrow-right"
                              className="flex-shrink-0 text-default-400 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                              width={14}
                            />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-default-500">
                        Brak pytań dla tego tagu
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default PopularTags;
