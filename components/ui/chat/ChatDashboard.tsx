'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import ChatStatsSection from './ChatStatsSection';
import ChatQuickActionsSection from './ChatQuickActionsSection';
import { DirectChat } from '@/types/chat.types';
import RecentConversationsSection from './RecentConversationsSection';

interface ChatStats {
  totalConversations: number;
  unreadMessages: number;
  activeUsers: number;
  lastActivity: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
}

interface ChatDashboardProps {
  stats: ChatStats;
  quickActions: QuickAction[];
  recentTopics: Array<{
    id: string;
    name: string;
    participants: number;
    lastActivity: string;
  }>;
  recentConversations?: DirectChat[];
  onCreateNewChat: () => void;
  onSearchUsers: () => void;
  onStartConversation?: (userId: string) => void;
  onBackToChatList?: () => void;
}

export default function ChatDashboard({
  stats,
  recentConversations = [],
  onCreateNewChat,
  onSearchUsers,
  onStartConversation,
  onBackToChatList,
}: ChatDashboardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden p-5">
      <div className="mb-6 flex-shrink-0">
        {onBackToChatList && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="mb-2 flex gap-3 text-default-600 transition-colors hover:text-cCta-500 lg:hidden"
            onPress={onBackToChatList}
          >
            <SvgIcon icon="mdi:arrow-left" />
          </Button>
        )}
        <h1 className="text-base text-cMuted-500">
          Komunikuj się z innymi użytkownikami, zadawaj pytania i dziel się
          wiedzą
        </h1>
      </div>

      <div className="mb-6 flex-shrink-0">
        <ChatStatsSection stats={stats} />
      </div>

      <div className="mb-3 flex-shrink-0">
        <ChatQuickActionsSection
          onCreateNewChat={onCreateNewChat}
          onSearchUsers={onSearchUsers}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <RecentConversationsSection
          recentConversations={recentConversations}
          onStartConversation={onStartConversation}
        />
      </div>
    </div>
  );
}
