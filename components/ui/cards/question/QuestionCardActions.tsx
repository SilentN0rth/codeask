'use client';

import Link from 'next/link';
import { Tooltip, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { SvgIcon } from '@/lib/utils/icons';

interface QuestionCardActionsProps {
  id: string;
  question_slug: string;
  hovered: boolean;
}

export const QuestionCardActions: React.FC<QuestionCardActionsProps> = ({
  question_slug,
  hovered,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Przejdź do pytania" placement="top">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : 20,
          }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none"
          style={{ pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <Button
            as={Link}
            href={`/questions/${question_slug}`}
            isIconOnly
            size="sm"
            variant="light"
            aria-label="Przejdź do pytania"
            className="flex items-center justify-center rounded-lg bg-cCta-500/10 text-cCta-500 transition-all duration-300 hover:bg-cCta-500 hover:text-white"
          >
            <SvgIcon icon="mdi:arrow-right" width={20} />
          </Button>
        </motion.div>
      </Tooltip>
    </div>
  );
};
