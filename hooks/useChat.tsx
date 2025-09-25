'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ConversationInterface,
  MessageInterface,
  CreateConversationRequest,
} from '@/types/chat.types';
import {
  getUserConversations,
  getUserConversationsWithLastMessages,
  getConversationMessages,
  sendMessage,
  createConversation,
  subscribeToConversationMessages,
  subscribeToUserConversations,
  subscribeToUserMessages,
  deleteMessageClient,
  editMessageClient,
  getUnreadMessagesCount,
  getActiveUsersCount,
  getLastActivityTime,
  markConversationAsRead,
  getRecentConversationUsers,
} from '../supabase/services/client/chat';
import { supabase } from 'supabase/supabaseClient';
import { MESSAGES_PER_PAGE } from '@/constants/Chat';

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

interface UseChatReturn {
  conversations: ConversationInterface[];
  currentConversation: ConversationInterface | null;
  messages: MessageInterface[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  hasMoreMessages: boolean;
  chatStats: {
    totalConversations: number;
    unreadMessages: number;
    activeUsers: number;
    lastActivity: string;
  };
  recentConversations: any[];
  loadConversations: () => Promise<void>;
  selectConversation: (
    conversationId: string,
    conversation?: ConversationInterface
  ) => Promise<void>;
  sendNewMessage: (content: string) => Promise<void>;
  createNewConversation: (
    otherUserId: string
  ) => Promise<ConversationInterface | null>;
  loadMoreMessages: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  loadChatStats: () => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  loadRecentConversations: () => Promise<void>;
}

export function useChat(userId?: string): UseChatReturn {
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    []
  );
  const [currentConversation, setCurrentConversation] =
    useState<ConversationInterface | null>(null);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [chatStats, setChatStats] = useState({
    totalConversations: 0,
    unreadMessages: 0,
    activeUsers: 0,
    lastActivity: 'Brak aktywności',
  });
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const conversationSubscriptionRef = useRef<any>(null);
  const userMessagesSubscriptionRef = useRef<any>(null);

  const loadConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserConversationsWithLastMessages(userId);
      setConversations(data);

      setChatStats((prev) => ({
        ...prev,
        totalConversations: data.length,
      }));
    } catch (err) {
      setError('Błąd podczas ładowania konwersacji');
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const selectConversation = useCallback(
    async (conversationId: string, conversation?: ConversationInterface) => {
      try {
        setLoading(true);
        setError(null);

        const targetConversation =
          conversation || conversations.find((c) => c.id === conversationId);
        if (!targetConversation) {
          setError('Konwersacja nie została znaleziona');
          return;
        }

        setCurrentConversation(targetConversation);

        const messageData = await getConversationMessages(
          conversationId,
          MESSAGES_PER_PAGE,
          0
        );
        setMessages(messageData.reverse());
        setMessagesOffset(messageData.length);
        setHasMoreMessages(messageData.length === MESSAGES_PER_PAGE);
      } catch (err) {
        setError('Błąd podczas ładowania wiadomości');
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    },
    [conversations]
  );

  const loadMoreMessages = useCallback(async () => {
    if (!currentConversation || !hasMoreMessages || loading) return;

    try {
      setLoading(true);
      const newMessages = await getConversationMessages(
        currentConversation.id,
        MESSAGES_PER_PAGE,
        messagesOffset
      );

      if (newMessages.length > 0) {
        setMessages((prev) => [...newMessages.reverse(), ...prev]);
        setMessagesOffset((prev) => prev + newMessages.length);
        setHasMoreMessages(newMessages.length === MESSAGES_PER_PAGE);
      } else {
        setHasMoreMessages(false);
      }
    } catch (err) {
      setError('Błąd podczas ładowania kolejnych wiadomości');
      console.error('Error loading more messages:', err);
    } finally {
      setLoading(false);
    }
  }, [currentConversation, messagesOffset, hasMoreMessages, loading]);

  const sendNewMessage = useCallback(
    async (content: string) => {
      if (!currentConversation || !userId || !content.trim()) return;

      try {
        setSending(true);
        setError(null);

        const newMsg = await sendMessage({
          conversation_id: currentConversation.id,
          sender_id: userId,
          content: content.trim(),
        });

        if (newMsg) {
          setMessages((prev) => [...prev, newMsg]);
        }
      } catch (err) {
        setError('Błąd podczas wysyłania wiadomości');
        console.error('Error sending message:', err);
      } finally {
        setSending(false);
      }
    },
    [currentConversation, userId]
  );

  const createNewConversation = useCallback(
    async (otherUserId: string): Promise<ConversationInterface | null> => {
      if (!userId) return null;

      try {
        setLoading(true);
        setError(null);

        const request: CreateConversationRequest = {
          user1_id: userId,
          user2_id: otherUserId,
        };

        const conversation = await createConversation(request);

        if (conversation) {
          setConversations((prev) => {
            const exists = prev.some((conv) => conv.id === conversation.id);
            if (exists) {
              return prev;
            } else {
              return [conversation, ...prev];
            }
          });
          return conversation;
        }

        return null;
      } catch (err) {
        setError('Błąd podczas tworzenia konwersacji');
        console.error('Error creating conversation:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const success = await deleteMessageClient(messageId);
      if (!success) {
        setError('Nie udało się usunąć wiadomości');
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Błąd podczas usuwania wiadomości');
    }
  }, []);

  const editMessage = useCallback(
    async (messageId: string, newContent: string) => {
      try {
        const success = await editMessageClient(messageId, newContent);
        if (!success) {
          setError('Nie udało się edytować wiadomości');
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    content: newContent,
                  }
                : msg
            )
          );
        }
      } catch (err) {
        console.error('Error editing message:', err);
        setError('Błąd podczas edytowania wiadomości');
      }
    },
    []
  );

  useEffect(() => {
    if (!currentConversation) return;

    if (conversationSubscriptionRef.current) {
      conversationSubscriptionRef.current.unsubscribe();
    }

    conversationSubscriptionRef.current = subscribeToConversationMessages(
      currentConversation.id,
      (newMessage: MessageInterface) => {
        setMessages((prev) =>
          prev.some((msg) => msg.id === newMessage.id)
            ? prev
            : [...prev, newMessage]
        );
      },
      (deletedId: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== deletedId));
      },
      (updatedMessage: MessageInterface) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      }
    );

    return () => {
      if (conversationSubscriptionRef.current) {
        conversationSubscriptionRef.current.unsubscribe();
      }
    };
  }, [currentConversation]);

  useEffect(() => {
    if (!userId) return;

    const subscription = subscribeToUserConversations(
      userId,
      (updatedConversation: ConversationInterface) => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === updatedConversation.id ? updatedConversation : c
          )
        );
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadConversations();
    }
  }, [userId, loadConversations]);

  const loadChatStats = useCallback(async () => {
    if (!userId) return;

    try {
      const [unreadMessages, activeUsers, lastActivity] = await Promise.all([
        getUnreadMessagesCount(userId),
        getActiveUsersCount(),
        getLastActivityTime(userId),
      ]);

      setChatStats((prev) => ({
        ...prev,
        unreadMessages,
        activeUsers,
        lastActivity,
      }));
    } catch (err) {
      console.error('Error loading chat stats:', err);
    }
  }, [userId]);

  const debouncedLoadChatStats = useCallback(debounce(loadChatStats, 1000), [
    loadChatStats,
  ]);

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!userId) return;

      try {
        await markConversationAsRead(conversationId, userId);

        debouncedLoadChatStats();
      } catch (err) {
        console.error('Error marking conversation as read:', err);
      }
    },
    [userId, debouncedLoadChatStats]
  );

  const updateConversationWithNewMessage = useCallback(
    async (message: MessageInterface) => {
      setConversations((prev) => {
        return prev
          .map((conv) => {
            if (conv.id === message.conversation_id) {
              return {
                ...conv,
                last_message: message,
                updated_at: message.created_at,
              };
            }
            return conv;
          })
          .sort((a, b) => {
            const aTime = a.last_message?.created_at || a.updated_at;
            const bTime = b.last_message?.created_at || b.updated_at;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          });
      });

      debouncedLoadChatStats();
    },
    [debouncedLoadChatStats]
  );

  const updateConversationWithUpdatedMessage = useCallback(
    async (message: MessageInterface) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id === message.conversation_id) {
            if (conv.last_message?.id === message.id) {
              return {
                ...conv,
                last_message: message,
              };
            }
          }
          return conv;
        });
      });
    },
    []
  );

  const updateConversationWithDeletedMessage = useCallback(
    async (messageId: string) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.last_message?.id === messageId) {
            return {
              ...conv,
              last_message: undefined,
            };
          }
          return conv;
        });
      });

      debouncedLoadChatStats();
    },
    [debouncedLoadChatStats]
  );

  useEffect(() => {
    if (!userId) return;

    if (userMessagesSubscriptionRef.current) {
      userMessagesSubscriptionRef.current.unsubscribe();
    }

    userMessagesSubscriptionRef.current = subscribeToUserMessages(
      userId,
      updateConversationWithNewMessage,
      updateConversationWithUpdatedMessage,
      updateConversationWithDeletedMessage
    );

    return () => {
      if (userMessagesSubscriptionRef.current) {
        userMessagesSubscriptionRef.current.unsubscribe();
      }
    };
  }, [
    userId,
    updateConversationWithNewMessage,
    updateConversationWithUpdatedMessage,
    updateConversationWithDeletedMessage,
  ]);

  const loadRecentConversations = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await getRecentConversationUsers(userId);
      setRecentConversations(data);
    } catch (err) {
      console.error('Error loading recent conversations:', err);
    }
  }, [userId]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    sending,
    error,
    hasMoreMessages,
    chatStats,
    recentConversations,
    loadConversations,
    selectConversation,
    sendNewMessage,
    createNewConversation,
    loadMoreMessages,
    deleteMessage,
    editMessage,
    loadChatStats,
    markAsRead,
    loadRecentConversations,
  };
}
