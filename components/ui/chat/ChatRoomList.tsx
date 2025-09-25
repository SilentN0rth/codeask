'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Chip,
  Tooltip,
} from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { DirectChat } from '@/types/chat.types';
import UserDisplay from '@/components/ui/UserDisplay';
import { formatRelativeTimeShortHelper as formatRelativeTimeShort } from '@/lib/utils/formatDate';

interface ChatRoomListProps {
  chatRooms: DirectChat[];
  selectedChat: string | null;
  onChatSelect: (chatId: string) => void;
  onSearchChange: (query: string) => void;
  onBackToDashboard?: () => void;
  showBackButton?: boolean;
  onNewConversation?: () => void;
  onShowDashboardOnMobile?: () => void;
  showDashboardButton?: boolean;
}

export default function ChatRoomList({
  chatRooms,
  selectedChat,
  onChatSelect,
  onSearchChange,
  onBackToDashboard,
  showBackButton = false,
  onNewConversation,
  onShowDashboardOnMobile,
  showDashboardButton = false,
}: ChatRoomListProps) {
  const fadeIn = useFadeIn(0, 0.3);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const filteredChatRooms = useMemo(() => {
    const query = localSearchQuery.toLowerCase().trim();
    if (!query) return chatRooms;

    return chatRooms.filter((chat) =>
      chat.other_user.username.toLowerCase().includes(query)
    );
  }, [chatRooms, localSearchQuery]);

  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <motion.div
      {...fadeIn}
      transition={{ delay: 0.1 }}
      className="flex h-full flex-col lg:col-span-1"
    >
      <Card
        shadow="none"
        className="flex h-full flex-col overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm transition-all duration-300"
      >
        <CardHeader className="flex-shrink-0 border-b-1 border-default-200/50 !p-[18px]">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Tooltip
                content={
                  showDashboardButton ? 'Pokaż dashboard' : 'Wróć do dashboardu'
                }
                placement="bottom"
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-default-600 transition-colors hover:text-cCta-500"
                  aria-label="Wróć do dashboardu"
                  onPress={
                    showDashboardButton && onShowDashboardOnMobile
                      ? onShowDashboardOnMobile
                      : showBackButton && onBackToDashboard
                        ? onBackToDashboard
                        : undefined
                  }
                  isDisabled={!showDashboardButton && !showBackButton}
                >
                  <SvgIcon icon="mdi:arrow-left" />
                </Button>
              </Tooltip>
            </div>
            <Input
              placeholder="Szukaj użytkownika..."
              value={localSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              startContent={
                <SvgIcon icon="mdi:magnify" className="text-default-400" />
              }
              classNames={{
                input: 'text-base',
                inputWrapper:
                  'bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider',
              }}
            />
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-default-600 transition-colors hover:text-cCta-500"
              title="Nowa konwersacja"
              onPress={onNewConversation}
              endContent={<SvgIcon icon="mdi:plus" />}
            />
          </div>
        </CardHeader>
        <CardBody className="min-h-0 flex-1 p-0">
          <div className="h-full max-h-[calc(100vh-300px)] space-y-1 overflow-y-auto overflow-x-hidden">
            {filteredChatRooms.length > 0 ? (
              filteredChatRooms.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className={`group cursor-pointer p-4 transition-all duration-200 ${
                      selectedChat === chat.id
                        ? 'border-l-4 border-cCta-500 bg-cCta-500/10'
                        : 'border-l-4 border-transparent hover:bg-default-100/30'
                    }`}
                    onClick={() => onChatSelect(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChatSelect(chat.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex gap-4">
                      <UserDisplay
                        user={chat.other_user}
                        variant="profile"
                        size="sm"
                        linkToProfile={false}
                        withIndicator
                      />
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-default-500">
                            {formatRelativeTimeShort(chat.last_message_time)}
                          </span>
                        </div>
                        <p className="mb-2 truncate text-sm text-default-600">
                          {chat.last_message || 'Brak wiadomości'}
                        </p>
                        <div className="flex items-center justify-between">
                          {chat.unread_count > 0 && (
                            <Chip
                              size="sm"
                              color="primary"
                              variant="solid"
                              className="text-xs"
                            >
                              {chat.unread_count}
                            </Chip>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <SvgIcon
                    icon="mdi:account-search"
                    className="size-12 text-default-400"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-default-600">
                      Brak użytkowników
                    </h3>
                    <p className="mt-1 text-xs text-default-400">
                      Nie znaleziono użytkowników z &quot;{localSearchQuery}
                      &quot;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
