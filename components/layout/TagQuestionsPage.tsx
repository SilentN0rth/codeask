'use client';

import { QuestionCard } from '@/components/ui/cards/QuestionCard';
import PageTitle from '@/components/ui/PageTitle';
import { usePagination } from '@/hooks/usePagination';
import { QuestionCardProps } from '@/types/questions.types';
import { Tag } from '@/types/tags.types';
import { UserInterface } from '@/types/users.types';
import { Button, Chip } from '@heroui/react';
import UniversalPagination from '../ui/UniversalPagination';
import { useSidebarContext } from 'context/LeftSidebarContext';
import { useAuthContext } from 'context/useAuthContext';
import { showLoginRequiredToast } from '@/components/ui/toasts/LoginRequiredToast';
import TagPageSearcherWrapper from '../ui/search/TagPageSearcherWrapper';
import ClearFiltersButton from '../ui/filters/ClearFiltersButton';
import ViewModeToggle, { ViewMode } from '../ui/filters/ViewModeToggle';
import { Masonry } from 'masonic';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import NoResults from '@/components/ui/effects/NoResults';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { QuestionSkeleton } from '../ui/cards/question/QuestionSkeleton';

export default function TagQuestionsPage({
  tag,
  questions,
  savedQuestionIds = [],
  users = [],
}: {
  tag: Tag;
  questions: QuestionCardProps[];
  savedQuestionIds?: string[];
  users?: UserInterface[];
}) {
  const PER_PAGE = 18;
  const { isCompact } = useSidebarContext();
  const { user } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [userSelectedMode, setUserSelectedMode] = useState<boolean>(false);
  const searcherRef = useRef<{ resetAllFilters: () => void } | null>(null);

  const { paginatedItems, currentPage, totalPages, setPage } = usePagination(
    questions,
    PER_PAGE
  );

  const titleAnimation = useFadeIn(30, 0.5);
  const searchAnimation = useFadeIn(20, 0.6);
  const resultsCountAnimation = useFadeIn(15, 0.65);
  const cardsAnimation = useFadeIn(40, 0.7);
  const paginationAnimation = useFadeIn(20, 0.8);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setUserSelectedMode(true);
  };

  const QuestionCardWrapper = ({
    data: question,
  }: {
    data: QuestionCardProps;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: 'easeOut',
      }}
    >
      <QuestionCard {...question} savedQuestionIds={savedQuestionIds} />
    </motion.div>
  );

  const currentSearch = searchParams.get('search') ?? '';
  const currentFilter = searchParams.get('filter') ?? '';

  const hasActiveFilters = Boolean(currentSearch || currentFilter);

  useEffect(() => {
    if (hasActiveFilters) {
      if (viewMode === 'masonry') {
        setViewMode('grid');
        setUserSelectedMode(false);
      }
    } else {
      if (!userSelectedMode && viewMode !== 'masonry') {
        setViewMode('masonry');
      }
    }
  }, [hasActiveFilters, viewMode, userSelectedMode]);

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

  return (
    <motion.div
      className="wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div {...titleAnimation}>
        <div className="flex items-center justify-between">
          <PageTitle
            title={`Tag: ${tag.name}`}
            icon="mdi:tag"
            description={`Pytania z tagiem "${tag.name}"`}
          />
          <Button
            onPress={() => {
              if (!user) {
                showLoginRequiredToast({ action: 'utworzyć pytanie' });
                return;
              }
              router.push('/questions/create');
            }}
            variant="light"
            radius="md"
            className="bg-cCta-500 text-cTextDark-100 transition-colors hover:!bg-cCta-700"
          >
            Dodaj pytanie
          </Button>
        </div>
      </motion.div>

      <motion.div {...searchAnimation}>
        <TagPageSearcherWrapper
          ref={searcherRef}
          className="mb-4"
          users={users}
        />
      </motion.div>

      {hasActiveFilters && !isLoading && (
        <motion.div {...resultsCountAnimation} className="mb-4">
          <div className="flex items-center gap-3">
            <Chip
              variant="flat"
              color="primary"
              radius="sm"
              className="gap-3 border-cCta-500/30 bg-cCta-500/20 text-cCta-500"
            >
              {questions.length}{' '}
              {questions.length === 0
                ? 'wyników'
                : questions.length === 1
                  ? 'wynik'
                  : questions.length < 5
                    ? 'wyniki'
                    : 'wyników'}
            </Chip>
            <ClearFiltersButton
              size="sm"
              onReset={() => searcherRef.current?.resetAllFilters()}
            />
          </div>
        </motion.div>
      )}

      {!isLoading && (
        <motion.div {...resultsCountAnimation} className="mb-4">
          <div className="flex items-center justify-end">
            <ViewModeToggle
              currentMode={viewMode}
              onModeChange={handleViewModeChange}
              hasActiveFilters={hasActiveFilters}
              className="ml-auto"
            />
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <motion.div
          {...cardsAnimation}
          className={`grid gap-3 ${
            isCompact
              ? 'lg:grid-cols-2 2xl:grid-cols-3'
              : 'xl:grid-cols-2 4xl:grid-cols-3'
          }`}
        >
          {Array.from({ length: 6 }).map(() => (
            <QuestionSkeleton key={`skeleton-${Math.random()}-${Date.now()}`} />
          ))}
        </motion.div>
      ) : paginatedItems.length > 0 ? (
        <>
          <motion.div {...cardsAnimation}>
            {viewMode === 'masonry' && (
              <Masonry
                key={`masonry-${paginatedItems.length}-${paginatedItems[0]?.id || 'empty'}`}
                items={paginatedItems}
                columnGutter={16}
                columnWidth={300}
                overscanBy={1}
                itemKey={(data) => data?.id || Math.random().toString()}
                render={QuestionCardWrapper}
                as="ul"
                itemAs="li"
                role="list"
                aria-label="Lista pytań w układzie masonry"
              />
            )}

            {viewMode === 'grid' && (
              <div
                className={`grid gap-3 ${
                  isCompact
                    ? 'lg:grid-cols-2 2xl:grid-cols-3'
                    : 'xl:grid-cols-2 4xl:grid-cols-3'
                }`}
              >
                {paginatedItems.map((question) => (
                  <QuestionCardWrapper
                    key={`question-grid-${question.id}`}
                    data={question}
                  />
                ))}
              </div>
            )}

            {viewMode === 'flex' && (
              <div className="flex flex-col gap-3">
                {paginatedItems.map((question) => (
                  <QuestionCardWrapper
                    key={`question-flex-${question.id}`}
                    data={question}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            {...paginationAnimation}
            className="col-span-full mx-auto mt-4"
          >
            {totalPages > 1 && (
              <UniversalPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                ariaLabel="Przejdź między stronami pytań z tagiem"
              />
            )}
          </motion.div>
        </>
      ) : (
        <NoResults
          title="Brak pytań"
          description={`Nie znaleziono pytań z tagiem "${tag.name}" spełniających kryteria wyszukiwania.`}
          hint="Spróbuj zmienić filtry lub wyszukiwane hasło."
          icon="lucide:search-x"
        />
      )}
    </motion.div>
  );
}
