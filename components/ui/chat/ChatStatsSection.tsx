'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import ChatStatsCard from './ChatStatsCard';

interface ChatStats {
  totalConversations: number;
  unreadMessages: number;
  activeUsers: number;
  lastActivity: string;
}

interface ChatStatsSectionProps {
  stats: ChatStats;
}

export default function ChatStatsSection({ stats }: ChatStatsSectionProps) {
  const fadeIn = useFadeIn(0, 0.3);

  const statsData = [
    {
      icon: 'mdi:message-outline',
      title: 'Konwersacje',
      value: stats.totalConversations,
      delay: 0.3,
    },
    {
      icon: 'mdi:message-unread-outline',
      title: 'Nieprzeczytane',
      value: stats.unreadMessages,
      delay: 0.4,
    },
    {
      icon: 'solar:users-group-two-rounded-outline',
      title: 'Aktywni użytkownicy',
      value: stats.activeUsers,
      delay: 0.5,
    },
    {
      icon: 'mdi:clock-outline',
      title: 'Ostatnia aktywność',
      value: stats.lastActivity,
      delay: 0.6,
    },
  ];
  return (
    <div className="mb-4 sm:mb-6">
      <h2 className="mb-2 text-base font-semibold text-cTextDark-100 sm:mb-3 sm:text-lg">
        Statystyki
      </h2>
      <div className="flex flex-wrap gap-2">
        {statsData.map((stat) => (
          <motion.div
            key={stat.title}
            {...fadeIn}
            transition={{ delay: stat.delay }}
            className=""
          >
            <ChatStatsCard
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
