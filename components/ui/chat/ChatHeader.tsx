'use client';

import React from 'react';
import { CardHeader, Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import { DirectChat } from '@/types/chat.types';
import UserDisplay from '@/components/ui/UserDisplay';

interface ChatHeaderProps {
  directChat: DirectChat;
  onBackToDashboard?: () => void;
}

export default function ChatHeader({
  directChat,
  onBackToDashboard,
}: ChatHeaderProps) {
  return (
    <CardHeader className="border-b border-default-200 !p-[18px_18px_11px_18px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBackToDashboard && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-default-600 transition-colors hover:text-cCta-500 xl:hidden"
              onPress={onBackToDashboard}
            >
              <SvgIcon icon="mdi:arrow-left" />
            </Button>
          )}
          <UserDisplay
            user={directChat.other_user}
            variant="profile"
            size="md"
            linkToProfile
            withIndicator
          />
        </div>
      </div>
    </CardHeader>
  );
}
