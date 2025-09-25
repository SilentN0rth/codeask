'use client';

import { SvgIcon } from '@/lib/utils/icons';

interface QuestionCardStatsProps {
  likes_count: number;
  unlikes_count: number;
  answers_count: number;
  views_count: number;
  hovered: boolean;
}

export const QuestionCardStats: React.FC<QuestionCardStatsProps> = ({
  likes_count,
  unlikes_count,
  answers_count,
  views_count,
}) => {
  const iconClasses =
    'text-cMuted-500 px-1 rounded-lg text-sm sm:hover:bg-cBgDark-700 sm:transition-colors';

  const stats = [
    {
      icon: 'mdi:thumb-up-outline',
      count: likes_count,
      message: `${likes_count} osób polubiło to pytanie`,
    },
    {
      icon: 'mdi:thumb-down-outline',
      count: unlikes_count,
      message: `${unlikes_count} osób nie polubiło`,
    },
    {
      icon: 'mdi:message-outline',
      count: answers_count,
      message: `${answers_count} odpowiedzi`,
    },
    {
      icon: 'mdi:eye-outline',
      count: views_count,
      message: `${views_count} wyświetleń`,
    },
  ];

  return (
    <div className="flex">
      {stats.map((stat) => (
        <span
          key={stat.icon}
          className={`${iconClasses} flex items-center justify-center gap-1`}
        >
          <SvgIcon icon={stat.icon} width={20} />
          {stat.count}
        </span>
      ))}
    </div>
  );
};
