'use client';

import { SvgIcon } from '@/lib/utils/icons';
import { Tag } from '@/types/tags.types';
import { Link as LinkHeroUI } from '@heroui/react';
import Link from 'next/link';
import { getLocalTimeString } from '@/lib/utils/getLocalTimeString';

export const TagCard = ({ tag }: { tag: Tag }) => {
  const localTime = getLocalTimeString(tag.created_at);

  return (
    <LinkHeroUI
      as={Link}
      className="group relative size-full overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-800/80 hover:shadow-lg hover:shadow-cCta-500/10"
      href={`/tags/${tag.name}`}
    >
      <div className="relative z-10 space-y-3 p-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-cBgDark-700 shadow-lg">
            <SvgIcon
              icon="mdi:tag"
              className="size-4 text-default-400 drop-shadow-sm"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-default-600 transition-colors group-hover:text-cCta-500">
              #{tag.name}
            </p>
            <div className="flex items-center gap-1 text-default-500">
              <SvgIcon icon="mdi:help-circle-outline" className="size-4" />
              <span className="text-sm font-medium">{tag.question_count}</span>
              <span className="text-xs text-default-400">
                {tag.question_count === 1
                  ? 'pytanie'
                  : tag.question_count > 1 && tag.question_count < 5
                    ? 'pytania'
                    : 'pytań'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-default-500">
            <p className="text-xs text-default-400">Utworzono: {localTime}</p>
          </div>
        </div>

        <div className="h-0.5 w-0 bg-cCta-500 transition-all duration-300 group-hover:w-full" />
      </div>
    </LinkHeroUI>
  );
};

export default TagCard;
