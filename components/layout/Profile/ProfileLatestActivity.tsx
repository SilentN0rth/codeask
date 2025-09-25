'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import UniversalPagination from '../../ui/UniversalPagination';
import { UserInterface } from '@/types/users.types';
import { formatActivityDateHelper as formatActivityDate } from '@/lib/utils/formatDate';
import { ActivityType } from '@/types/activity.types';
import { SvgIcon } from '@/lib/utils/icons';
import { usePagination } from '@/hooks/usePagination';
import NoResults from '@/components/ui/effects/NoResults';

const PER_PAGE = 10;

const iconMap: Record<ActivityType, React.ReactNode> = {
  question: (
    <SvgIcon
      icon="mdi:comment-question-outline"
      className="text-cCta-500"
      width={18}
    />
  ),
  answer: (
    <SvgIcon
      icon="mdi:comment-text-multiple-outline"
      className="text-cCta-500"
      width={18}
    />
  ),
  like: (
    <SvgIcon icon="mdi:thumb-up-outline" className="text-success" width={18} />
  ),
  dislike: (
    <SvgIcon icon="mdi:thumb-down-outline" className="text-danger" width={18} />
  ),
  report: <SvgIcon icon="mdi:flag" className="text-danger" width={18} />,
  badge: (
    <SvgIcon icon="mdi:medal-outline" className="text-warning" width={18} />
  ),
  joined: (
    <SvgIcon
      icon="mdi:calendar-account"
      className="text-default-500"
      width={18}
    />
  ),
  comment: (
    <SvgIcon
      icon="mdi:comment-outline"
      className="text-default-400"
      width={18}
    />
  ),
  follow: (
    <SvgIcon
      icon="mdi:account-multiple-plus-outline"
      className="text-cCta-500"
      width={18}
    />
  ),
  mention: <SvgIcon icon="mdi:at" className="text-cCta-500" width={18} />,
};

export default function ProfileLatestActivity({
  user,
}: {
  user: UserInterface | null;
}) {
  const recentActivity = user?.recent_activity;

  const sortedActivity = recentActivity
    ? [...recentActivity].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0;
        }

        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const { paginatedItems, currentPage, totalPages, setPage } = usePagination(
    sortedActivity,
    PER_PAGE,
    '#activity-section'
  );

  if (!user || sortedActivity.length === 0 || paginatedItems.length <= 0) {
    return (
      <NoResults
        title="Brak aktywności"
        description="Użytkownik nie wykonał jeszcze żadnej aktywności."
        hint=""
        icon="mdi:clock-outline"
        className="col-span-full"
        childClassName="w-full"
      />
    );
  }

  return (
    <div className="col-span-full space-y-4" id="activity-section">
      <Card className="border border-divider bg-cBgDark-800 shadow-none">
        <CardBody className="divide-y divide-divider p-0">
          {paginatedItems.map((activity) => {
            const activityDate = new Date(activity.timestamp);
            const isValidDate = !isNaN(activityDate.getTime());
            return (
              <div
                key={`activity-${activity.user_id}-${activity.timestamp}-${Math.random()}`}
                className="flex items-start gap-3 px-4 py-3 text-sm"
              >
                {iconMap[activity.type] ?? (
                  <SvgIcon
                    icon="mdi:help-circle-outline"
                    className="text-default-400"
                    width={18}
                  />
                )}
                <div>
                  <p>{activity.description}</p>
                  <p className="text-xs text-default-400">
                    {isValidDate
                      ? formatActivityDate(activityDate)
                      : 'Nieznana data'}
                  </p>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4">
          <UniversalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mx-auto"
            ariaLabel="Przejdź między stronami aktywności"
          />
        </div>
      )}
    </div>
  );
}
