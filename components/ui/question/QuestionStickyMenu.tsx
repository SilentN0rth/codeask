'use client';
import { getRelativeTimeFromNow } from '@/lib/utils/getRelativeTimeFromNow';
import { Tooltip, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import QuestionHeader from './QuestionHeader';
import { QuestionCardProps } from '@/types/questions.types';
import QuestionMeta from './QuestionMeta';
import { useStickyMenu } from '@/hooks/useScroll';
import { SvgIcon } from '@/lib/utils/icons';

interface QuestionStickyMenuProps {
  question: QuestionCardProps;
  status: 'opened' | 'closed' | 'archived';
  onStatusChange: (newStatus: 'opened' | 'closed' | 'archived') => void;
}

export default function QuestionStickyMenu({
  question,
  status,
  onStatusChange,
}: QuestionStickyMenuProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [userToggledSticky, setUserToggledSticky] = useState(false);

  const { hasScrolled, isSticky, isTooltipDisabled, setIsSticky } =
    useStickyMenu({
      threshold: 50,
      debounceMs: 200,
      userToggledSticky,
    });

  const handleHide = () => {
    setIsAnimatingOut(true);
  };

  const handleShow = () => {
    setIsSticky(true);
    setUserToggledSticky(false);
  };

  const handleAnimationComplete = () => {
    if (isAnimatingOut) {
      setIsAnimatingOut(false);
      setIsSticky(false);
      setUserToggledSticky(true);
    }
  };

  const shouldStick = isSticky || isAnimatingOut;

  return (
    <motion.div
      initial={false}
      animate={{
        y: isAnimatingOut ? -80 : 0,
      }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={handleAnimationComplete}
      className={`${
        shouldStick ? 'sticky top-[90px]' : 'static'
      } left-0 z-50 flex flex-col gap-4 border-1 border-transparent border-b-divider bg-cBgDark-900/60 py-4 backdrop-blur-md`}
    >
      <AnimatePresence>
        {(hasScrolled || !shouldStick) && (
          <motion.div
            key="toggle-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-1/2 -bottom-4 z-[1000] -translate-x-1/2"
          >
            {shouldStick ? (
              <Tooltip
                content="Schowaj menu"
                placement="top"
                isDisabled={isTooltipDisabled}
              >
                <Button
                  size="sm"
                  onPress={handleHide}
                  className="border border-divider bg-cBgDark-900"
                >
                  <SvgIcon
                    icon="iconamoon:arrow-up-2-bold"
                    className="text-xl"
                  />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip
                content="Pokaż podążające menu"
                placement="top"
                isDisabled={isTooltipDisabled}
              >
                <Button
                  size="sm"
                  onPress={handleShow}
                  className="border border-divider bg-cBgDark-900"
                >
                  <SvgIcon
                    icon="iconamoon:arrow-down-2-bold"
                    className="text-xl"
                  />
                </Button>
              </Tooltip>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* >= Laptop */}
      <motion.div
        initial={false}
        animate={{
          paddingLeft: hasScrolled ? 20 : 0,
          paddingRight: hasScrolled ? 20 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        onAnimationComplete={handleAnimationComplete}
        className="wrapper hidden flex-col gap-4 lg:flex"
      >
        <QuestionHeader
          time={getRelativeTimeFromNow(question.created_at)}
          questionId={question.id}
          questionSlug={question.question_slug}
          questionTitle={question.title}
          questionAuthor={question.author}
          status={status}
          onStatusChange={onStatusChange}
        />
        <QuestionMeta question={question} />
      </motion.div>
      {/* MOBILE */}
      <div className="wrapper flex flex-col gap-4 px-4 lg:hidden">
        <QuestionHeader
          time={getRelativeTimeFromNow(question.created_at)}
          questionId={question.id}
          questionSlug={question.question_slug}
          questionTitle={question.title}
          questionAuthor={question.author}
          status={status}
          onStatusChange={onStatusChange}
        />
        <QuestionMeta question={question} />
      </div>
    </motion.div>
  );
}
