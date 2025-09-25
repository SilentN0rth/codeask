'use client';

import React from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { DirectChat } from '@/types/chat.types';
import UserDisplay from '@/components/ui/UserDisplay';
import { formatRelativeTimeHelper as formatRelativeTime } from '@/lib/utils/formatDate';
import { SvgIcon } from '@/lib/utils/icons';

interface RecentConversationsSectionProps {
  recentConversations: DirectChat[];
  onStartConversation?: (userId: string) => void;
}

export default function RecentConversationsSection({
  recentConversations,
  onStartConversation,
}: RecentConversationsSectionProps) {
  return (
    <Card
      className="rounded-none border-t border-divider bg-cBgDark-800 lg:rounded-xl lg:border"
      shadow="none"
    >
      <CardBody className="px-0 pb-0 pt-6 lg:p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 size-12 rounded-full bg-cCta-500/20 p-3">
            <SvgIcon
              icon="solar:chat-round-dots-bold"
              className="size-6 text-cCta-500"
            />
          </div>
          <p className="mb-4 text-cMuted-500">
            Użytkownicy, z którymi ostatnio prowadziłeś rozmowy. Zobacz, kto
            jest online i zacznij rozmawiać!
          </p>
        </div>

        <div className="space-y-3">
          {recentConversations.slice(0, 3).map((conversation, index) => (
            <motion.div
              key={conversation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.2,
                  delay: index * 0.1,
                },
              }}
              className="group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent bg-cBgDark-700/50 p-3 transition-all duration-300 hover:border-cCta-500/30 hover:bg-cBgDark-700/80"
              onClick={() => onStartConversation?.(conversation.other_user.id)}
            >
              <div className="flex-shrink-0">
                <UserDisplay
                  user={conversation.other_user}
                  variant="withNick"
                  size="sm"
                  linkToProfile={false}
                  withIndicator
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="ml-2 flex-shrink-0 text-xs text-cMuted-500">
                    {formatRelativeTime(conversation.last_message_time)}
                  </p>
                </div>
              </div>

              <div className="relative hidden overflow-hidden lg:block">
                <div className="translate-x-8 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-cCta-500 transition-all duration-300 hover:bg-cCta-500/10"
                    onPress={() =>
                      onStartConversation?.(conversation.other_user.id)
                    }
                  >
                    <SvgIcon icon="mdi:arrow-right" className="size-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {recentConversations.length === 0 && (
          <div className="py-4 text-center">
            <p className="text-sm text-cMuted-500">
              Nie masz jeszcze żadnych rozmów. Rozpocznij nową konwersację!
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
