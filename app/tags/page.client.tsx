'use client';

import PageTitle from '@/components/ui/PageTitle';
import TagCard from '@/components/ui/tags/TagCard';
import { SvgIcon } from '@/lib/utils/icons';
import { Tag } from '@/types/tags.types';
import { usePagination } from '@/hooks/usePagination';
import { Chip } from '@heroui/react';
import UniversalPagination from '@/components/ui/UniversalPagination';
import TagsPageClient from '@/components/ui/search/TagsPageClient';
import ClearFiltersButton from '@/components/ui/filters/ClearFiltersButton';
import { useSidebarContext } from 'context/LeftSidebarContext';
import { useAuthContext } from 'context/useAuthContext';
import { showLoginRequiredToast } from '@/components/ui/toasts/LoginRequiredToast';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import NoResults from '@/components/ui/effects/NoResults';
import { TagSkeleton } from '@/components/ui/cards/TagSkeleton';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PER_PAGE = 30;

type MasonryItem = Tag | { id: 'add-tag'; type: 'add-tag' };

const PageClient = ({ tags }: { tags: Tag[] }) => {
  const { isCompact } = useSidebarContext();
  const { user } = useAuthContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const searcherRef = useRef<{ resetAllFilters: () => void } | null>(null);

  const { paginatedItems, currentPage, totalPages, setPage } = usePagination(
    tags,
    PER_PAGE - 1
  );

  const masonryItems: MasonryItem[] = [
    ...paginatedItems,
    { id: 'add-tag', type: 'add-tag' },
  ];

  const hasActiveFilters = () => {
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    return Boolean(search ?? sort);
  };

  useEffect(() => {
    const searchString = searchParams.toString();
    const hasParams = searchString.length > 0;

    if (hasParams) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const titleAnimation = useFadeIn(30, 0.4);
  const searchAnimation = useFadeIn(20, 0.5);
  const resultsCountAnimation = useFadeIn(15, 0.55);
  const tagsAnimation = useFadeIn(40, 0.6);
  const paginationAnimation = useFadeIn(20, 0.8);

  const TagCardWrapper = ({ data: item }: { data: MasonryItem }) => {
    if ('type' in item && item.type === 'add-tag') {
      return (
        <div
          onClick={() => {
            if (!user) {
              showLoginRequiredToast({ action: 'utworzyć tag' });
              return;
            }
            router.push('/questions/create');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (!user) {
                showLoginRequiredToast({ action: 'utworzyć tag' });
                return;
              }
              router.push('/questions/create');
            }
          }}
          role="button"
          tabIndex={0}
          className="group relative flex size-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-divider bg-cBgDark-800 py-4 backdrop-blur-sm transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-800/80 hover:shadow-lg hover:shadow-cCta-500/10"
        >
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-cBgDark-700 shadow-lg transition-transform">
              <SvgIcon
                icon="mdi:plus"
                className="size-6 text-default-400 drop-shadow-sm transition-transform group-hover:rotate-180 group-hover:text-cCta-500"
              />
            </div>
            <div>
              <p className="font-semibold text-default-600 transition-colors">
                Dodaj tag
              </p>
              <p className="text-xs text-default-400">Stwórz nowy tag</p>
            </div>
          </div>
        </div>
      );
    }

    return <TagCard tag={item as Tag} />;
  };

  return (
    <motion.div
      className="wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div {...titleAnimation}>
        <PageTitle
          title="Tagi"
          icon="solar:tag-outline"
          description="Przeglądaj pytania według kategorii"
        />
      </motion.div>

      <motion.div {...searchAnimation}>
        <TagsPageClient ref={searcherRef} />
      </motion.div>

      {hasActiveFilters() && !isLoading && (
        <motion.div {...resultsCountAnimation} className="mb-4">
          <div className="flex items-center gap-3">
            <Chip
              variant="flat"
              color="primary"
              radius="sm"
              className="gap-3 border-cCta-500/30 bg-cCta-500/20 text-cCta-500"
            >
              {tags.length}{' '}
              {tags.length === 0
                ? 'tagów'
                : tags.length === 1
                  ? 'tag'
                  : tags.length < 5
                    ? 'tagi'
                    : 'tagów'}
            </Chip>
            <ClearFiltersButton
              size="sm"
              onReset={() => searcherRef.current?.resetAllFilters()}
            />
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <motion.div
          {...tagsAnimation}
          className={`grid gap-3 ${
            isCompact
              ? 'grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
              : 'grid-cols-1 xsm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6'
          }`}
        >
          {Array.from({ length: PER_PAGE }).map(() => (
            <TagSkeleton key={`skeleton-${Math.random()}-${Date.now()}`} />
          ))}
        </motion.div>
      ) : masonryItems.length > 0 ? (
        <>
          <motion.div
            {...tagsAnimation}
            className={`grid gap-4 ${
              isCompact
                ? 'grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                : 'grid-cols-1 xsm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6'
            }`}
          >
            {masonryItems.map((item, index) => (
              <motion.div
                key={`tag-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
              >
                <TagCardWrapper data={item} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...paginationAnimation}>
            {totalPages > 1 && (
              <UniversalPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                className="col-span-full mx-auto mt-4"
                ariaLabel="Przejdź między stronami tagów"
              />
            )}
          </motion.div>
        </>
      ) : (
        <NoResults
          title="Brak tagów"
          description="Nie znaleziono tagów spełniających kryteria wyszukiwania."
          hint="Spróbuj zmienić filtry lub wyszukiwane hasło."
          icon="mdi:tag-remove-outline"
        />
      )}
    </motion.div>
  );
};

export default PageClient;
