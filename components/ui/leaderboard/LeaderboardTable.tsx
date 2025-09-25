'use client';

import { UserInterface } from '@/types/users.types';
import { motion } from 'framer-motion';
import { SvgIcon } from '@/lib/utils/icons';
import Link from 'next/link';
import { Avatar, Card, CardBody } from '@heroui/react';
import UniversalPagination from '../UniversalPagination';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import BadgeIcon from '../badges/BadgeIcon';
import { usePagination } from '@/hooks/usePagination';
import { useSidebarContext } from 'context/LeftSidebarContext';
import { useResponsiveBreakpoint } from '@/hooks/useWindowSize';

interface LeaderboardTableProps {
  users: UserInterface[];
}

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
  const { isCompact } = useSidebarContext();
  const breakpoint = useResponsiveBreakpoint();

  const useTableLayout =
    (breakpoint === '3xl' && isCompact) || breakpoint === '4xl';

  const PER_PAGE = useTableLayout ? 10 : 5;
  const { paginatedItems, currentPage, totalPages, setPage } = usePagination(
    users,
    PER_PAGE
  );

  const tableFadeIn = useFadeIn(30, 0.6);
  const paginationFadeIn = useFadeIn(20, 0.8);

  return (
    <motion.div {...tableFadeIn}>
      {/* Header */}
      <div className="overflow-hidden rounded-xl border border-cBgDark-800 bg-cBgDark-700">
        <div className="bg-gradient-to-r from-cCta-500 to-cCta-700 px-6 py-4">
          <div className="flex items-center justify-between text-cTextDark-100">
            <div className="flex items-center space-x-3">
              <SvgIcon icon="mdi:chart-bar" className="size-5" />
              <h2 className="text-base font-medium">Podsumowanie aktywności</h2>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <SvgIcon icon="mdi:account-group" className="size-4" />
                <span>{users.length} użytkowników</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        {useTableLayout && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cBgDark-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                    Pozycja
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                    Użytkownik
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                    Reputacja
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                    Odpowiedzi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                    Pytania
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-cMuted-500">
                    Odznaki
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cBgDark-800 bg-cBgDark-700">
                {paginatedItems.map((user, index) => {
                  const position = (currentPage - 1) * PER_PAGE + index + 1;
                  return (
                    <DesktopUserRow
                      key={user.id}
                      user={user}
                      position={position}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile/Tablet Card View */}
        {!useTableLayout && (
          <div className="space-y-2 p-4">
            {paginatedItems.map((user, index) => {
              const position = (currentPage - 1) * PER_PAGE + index + 1;
              return (
                <MobileUserCard key={user.id} user={user} position={position} />
              );
            })}
          </div>
        )}
      </div>

      {/* Paginacja */}
      {totalPages > 1 && (
        <motion.div {...paginationFadeIn} className="mt-6 flex justify-center">
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="col-span-full mx-auto"
            ariaLabel="Przejdź między stronami rankingu"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

// Desktop Table Row Component
function DesktopUserRow({
  user,
  position,
}: {
  user: UserInterface;
  position: number;
}) {
  return (
    <tr
      className={`${
        position === 1 ? 'hover:bg-cCta-500/10' : 'hover:bg-cBgDark-800/50'
      }transition-colors duration-200`}
    >
      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          <div
            className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
              position === 1
                ? 'bg-cCta-500 text-cTextDark-100'
                : 'bg-divider text-cMuted-500'
            }`}
          >
            {position === 1 && <SvgIcon icon="mdi:crown" className="size-4" />}
            {position > 1 && (
              <span className="text-xs font-normal">#{position}</span>
            )}
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center">
          <div className="size-10 flex-shrink-0">
            <Avatar
              className="size-10 rounded-full border-2 border-cCta-300/30"
              src={user.avatar_url}
              alt={user.name}
              name={user.name}
              showFallback
              radius="full"
            />
          </div>
          <div className="ml-4">
            <Link
              href={`/users/${user.profile_slug}`}
              className="text-sm font-medium text-cTextDark-100 transition-colors duration-200 hover:text-cCta-300"
            >
              {user.name}
            </Link>
            <div className="text-sm text-cMuted-500">@{user.username}</div>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="text-sm font-bold text-cTextDark-100">
          {user.reputation.toLocaleString()} pkt
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center text-sm text-cTextDark-100">
          <SvgIcon
            icon="mdi:message-outline"
            className="text-cMuted-400 mr-2 size-4"
          />
          {user.answers_count}
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex items-center text-sm text-cTextDark-100">
          <SvgIcon
            icon="mdi:help-circle"
            className="text-cMuted-400 mr-2 size-4"
          />
          {user.questions_count}
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-4">
        <div className="flex flex-wrap items-center gap-1">
          <UserBadges user={user} />
        </div>
      </td>
    </tr>
  );
}

// Mobile Card Component
function MobileUserCard({
  user,
  position,
}: {
  user: UserInterface;
  position: number;
}) {
  return (
    <Card
      className={`${
        position === 1
          ? 'border-cCta-500/30 bg-cCta-500/5'
          : 'border-cBgDark-800 bg-cBgDark-800'
      } transition-all duration-200 hover:border-cCta-500/30 hover:bg-cCta-500/5`}
      shadow="none"
    >
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          {/* Position & Avatar */}
          <div className="flex items-center gap-3">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                position === 1
                  ? 'bg-cCta-500 text-cTextDark-100'
                  : 'bg-divider text-cMuted-500'
              }`}
            >
              {position === 1 && (
                <SvgIcon icon="mdi:crown" className="size-4" />
              )}
              {position > 1 && (
                <span className="text-xs font-normal">#{position}</span>
              )}
            </div>

            <Avatar
              className="size-10 rounded-full border-2 border-cCta-300/30"
              src={user.avatar_url}
              alt={user.name}
              name={user.name}
              showFallback
              radius="full"
            />

            <div>
              <Link
                href={`/users/${user.profile_slug}`}
                className="text-sm font-medium text-cTextDark-100 transition-colors duration-200 hover:text-cCta-300"
              >
                {user.name}
              </Link>
              <div className="text-xs text-cMuted-500">@{user.username}</div>
            </div>
          </div>

          {/* Reputation */}
          <div className="text-right">
            <div className="text-sm font-bold text-cTextDark-100">
              {user.reputation.toLocaleString()}
            </div>
            <div className="text-xs text-cMuted-500">pkt</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-3 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xs text-cTextDark-100">
              <SvgIcon
                icon="mdi:message-outline"
                className="text-cMuted-400 mr-1 size-3"
              />
              {user.answers_count}
            </div>
            <div className="flex items-center text-xs text-cTextDark-100">
              <SvgIcon
                icon="mdi:help-circle"
                className="text-cMuted-400 mr-1 size-3"
              />
              {user.questions_count}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1">
            <UserBadges user={user} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// User Badges Component
function UserBadges({ user }: { user: UserInterface }) {
  return (
    <>
      {/* Podstawowe odznaki (gold, silver, bronze) */}
      {user.badges && (
        <>
          {user.badges.gold > 0 && (
            <BadgeIcon type="gold" count={user.badges.gold} />
          )}
          {user.badges.silver > 0 && (
            <BadgeIcon type="silver" count={user.badges.silver} />
          )}
          {user.badges.bronze > 0 && (
            <BadgeIcon type="bronze" count={user.badges.bronze} />
          )}
        </>
      )}

      {/* Specjalne odznaki */}
      {user.badges && (
        <>
          {user.badges.first_question && (
            <BadgeIcon type="first_question" size="sm" />
          )}
          {user.badges.first_answer && (
            <BadgeIcon type="first_answer" size="sm" />
          )}
          {user.badges.helpful_answer && (
            <BadgeIcon type="helpful_answer" size="sm" />
          )}
          {user.badges.popular_question && (
            <BadgeIcon type="popular_question" size="sm" />
          )}
          {user.badges.active_user && (
            <BadgeIcon type="active_user" size="sm" />
          )}
          {user.badges.expert && <BadgeIcon type="expert" size="sm" />}
          {user.badges.community_companion && (
            <BadgeIcon type="community_companion" size="sm" />
          )}
          {user.badges.community_helper && (
            <BadgeIcon type="community_helper" size="sm" />
          )}
        </>
      )}

      {/* Sprawdź czy użytkownik ma jakiekolwiek odznaki */}
      {(!user.badges ||
        ((!user.badges.gold || user.badges.gold === 0) &&
          (!user.badges.silver || user.badges.silver === 0) &&
          (!user.badges.bronze || user.badges.bronze === 0) &&
          !user.badges.first_question &&
          !user.badges.first_answer &&
          !user.badges.helpful_answer &&
          !user.badges.popular_question &&
          !user.badges.active_user &&
          !user.badges.expert &&
          !user.badges.community_companion &&
          !user.badges.community_helper)) && (
        <span className="text-xs text-cMuted-500">Brak odznak</span>
      )}
    </>
  );
}
