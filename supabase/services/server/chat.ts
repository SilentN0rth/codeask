'use server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabase } from 'supabase/supabaseClient';
import {
  ConversationInterface,
  MessageInterface,
  CreateConversationRequest,
  SendMessageRequest,
} from '@/types/chat.types';

// Conversations
export async function getUserConversations(
  userId: string
): Promise<ConversationInterface[]> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { data, error } = await supabaseServer
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
}

export async function getConversationById(
  conversationId: string
): Promise<ConversationInterface | null> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { data, error } = await supabaseServer
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
}

export async function createConversation(
  request: CreateConversationRequest
): Promise<ConversationInterface | null> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    // First check if conversation already exists
    const { data: existingConversation } = await supabaseServer
      .from('conversations')
      .select('*')
      .or(
        `and(user1_id.eq.${request.user1_id},user2_id.eq.${request.user2_id}),and(user1_id.eq.${request.user2_id},user2_id.eq.${request.user1_id})`
      )
      .single();

    if (existingConversation) {
      // Get full conversation with user data
      const { data } = await supabaseServer
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
        .eq('id', existingConversation.id)
        .single();

      return data;
    }

    const { data, error } = await supabaseServer
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
}

export async function findConversationBetweenUsers(
  user1Id: string,
  user2Id: string
): Promise<ConversationInterface | null> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { data, error } = await supabaseServer
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
      .or(
        `and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`
      )
      .single();

    if (error) {
      console.error('Błąd przy szukaniu konwersacji:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy szukaniu konwersacji:', err);
    return null;
  }
}

// Messages
export async function getConversationMessages(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<MessageInterface[]> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { data, error } = await supabaseServer
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
}

export async function sendMessage(
  request: SendMessageRequest
): Promise<MessageInterface | null> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { data, error } = await supabaseServer
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

    // Update conversation's updated_at timestamp
    await supabaseServer
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', request.conversation_id);

    return data;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy wysyłaniu wiadomości:', err);
    return null;
  }
}

export async function getLastMessageForConversation(
  conversationId: string
): Promise<MessageInterface | null> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { data, error } = await supabaseServer
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
      .limit(1)
      .single();

    if (error) {
      console.error('Błąd przy pobieraniu ostatniej wiadomości:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(
      'Nieoczekiwany błąd przy pobieraniu ostatniej wiadomości:',
      err
    );
    return null;
  }
}

export async function getConversationsWithLastMessages(
  userId: string
): Promise<ConversationInterface[]> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    // First get all conversations for the user
    const conversations = await getUserConversations(userId);

    // Then get the last message for each conversation
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await getLastMessageForConversation(
          conversation.id
        );
        return {
          ...conversation,
          last_message: lastMessage || undefined,
        };
      })
    );

    return conversationsWithMessages;
  } catch (err) {
    console.error(
      'Nieoczekiwany błąd przy pobieraniu konwersacji z wiadomościami:',
      err
    );
    return [];
  }
}

export async function deleteMessage(messageId: string): Promise<boolean> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    const { error } = await supabaseServer
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
}

export async function deleteConversation(
  conversationId: string
): Promise<boolean> {
  try {
    const supabaseServer = createServerComponentClient({ cookies });

    // Messages will be deleted automatically due to CASCADE constraint
    const { error } = await supabaseServer
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Błąd przy usuwaniu konwersacji:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Nieoczekiwany błąd przy usuwaniu konwersacji:', err);
    return false;
  }
}
