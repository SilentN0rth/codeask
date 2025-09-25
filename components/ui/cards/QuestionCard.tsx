/* eslint-disable camelcase */
'use client';

import { Card } from '@heroui/react';
import React, { useState } from 'react';
import { QuestionCardProps } from '@/types/questions.types';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import {
  QuestionCardHeader,
  QuestionCardContent,
  QuestionCardStats,
  QuestionCardActions,
} from './question';

export const QuestionCard: React.FC<QuestionCardProps> = ({
  id,
  title,
  question_slug,
  short_content,
  created_at,
  updated_at,
  likes_count,
  unlikes_count,
  answers_count,
  views_count,
  status,
  author,
  tags,

  showAuthor = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const fadeInUp = useFadeIn(20, 0.3);

  return (
    <motion.div {...fadeInUp} whileHover={{ y: -4 }} className="group h-full">
      <Card
        shadow="none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full justify-between overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-800/80 hover:shadow-lg hover:shadow-cCta-500/10"
      >
        {showAuthor && (
          <QuestionCardHeader
            author={author}
            status={status}
            created_at={created_at}
            updated_at={updated_at}
          />
        )}

        <QuestionCardContent
          id={id}
          title={title}
          question_slug={question_slug}
          short_content={short_content}
          tags={tags}
          showAuthor={showAuthor}
        />

        <div className="relative overflow-visible p-4 pt-0">
          <div className="flex w-full items-center justify-between">
            <QuestionCardStats
              likes_count={likes_count}
              unlikes_count={unlikes_count}
              answers_count={answers_count}
              views_count={views_count}
              hovered={hovered}
            />

            <QuestionCardActions
              id={id}
              question_slug={question_slug}
              hovered={hovered}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
