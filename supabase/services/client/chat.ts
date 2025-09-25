'use client';
import { supabase } from 'supabase/supabaseClient';
import { formatRelativeTimeHelper as formatRelativeTime } from '@/lib/utils/formatDate';
import {
  ConversationInterface,
  MessageInterface,
  CreateConversationRequest,
  SendMessageRequest,
} from '@/types/chat.types';

const lastMessageCache = new Map<
  string,
  { message: MessageInterface | null; timestamp: number }
>();
const CACHE_DURATION = 30000; // 30 seconds

export const clearLastMessageCache = (conversationId: string) => {
  lastMessageCache.delete(conversationId);
};
import { UserInterface } from '@/types/users.types';
import { MESSAGES_PER_PAGE } from '@/constants/Chat';
export const getUserConversations = async (
  userId: string
): Promise<ConversationInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        user1:users!user1_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        ),
        user2:users!user2_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        )
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Błąd przy pobieraniu konwersacji:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu konwersacji:', err);
    return [];
  }
};

export const getConversationById = async (
  conversationId: string
): Promise<ConversationInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        user1:users!user1_id (
          id,
          name,
          username,
          avatar_url,
          is_online
        ),
        user2:users!user2_id (
          id,
          name,
          username,
          avatar_url,
          is_online
        )
      `
      )
      .eq('id', conversationId)
      .single();

    if (error) {
      console.error('Błąd przy pobieraniu konwersacji:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu konwersacji:', err);
    return null;
  }
};

export const getUserConversationsWithLastMessages = async (
  userId: string
): Promise<ConversationInterface[]> => {
  try {
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        user1:users!user1_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        ),
        user2:users!user2_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        ),
        messages!messages_conversation_id_fkey (
          id,
          content,
          created_at,
          sender_id
        )
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations with messages:', error);
      return [];
    }

    if (!conversations) return [];

    return conversations.map((conversation) => {
      const lastMessage =
        conversation.messages && conversation.messages.length > 0
          ? conversation.messages.sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0]
          : null;

      return {
        ...conversation,
        last_message: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              created_at: lastMessage.created_at,
              sender_id: lastMessage.sender_id,
              conversation_id: conversation.id,
              sender:
                conversation.user1_id === lastMessage.sender_id
                  ? conversation.user1
                  : conversation.user2,
            }
          : undefined,
        messages: undefined,
      };
    });
  } catch (err) {
    console.error(
      'Nieoczekiwany błąd przy pobieraniu konwersacji z wiadomościami:',
      err
    );
    return [];
  }
};

export const createConversation = async (
  request: CreateConversationRequest
): Promise<ConversationInterface | null> => {
  try {
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .or(
        `and(user1_id.eq.${request.user1_id},user2_id.eq.${request.user2_id}),and(user1_id.eq.${request.user2_id},user2_id.eq.${request.user1_id})`
      )
      .single();

    if (existingConversation) {
      return existingConversation;
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([request])
      .select(
        `
        *,
        user1:users!user1_id (
          id,
          name,
          username,
          avatar_url,
          is_online
        ),
        user2:users!user2_id (
          id,
          name,
          username,
          avatar_url,
          is_online
        )
      `
      )
      .single();

    if (error) {
      console.error('Błąd przy tworzeniu konwersacji:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy tworzeniu konwersacji:', err);
    return null;
  }
};

export const getConversationMessages = async (
  conversationId: string,
  limit: number = MESSAGES_PER_PAGE,
  offset: number = 0
): Promise<MessageInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        *,
        sender:users!sender_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        )
      `
      )
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Błąd przy pobieraniu wiadomości:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Nieoczekiwany błąd przy pobieraniu wiadomości:', err);
    return [];
  }
};

export const sendMessage = async (
  request: SendMessageRequest
): Promise<MessageInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([request])
      .select(
        `
        *,
        sender:users!sender_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        )
      `
      )
      .single();

    if (error) {
      console.error('Błąd przy wysyłaniu wiadomości:', error);
      return null;
    }

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', request.conversation_id);

    clearLastMessageCache(request.conversation_id);

    return data;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy wysyłaniu wiadomości:', err);
    return null;
  }
};

export const getLastMessageForConversation = async (
  conversationId: string
): Promise<MessageInterface | null> => {
  const cached = lastMessageCache.get(conversationId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.message;
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select(
        `
        *,
        sender:users!sender_id (
          id,
          name,
          username,
          avatar_url,
          is_online,
          profile_slug
        )
      `
      )
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Błąd przy pobieraniu ostatniej wiadomości:', error);
      return null;
    }

    const message = data && data.length > 0 ? data[0] : null;

    lastMessageCache.set(conversationId, { message, timestamp: Date.now() });

    return message;
  } catch (err) {
    console.error(
      'Nieoczekiwany błąd przy pobieraniu ostatniej wiadomości:',
      err
    );
    return null;
  }
};

export const subscribeToConversationMessages = (
  conversationId: string,
  onInsert: (message: MessageInterface) => void,
  onDelete: (messageId: string) => void,
  onUpdate: (message: MessageInterface) => void
) => {
  const channel = supabase.channel('messages_changes');
  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
    },
    async (payload: any) => {
      if (payload.new.conversation_id === conversationId) {
        const { data } = await supabase
          .from('messages')
          .select(
            `
              *,
              sender:users!sender_id (
                id,
                name,
                username,
                avatar_url,
                is_online
              )
            `
          )
          .eq('id', payload.new.id)
          .single();
        if (data) {
          onInsert(data as MessageInterface);
        }
      }
    }
  );

  channel.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
    },
    async (payload: any) => {
      if (payload.new.conversation_id === conversationId) {
        const { data } = await supabase
          .from('messages')
          .select(
            `
              *,
              sender:users!sender_id (
                id,
                name,
                username,
                avatar_url,
                is_online
              )
            `
          )
          .eq('id', payload.new.id)
          .single();
        if (data) {
          onUpdate(data as MessageInterface);
        } else {
        }
      } else {
      }
    }
  );

  // Listen for deeted messages (all messages, then filter)
  channel.on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'messages',
    },
    (payload: any) => {
      const messageId = payload.old?.id || payload.id;
      const oldConversationId = payload.old?.conversation_id;

      if (
        messageId &&
        (!oldConversationId || oldConversationId === conversationId)
      ) {
        onDelete(messageId);
      }
    }
  );
  channel.subscribe();
  return channel;
};

export const subscribeToUserConversations = (
  userId: string,
  callback: (conversation: ConversationInterface) => void
) => {
  return supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `or(user1_id.eq.${userId},user2_id.eq.${userId})`,
      },
      async (payload) => {
        const { data } = await supabase
          .from('conversations')
          .select(
            `
            *,
            user1:users!user1_id (
              id,
              name,
              username,
              avatar_url,
              is_online,
              profile_slug
            ),
            user2:users!user2_id (
              id,
              name,
              username,
              avatar_url,
              is_online,
              profile_slug
            )
          `
          )
          .eq('id', (payload.new as any).id)
          .single();

        if (data) {
          callback(data);
        }
      }
    )
    .subscribe();
};

export const subscribeToUserMessages = (
  userId: string,
  onNewMessage: (message: MessageInterface) => void,
  onMessageUpdate: (message: MessageInterface) => void,
  onMessageDelete: (messageId: string) => void
) => {
  const channel = supabase.channel(`user_messages:${userId}`);

  channel.on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
    },
    async (payload: any) => {
      // Check if this message is in a conversation where user participates
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', payload.new.conversation_id)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .single();

      if (conversation) {
        const messageData = {
          ...payload.new,
          sender: {
            id: payload.new.sender_id,
          },
        };
        onNewMessage(messageData as MessageInterface);
      }
    }
  );

  channel.on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
    },
    async (payload: any) => {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', payload.new.conversation_id)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .single();

      if (conversation) {
        const messageData = {
          ...payload.new,
          sender: {
            id: payload.new.sender_id,
          },
        };
        onMessageUpdate(messageData as MessageInterface);
      }
    }
  );

  channel.on(
    'postgres_changes',
    {
      event: 'DELETE',
      schema: 'public',
      table: 'messages',
    },
    async (payload: any) => {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', payload.old.conversation_id)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .single();

      if (conversation) {
        onMessageDelete(payload.old.id);
      }
    }
  );

  channel.subscribe();
  return channel;
};

export const deleteMessageClient = async (
  messageId: string
): Promise<boolean> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return false;
    }

    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('id', messageId)
      .single();

    if (fetchError || !message) {
      console.error('Error fetching message:', fetchError);
      return false;
    }

    if (message.sender_id !== currentUser.user.id) {
      return false;
    }

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Błąd przy usuwaniu wiadomości:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy usuwaniu wiadomości:', err);
    return false;
  }
};

export const editMessageClient = async (
  messageId: string,
  newContent: string
): Promise<boolean> => {
  try {
    const { data: currentUser } = await supabase.auth.getUser();
    if (!currentUser.user) {
      return false;
    }

    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('id', messageId)
      .single();

    if (fetchError || !message) {
      console.error('Error fetching message:', fetchError);
      return false;
    }

    if (message.sender_id !== currentUser.user.id) {
      return false;
    }

    const { error } = await supabase
      .from('messages')
      .update({
        content: newContent.trim(),
      })
      .eq('id', messageId);

    if (error) {
      console.error('Błąd przy edytowaniu wiadomości:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy edytowaniu wiadomości:', err);
    return false;
  }
};

export const markConversationAsRead = async (
  conversationId: string,
  userId: string
): Promise<boolean> => {
  try {
    if (!window.localStorage) {
      return false;
    }

    const lastReadKey = `conversation_${conversationId}_${userId}_last_read`;
    localStorage.setItem(lastReadKey, new Date().toISOString());
    return true;
  } catch (err) {
    console.error('Error marking conversation as read:', err);
    return false;
  }
};

export const getLastReadTime = (
  conversationId: string,
  userId: string
): Date | null => {
  try {
    if (!window.localStorage) {
      return null;
    }

    const lastReadKey = `conversation_${conversationId}_${userId}_last_read`;
    const lastReadTime = localStorage.getItem(lastReadKey);
    return lastReadTime ? new Date(lastReadTime) : null;
  } catch (err) {
    console.error('Error getting last read time:', err);
    return null;
  }
};

export const getUnreadMessagesCount = async (
  userId: string
): Promise<number> => {
  try {
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (convError) {
      console.error('Error fetching conversations:', convError);
      return 0;
    }

    if (!conversations || conversations.length === 0) {
      return 0;
    }

    const conversationIds = conversations.map((c) => c.id);
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('created_at, conversation_id')
      .in('conversation_id', conversationIds)
      .neq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (msgError) {
      console.error('Error fetching messages:', msgError);
      return 0;
    }

    if (!messages || messages.length === 0) {
      return 0;
    }

    const conversationUnreadCounts = new Map<string, number>();

    for (const message of messages) {
      const conversationId = message.conversation_id;
      const lastReadTime = getLastReadTime(conversationId, userId);

      if (new Date(message.created_at) > (lastReadTime || new Date(0))) {
        conversationUnreadCounts.set(
          conversationId,
          (conversationUnreadCounts.get(conversationId) || 0) + 1
        );
      }
    }

    return Array.from(conversationUnreadCounts.values()).reduce(
      (sum, count) => sum + count,
      0
    );
  } catch (err) {
    console.error('Unexpected error counting unread messages:', err);
    return 0;
  }
};

export const getActiveUsersCount = async (): Promise<number> => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_online', true);

    if (error) {
      console.error('Error counting active users:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Unexpected error counting active users:', err);
    return 0;
  }
};

export const getUnreadMessagesCountForConversation = async (
  conversationId: string,
  userId: string
): Promise<number> => {
  try {
    const lastReadTime = getLastReadTime(conversationId, userId);

    const { data: messages, error } = await supabase
      .from('messages')
      .select('created_at')
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        'Error getting messages for conversation:',
        conversationId,
        error
      );
      return 0;
    }

    if (!messages || messages.length === 0) return 0;

    const unreadCount = lastReadTime
      ? messages.filter((msg) => new Date(msg.created_at) > lastReadTime).length
      : messages.length;

    return unreadCount;
  } catch (err) {
    console.error(
      'Unexpected error counting unread messages for conversation:',
      err
    );
    return 0;
  }
};

export const getLastActivityTime = async (userId: string): Promise<string> => {
  try {
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (!conversations || conversations.length === 0) {
      return 'Brak aktywności';
    }

    const conversationIds = conversations.map((c) => c.id);

    const { data: messages, error } = await supabase
      .from('messages')
      .select('created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error getting last activity:', error);
      return 'Błąd';
    }

    if (!messages || messages.length === 0) {
      return 'Brak aktywności';
    }

    const lastActivity = new Date(messages[0].created_at);
    const now = new Date();
    const diffMs = now.getTime() - lastActivity.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'Teraz';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} min temu`;
    } else if (diffHours < 24) {
      return `${diffHours} godz. temu`;
    } else if (diffDays < 7) {
      return `${diffDays} dni temu`;
    } else {
      return formatRelativeTime(lastActivity);
    }
  } catch (err) {
    console.error('Unexpected error getting last activity:', err);
    return 'Błąd';
  }
};

export const getUsersWithConversations = async (
  userId: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        user1:users!user1_id (
          id,
          name,
          username,
          avatar_url,
          bio,
          is_online,
          profile_slug
        ),
        user2:users!user2_id (
          id,
          name,
          username,
          avatar_url,
          bio,
          is_online,
          profile_slug
        )
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (error) {
      console.error('Error fetching users with conversations:', error);
      return [];
    }

    const users: any[] = [];
    data.forEach((conv) => {
      if (conv.user1 && conv.user1.id !== userId) {
        users.push(conv.user1);
      }
      if (conv.user2 && conv.user2.id !== userId) {
        users.push(conv.user2);
      }
    });

    // Remove duplicates based on user id
    const uniqueUsers = users.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );

    return uniqueUsers;
  } catch (err) {
    console.error('Error getting users with conversations:', err);
    return [];
  }
};

export const getUsersWithoutConversations = async (
  userId: string
): Promise<any[]> => {
  try {
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, name, username, avatar_url, bio, is_online, profile_slug')
      .neq('id', userId);

    if (allUsersError) {
      console.error('Error fetching all users:', allUsersError);
      return [];
    }

    const usersWithConversations = await getUsersWithConversations(userId);

    const conversationUserIds = usersWithConversations.map((user) => user.id);

    const usersWithoutConversations = allUsers.filter(
      (user) => !conversationUserIds.includes(user.id)
    );

    return usersWithoutConversations;
  } catch (err) {
    console.error('Error getting users without conversations:', err);
    return [];
  }
};

export const getRecentConversationUsers = async (
  userId: string
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        *,
        user1:users!user1_id (
          id,
          name,
          username,
          avatar_url,
          bio,
          is_online,
          profile_slug
        ),
        user2:users!user2_id (
          id,
          name,
          username,
          avatar_url,
          bio,
          is_online,
          profile_slug
        )
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching recent conversation users:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const conversationsWithMessages = data.map((conversation) => ({
      ...conversation,
      last_message: undefined,
    }));

    const users: any[] = [];
    conversationsWithMessages.forEach((conv) => {
      if (conv.user1 && conv.user1.id !== userId) {
        users.push({
          ...conv.user1,
          conversation_id: conv.id,
          last_message: conv.last_message,
          updated_at: conv.updated_at,
        });
      }
      if (conv.user2 && conv.user2.id !== userId) {
        users.push({
          ...conv.user2,
          conversation_id: conv.id,
          last_message: conv.last_message,
          updated_at: conv.updated_at,
        });
      }
    });

    const uniqueUsers = users.filter(
      (user, index, self) => index === self.findIndex((u) => u.id === user.id)
    );

    return uniqueUsers.slice(0, 3);
  } catch (err) {
    console.error('Error getting recent conversation users:', err);
    return [];
  }
};
