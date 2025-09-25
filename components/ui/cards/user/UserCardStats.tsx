'use client';

import { SvgIcon } from '@/lib/utils/icons';
import { UserInterface } from '@/types/users.types';

export const UserCardStats = ({ user }: { user: UserInterface }) => {
  const stats = [
    {
      icon: 'mdi:star-outline',
      count: user.reputation,
      label: 'Reputacja',
    },
    {
      icon: 'mdi:help-circle-outline',
      count: user.questions_count,
      label: 'Pytania',
    },
    {
      icon: 'mdi:message-outline',
      count: user.answers_count,
      label: 'Odpowiedzi',
    },
    {
      icon: 'mdi:eye',
      count: user.followers_count,
      label: 'Obserwujący',
    },
    {
      icon: 'mdi:eye-outline',
      count: user.following_count,
      label: 'Obserwowani',
    },
  ];

  return (
    <div className="flex gap-2">
      {stats.map((stat) => {
        return (
          <div key={stat.icon}>
            <div className="flex items-center gap-1 rounded-full bg-cBgDark-700 px-2 py-1 text-xs font-medium text-cMuted-500 transition-colors hover:bg-cBgDark-800">
              <SvgIcon icon={stat.icon} width={14} />
              {stat.count}
            </div>
          </div>
        );
      })}
    </div>
  );
};
