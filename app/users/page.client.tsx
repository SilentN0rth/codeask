'use client';

import UserCard from '@/components/ui/cards/UserCard';
import PageTitle from '@/components/ui/PageTitle';
import LocalUserSearcher from '@/components/ui/search/LocalUserSearcher';
import ClearFiltersButton from '@/components/ui/filters/ClearFiltersButton';
import ViewModeToggle, {
  ViewMode,
} from '@/components/ui/filters/ViewModeToggle';
import { UserInterface } from '@/types/users.types';
import { useSidebarContext } from 'context/LeftSidebarContext';
import { usePagination } from '@/hooks/usePagination';
import { Chip } from '@heroui/react';
import UniversalPagination from '@/components/ui/UniversalPagination';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import NoResults from '@/components/ui/effects/NoResults';
import { UserSkeleton } from '@/components/ui/cards/UserSkeleton';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Masonry } from 'masonic';

const PER_PAGE = 30;

export default function PageClient({
  users,
  followStatuses,
}: {
  users: UserInterface[];
  followStatuses: Record<string, boolean>;
}) {
  const { isCompact } = useSidebarContext();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [userSelectedMode, setUserSelectedMode] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const searcherRef = useRef<{ resetAllFilters: () => void } | null>(null);
  const { paginatedItems, currentPage, totalPages, setPage } = usePagination(
    users,
    PER_PAGE
  );

  const hasActiveFilters = useCallback(() => {
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    return Boolean(search ?? sort);
  }, [searchParams]);

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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setUserSelectedMode(true);
  };

  useEffect(() => {
    if (hasActiveFilters()) {
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

  const titleAnimation = useFadeIn(30, 0.4);
  const searchAnimation = useFadeIn(20, 0.5);
  const resultsCountAnimation = useFadeIn(15, 0.55);
  const usersAnimation = useFadeIn(40, 0.6);
  const paginationAnimation = useFadeIn(20, 0.8);

  const UserCardWrapper = ({
    data: user,
    index,
  }: {
    data: UserInterface;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.1 + index * 0.05,
        ease: 'easeOut',
      }}
    >
      <UserCard user={user} isFollowing={followStatuses[user.id]} />
    </motion.div>
  );

  return (
    <motion.div
      key="users-page"
      className="wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div {...titleAnimation}>
        <PageTitle
          title="Użytkownicy"
          icon="solar:users-group-two-rounded-outline"
          description="Przeglądaj wszystkich użytkowników"
        />
      </motion.div>

      <motion.div {...searchAnimation}>
        <LocalUserSearcher ref={searcherRef} />
      </motion.div>

      {!isLoading && (
        <motion.div {...resultsCountAnimation} className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasActiveFilters() && (
                <>
                  <Chip
                    variant="flat"
                    color="primary"
                    radius="sm"
                    className="gap-3 border-cCta-500/30 bg-cCta-500/20 text-cCta-500"
                  >
                    {users.length}{' '}
                    {users.length === 0
                      ? 'użytkowników'
                      : users.length === 1
                        ? 'użytkownik'
                        : users.length < 5
                          ? 'użytkowników'
                          : 'użytkowników'}
                  </Chip>
                  <ClearFiltersButton
                    size="sm"
                    onReset={() => searcherRef.current?.resetAllFilters()}
                  />
                </>
              )}
            </div>

            <ViewModeToggle
              currentMode={viewMode}
              onModeChange={handleViewModeChange}
              hasActiveFilters={hasActiveFilters()}
              className="ml-auto"
            />
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <motion.div
          {...usersAnimation}
          className={`grid gap-4 ${
            isCompact
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
              : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 5xl:grid-cols-4'
          }`}
        >
          {Array.from({ length: PER_PAGE }).map(() => (
            <UserSkeleton key={`skeleton-${Math.random()}-${Date.now()}`} />
          ))}
        </motion.div>
      ) : paginatedItems.length > 0 ? (
        <>
          <motion.div {...usersAnimation}>
            {viewMode === 'masonry' && (
              <Masonry
                key={`masonry-${paginatedItems.length}-${paginatedItems[0]?.id || 'empty'}`}
                items={paginatedItems}
                columnGutter={16}
                columnWidth={300}
                overscanBy={1}
                itemKey={(data) => data?.id || Math.random().toString()}
                render={UserCardWrapper}
                as="ul"
                itemAs="li"
                role="list"
                aria-label="Lista użytkowników w układzie masonry"
              />
            )}

            {viewMode === 'grid' && (
              <div
                className={`grid gap-4 ${
                  isCompact
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 5xl:grid-cols-4'
                }`}
              >
                {paginatedItems.map((user, index) => (
                  <motion.div
                    key={`user-grid-${user.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + index * 0.05,
                      ease: 'easeOut',
                    }}
                  >
                    <UserCard
                      user={user}
                      isFollowing={followStatuses[user.id]}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'flex' && (
              <div className="flex flex-col gap-3">
                {paginatedItems.map((user, index) => (
                  <motion.div
                    key={`user-flex-${user.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + index * 0.05,
                      ease: 'easeOut',
                    }}
                  >
                    <UserCard
                      user={user}
                      isFollowing={followStatuses[user.id]}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {totalPages > 1 && (
            <motion.div {...paginationAnimation} className="mt-8">
              <UniversalPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                className="col-span-full mx-auto"
                ariaLabel="Przejdź między stronami użytkowników"
              />
            </motion.div>
          )}
        </>
      ) : (
        <NoResults
          title="Brak użytkowników"
          description="Nie znaleziono użytkowników spełniających kryteria wyszukiwania."
          hint="Spróbuj zmienić filtry lub wyszukiwane hasło."
          icon="lucide:user-x"
        />
      )}
    </motion.div>
  );
}
