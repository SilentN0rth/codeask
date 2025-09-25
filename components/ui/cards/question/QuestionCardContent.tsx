'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { TagItem } from '../../tags/TagItem';

interface QuestionCardContentProps {
  id: string;
  title: string;
  question_slug: string;
  short_content: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
  showAuthor?: boolean;
}

export const QuestionCardContent: React.FC<QuestionCardContentProps> = ({
  title,
  question_slug,
  short_content,
  tags,
}) => {
  const fadeIn = useFadeIn(0, 0.3);

  return (
    <div className="flex flex-col gap-3 p-4 pt-0">
      <motion.div {...fadeIn} transition={{ delay: 0.5 }}>
        <Link
          href={`/questions/${question_slug}`}
          className="line-clamp-2 w-fit whitespace-normal border-l-2 border-transparent text-base font-semibold text-default-600 transition-all duration-300 hover:border-cCta-500 hover:pl-2 hover:text-cCta-500"
          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {title}
        </Link>
      </motion.div>

      <motion.p
        className="line-clamp-4 text-sm leading-relaxed text-default-500"
        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        {...fadeIn}
        transition={{ delay: 0.6 }}
      >
        {short_content}
      </motion.p>

      {tags && tags.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          {...fadeIn}
          transition={{ delay: 0.7 }}
        >
          {tags.map((tag) => (
            <TagItem
              className="px-3 py-1 text-xs"
              key={tag.id}
              label={tag.name}
              href={`/tags/${tag.name}`}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};
