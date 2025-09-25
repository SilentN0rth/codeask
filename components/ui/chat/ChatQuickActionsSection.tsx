'use client';

import React from 'react';
import { Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';

interface ChatQuickActionsSectionProps {
  onCreateNewChat: () => void;
  onSearchUsers: () => void;
}

export default function ChatQuickActionsSection({
  onCreateNewChat,
  onSearchUsers,
}: ChatQuickActionsSectionProps) {
  const quickActions = [
    {
      title: 'Nowa konwersacja',
      description: 'Rozpocznij nowy czat',
      icon: 'mdi:plus',
      onClick: onCreateNewChat,
    },
    {
      title: 'Znajdź użytkowników',
      description: 'Wyszukaj istniejące konwersacje',
      icon: 'solar:users-group-two-rounded-outline',
      onClick: onSearchUsers,
    },
  ];

  return (
    <div className="mb-6">
      <h2 className="mb-3 text-lg font-semibold text-cTextDark-100">
        Szybkie akcje
      </h2>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant="bordered"
            className="h-16 justify-start border border-divider bg-cBgDark-700/50 transition-all duration-300 hover:border-cCta-500/30 hover:bg-cCta-500/10"
            onPress={action.onClick}
            startContent={
              <SvgIcon icon={action.icon} className="text-xl text-cCta-500" />
            }
          >
            <div className="text-left">
              <p className="font-medium text-cTextDark-100">{action.title}</p>
              <p className="text-xs text-cMuted-500">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
