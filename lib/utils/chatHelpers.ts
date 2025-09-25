import {
  ConversationInterface,
  MessageInterface,
  DirectChat,
  Message,
} from '@/types/chat.types';
import { UserInterface } from '@/types/users.types';

/**
 * Get the other user in a conversation (not the current user)
 */
export function getOtherUser(
  conversation: ConversationInterface,
  currentUserId: string
): UserInterface | null {
  if (conversation.user1_id === currentUserId) {
    return conversation.user2 ?? null;
  } else if (conversation.user2_id === currentUserId) {
    return conversation.user1 ?? null;
  }
  return null;
}

/**
 * Convert a ConversationInterface to DirectChat for UI
 */
export function conversationToDirectChat(
  conversation: ConversationInterface,
  currentUserId: string,
  lastMessage?: MessageInterface
): DirectChat | null {
  const otherUser = getOtherUser(conversation, currentUserId);

  if (!otherUser) return null;

  // Don't fetch unread count here to avoid excessive requests
  // Unread count will be updated via real-time subscriptions
  const unreadCount = 0; // Placeholder - will be updated by real-time

  return {
    id: conversation.id,
    other_user: {
      id: otherUser.id,
      name: otherUser.name,
      username: otherUser.username,
      avatar_url: otherUser.avatar_url,
      is_online: otherUser.is_online ?? false,
      profile_slug: otherUser.profile_slug ?? '',
    },
    last_message: lastMessage?.content ?? '',
    last_message_time: lastMessage
      ? new Date(lastMessage.created_at)
      : new Date(conversation.updated_at),
    unread_count: unreadCount,
  };
}

/**
 * Convert MessageInterface to Message for UI
 */
export function messageToUIMessage(
  message: MessageInterface,
  currentUserId: string
): Message {
  return {
    id: message.id,
    sender: {
      id: message.sender_id,
      name: message.sender?.name ?? 'Nieznany użytkownik',
      username: message.sender?.username ?? 'Nieznany użytkownik',
      avatar_url: message.sender?.avatar_url ?? '',
      is_online: message.sender?.is_online ?? false,
      profile_slug: message.sender?.profile_slug ?? '',
    },
    content: message.content,
    timestamp: new Date(message.created_at),
    is_own: message.sender_id === currentUserId,
  };
}

/**
 * Format conversation list with last messages
 */
export function formatConversationsForUI(
  conversations: ConversationInterface[],
  currentUserId: string
): DirectChat[] {
  const directChats = conversations.map((conversation) =>
    conversationToDirectChat(
      conversation,
      currentUserId,
      conversation.last_message
    )
  );

  return directChats
    .filter((chat): chat is DirectChat => chat !== null)
    .sort(
      (a, b) => b.last_message_time.getTime() - a.last_message_time.getTime()
    );
}

/**
 * Format messages for UI
 */
export function formatMessagesForUI(
  messages: MessageInterface[],
  currentUserId: string
): Message[] {
  return messages.map((message) => messageToUIMessage(message, currentUserId));
}

/**
 * Filter conversations by search query
 */
export function filterConversationsBySearch(
  conversations: ConversationInterface[],
  currentUserId: string,
  searchQuery: string
): ConversationInterface[] {
  if (!searchQuery.trim()) return conversations;

  const query = searchQuery.toLowerCase().trim();

  return conversations.filter((conversation) => {
    const otherUser = getOtherUser(conversation, currentUserId);
    if (!otherUser) return false;

    // Search by user name or username
    const nameMatch = otherUser.name.toLowerCase().includes(query);
    const usernameMatch = otherUser.username.toLowerCase().includes(query);

    // Search by last message content
    const messageMatch =
      conversation.last_message?.content.toLowerCase().includes(query) ?? false;

    return nameMatch || usernameMatch || messageMatch;
  });
}
