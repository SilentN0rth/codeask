'use client';

import React, { useState, useEffect } from 'react';
import { useIsLargeScreen } from '@/hooks/useWindowSize';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { ChatRoomList, ChatWindow } from '@/components/ui/chat';
import ChatDashboard from '@/components/ui/chat/ChatDashboard';
import NewConversationModal from '@/components/ui/chat/NewConversationModal';
import FindUsersModal from '@/components/ui/chat/FindUsersModal';
import { DirectChat } from '@/types/chat.types';
import { Card } from '@heroui/react';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useChat } from '@/hooks/useChat';
import {
  formatConversationsForUI,
  formatMessagesForUI,
  filterConversationsBySearch,
} from '@/lib/utils/chatHelpers';
import Loading from '@/components/ui/Loading';

export default function ChatPage() {
  const { user, loading } = useAuthRedirect();
  const fadeInUp = useFadeIn(20, 0.3);

  const {
    conversations,
    currentConversation,
    messages,
    sending,
    error: chatError,
    hasMoreMessages,
    chatStats,
    recentConversations,
    selectConversation,
    sendNewMessage,
    createNewConversation,
    loadMoreMessages,
    deleteMessage,
    editMessage,
    loadChatStats,
    markAsRead,
    loadRecentConversations,
  } = useChat(user?.id);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConversationModal, setShowNewConversationModal] =
    useState(false);
  const [showFindUsersModal, setShowFindUsersModal] = useState(false);
  const [showDashboardOnMobile, setShowDashboardOnMobile] = useState(false);

  const isLargeScreen = useIsLargeScreen();
  const isMobile = !isLargeScreen;

  const [directChats, setDirectChats] = useState<DirectChat[]>([]);
  const [filteredDirectChats, setFilteredDirectChats] = useState<DirectChat[]>(
    []
  );

  useEffect(() => {
    const updateDirectChats = () => {
      if (user?.id) {
        const formatted = formatConversationsForUI(conversations, user.id);
        setDirectChats(formatted);
      }
    };
    updateDirectChats();
  }, [conversations, user?.id]);

  useEffect(() => {
    const updateFilteredChats = () => {
      if (user?.id) {
        const filtered = filterConversationsBySearch(
          conversations,
          user.id,
          searchQuery
        );
        const formatted = formatConversationsForUI(filtered, user.id);
        setFilteredDirectChats(formatted);
      }
    };
    updateFilteredChats();
  }, [conversations, searchQuery, user?.id]);

  const formattedMessages = formatMessagesForUI(messages, user?.id ?? '');

  const availableChats = searchQuery ? filteredDirectChats : directChats;

  const recentConversationsFormatted = recentConversations.map(
    (user: unknown) => {
      const userData = user as {
        id: string;
        username?: string;
        name?: string;
        avatar_url?: string;
        is_online?: boolean;
        profile_slug?: string;
        last_message?: { content?: string; created_at?: string };
        updated_at?: string;
      };
      return {
        id: `recent-${userData.id}`,
        other_user: {
          id: userData.id,
          username: userData.username ?? userData.name ?? 'Unknown User',
          avatar_url: userData.avatar_url,
          is_online: userData.is_online ?? false,
          profile_slug: userData.profile_slug ?? '',
        },
        last_message: userData.last_message?.content ?? 'Ostatnia rozmowa',
        last_message_time: userData.last_message?.created_at
          ? new Date(userData.last_message.created_at)
          : new Date(userData.updated_at ?? ''),
        unread_count: 0,
      };
    }
  );

  const handleSendMessage = async () => {
    if (newMessage.trim() && !sending) {
      await sendNewMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleChatSelect = async (chatId: string) => {
    setSelectedChat(chatId);
    setHasManuallyOpenedConversation(true);
    await selectConversation(chatId);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleMessageChange = (message: string) => {
    setNewMessage(message);
  };

  const handleCreateNewChat = () => {
    setShowNewConversationModal(true);
  };

  const handleFindUsers = () => {
    setShowFindUsersModal(true);
  };

  const handleSelectUserFromFind = async (userId: string) => {
    const conversation = conversations.find(
      (conv) =>
        (conv.user1_id === user?.id && conv.user2_id === userId) ||
        (conv.user1_id === userId && conv.user2_id === user?.id)
    );

    if (conversation) {
      setSelectedChat(conversation.id);
      setHasManuallyOpenedConversation(true);
      await selectConversation(conversation.id, conversation);
      setShowFindUsersModal(false);
    }
  };

  const handleStartConversation = async (otherUserId: string) => {
    if (user?.id) {
      const conversation = await createNewConversation(otherUserId);
      if (conversation) {
        setSelectedChat(conversation.id);
        setHasManuallyOpenedConversation(true);
        await selectConversation(conversation.id, conversation);
        setShowNewConversationModal(false);

        if (isMobile) {
          setShowDashboardOnMobile(false);
        }
      }
    }
  };

  const handleBackToDashboard = () => {
    setSelectedChat(null);
    setShowDashboardOnMobile(false);
  };

  const handleShowDashboardOnMobile = () => {
    setShowDashboardOnMobile(true);
  };

  useEffect(() => {
    if (user?.id) {
      void loadChatStats();
      void loadRecentConversations();
    }
  }, [user?.id, loadChatStats, loadRecentConversations]);

  const [hasManuallyOpenedConversation, setHasManuallyOpenedConversation] =
    useState(false);

  useEffect(() => {
    if (
      currentConversation?.id &&
      selectedChat === currentConversation.id &&
      hasManuallyOpenedConversation
    ) {
      const timer = setTimeout(() => {
        void markAsRead(currentConversation.id);

        setDirectChats((prev) => {
          return prev.map((chat) => {
            if (chat.id === currentConversation.id) {
              return {
                ...chat,
                unreadCount: 0,
              };
            }
            return chat;
          });
        });

        setFilteredDirectChats((prev) => {
          return prev.map((chat) => {
            if (chat.id === currentConversation.id) {
              return {
                ...chat,
                unreadCount: 0,
              };
            }
            return chat;
          });
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    currentConversation?.id,
    selectedChat,
    markAsRead,
    hasManuallyOpenedConversation,
  ]);

  if (loading) {
    return (
      <div className="container flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  const selectedDirectChat = selectedChat
    ? availableChats.find((chat) => chat.id === selectedChat)
    : undefined;
  const displayedMessages = formattedMessages;

  return (
    <div className="grid h-full min-h-0 flex-1 grid-cols-1 flex-col gap-y-4 xl:container xl:grid-cols-3 xl:gap-x-4">
      <div
        className={`${selectedChat || showDashboardOnMobile ? 'hidden xl:block' : 'block'}`}
      >
        <ChatRoomList
          chatRooms={availableChats}
          selectedChat={selectedChat}
          onChatSelect={(chatId) => void handleChatSelect(chatId)}
          onSearchChange={handleSearchChange}
          onBackToDashboard={handleBackToDashboard}
          showBackButton={selectedChat !== null}
          onNewConversation={() => void handleCreateNewChat()}
          onShowDashboardOnMobile={handleShowDashboardOnMobile}
          showDashboardButton={
            !selectedChat && !showDashboardOnMobile && isMobile
          }
        />
      </div>

      {showDashboardOnMobile && (
        <div className="lg:hidden">
          <Card
            shadow="none"
            className="h-full overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm"
          >
            <ChatDashboard
              stats={chatStats}
              quickActions={[]}
              recentTopics={[]}
              recentConversations={recentConversationsFormatted as DirectChat[]}
              onCreateNewChat={() => void handleCreateNewChat()}
              onSearchUsers={handleFindUsers}
              onStartConversation={(userId) =>
                void handleStartConversation(userId)
              }
              onBackToChatList={() => setShowDashboardOnMobile(false)}
            />
          </Card>
        </div>
      )}

      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.3 }}
        className={`${selectedChat ? 'col-span-1 lg:col-span-2' : 'hidden lg:col-span-2 lg:block'}`}
      >
        <Card
          shadow="none"
          className="h-full overflow-hidden rounded-xl border border-divider bg-cBgDark-800 backdrop-blur-sm"
        >
          {selectedDirectChat ? (
            <ChatWindow
              selectedDirectChat={selectedDirectChat}
              messages={displayedMessages}
              newMessage={newMessage}
              onMessageChange={handleMessageChange}
              onSendMessage={() => void handleSendMessage()}
              onDeleteMessage={(messageId) => void deleteMessage(messageId)}
              onEditMessage={(messageId, content) =>
                void editMessage(messageId, content)
              }
              hasMoreMessages={hasMoreMessages}
              onLoadMoreMessages={() => void loadMoreMessages()}
              loading={sending}
              onBackToDashboard={handleBackToDashboard}
            />
          ) : (
            <ChatDashboard
              stats={chatStats}
              quickActions={[]}
              recentTopics={[]}
              recentConversations={recentConversationsFormatted as DirectChat[]}
              onCreateNewChat={() => void handleCreateNewChat()}
              onSearchUsers={handleFindUsers}
              onStartConversation={(userId) =>
                void handleStartConversation(userId)
              }
            />
          )}
        </Card>
      </motion.div>

      {chatError && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-red-500 p-3 text-white shadow-lg">
          {chatError}
        </div>
      )}

      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => {
          setShowNewConversationModal(false);
        }}
        onStartConversation={(userId) => {
          void handleStartConversation(userId);
        }}
        currentUserId={user?.id ?? ''}
      />

      <FindUsersModal
        isOpen={showFindUsersModal}
        onClose={() => {
          setShowFindUsersModal(false);
        }}
        onSelectUser={(userId) => {
          void handleSelectUserFromFind(userId);
        }}
        currentUserId={user?.id ?? ''}
      />
    </div>
  );
}
