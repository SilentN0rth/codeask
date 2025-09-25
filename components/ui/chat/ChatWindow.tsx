'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Button } from '@heroui/react';
import { SvgIcon } from '@/lib/utils/icons';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

import { Message, DirectChat } from '@/types/chat.types';

interface ChatWindowProps {
  selectedDirectChat: DirectChat | undefined;
  messages: Message[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onDeleteMessage: (id: string) => void;
  onEditMessage: (id: string, newContent: string) => void;
  hasMoreMessages: boolean;
  onLoadMoreMessages: () => void;
  loading: boolean;
  onBackToDashboard?: () => void;
}

export default function ChatWindow({
  selectedDirectChat,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
  onDeleteMessage,
  onEditMessage,
  hasMoreMessages,
  onLoadMoreMessages,
  loading,
  onBackToDashboard,
}: ChatWindowProps) {
  const fadeIn = useFadeIn(0, 0.3);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const lastMessageCountRef = useRef(0);
  const isLoadingOlderMessagesRef = useRef(false);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const isNearBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 100;
  };

  useEffect(() => {
    const messageCount = messages.length;
    const isNewMessage = messageCount > lastMessageCountRef.current;

    if (
      isNewMessage &&
      !isLoadingOlderMessagesRef.current &&
      (isNearBottom() || !isUserScrollingRef.current)
    ) {
      setTimeout(scrollToBottom, 100);
    }

    lastMessageCountRef.current = messageCount;
  }, [messages]);

  const handleLoadMoreMessages = () => {
    isLoadingOlderMessagesRef.current = true;
    onLoadMoreMessages();

    setTimeout(() => {
      isLoadingOlderMessagesRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isUserScrollingRef.current = true;

      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      {...fadeIn}
      transition={{ delay: 0.2 }}
      className="h-full xl:col-span-2"
    >
      <Card
        shadow="none"
        className="flex h-[calc(100svh-190px)] flex-col overflow-hidden rounded-xl border-none bg-cBgDark-800 backdrop-blur-sm transition-all duration-300"
      >
        {selectedDirectChat ? (
          <>
            <ChatHeader
              directChat={selectedDirectChat}
              onBackToDashboard={onBackToDashboard}
            />
            <CardBody className="flex-1 overflow-hidden p-0">
              <div className="flex h-full flex-col">
                <div
                  ref={messagesContainerRef}
                  className="flex-1 space-y-4 overflow-y-auto p-4"
                >
                  {hasMoreMessages && (
                    <div className="flex justify-center py-2">
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={handleLoadMoreMessages}
                        isLoading={loading}
                        className="text-xs"
                      >
                        Załaduj więcej wiadomości
                      </Button>
                    </div>
                  )}

                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onDelete={onDeleteMessage}
                      onEdit={onEditMessage}
                    />
                  ))}
                </div>
                <MessageInput
                  newMessage={newMessage}
                  onMessageChange={onMessageChange}
                  onSendMessage={onSendMessage}
                  isSending={loading}
                />
              </div>
            </CardBody>
          </>
        ) : (
          <CardBody className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <SvgIcon
                icon="mdi:chat-outline"
                className="mb-4 text-6xl text-default-400"
              />
              <h3 className="mb-2 text-lg font-semibold text-default-900">
                Wybierz rozmowę
              </h3>
              <p className="text-default-600">
                Wybierz użytkownika z listy, aby rozpocząć prywatną rozmowę
              </p>
            </div>
          </CardBody>
        )}
      </Card>
    </motion.div>
  );
}
