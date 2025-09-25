'use client';

import {
  Popover,
  PopoverTrigger,
  Avatar,
  Button,
  PopoverContent,
} from '@heroui/react';
import { ReactNode, useState, useEffect } from 'react';
import ProfileCardFull from '../cards/profile/ProfileCardFull';
import { UserInterface } from '@/types/users.types';
import { motion, AnimatePresence } from 'framer-motion';

const UserPopover = ({
  subText = '',
  className,
  isAnswer = false,
  author,
}: {
  className?: string;
  subText?: ReactNode;
  author: UserInterface | null;
  isAnswer?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<UserInterface | null>(
    author
  );

  useEffect(() => {
    setCurrentAuthor(author);
  }, [author]);

  return (
    <Popover isOpen={isOpen} size="lg" onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          disableAnimation
          disableRipple
          radius="none"
          className={`flex !scale-100 items-center gap-3 border-l-3 border-transparent !bg-transparent p-2 pl-0 text-left !transition-all ${
            isOpen && isAnswer
              ? 'border-cCta-500 !pl-3'
              : 'hover:border-cCta-500 hover:!pl-3'
          } ${isAnswer ? '!mb-3' : ''}`}
          aria-expanded={isOpen}
        >
          <Avatar
            size="sm"
            src={currentAuthor?.avatar_url}
            name={currentAuthor?.name}
            alt="avatar"
            showFallback
            radius="full"
          />
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-cTextDark-100">
              {currentAuthor?.name}
            </span>
            <span className="text-xs text-default-400">{subText}</span>
          </div>
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {isOpen && (
          <PopoverContent
            className={`${className} w-full border border-divider p-0 shadow-lg`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ProfileCardFull author={currentAuthor} />
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};

export default UserPopover;
