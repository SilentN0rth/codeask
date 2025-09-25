import { UserInterface } from './users.types';

// Database types matching the schema
export interface MessageInterface {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: UserInterface;
}

export interface ConversationInterface {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  user1?: UserInterface;
  user2?: UserInterface;
  last_message?: MessageInterface;
  unread_count?: number;
}

// UI-friendly types
export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
    is_online: boolean;
    profile_slug: string;
  };
  content: string;
  timestamp: Date;
  is_own: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  last_message: string;
  last_messagetime: Date;
  unread_count: number;
  participants: Array<{
    id: string;
    username: string;
    avatar_url: string;
    is_online: boolean;
    profile_slug: string;
  }>;
}

// Typ dla rozmowy jeden na jeden
export interface DirectChat {
  id: string;
  other_user: {
    id: string;
    name: string;
    username: string;
    avatar_url: string;
    is_online: boolean;
    profile_slug: string;
  };
  last_message: string;
  last_message_time: Date;
  unread_count: number;
}

export interface ChatParticipant {
  id: string;
  username: string;
  avatar_url: string;
  is_online: boolean;
  profile_slug: string;
}

// Request/Response types
export interface CreateConversationRequest {
  user1_id: string;
  user2_id: string;
}

export interface SendMessageRequest {
  conversation_id: string;
  sender_id: string;
  content: string;
}
