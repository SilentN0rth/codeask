'use client';

import { motion } from 'framer-motion';
import { TagItem } from '../tags/TagItem';
import { Tag } from '@/types/tags.types';
import PageTitle from '../PageTitle';
import Divider from '../Divider';
import SeeAllButton from '../SeeAllButton';

interface TagsSectionProps {
  tags: Tag[];
  animation: Record<string, unknown>;
}

export const TagsSection = ({ tags, animation }: TagsSectionProps) => {
  if (tags.length === 0) return null;
  return (
    <>
      <motion.div {...animation}>
        <PageTitle
          title="Nowe tagi"
          icon="solar:tag-outline"
          description="Najnowsze kategorie w społeczności"
          parentClasses="mb-5"
          className="text-lg"
          as="h2"
        />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <TagItem
                className="px-3 py-1 text-xs"
                label={`${tag.name} (${tag.question_count})`}
                href={`/tags/${tag.name}`}
              />
            </motion.div>
          ))}
        </div>
        <SeeAllButton
          href="/tags"
          className="mt-4 text-cCta-500 hover:bg-cCta-500/10"
        >
          Zobacz wszystkie tagi
        </SeeAllButton>
      </motion.div>
      <Divider
        text="</>"
        orientation="horizontal"
        position="center"
        bgColor="bg-cBgDark-900"
      />
    </>
  );
};
